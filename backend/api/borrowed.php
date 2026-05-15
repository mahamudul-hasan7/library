<?php
// backend/api/borrowed.php - Handle borrowed books (borrow/return)

// Prevent any output before JSON - MUST come first!
ob_start();
ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once '../config.php';

ensureBookCatalogColumns($conn);
ensureBorrowedBookColumns($conn);

$method = $_SERVER['REQUEST_METHOD'];
$userId = getCurrentUserId();

if ($method === 'GET') {
    $status = strtolower(trim($_GET['status'] ?? 'active'));
    $statusWhere = 'bb.returned_at IS NULL';
    $orderBy = 'bb.borrowed_at DESC';

    if ($status === 'returned') {
        $statusWhere = 'bb.returned_at IS NOT NULL';
        $orderBy = 'bb.returned_at DESC';
    } elseif ($status === 'expired') {
        $statusWhere = 'bb.returned_at IS NULL AND bb.due_at IS NOT NULL AND bb.due_at < NOW()';
        $orderBy = 'bb.due_at ASC';
    }

    $query = "
        SELECT 
            b.id,
            b.title, 
            b.author, 
            b.category, 
            b.image_url,
            b.image_url as image,
            b.description,
            b.file_url,
            b.sample_url,
            b.published_year,
            b.language,
            b.format,
            b.pages,
            b.rating_average,
            b.rating_count,
            b.access_type as access,
            bb.borrowed_at,
            bb.due_at,
            bb.returned_at,
            CASE
                WHEN bb.returned_at IS NULL AND bb.due_at IS NOT NULL AND bb.due_at < NOW()
                THEN 1
                ELSE 0
            END as is_expired
        FROM borrowed_books bb
        JOIN books b ON bb.book_id = b.id
        WHERE bb.user_id = ? AND $statusWhere
        ORDER BY $orderBy
    ";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $borrowed = [];
    while ($row = $result->fetch_assoc()) {
        $borrowed[] = $row;
    }
    
    sendJson(['success' => true, 'data' => $borrowed]);
}

