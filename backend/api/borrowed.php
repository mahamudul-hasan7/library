<?php
// backend/api/borrowed.php - Handle borrowed books (borrow/return)

require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$userId = getCurrentUserId();

if ($method === 'GET') {
    // Get all currently borrowed books for user
    $query = "
        SELECT 
            b.id,
            b.title, 
            b.author, 
            b.category, 
            b.image_url,
            bb.borrowed_at
        FROM borrowed_books bb
        JOIN books b ON bb.book_id = b.id
        WHERE bb.user_id = ? AND bb.returned_at IS NULL
        ORDER BY bb.borrowed_at DESC
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
    
    if (!$action || !$title) {
        sendJson(['success' => false, 'error' => 'Action and title are required'], 400);
    }
    
    // Get book ID
    $bookQuery = "SELECT id FROM books WHERE title = ?";
    $stmt = $conn->prepare($bookQuery);
    $stmt->bind_param("s", $title);
    $stmt->execute();
    $bookResult = $stmt->get_result();
    
    if ($bookResult->num_rows === 0) {
        sendJson(['success' => false, 'error' => 'Book not found'], 404);
    }
    
    $bookId = $bookResult->fetch_assoc()['id'];
    
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
            sendJson(['success' => false, 'error' => 'Book already borrowed'], 400);
        }
        
        // Add to borrowed
        $borrowQuery = "
            INSERT INTO borrowed_books (user_id, book_id, borrowed_at)
            VALUES (?, ?, NOW())
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
            
            sendJson(['success' => true, 'message' => 'Book borrowed successfully']);
        } else {
            sendJson(['success' => false, 'error' => $stmt->error], 400);
        }
    }
    
    else if ($action === 'return') {
        // Mark as returned
        $returnQuery = "
            UPDATE borrowed_books 
            SET returned_at = NOW()
            WHERE user_id = ? AND book_id = ? AND returned_at IS NULL
        ";
        
        $stmt = $conn->prepare($returnQuery);
        $stmt->bind_param("ii", $userId, $bookId);
        
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                sendJson(['success' => true, 'message' => 'Book returned successfully']);
            } else {
                sendJson(['success' => false, 'error' => 'Book not found in borrowed list'], 404);
            }
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
