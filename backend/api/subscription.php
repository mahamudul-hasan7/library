<?php
// backend/api/subscription.php - Handle subscription updates

require_once '../config.php';

ensureUserProfileColumns($conn);

$method = $_SERVER['REQUEST_METHOD'];
$userId = getCurrentUserId();

// Verify user is logged in
if (!$userId) {
    sendJson(['success' => false, 'error' => 'User not authenticated'], 401);
}

function getPlanTypeFromPlanName($planName) {
    $planMap = [
        'Free Book' => 'free',
        'Basic' => 'basic',
        'Standard' => 'standard',
        'Premium' => 'premium'
    ];
    
    return $planMap[$planName] ?? 'free';
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!is_array($input)) {
        sendJson(['success' => false, 'error' => 'Invalid JSON body'], 400);
    }

    $planName = trim($input['plan'] ?? '');
    $billingCycle = trim($input['billingCycle'] ?? 'monthly');
    $planType = getPlanTypeFromPlanName($planName);
    $price = intval($input['price'] ?? 0);

    if (!$planName || !$planType) {
        sendJson(['success' => false, 'error' => 'Invalid plan'], 400);
    }

    try {
        $updateQuery = "
            UPDATE users
            SET plan_type = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ";
        $stmt = $conn->prepare($updateQuery);
        
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        
        $stmt->bind_param("si", $planType, $userId);
        
        if (!$stmt->execute()) {
            throw new Exception("Execute failed: " . $stmt->error);
        }

        // Get updated user
        $userQuery = "
            SELECT id, email, name, institution, role, plan_type, created_at
            FROM users
            WHERE id = ?
            LIMIT 1
        ";
        $userStmt = $conn->prepare($userQuery);
        if (!$userStmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        
        $userStmt->bind_param("i", $userId);
        $userStmt->execute();
        $result = $userStmt->get_result();
        $user = $result->fetch_assoc();
        
        if (!$user) {
            throw new Exception("User not found after update");
        }
        
        $user['planType'] = $user['plan_type'];
        $user['createdAt'] = $user['created_at'];

        sendJson([
            'success' => true,
            'message' => 'Subscription updated successfully',
            'plan' => $planName,
            'planType' => $planType,
            'billingCycle' => $billingCycle,
            'price' => $price,
            'user' => $user
        ]);

    } catch (Exception $error) {
        sendJson(['success' => false, 'error' => $error->getMessage()], 500);
    }
    
    exit;
}

sendJson(['success' => false, 'error' => 'Method not allowed'], 405);
?>
