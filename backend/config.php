<?php
// config.php - Database configuration

// Load environment variables from .env file
require_once __DIR__ . '/.env.php';

// Handle CORS before any database work so browser preflight requests do not fail.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$isLocalDevOrigin = $origin && preg_match('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/', $origin);

if ($isLocalDevOrigin) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
} elseif (!$origin) {
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Brainroot-User-Id, X-Brainroot-User-Email');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Get database configuration from environment variables (with fallback defaults)
$db_host = getenv('DB_HOST') ?: 'localhost';
$db_user = getenv('DB_USER') ?: 'root';
$db_password = getenv('DB_PASSWORD') ?: '';
$db_name = getenv('DB_NAME') ?: 'brainroot_library';

// Create connection
$conn = new mysqli($db_host, $db_user, $db_password, $db_name);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode([
        'success' => false,
        'error' => 'Database connection failed: ' . $conn->connect_error
    ]));
}

// Set charset to UTF-8
$conn->set_charset("utf8");

// Enable error reporting
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

// Helper function to send JSON response
function sendJson($data, $statusCode = 200) {
    header('Content-Type: application/json');
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

// Helper function to get current user ID from session
function getCurrentUserId() {
    global $conn;

    session_start();
    if (isset($_SESSION['user_id'])) {
        return $_SESSION['user_id'];
    }

    $headerUserId = isset($_SERVER['HTTP_X_BRAINROOT_USER_ID']) ? (int) $_SERVER['HTTP_X_BRAINROOT_USER_ID'] : 0;
    $headerEmail = trim(strtolower($_SERVER['HTTP_X_BRAINROOT_USER_EMAIL'] ?? ''));

    if ($headerUserId > 0 && $headerEmail !== '') {
        $query = "SELECT id, email, name FROM users WHERE id = ? AND LOWER(email) = ? LIMIT 1";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("is", $headerUserId, $headerEmail);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['name'] = $user['name'];
            return (int) $user['id'];
        }
    }

    sendJson(['success' => false, 'error' => 'Not authenticated'], 401);
}

// Existing local databases may have been created before profile fields existed.
function ensureColumnExists($conn, $tableName, $columnName, $definition) {
    $checkQuery = "
        SELECT COUNT(*) AS column_count
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = ?
            AND COLUMN_NAME = ?
    ";

    $stmt = $conn->prepare($checkQuery);
    $stmt->bind_param("ss", $tableName, $columnName);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    if ((int) ($result['column_count'] ?? 0) === 0) {
        $conn->query("ALTER TABLE `$tableName` ADD COLUMN `$columnName` $definition");
    }
}

function indexExists($conn, $tableName, $indexName) {
    $checkQuery = "
        SELECT COUNT(*) AS index_count
        FROM INFORMATION_SCHEMA.STATISTICS
        WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = ?
            AND INDEX_NAME = ?
    ";

    $stmt = $conn->prepare($checkQuery);
    $stmt->bind_param("ss", $tableName, $indexName);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    return (int) ($result['index_count'] ?? 0) > 0;
}

function dropIndexIfExists($conn, $tableName, $indexName) {
    if (indexExists($conn, $tableName, $indexName)) {
        $conn->query("ALTER TABLE `$tableName` DROP INDEX `$indexName`");
    }
}

function ensureIndexExists($conn, $tableName, $indexName, $createSql) {
    if (!indexExists($conn, $tableName, $indexName)) {
        $conn->query($createSql);
    }
}

