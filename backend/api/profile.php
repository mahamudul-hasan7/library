<?php
// backend/api/profile.php - Read and update the logged-in user's profile

require_once '../config.php';

ensureUserProfileColumns($conn);

$method = $_SERVER['REQUEST_METHOD'];
$userId = getCurrentUserId();

function getProfileById($conn, $userId) {
    $query = "
        SELECT id, email, name, institution, role, plan_type, created_at
        FROM users
        WHERE id = ?
        LIMIT 1
    ";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        sendJson(['success' => false, 'error' => 'User not found'], 404);
    }

    $profile = $result->fetch_assoc();
    $profile['plan_type'] = $profile['plan_type'] ?: 'free';
    $profile['planType'] = $profile['plan_type'];
    $profile['createdAt'] = $profile['created_at'];

    return $profile;
}

if ($method === 'GET') {
    sendJson([
        'success' => true,
        'user' => getProfileById($conn, $userId)
    ]);
}

if ($method === 'PUT' || $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!is_array($input)) {
        sendJson(['success' => false, 'error' => 'Invalid JSON body'], 400);
    }

    $currentProfile = getProfileById($conn, $userId);
    $name = trim($input['name'] ?? $currentProfile['name'] ?? '');
    $email = trim(strtolower($input['email'] ?? $currentProfile['email'] ?? ''));
    $institution = trim($input['institution'] ?? $currentProfile['institution'] ?? '');
    $role = trim($input['role'] ?? $currentProfile['role'] ?? '');

    if ($name === '') {
        sendJson(['success' => false, 'error' => 'Name is required'], 400);
    }

    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJson(['success' => false, 'error' => 'A valid email address is required'], 400);
    }

    try {
        $updateQuery = "
            UPDATE users
            SET email = ?, name = ?, institution = ?, role = ?
            WHERE id = ?
        ";
        $stmt = $conn->prepare($updateQuery);
        $stmt->bind_param("ssssi", $email, $name, $institution, $role, $userId);
        $stmt->execute();
    } catch (mysqli_sql_exception $error) {
        if ((int) $error->getCode() === 1062) {
            sendJson(['success' => false, 'error' => 'Email already registered'], 409);
        }

        sendJson(['success' => false, 'error' => 'Profile update failed'], 500);
    }

    $_SESSION['email'] = $email;
    $_SESSION['name'] = $name;

    sendJson([
        'success' => true,
        'message' => 'Profile updated successfully',
        'user' => getProfileById($conn, $userId)
    ]);
}

sendJson(['success' => false, 'error' => 'Method not allowed'], 405);
?>
