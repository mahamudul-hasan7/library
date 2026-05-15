<?php
// backend/api/test-books.php - Debug endpoint for books API

header('Content-Type: application/json; charset=utf-8');

require_once '../config.php';

if (isProductionEnvironment()) {
    sendJson(['success' => false, 'error' => 'Not found'], 404);
}

requireAdminUser($conn);

$debug = [];

// Test database connection
if ($conn->connect_error) {
    $debug['connection'] = 'ERROR: ' . $conn->connect_error;
    echo json_encode($debug);
    exit;
}

$debug['connection'] = 'OK';

// Test if books table exists
$result = $conn->query("SHOW TABLES LIKE 'books'");
if (!$result || $result->num_rows == 0) {
    $debug['books_table'] = 'NOT FOUND';
} else {
    $debug['books_table'] = 'EXISTS';
}

// Test if ensureBookCatalogColumns function exists
if (function_exists('ensureBookCatalogColumns')) {
    $debug['ensureBookCatalogColumns'] = 'FUNCTION EXISTS';
    try {
        ensureBookCatalogColumns($conn);
        $debug['ensureBookCatalogColumns_call'] = 'SUCCESS';
    } catch (Exception $e) {
        $debug['ensureBookCatalogColumns_call'] = 'ERROR: ' . $e->getMessage();
    }
} else {
    $debug['ensureBookCatalogColumns'] = 'FUNCTION NOT FOUND';
}

// Count books
$countResult = $conn->query("SELECT COUNT(*) as book_count FROM books");
if ($countResult) {
    $row = $countResult->fetch_assoc();
    $debug['total_books'] = (int)$row['book_count'];
} else {
    $debug['total_books'] = 'QUERY ERROR: ' . $conn->error;
}

// Try to fetch a sample of books
$sampleResult = $conn->query("SELECT id, title, author FROM books LIMIT 5");
if ($sampleResult) {
    $books = [];
    while ($row = $sampleResult->fetch_assoc()) {
        $books[] = $row;
    }
    $debug['sample_books'] = $books;
} else {
    $debug['sample_books'] = 'QUERY ERROR: ' . $conn->error;
}

// Check what getBooks() returns
try {
    ob_start();
    $method = $_SERVER['REQUEST_METHOD'];
    $_GET['action'] = 'list';
    
    $query = "
        SELECT
            id, title, author, category, description, access_type,
            image_url, published_year, pages, file_url, sample_url,
            section_name, status, view_count, like_count, featured_section,
            created_at
        FROM books
        ORDER BY title ASC
    ";

    $result = $conn->query($query);
    $books = [];

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $row['id'] = (int) $row['id'];
            $row['published_year'] = $row['published_year'] ? (int) $row['published_year'] : null;
            $row['pages'] = $row['pages'] ? (int) $row['pages'] : null;
            $books[] = $row;
        }
        $debug['getBooks_result'] = [
            'success' => true,
            'books_count' => count($books),
            'sample' => array_slice($books, 0, 2)
        ];
    } else {
        $debug['getBooks_result'] = 'QUERY ERROR: ' . $conn->error;
    }
    ob_end_clean();
} catch (Exception $e) {
    $debug['getBooks_result'] = 'ERROR: ' . $e->getMessage();
}

echo json_encode($debug, JSON_PRETTY_PRINT);
?>
