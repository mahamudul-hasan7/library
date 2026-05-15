<?php
// backend/api/wishlist.php - Handle wishlist

// Prevent any output before JSON - MUST come first!
ob_start();
ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once '../config.php';

ensureBookCatalogColumns($conn);

$method = $_SERVER['REQUEST_METHOD'];
$userId = getCurrentUserId();

if ($method === 'GET') {
    // Get all wishlist items for user
    $query = "
        SELECT 
            b.id,
            b.title, 
            b.author, 
            b.category, 
            b.image_url,
            b.image_url as image,
            b.description,
            b.rating_average,
            b.rating_count,
            b.access_type as access,
            w.added_at
        FROM wishlist w
        JOIN books b ON w.book_id = b.id
        WHERE w.user_id = ?
            AND NOT EXISTS (
                SELECT 1
                FROM borrowed_books bb
                WHERE bb.user_id = w.user_id
                    AND bb.book_id = w.book_id
                    AND bb.returned_at IS NULL
            )
        ORDER BY w.added_at DESC
    ";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $wishlist = [];
    while ($row = $result->fetch_assoc()) {
        $wishlist[] = $row;
    }
    
    sendJson(['success' => true, 'data' => $wishlist]);
}

else if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $title = $input['title'] ?? null;
    $author = $input['author'] ?? 'Unknown';
    $category = $input['category'] ?? 'General';
    $image_url = $input['image'] ?? null;
    $access = $input['access'] ?? 'free';
    $description = $input['description'] ?? null;
    
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
            INSERT INTO books (title, author, category, description, image_url, access_type)
            VALUES (?, ?, ?, ?, ?, ?)
        ";
        $stmt = $conn->prepare($insertBookQuery);
        $stmt->bind_param("ssssss", $title, $author, $category, $description, $image_url, $access);
        $stmt->execute();
        $bookId = $conn->insert_id;
    }

    $borrowedQuery = "
        SELECT id FROM borrowed_books
        WHERE user_id = ? AND book_id = ? AND returned_at IS NULL
        LIMIT 1
    ";
    $stmt = $conn->prepare($borrowedQuery);
    $stmt->bind_param("ii", $userId, $bookId);
    $stmt->execute();

    if ($stmt->get_result()->num_rows > 0) {
        sendJson([
            'success' => false,
            'error' => 'This book is already borrowed, so it cannot be added to wishlist.'
        ], 409);
    }
    
    // Add to wishlist
    $wishlistQuery = "
        INSERT IGNORE INTO wishlist (user_id, book_id)
        VALUES (?, ?)
    ";
    $stmt = $conn->prepare($wishlistQuery);
    $stmt->bind_param("ii", $userId, $bookId);
    
    if ($stmt->execute()) {
        sendJson(['success' => true, 'message' => 'Added to wishlist']);
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
    
    // Delete from wishlist
    $query = "
        DELETE FROM wishlist
        WHERE user_id = ? AND book_id IN (
            SELECT id FROM books WHERE title = ?
        )
    ";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("is", $userId, $title);
    
    if ($stmt->execute()) {
        sendJson(['success' => true, 'message' => 'Removed from wishlist']);
    } else {
        sendJson(['success' => false, 'error' => $stmt->error], 400);
    }
}

else {
    sendJson(['success' => false, 'error' => 'Method not allowed'], 405);
}
?>
