<?php
// backend/api/users.php - Admin user management API

ob_start();
ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once '../config.php';

ensureUserProfileColumns($conn);
ensureAdminLogsTable($conn);

function normalizeUserRole($value) {
    return strtolower(trim((string) $value));
}

function normalizeUserStatus($value) {
    return strtolower(trim((string) $value));
}

function isAdminRole($role) {
    $normalized = normalizeUserRole($role);
    return in_array($normalized, ['admin', 'super admin'], true);
}

function getCurrentUserRow($conn, $userId) {
    $query = "
        SELECT id, email, name, role, plan_type, status
        FROM users
        WHERE id = ?
        LIMIT 1
    ";

    $stmt = $conn->prepare($query);
    if (!$stmt) {
        sendJson(['success' => false, 'error' => 'Unable to verify current user'], 500);
    }

    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        sendJson(['success' => false, 'error' => 'Current user not found'], 404);
    }

    return $result->fetch_assoc();
}

function fetchUsersWithLoanCount($conn) {
    $query = "
        SELECT
            u.id,
            u.email,
            u.name,
            u.institution,
            u.role,
            u.plan_type,
            u.status,
            u.created_at,
            COALESCE(loans.current_loans, 0) AS current_loans
        FROM users u
        LEFT JOIN (
            SELECT user_id, COUNT(*) AS current_loans
            FROM borrowed_books
            WHERE returned_at IS NULL
            GROUP BY user_id
        ) loans ON loans.user_id = u.id
        ORDER BY u.created_at DESC, u.id DESC
    ";

    $result = $conn->query($query);
    if (!$result) {
        sendJson(['success' => false, 'error' => 'Failed to load users'], 500);
    }

    $users = [];
    while ($row = $result->fetch_assoc()) {
        $name = trim((string) ($row['name'] ?? ''));
        $email = trim((string) ($row['email'] ?? ''));
        $initialSource = $name !== '' ? $name : $email;
        $initials = strtoupper(substr(preg_replace('/[^a-zA-Z0-9]+/', ' ', $initialSource), 0, 2));
        if ($initials === '') {
            $initials = 'U';
        }

        $users[] = [
            'id' => (int) $row['id'],
            'email' => $email,
            'name' => $name !== '' ? $name : 'Unnamed User',
            'institution' => $row['institution'] ?? '',
            'role' => normalizeUserRole($row['role'] ?? '') ?: 'student',
            'plan_type' => strtolower(trim((string) ($row['plan_type'] ?? 'free'))) ?: 'free',
            'status' => normalizeUserStatus($row['status'] ?? '') ?: 'active',
            'created_at' => $row['created_at'],
            'current_loans' => (int) ($row['current_loans'] ?? 0),
            'initials' => $initials,
        ];
    }

    return $users;
}

function respondWithUser($conn, $userId) {
    $query = "
        SELECT
            u.id,
            u.email,
            u.name,
            u.institution,
            u.role,
            u.plan_type,
            u.status,
            u.created_at,
            COALESCE(loans.current_loans, 0) AS current_loans
        FROM users u
        LEFT JOIN (
            SELECT user_id, COUNT(*) AS current_loans
            FROM borrowed_books
            WHERE returned_at IS NULL
            GROUP BY user_id
        ) loans ON loans.user_id = u.id
        WHERE u.id = ?
        LIMIT 1
    ";

    $stmt = $conn->prepare($query);
    if (!$stmt) {
        sendJson(['success' => false, 'error' => 'Unable to reload user'], 500);
    }

    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        sendJson(['success' => false, 'error' => 'User not found'], 404);
    }

    $row = $result->fetch_assoc();
    $name = trim((string) ($row['name'] ?? ''));
    $email = trim((string) ($row['email'] ?? ''));
    $initialSource = $name !== '' ? $name : $email;
    $initials = strtoupper(substr(preg_replace('/[^a-zA-Z0-9]+/', ' ', $initialSource), 0, 2));
    if ($initials === '') {
        $initials = 'U';
    }

    return [
        'id' => (int) $row['id'],
        'email' => $email,
        'name' => $name !== '' ? $name : 'Unnamed User',
        'institution' => $row['institution'] ?? '',
        'role' => normalizeUserRole($row['role'] ?? '') ?: 'student',
        'plan_type' => strtolower(trim((string) ($row['plan_type'] ?? 'free'))) ?: 'free',
        'status' => normalizeUserStatus($row['status'] ?? '') ?: 'active',
        'created_at' => $row['created_at'],
        'current_loans' => (int) ($row['current_loans'] ?? 0),
        'initials' => $initials,
    ];
}

function getOptionalCurrentUserId($conn) {
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
        if ($stmt) {
            $stmt->bind_param('is', $headerUserId, $headerEmail);
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
    }

    return 0;
}

