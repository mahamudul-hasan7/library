<?php
// backend/api/auth.php - Handle authentication (login/register)

// Prevent any output before JSON - MUST come first!
ob_start();
ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once '../config.php';

ensureUserProfileColumns($conn);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? null;
    $email = $input['email'] ?? null;
    $password = $input['password'] ?? null;
    $name = $input['name'] ?? null;
    $institution = $input['institution'] ?? null;
    $role = $input['role'] ?? null;
    
    if (!$action) {
        sendJson(['success' => false, 'error' => 'Action is required'], 400);
    }
    
    if ($action === 'register') {
        if (!$email || !$password) {
            sendJson(['success' => false, 'error' => 'Email and password are required'], 400);
        }

        if (!$name) {
            sendJson(['success' => false, 'error' => 'Name is required'], 400);
        }
        
        // Check if user exists
        $checkQuery = "SELECT id FROM users WHERE email = ?";
        $stmt = $conn->prepare($checkQuery);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        
        if ($stmt->get_result()->num_rows > 0) {
            sendJson(['success' => false, 'error' => 'Email already registered'], 400);
        }
        
        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        
        // Insert user. New accounts always start on the free plan.
        $planType = 'free';
        $insertQuery = "INSERT INTO users (email, password, name, institution, role, plan_type) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($insertQuery);
        $stmt->bind_param("ssssss", $email, $hashedPassword, $name, $institution, $role, $planType);
        
        if ($stmt->execute()) {
            $userId = $conn->insert_id;
            $createdAtQuery = "SELECT created_at FROM users WHERE id = ?";
            $createdAtStmt = $conn->prepare($createdAtQuery);
            $createdAtStmt->bind_param("i", $userId);
            $createdAtStmt->execute();
            $createdAt = $createdAtStmt->get_result()->fetch_assoc()['created_at'] ?? date('Y-m-d H:i:s');

            startBrainrootSession();
            $_SESSION['user_id'] = $userId;
            $_SESSION['email'] = $email;
            $_SESSION['name'] = $name;
            
            sendJson([
                'success' => true,
                'message' => 'Registration successful',
                'user' => [
                    'id' => $userId,
                    'email' => $email,
                    'name' => $name,
                    'institution' => $institution,
                    'role' => $role,
                    'plan_type' => $planType,
                    'planType' => $planType,
                    'created_at' => $createdAt,
                    'createdAt' => $createdAt
                ]
            ]);
        } else {
            sendJson(['success' => false, 'error' => $stmt->error], 400);
        }
    }
    
    else if ($action === 'login') {
        if (!$email || !$password) {
            sendJson(['success' => false, 'error' => 'Email and password are required'], 400);
        }

        // Get user
        $userQuery = "SELECT id, password, name, institution, role, plan_type, created_at FROM users WHERE email = ?";
        $stmt = $conn->prepare($userQuery);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            sendJson(['success' => false, 'error' => 'Email not found'], 401);
        }
        
        $user = $result->fetch_assoc();
        
        // Verify password
        if (!password_verify($password, $user['password'])) {
            sendJson(['success' => false, 'error' => 'Invalid password'], 401);
        }
        
        // Create session
        startBrainrootSession();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email'] = $email;
        $_SESSION['name'] = $user['name'];
        
        sendJson([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'id' => $user['id'],
                'email' => $email,
                'name' => $user['name'],
                'institution' => $user['institution'],
                'role' => $user['role'],
                'plan_type' => $user['plan_type'] ?: 'free',
                'planType' => $user['plan_type'] ?: 'free',
                'created_at' => $user['created_at'],
                'createdAt' => $user['created_at']
            ]
        ]);
    }
    
    else if ($action === 'logout') {
        startBrainrootSession();
        session_destroy();
        sendJson(['success' => true, 'message' => 'Logged out successfully']);
    }
    
    else {
        sendJson(['success' => false, 'error' => 'Invalid action'], 400);
    }
}

else if ($method === 'GET') {
    $userId = getCurrentUserId();
    $userQuery = "SELECT id, email, name, institution, role, plan_type, created_at FROM users WHERE id = ?";
    $stmt = $conn->prepare($userQuery);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        sendJson(['success' => false, 'error' => 'Not authenticated'], 401);
    }

    $user = $result->fetch_assoc();
    $_SESSION['email'] = $user['email'];
    $_SESSION['name'] = $user['name'];

    sendJson([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'name' => $user['name'],
            'institution' => $user['institution'],
            'role' => $user['role'],
            'plan_type' => $user['plan_type'] ?: 'free',
            'planType' => $user['plan_type'] ?: 'free',
            'created_at' => $user['created_at'],
            'createdAt' => $user['created_at']
        ]
    ]);
}

else {
    sendJson(['success' => false, 'error' => 'Method not allowed'], 405);
}
?>