function ensureUserProfileColumns($conn) {
    ensureColumnExists($conn, 'users', 'institution', 'VARCHAR(255) NULL AFTER name');
    ensureColumnExists($conn, 'users', 'role', 'VARCHAR(100) NULL AFTER institution');
    ensureColumnExists($conn, 'users', 'plan_type', "VARCHAR(50) DEFAULT 'free' AFTER role");
    ensureColumnExists($conn, 'users', 'created_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER plan_type');

    $conn->query("
        UPDATE users
        SET plan_type = 'free'
        WHERE plan_type IS NULL OR plan_type = ''
    ");
}

function ensureBookCatalogColumns($conn) {
    ensureColumnExists($conn, 'books', 'rating_average', 'DECIMAL(3,2) DEFAULT 0.00 AFTER image_url');
    ensureColumnExists($conn, 'books', 'rating_count', 'INT DEFAULT 0 AFTER rating_average');
    ensureColumnExists($conn, 'books', 'published_year', 'INT NULL AFTER rating_count');
    ensureColumnExists($conn, 'books', 'language', "VARCHAR(80) DEFAULT 'English' AFTER published_year");
    ensureColumnExists($conn, 'books', 'format', "VARCHAR(80) DEFAULT 'Digital' AFTER language");
    ensureColumnExists($conn, 'books', 'pages', 'INT NULL AFTER format');
    ensureColumnExists($conn, 'books', 'file_url', 'VARCHAR(500) NULL AFTER pages');
    ensureColumnExists($conn, 'books', 'sample_url', 'VARCHAR(500) NULL AFTER file_url');
    ensureColumnExists($conn, 'books', 'section_name', "VARCHAR(80) DEFAULT 'collection' AFTER pages");
    ensureColumnExists($conn, 'books', 'status', "VARCHAR(50) DEFAULT 'Available' AFTER section_name");
    ensureDefaultBookCoverImages($conn);
}

function ensureDefaultBookCoverImages($conn) {
    $conn->query("
        UPDATE books
        SET image_url = CASE title
            WHEN 'The Digital Archive' THEN 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80'
            WHEN 'Urban Rhythms' THEN 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80'
            WHEN 'Minimalist Logic' THEN 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80'
            WHEN 'Green Horizons' THEN 'https://images.unsplash.com/photo-1469122312224-c5846569feb1?auto=format&fit=crop&w=900&q=80'
            WHEN 'The Kite Runner' THEN 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80'
            WHEN 'Atomic Habits' THEN 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80'
            WHEN 'Educated' THEN 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=700&q=80'
            WHEN 'Dune' THEN 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=700&q=80'
            WHEN 'The Silent Patient' THEN 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=700&q=80'
            WHEN 'Why We Sleep' THEN 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=700&q=80'
            ELSE image_url
        END
        WHERE image_url IS NULL OR image_url = ''
    ");
}

function ensureBorrowedBookColumns($conn) {
    ensureColumnExists($conn, 'borrowed_books', 'due_at', 'TIMESTAMP NULL AFTER borrowed_at');

    $conn->query("
        UPDATE borrowed_books
        SET due_at = DATE_ADD(borrowed_at, INTERVAL 14 DAY)
        WHERE due_at IS NULL
    ");

    $conn->query("
        UPDATE borrowed_books bb
        JOIN (
            SELECT user_id, book_id, MIN(id) AS keep_id
            FROM borrowed_books
            WHERE returned_at IS NULL
            GROUP BY user_id, book_id
            HAVING COUNT(*) > 1
        ) duplicates
            ON bb.user_id = duplicates.user_id
            AND bb.book_id = duplicates.book_id
        SET bb.returned_at = DATE_SUB(NOW(), INTERVAL bb.id SECOND)
        WHERE bb.returned_at IS NULL
            AND bb.id <> duplicates.keep_id
    ");

    ensureColumnExists(
        $conn,
        'borrowed_books',
        'active_borrow_book_id',
        "INT GENERATED ALWAYS AS (CASE WHEN `returned_at` IS NULL THEN `book_id` ELSE NULL END) STORED AFTER returned_at"
    );

    dropIndexIfExists($conn, 'borrowed_books', 'unique_active_borrow');
    ensureIndexExists(
        $conn,
        'borrowed_books',
        'unique_active_borrow_open',
        'CREATE UNIQUE INDEX unique_active_borrow_open ON borrowed_books (user_id, active_borrow_book_id)'
    );
    ensureIndexExists(
        $conn,
        'borrowed_books',
        'idx_borrowed_due',
        'CREATE INDEX idx_borrowed_due ON borrowed_books (due_at)'
    );
}

?>
