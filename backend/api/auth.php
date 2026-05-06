<?php
// backend/api/auth.php - Handle authentication (login/register)

require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? null;
    $email = $input['email'] ?? null;
    $password = $input['password'] ?? null;
    $name = $input['name'] ?? null;
    
    if (!$action || !$email || !$password) {
        sendJson(['success' => false, 'error' => 'Action, email, and password are required'], 400);
    }
    
    if ($action === 'register') {
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
        
        // Insert user
        $insertQuery = "INSERT INTO users (email, password, name) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($insertQuery);
        $stmt->bind_param("sss", $email, $hashedPassword, $name);
        
        if ($stmt->execute()) {
            session_start();
            $_SESSION['user_id'] = $conn->insert_id;
            $_SESSION['email'] = $email;
            $_SESSION['name'] = $name;
            
            sendJson([
                'success' => true,
                'message' => 'Registration successful',
                'user' => [
                    'id' => $conn->insert_id,
                    'email' => $email,
                    'name' => $name
                ]
            ]);
        } else {
            sendJson(['success' => false, 'error' => $stmt->error], 400);
        }
    }
    
    else if ($action === 'login') {
        // Get user
        $userQuery = "SELECT id, password, name FROM users WHERE email = ?";
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
        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email'] = $email;
        $_SESSION['name'] = $user['name'];
        
        sendJson([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'id' => $user['id'],
                'email' => $email,
                'name' => $user['name']
            ]
        ]);
    }
    
    else if ($action === 'logout') {
        session_start();
        session_destroy();
        sendJson(['success' => true, 'message' => 'Logged out successfully']);
    }
    
    else {
        sendJson(['success' => false, 'error' => 'Invalid action'], 400);
    }
}

else if ($method === 'GET') {
    session_start();
    
    if (isset($_SESSION['user_id'])) {
        sendJson([
            'success' => true,
            'user' => [
                'id' => $_SESSION['user_id'],
                'email' => $_SESSION['email'],
                'name' => $_SESSION['name']
            ]
        ]);
    } else {
        sendJson(['success' => false, 'error' => 'Not authenticated'], 401);
    }
}

else {
    sendJson(['success' => false, 'error' => 'Method not allowed'], 405);
}
?>
