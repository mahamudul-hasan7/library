<?php
// config.php - Database configuration

$db_host = 'localhost';
$db_user = 'root';
$db_password = ''; // Change this to your MySQL password
$db_name = 'brainroot_library';

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
    session_start();
    if (!isset($_SESSION['user_id'])) {
        sendJson(['success' => false, 'error' => 'Not authenticated'], 401);
    }
    return $_SESSION['user_id'];
}

// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
?>
