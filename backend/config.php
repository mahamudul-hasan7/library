<?php
// config.php - Database configuration

// Load environment variables from .env file
require_once __DIR__ . '/.env.php';

function getEnvironmentName() {
    return strtolower(trim((string) (getenv('ENVIRONMENT') ?: 'development')));
}

function isProductionEnvironment() {
    return getEnvironmentName() === 'production';
}

function getAppBasePath() {
    $configuredBasePath = trim((string) (getenv('APP_BASE_PATH') ?: ''));
    if ($configuredBasePath !== '') {
        return '/' . trim($configuredBasePath, '/') . '/';
    }

    $scriptName = str_replace('\\', '/', $_SERVER['SCRIPT_NAME'] ?? '');
    $backendMarker = '/backend/';
    $markerPosition = strpos($scriptName, $backendMarker);

    if ($markerPosition !== false) {
        $prefix = substr($scriptName, 0, $markerPosition);
        return rtrim($prefix, '/') . '/';
    }

    return '/';
}

function buildAppPath($path = '') {
    return getAppBasePath() . ltrim((string) $path, '/');
}

function startBrainrootSession() {
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    if (isProductionEnvironment()) {
        session_set_cookie_params([
            'httponly' => true,
            'secure' => true,
            'samesite' => 'Lax',
            'path' => getAppBasePath(),
        ]);
    }

    session_start();
}

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

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
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

    startBrainrootSession();
    if (isset($_SESSION['user_id'])) {
        return $_SESSION['user_id'];
    }

    if (isProductionEnvironment()) {
        sendJson(['success' => false, 'error' => 'Not authenticated'], 401);
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
    ensureColumnExists($conn, 'users', 'status', "VARCHAR(50) DEFAULT 'active' AFTER plan_type");
    ensureColumnExists($conn, 'users', 'created_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER status');
    ensureColumnExists($conn, 'users', 'updated_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at');

    $conn->query("
        UPDATE users
        SET plan_type = 'free'
        WHERE plan_type IS NULL OR plan_type = ''
    ");

    $conn->query("
        UPDATE users
        SET status = 'active'
        WHERE status IS NULL OR status = ''
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
    ensureColumnExists($conn, 'books', 'view_count', 'INT DEFAULT 0 AFTER status');
    ensureColumnExists($conn, 'books', 'like_count', 'INT DEFAULT 0 AFTER view_count');
    ensureColumnExists($conn, 'books', 'featured_section', "ENUM('trending', 'top_reading', 'most_liked', 'none') DEFAULT 'none' AFTER like_count");
    ensureColumnExists($conn, 'books', 'created_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER featured_section');
    ensureColumnExists($conn, 'books', 'updated_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at');
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

function ensureSubscriptionHistoryTable($conn) {
    $conn->query("
        CREATE TABLE IF NOT EXISTS subscription_history (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            plan_name VARCHAR(100) NOT NULL,
            plan_type VARCHAR(50) NOT NULL,
            billing_cycle VARCHAR(50) DEFAULT 'monthly',
            price INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_subscription_user_date (user_id, created_at)
        )
    ");
}

function ensureReadingProgressTable($conn) {
    $conn->query("
        CREATE TABLE IF NOT EXISTS reading_progress (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            book_id INT NOT NULL,
            progress INT DEFAULT 0,
            scroll_y INT DEFAULT 0,
            pdf_page INT NULL,
            pdf_page_count INT NULL,
            bookmark_scroll_y INT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
            UNIQUE KEY unique_user_book_progress (user_id, book_id),
            INDEX idx_reading_progress_user_updated (user_id, updated_at)
        )
    ");
}

function ensureBookRatingsTable($conn) {
    $conn->query("
        CREATE TABLE IF NOT EXISTS book_ratings (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            book_id INT NOT NULL,
            rating TINYINT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
            UNIQUE KEY unique_user_book_rating (user_id, book_id),
            INDEX idx_book_ratings_book (book_id)
        )
    ");
}

function brainrootSlugify($value) {
    $slug = strtolower(trim((string) $value));
    $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
    $slug = trim($slug, '-');
    return $slug !== '' ? $slug : 'category';
}

function ensureCategoriesTable($conn) {
    $conn->query("
        CREATE TABLE IF NOT EXISTS categories (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) UNIQUE NOT NULL,
            slug VARCHAR(120) UNIQUE NOT NULL,
            description TEXT NULL,
            status VARCHAR(50) DEFAULT 'active',
            sort_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_categories_status_order (status, sort_order, name)
        )
    ");

    $categories = [
        'Architecture', 'Urbanism', 'Design', 'Psychology', 'Productivity',
        'Mystery', 'Memoir', 'Biography', 'Health', 'History', 'Business',
        'Finance', 'Science', 'Technology', 'Computer Science', 'Data Science',
        'Classic Literature', 'Drama', 'Fiction', 'Sci-Fi', 'Environment', 'Other'
    ];

    $stmt = $conn->prepare("
        INSERT IGNORE INTO categories (name, slug, sort_order)
        VALUES (?, ?, ?)
    ");

    foreach ($categories as $index => $name) {
        $slug = brainrootSlugify($name);
        $sortOrder = $index + 1;
        $stmt->bind_param('ssi', $name, $slug, $sortOrder);
        $stmt->execute();
    }

    $bookCategories = $conn->query("
        SELECT DISTINCT TRIM(category) AS name
        FROM books
        WHERE category IS NOT NULL AND TRIM(category) <> ''
        ORDER BY category ASC
    ");

    $sortOrder = 1000;
    while ($row = $bookCategories->fetch_assoc()) {
        $name = trim((string) $row['name']);
        $slug = brainrootSlugify($name);
        $stmt->bind_param('ssi', $name, $slug, $sortOrder);
        $stmt->execute();
        $sortOrder++;
    }
}

function ensureAdminLogsTable($conn) {
    $conn->query("
        CREATE TABLE IF NOT EXISTS admin_logs (
            id INT PRIMARY KEY AUTO_INCREMENT,
            admin_user_id INT NULL,
            action VARCHAR(80) NOT NULL,
            entity_type VARCHAR(80) NOT NULL,
            entity_id INT NULL,
            summary VARCHAR(255),
            metadata TEXT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE SET NULL,
            INDEX idx_admin_logs_created (created_at),
            INDEX idx_admin_logs_entity (entity_type, entity_id)
        )
    ");
}

function ensureApplicationTables($conn) {
    ensureUserProfileColumns($conn);
    ensureBookCatalogColumns($conn);
    ensureSubscriptionHistoryTable($conn);
    ensureReadingProgressTable($conn);
    ensureBookRatingsTable($conn);
    ensureCategoriesTable($conn);
    ensureAdminLogsTable($conn);
}

function getOptionalRequestUserId($conn) {
    startBrainrootSession();

    if (isset($_SESSION['user_id'])) {
        return (int) $_SESSION['user_id'];
    }

    if (isProductionEnvironment()) {
        return 0;
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

    return 0;
}

function requireAdminUser($conn) {
    $userId = getCurrentUserId();
    $query = "SELECT id, role, status FROM users WHERE id = ? LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    $role = strtolower(trim((string) ($user['role'] ?? '')));
    $status = strtolower(trim((string) ($user['status'] ?? 'active')));

    if (!$user || !in_array($role, ['admin', 'super admin'], true) || $status !== 'active') {
        sendJson(['success' => false, 'error' => 'Admin access required'], 403);
    }

    return $user;
}

function logAdminAction($conn, $action, $entityType, $entityId = null, $summary = '', $metadata = []) {
    ensureAdminLogsTable($conn);

    $adminUserId = getOptionalRequestUserId($conn);
    $adminUserId = $adminUserId > 0 ? $adminUserId : null;
    $entityId = $entityId !== null ? (int) $entityId : null;
    $metadataJson = $metadata ? json_encode($metadata) : null;
    $summary = substr((string) $summary, 0, 255);

    $stmt = $conn->prepare("
        INSERT INTO admin_logs (admin_user_id, action, entity_type, entity_id, summary, metadata)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param('ississ', $adminUserId, $action, $entityType, $entityId, $summary, $metadataJson);
    $stmt->execute();
}

?>
