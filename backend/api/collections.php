<?php
// backend/api/collections.php - Handle user collections

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
    // Get all collections for user
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
            c.progress, 
            c.importance,
            b.access_type as access,
            bb.borrowed_at,
            bb.due_at,
            bb.returned_at,
            COALESCE(bb.returned_at IS NULL, false) as is_borrowed,
            CASE
                WHEN bb.returned_at IS NULL AND bb.due_at IS NOT NULL AND bb.due_at < NOW()
                THEN 1
                ELSE 0
            END as is_expired
        FROM collections c
        JOIN books b ON c.book_id = b.id
        LEFT JOIN borrowed_books bb ON c.user_id = bb.user_id 
            AND c.book_id = bb.book_id 
            AND bb.returned_at IS NULL
        WHERE c.user_id = ?
            AND (
                bb.id IS NULL
                OR bb.due_at IS NULL
                OR bb.due_at >= NOW()
            )
        ORDER BY c.added_at DESC
    ";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $collections = [];
    while ($row = $result->fetch_assoc()) {
        $collections[] = $row;
    }
    
    sendJson(['success' => true, 'data' => $collections]);
}

else if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $title = $input['title'] ?? null;
    $author = $input['author'] ?? 'Unknown';
    $category = $input['category'] ?? 'General';
    $image_url = $input['image'] ?? null;
    $progress = $input['progress'] ?? 0;
    $access = $input['access'] ?? 'free';
    
    if (!$title) {
        sendJson(['success' => false, 'error' => 'Title is required'], 400);
    }
    
    // Get or create book
    $bookQuery = "SELECT id FROM books WHERE title = ?";
    $stmt = $conn->prepare($bookQuery);
    $stmt->bind_param("s", $title);
    $stmt->execute();
    $bookResult = $stmt->get_result();
    
    if ($bookResult->num_rows > 0) {
        $bookId = $bookResult->fetch_assoc()['id'];
    } else {
        $insertBookQuery = "
            INSERT INTO books (title, author, category, image_url, access_type)
            VALUES (?, ?, ?, ?, ?)
        ";
        $stmt = $conn->prepare($insertBookQuery);
        $stmt->bind_param("sssss", $title, $author, $category, $image_url, $access);
        $stmt->execute();
        $bookId = $conn->insert_id;
    }
    
    // Add to collection
    $collectionQuery = "
        INSERT INTO collections (user_id, book_id, progress)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE progress = ?
    ";
    $stmt = $conn->prepare($collectionQuery);
    $stmt->bind_param("iiii", $userId, $bookId, $progress, $progress);
    
    if ($stmt->execute()) {
        $removeWishlistQuery = "DELETE FROM wishlist WHERE user_id = ? AND book_id = ?";
        $stmt = $conn->prepare($removeWishlistQuery);
        $stmt->bind_param("ii", $userId, $bookId);
        $stmt->execute();

        sendJson(['success' => true, 'message' => 'Added to collection']);
    } else {
        sendJson(['success' => false, 'error' => $stmt->error], 400);
    }
}

else if ($method === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    $title = $input['title'] ?? null;
    
    if (!$title) {
        sendJson(['success' => false, 'error' => 'Title is required'], 400);
    }
    
    // Delete from collection
    $query = "
        DELETE FROM collections
        WHERE user_id = ? AND book_id IN (
            SELECT id FROM books WHERE title = ?
        )
    ";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("is", $userId, $title);
    
    if ($stmt->execute()) {
        sendJson(['success' => true, 'message' => 'Removed from collection']);
    } else {
        sendJson(['success' => false, 'error' => $stmt->error], 400);
    }
}

else {
    sendJson(['success' => false, 'error' => 'Method not allowed'], 405);
}
?>
