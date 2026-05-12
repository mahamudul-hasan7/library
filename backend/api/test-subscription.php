<?php
// backend/api/test-subscription.php - Test subscription update endpoint

require_once '../config.php';

ensureUserProfileColumns($conn);

$method = $_SERVER['REQUEST_METHOD'];
$userId = getCurrentUserId();

$testData = [
    'method' => $method,
    'userId' => $userId,
    'isAuthenticated' => !empty($userId),
    'sessionUserId' => $_SESSION['user_id'] ?? null,
    'sessionEmail' => $_SESSION['email'] ?? null,
    'input' => json_decode(file_get_contents('php://input'), true)
];

// Get user data if authenticated
if ($userId) {
    $query = "SELECT id, email, name, plan_type FROM users WHERE id = ? LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $testData['userData'] = $result->fetch_assoc();
}

sendJson($testData);
?>
