<?php
// backend/api/reading-progress.php - Saved reader position API

ob_start();
ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once '../config.php';

ensureBookCatalogColumns($conn);
ensureReadingProgressTable($conn);

$method = $_SERVER['REQUEST_METHOD'];

function findProgressBookId($conn, $input) {
    $bookId = (int) ($input['book_id'] ?? ($_GET['book_id'] ?? 0));
    if ($bookId > 0) {
        return $bookId;
    }

    $title = trim((string) ($input['title'] ?? ($_GET['title'] ?? '')));
    if ($title === '') {
        return 0;
    }

    $stmt = $conn->prepare('SELECT id FROM books WHERE LOWER(title) = LOWER(?) LIMIT 1');
    $stmt->bind_param('s', $title);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        return 0;
    }

    return (int) $result->fetch_assoc()['id'];
}

function normalizeProgressRecord($row) {
    if (!$row) {
        return null;
    }

    return [
        'book_id' => (int) $row['book_id'],
        'title' => $row['title'] ?? '',
        'author' => $row['author'] ?? '',
        'category' => $row['category'] ?? '',
        'progress' => (int) ($row['progress'] ?? 0),
        'scrollY' => (int) ($row['scroll_y'] ?? 0),
        'pdfPage' => $row['pdf_page'] === null ? null : (int) $row['pdf_page'],
        'pdfPageCount' => $row['pdf_page_count'] === null ? null : (int) $row['pdf_page_count'],
        'bookmarkScrollY' => $row['bookmark_scroll_y'] === null ? null : (int) $row['bookmark_scroll_y'],
        'updatedAt' => $row['updated_at'] ?? null
    ];
}

if ($method === 'GET') {
    $userId = getCurrentUserId();
    $bookId = findProgressBookId($conn, []);
    if ($bookId <= 0) {
        sendJson(['success' => false, 'error' => 'Book not found'], 404);
    }

    $stmt = $conn->prepare("
        SELECT rp.*, b.title, b.author, b.category
        FROM reading_progress rp
        JOIN books b ON b.id = rp.book_id
        WHERE rp.user_id = ? AND rp.book_id = ?
        LIMIT 1
    ");
    $stmt->bind_param('ii', $userId, $bookId);
    $stmt->execute();
    $result = $stmt->get_result();

    sendJson([
        'success' => true,
        'progress' => $result->num_rows > 0 ? normalizeProgressRecord($result->fetch_assoc()) : null
    ]);
}

if ($method === 'POST' || $method === 'PUT') {
    $userId = getCurrentUserId();
    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        sendJson(['success' => false, 'error' => 'Invalid JSON body'], 400);
    }

    $bookId = findProgressBookId($conn, $input);
    if ($bookId <= 0) {
        sendJson(['success' => false, 'error' => 'Book not found'], 404);
    }

    $progress = max(0, min(100, (int) ($input['progress'] ?? 0)));
    $scrollY = max(0, (int) ($input['scrollY'] ?? ($input['scroll_y'] ?? 0)));
    $pdfPage = array_key_exists('pdfPage', $input) ? (int) $input['pdfPage'] : (array_key_exists('pdf_page', $input) ? (int) $input['pdf_page'] : null);
    $pdfPageCount = array_key_exists('pdfPageCount', $input) ? (int) $input['pdfPageCount'] : (array_key_exists('pdf_page_count', $input) ? (int) $input['pdf_page_count'] : null);
    $bookmarkScrollY = array_key_exists('bookmarkScrollY', $input) ? (int) $input['bookmarkScrollY'] : (array_key_exists('bookmark_scroll_y', $input) ? (int) $input['bookmark_scroll_y'] : null);

    $pdfPage = $pdfPage && $pdfPage > 0 ? $pdfPage : null;
    $pdfPageCount = $pdfPageCount && $pdfPageCount > 0 ? $pdfPageCount : null;
    $bookmarkScrollY = $bookmarkScrollY !== null ? max(0, $bookmarkScrollY) : null;

    $stmt = $conn->prepare("
        INSERT INTO reading_progress
            (user_id, book_id, progress, scroll_y, pdf_page, pdf_page_count, bookmark_scroll_y)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            progress = VALUES(progress),
            scroll_y = VALUES(scroll_y),
            pdf_page = VALUES(pdf_page),
            pdf_page_count = VALUES(pdf_page_count),
            bookmark_scroll_y = VALUES(bookmark_scroll_y),
            updated_at = CURRENT_TIMESTAMP
    ");
    $stmt->bind_param('iiiiiii', $userId, $bookId, $progress, $scrollY, $pdfPage, $pdfPageCount, $bookmarkScrollY);
    $stmt->execute();

    sendJson(['success' => true, 'message' => 'Progress saved']);
}

sendJson(['success' => false, 'error' => 'Method not allowed'], 405);
?>
