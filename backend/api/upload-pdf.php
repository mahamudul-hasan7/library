<?php
// PDF Upload Handler
// POST /backend/api/upload-pdf.php

header('Content-Type: application/json');
session_start();

// Check authentication
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Not authenticated']);
    exit;
}

// Check if user is admin or has upload permission
// For now, we'll allow authenticated users; adjust this based on your role system
$user_id = $_SESSION['user_id'];

// Database connection
require_once '../config.php';

$action = $_GET['action'] ?? $_POST['action'] ?? null;

if ($action === 'upload') {
    // Handle PDF upload
    if (!isset($_FILES['pdf'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'No PDF file provided']);
        exit;
    }

    $file = $_FILES['pdf'];
    $bookId = $_POST['book_id'] ?? null;

    // Validate file
    if ($file['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Upload error: ' . $file['error']]);
        exit;
    }

    // Check file type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime_type = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if ($mime_type !== 'application/pdf') {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'File must be a PDF']);
        exit;
    }

    // Check file size (max 50MB)
    $max_size = 50 * 1024 * 1024;
    if ($file['size'] > $max_size) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'File too large (max 50MB)']);
        exit;
    }

    // Create unique filename
    $timestamp = time();
    $random = bin2hex(random_bytes(4));
    $filename = 'book_' . $bookId . '_' . $timestamp . '_' . $random . '.pdf';

    // Create upload directory if it doesn't exist
    $upload_dir = '../../Assets/books';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    $filepath = $upload_dir . '/' . $filename;

    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $filepath)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to save file']);
        exit;
    }

    // Update database with PDF URL
    if ($bookId) {
        $pdfUrl = '/BrainRoot/Assets/books/' . $filename;
        
        try {
            $stmt = $conn->prepare("UPDATE books SET file_url = ? WHERE id = ?");
            $stmt->bind_param("si", $pdfUrl, $bookId);
            $stmt->execute();
            $stmt->close();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Database update failed']);
            exit;
        }
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'PDF uploaded successfully',
        'file' => $filename,
        'url' => '/BrainRoot/Assets/books/' . $filename
    ]);
    exit;
}

// Get uploaded PDFs for a book
if ($action === 'list') {
    $bookId = $_GET['book_id'] ?? null;

    if (!$bookId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'book_id required']);
        exit;
    }

    try {
        $stmt = $conn->prepare("SELECT id, title, file_url FROM books WHERE id = ? AND file_url IS NOT NULL");
        $stmt->bind_param("i", $bookId);
        $stmt->execute();
        $result = $stmt->get_result();
        $book = $result->fetch_assoc();
        $stmt->close();

        if (!$book) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Book not found']);
            exit;
        }

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'book' => $book
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Query failed']);
    }
    exit;
}

http_response_code(400);
echo json_encode(['success' => false, 'error' => 'Invalid action']);
?>