$currentUserId = getOptionalCurrentUserId($conn);
$currentUser = $currentUserId > 0 ? getCurrentUserRow($conn, $currentUserId) : null;
requireAdminUser($conn);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $users = fetchUsersWithLoanCount($conn);
    sendJson([
        'success' => true,
        'users' => $users,
        'count' => count($users),
    ]);
}

if ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        sendJson(['success' => false, 'error' => 'Invalid JSON body'], 400);
    }

    $targetUserId = (int) ($input['id'] ?? ($_GET['id'] ?? 0));
    if ($targetUserId <= 0) {
        sendJson(['success' => false, 'error' => 'User id is required'], 400);
    }

    $fields = [];
    $params = [];
    $types = '';

    if (array_key_exists('name', $input)) {
        $name = trim((string) $input['name']);
        $fields[] = 'name = ?';
        $params[] = $name;
        $types .= 's';
    }

    if (array_key_exists('email', $input)) {
        $email = trim(strtolower((string) $input['email']));
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendJson(['success' => false, 'error' => 'A valid email address is required'], 400);
        }
        $fields[] = 'email = ?';
        $params[] = $email;
        $types .= 's';
    }

    if (array_key_exists('institution', $input)) {
        $institution = trim((string) $input['institution']);
        $fields[] = 'institution = ?';
        $params[] = $institution;
        $types .= 's';
    }

    if (array_key_exists('role', $input)) {
        $role = normalizeUserRole($input['role']);
        $validRoles = ['admin', 'faculty', 'student', 'guest', 'user'];
        if (!in_array($role, $validRoles, true)) {
            $role = 'student';
        }
        $fields[] = 'role = ?';
        $params[] = $role;
        $types .= 's';
    }

    if (array_key_exists('plan_type', $input)) {
        $planType = strtolower(trim((string) $input['plan_type']));
        $validPlans = ['free', 'basic', 'standard', 'premium'];
        if (!in_array($planType, $validPlans, true)) {
            $planType = 'free';
        }
        $fields[] = 'plan_type = ?';
        $params[] = $planType;
        $types .= 's';
    }

    if (array_key_exists('status', $input)) {
        $status = normalizeUserStatus($input['status']);
        $validStatuses = ['active', 'suspended'];
        if (!in_array($status, $validStatuses, true)) {
            $status = 'active';
        }
        $fields[] = 'status = ?';
        $params[] = $status;
        $types .= 's';
    }

    if (empty($fields)) {
        sendJson(['success' => false, 'error' => 'No fields to update'], 400);
    }

    $params[] = $targetUserId;
    $types .= 'i';

    try {
        $query = 'UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception('Prepare failed: ' . $conn->error);
        }

        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        logAdminAction($conn, 'user.update', 'user', $targetUserId, 'Updated user #' . $targetUserId, $input);

        sendJson([
            'success' => true,
            'message' => 'User updated successfully',
            'user' => respondWithUser($conn, $targetUserId),
        ]);
    } catch (mysqli_sql_exception $error) {
        if ((int) $error->getCode() === 1062) {
            sendJson(['success' => false, 'error' => 'Email already registered'], 409);
        }
        sendJson(['success' => false, 'error' => 'User update failed'], 500);
    } catch (Exception $error) {
        sendJson(['success' => false, 'error' => $error->getMessage()], 500);
    }
}

if ($method === 'DELETE') {
    $targetUserId = (int) ($_GET['id'] ?? 0);
    if ($targetUserId <= 0) {
        sendJson(['success' => false, 'error' => 'User id is required'], 400);
    }

    if ($targetUserId === (int) $currentUserId) {
        sendJson(['success' => false, 'error' => 'You cannot delete your own admin account'], 400);
    }

    $targetLabel = 'user #' . $targetUserId;
    $labelStmt = $conn->prepare('SELECT name, email FROM users WHERE id = ? LIMIT 1');
    if ($labelStmt) {
        $labelStmt->bind_param('i', $targetUserId);
        $labelStmt->execute();
        $labelResult = $labelStmt->get_result();
        if ($labelResult->num_rows > 0) {
            $labelRow = $labelResult->fetch_assoc();
            $targetLabel = trim((string) ($labelRow['name'] ?? '')) ?: (string) ($labelRow['email'] ?? $targetLabel);
        }
    }

    $stmt = $conn->prepare('DELETE FROM users WHERE id = ?');
    if (!$stmt) {
        sendJson(['success' => false, 'error' => 'Prepare failed'], 500);
    }

    $stmt->bind_param('i', $targetUserId);
    $stmt->execute();

    if ($stmt->affected_rows === 0) {
        sendJson(['success' => false, 'error' => 'User not found'], 404);
    }

    logAdminAction($conn, 'user.delete', 'user', $targetUserId, 'Deleted user: ' . $targetLabel);

    sendJson([
        'success' => true,
        'message' => 'User deleted successfully'
    ]);
}

sendJson(['success' => false, 'error' => 'Method not allowed'], 405);