else if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? null;
    $title = $input['title'] ?? null;
    $author = $input['author'] ?? 'Unknown Author';
    $category = $input['category'] ?? 'General';
    $image_url = $input['image'] ?? null;
    $access = $input['access'] ?? 'free';
    $description = $input['description'] ?? null;
    
    if (!$action) {
        sendJson(['success' => false, 'error' => 'Action is required'], 400);
    }

    if ($action === 'clear_history') {
        $removeExpiredCollectionsQuery = "
            DELETE FROM collections
            WHERE user_id = ?
                AND book_id IN (
                    SELECT book_id
                    FROM borrowed_books
                    WHERE user_id = ?
                        AND returned_at IS NULL
                        AND due_at IS NOT NULL
                        AND due_at < NOW()
                )
        ";
        $stmt = $conn->prepare($removeExpiredCollectionsQuery);
        $stmt->bind_param("ii", $userId, $userId);
        $stmt->execute();

        $clearHistoryQuery = "
            DELETE FROM borrowed_books
            WHERE user_id = ?
                AND (
                    returned_at IS NOT NULL
                    OR (
                        returned_at IS NULL
                        AND due_at IS NOT NULL
                        AND due_at < NOW()
                    )
                )
        ";
        $stmt = $conn->prepare($clearHistoryQuery);
        $stmt->bind_param("i", $userId);
        $stmt->execute();

        sendJson([
            'success' => true,
            'message' => 'History cleared successfully',
            'removed' => $stmt->affected_rows
        ]);
    }

    if (!$title) {
        sendJson(['success' => false, 'error' => 'Title is required'], 400);
    }
    
    // Get book ID
    $bookQuery = "SELECT id FROM books WHERE title = ?";
    $stmt = $conn->prepare($bookQuery);
    $stmt->bind_param("s", $title);
    $stmt->execute();
    $bookResult = $stmt->get_result();
    
    if ($bookResult->num_rows > 0) {
        $bookId = $bookResult->fetch_assoc()['id'];
    } else if ($action === 'remove_history') {
        sendJson(['success' => false, 'error' => 'Book not found in history'], 404);
    } else {
        $insertBookQuery = "
            INSERT INTO books (title, author, category, description, image_url, access_type)
            VALUES (?, ?, ?, ?, ?, ?)
        ";
        $stmt = $conn->prepare($insertBookQuery);
        $stmt->bind_param("ssssss", $title, $author, $category, $description, $image_url, $access);
        $stmt->execute();
        $bookId = $conn->insert_id;
    }
    
    if ($action === 'remove_history') {
        $historyType = strtolower(trim($input['history_type'] ?? $input['historyType'] ?? 'all'));
        $removedCount = 0;

        if ($historyType === 'returned' || $historyType === 'all') {
            $removeReturnedQuery = "
                DELETE FROM borrowed_books
                WHERE user_id = ? AND book_id = ? AND returned_at IS NOT NULL
            ";
            $stmt = $conn->prepare($removeReturnedQuery);
            $stmt->bind_param("ii", $userId, $bookId);
            $stmt->execute();
            $removedCount += $stmt->affected_rows;
        }

        if ($historyType === 'expired' || $historyType === 'all') {
            $removeExpiredQuery = "
                DELETE FROM borrowed_books
                WHERE user_id = ?
                    AND book_id = ?
                    AND returned_at IS NULL
                    AND due_at IS NOT NULL
                    AND due_at < NOW()
            ";
            $stmt = $conn->prepare($removeExpiredQuery);
            $stmt->bind_param("ii", $userId, $bookId);
            $stmt->execute();
            $removedCount += $stmt->affected_rows;

            $removeCollectionQuery = "
                DELETE FROM collections
                WHERE user_id = ? AND book_id = ?
            ";
            $stmt = $conn->prepare($removeCollectionQuery);
            $stmt->bind_param("ii", $userId, $bookId);
            $stmt->execute();
        }

        sendJson([
            'success' => true,
            'message' => 'History item removed',
            'removed' => $removedCount
        ]);
    }

    if ($action === 'borrow') {
        // Check if already borrowed
        $checkQuery = "
            SELECT id FROM borrowed_books 
            WHERE user_id = ? AND book_id = ? AND returned_at IS NULL
        ";
        $stmt = $conn->prepare($checkQuery);
        $stmt->bind_param("ii", $userId, $bookId);
        $stmt->execute();
        
        if ($stmt->get_result()->num_rows > 0) {
            $removeWishlistQuery = "DELETE FROM wishlist WHERE user_id = ? AND book_id = ?";
            $stmt = $conn->prepare($removeWishlistQuery);
            $stmt->bind_param("ii", $userId, $bookId);
            $stmt->execute();

            sendJson(['success' => true, 'message' => 'Book already borrowed']);
        }
        
        // Add to borrowed with a default 14 day expiry window.
        $borrowQuery = "
            INSERT INTO borrowed_books (user_id, book_id, borrowed_at, due_at)
            VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY))
        ";
        $stmt = $conn->prepare($borrowQuery);
        $stmt->bind_param("ii", $userId, $bookId);
        
        if ($stmt->execute()) {
            // Also add to collections if not already there
            $addCollectionQuery = "
                INSERT IGNORE INTO collections (user_id, book_id, progress)
                VALUES (?, ?, 0)
            ";
            $stmt = $conn->prepare($addCollectionQuery);
            $stmt->bind_param("ii", $userId, $bookId);
            $stmt->execute();

            $removeWishlistQuery = "DELETE FROM wishlist WHERE user_id = ? AND book_id = ?";
            $stmt = $conn->prepare($removeWishlistQuery);
            $stmt->bind_param("ii", $userId, $bookId);
            $stmt->execute();
            
            sendJson(['success' => true, 'message' => 'Book borrowed successfully']);
        } else {
            sendJson(['success' => false, 'error' => $stmt->error], 400);
        }
    }

    else if ($action === 'renew') {
        $activeBorrowQuery = "
            SELECT id FROM borrowed_books
            WHERE user_id = ? AND book_id = ? AND returned_at IS NULL
            LIMIT 1
        ";
        $stmt = $conn->prepare($activeBorrowQuery);
        $stmt->bind_param("ii", $userId, $bookId);
        $stmt->execute();
        $activeBorrowResult = $stmt->get_result();

        if ($activeBorrowResult->num_rows > 0) {
            $borrowId = (int) $activeBorrowResult->fetch_assoc()['id'];
            $renewQuery = "
                UPDATE borrowed_books
                SET due_at = DATE_ADD(NOW(), INTERVAL 14 DAY)
                WHERE id = ?
            ";
            $stmt = $conn->prepare($renewQuery);
            $stmt->bind_param("i", $borrowId);
            $stmt->execute();
        } else {
            $borrowQuery = "
                INSERT INTO borrowed_books (user_id, book_id, borrowed_at, due_at)
                VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY))
            ";
            $stmt = $conn->prepare($borrowQuery);
            $stmt->bind_param("ii", $userId, $bookId);
            $stmt->execute();
        }

        $addCollectionQuery = "
            INSERT INTO collections (user_id, book_id, progress)
            VALUES (?, ?, 0)
            ON DUPLICATE KEY UPDATE progress = progress
        ";
        $stmt = $conn->prepare($addCollectionQuery);
        $stmt->bind_param("ii", $userId, $bookId);
        $stmt->execute();

        $removeWishlistQuery = "DELETE FROM wishlist WHERE user_id = ? AND book_id = ?";
        $stmt = $conn->prepare($removeWishlistQuery);
        $stmt->bind_param("ii", $userId, $bookId);
        $stmt->execute();

        sendJson(['success' => true, 'message' => 'Book renewed successfully']);
    }
    
    else if ($action === 'return') {
        // Mark as returned if it is actively borrowed, then remove it from collections.
        $returnQuery = "
            UPDATE borrowed_books 
            SET returned_at = NOW()
            WHERE user_id = ? AND book_id = ? AND returned_at IS NULL
        ";
        
        $stmt = $conn->prepare($returnQuery);
        $stmt->bind_param("ii", $userId, $bookId);
        
        if ($stmt->execute()) {
            $wasBorrowed = $stmt->affected_rows > 0;

            $removeCollectionQuery = "
                DELETE FROM collections
                WHERE user_id = ? AND book_id = ?
            ";
            $stmt = $conn->prepare($removeCollectionQuery);
            $stmt->bind_param("ii", $userId, $bookId);
            $stmt->execute();
            $wasInCollection = $stmt->affected_rows > 0;

            if (!$wasBorrowed && $wasInCollection) {
                $historyQuery = "
                    INSERT INTO borrowed_books (user_id, book_id, borrowed_at, due_at, returned_at)
                    VALUES (?, ?, NOW(), NOW(), NOW())
                ";
                $stmt = $conn->prepare($historyQuery);
                $stmt->bind_param("ii", $userId, $bookId);
                $stmt->execute();
            }

            if ($wasBorrowed || $wasInCollection) {
                sendJson(['success' => true, 'message' => 'Book returned and removed from collection']);
            }

            sendJson(['success' => false, 'error' => 'Book not found in collection'], 404);
        } else {
            sendJson(['success' => false, 'error' => $stmt->error], 400);
        }
    }
    
    else {
        sendJson(['success' => false, 'error' => 'Invalid action'], 400);
    }
}

else {
    sendJson(['success' => false, 'error' => 'Method not allowed'], 405);
}
?>
