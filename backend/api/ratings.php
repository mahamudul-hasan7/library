<?php
// backend/api/ratings.php - Book rating API

ob_start();
ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once '../config.php';

ensureBookCatalogColumns($conn);
ensureBookRatingsTable($conn);

$method = $_SERVER['REQUEST_METHOD'];

function findRatingBookId($conn, $input) {
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

    $row = $result->fetch_assoc();
    return (int) $row['id'];
}

function getRatingSummary($conn, $bookId, $userId = 0) {
    $stmt = $conn->prepare('SELECT AVG(rating) AS average_rating, COUNT(*) AS rating_count FROM book_ratings WHERE book_id = ?');
    $stmt->bind_param('i', $bookId);
    $stmt->execute();
    $summary = $stmt->get_result()->fetch_assoc();

    $average = round((float) ($summary['average_rating'] ?? 0), 2);
    $count = (int) ($summary['rating_count'] ?? 0);
    $userRating = null;

    if ($userId > 0) {
        $userStmt = $conn->prepare('SELECT rating FROM book_ratings WHERE book_id = ? AND user_id = ? LIMIT 1');
        $userStmt->bind_param('ii', $bookId, $userId);
        $userStmt->execute();
        $userResult = $userStmt->get_result();
        if ($userResult->num_rows > 0) {
            $userRating = (int) $userResult->fetch_assoc()['rating'];
        }
    }

    return [
        'book_id' => $bookId,
        'average' => $average,
        'count' => $count,
        'user_rating' => $userRating
    ];
}

function refreshBookRatingAggregate($conn, $bookId) {
    $summary = getRatingSummary($conn, $bookId);
    $stmt = $conn->prepare('UPDATE books SET rating_average = ?, rating_count = ? WHERE id = ?');
    $stmt->bind_param('dii', $summary['average'], $summary['count'], $bookId);
    $stmt->execute();
    return $summary;
}

if ($method === 'GET') {
    $bookId = findRatingBookId($conn, []);
    if ($bookId <= 0) {
        sendJson(['success' => false, 'error' => 'Book not found'], 404);
    }

    $userId = getOptionalRequestUserId($conn);
    sendJson(['success' => true, 'rating' => getRatingSummary($conn, $bookId, $userId)]);
}

if ($method === 'POST' || $method === 'PUT') {
    $userId = getCurrentUserId();
    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        sendJson(['success' => false, 'error' => 'Invalid JSON body'], 400);
    }

    $bookId = findRatingBookId($conn, $input);
    if ($bookId <= 0) {
        sendJson(['success' => false, 'error' => 'Book not found'], 404);
    }

    $rating = (int) ($input['rating'] ?? 0);
    if ($rating < 1 || $rating > 5) {
        sendJson(['success' => false, 'error' => 'Rating must be between 1 and 5'], 400);
    }

    $stmt = $conn->prepare("
        INSERT INTO book_ratings (user_id, book_id, rating)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE rating = VALUES(rating), updated_at = CURRENT_TIMESTAMP
    ");
    $stmt->bind_param('iii', $userId, $bookId, $rating);
    $stmt->execute();

    $summary = refreshBookRatingAggregate($conn, $bookId);
    $summary['user_rating'] = $rating;

    sendJson(['success' => true, 'message' => 'Rating saved', 'rating' => $summary]);
}

sendJson(['success' => false, 'error' => 'Method not allowed'], 405);
?>
