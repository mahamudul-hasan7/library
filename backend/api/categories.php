<?php
// backend/api/categories.php - Category catalog API

ob_start();
ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once '../config.php';

ensureCategoriesTable($conn);
ensureAdminLogsTable($conn);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $includeAll = isset($_GET['all']) && $_GET['all'] === '1';
    if ($includeAll) {
        requireAdminUser($conn);
    }
    $query = "
        SELECT id, name, slug, description, status, sort_order, created_at, updated_at
        FROM categories
        " . ($includeAll ? "" : "WHERE status = 'active'") . "
        ORDER BY sort_order ASC, name ASC
    ";
    $result = $conn->query($query);
    $categories = [];

    while ($row = $result->fetch_assoc()) {
        $row['id'] = (int) $row['id'];
        $row['sort_order'] = (int) $row['sort_order'];
        $categories[] = $row;
    }

    sendJson(['success' => true, 'categories' => $categories, 'count' => count($categories)]);
}

if ($method === 'POST') {
    requireAdminUser($conn);
    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        sendJson(['success' => false, 'error' => 'Invalid JSON body'], 400);
    }

    $name = trim((string) ($input['name'] ?? ''));
    if ($name === '') {
        sendJson(['success' => false, 'error' => 'Category name is required'], 400);
    }

    $slug = brainrootSlugify($input['slug'] ?? $name);
    $description = trim((string) ($input['description'] ?? ''));
    $status = strtolower(trim((string) ($input['status'] ?? 'active'))) === 'archived' ? 'archived' : 'active';
    $sortOrder = max(0, (int) ($input['sort_order'] ?? 0));

    try {
        $stmt = $conn->prepare("
            INSERT INTO categories (name, slug, description, status, sort_order)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->bind_param('ssssi', $name, $slug, $description, $status, $sortOrder);
        $stmt->execute();

        $categoryId = $stmt->insert_id;
        logAdminAction($conn, 'category.create', 'category', $categoryId, 'Added category: ' . $name, [
            'name' => $name,
            'status' => $status
        ]);

        sendJson(['success' => true, 'message' => 'Category added successfully', 'category_id' => $categoryId]);
    } catch (mysqli_sql_exception $error) {
        if ((int) $error->getCode() === 1062) {
            sendJson(['success' => false, 'error' => 'Category already exists'], 409);
        }
        sendJson(['success' => false, 'error' => 'Category create failed'], 500);
    }
}

if ($method === 'PUT') {
    requireAdminUser($conn);
    $categoryId = (int) ($_GET['id'] ?? 0);
    if ($categoryId <= 0) {
        sendJson(['success' => false, 'error' => 'Category id is required'], 400);
    }

    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        sendJson(['success' => false, 'error' => 'Invalid JSON body'], 400);
    }

    $fields = [];
    $params = [];
    $types = '';

    if (array_key_exists('name', $input)) {
        $name = trim((string) $input['name']);
        if ($name === '') {
            sendJson(['success' => false, 'error' => 'Category name cannot be empty'], 400);
        }
        $fields[] = 'name = ?';
        $params[] = $name;
        $types .= 's';

        if (!array_key_exists('slug', $input)) {
            $fields[] = 'slug = ?';
            $params[] = brainrootSlugify($name);
            $types .= 's';
        }
    }

    if (array_key_exists('slug', $input)) {
        $fields[] = 'slug = ?';
        $params[] = brainrootSlugify($input['slug']);
        $types .= 's';
    }

    if (array_key_exists('description', $input)) {
        $fields[] = 'description = ?';
        $params[] = trim((string) $input['description']);
        $types .= 's';
    }

    if (array_key_exists('status', $input)) {
        $status = strtolower(trim((string) $input['status'])) === 'archived' ? 'archived' : 'active';
        $fields[] = 'status = ?';
        $params[] = $status;
        $types .= 's';
    }

    if (array_key_exists('sort_order', $input)) {
        $fields[] = 'sort_order = ?';
        $params[] = max(0, (int) $input['sort_order']);
        $types .= 'i';
    }

    if (!$fields) {
        sendJson(['success' => false, 'error' => 'No fields to update'], 400);
    }

    $params[] = $categoryId;
    $types .= 'i';

    try {
        $stmt = $conn->prepare('UPDATE categories SET ' . implode(', ', $fields) . ' WHERE id = ?');
        $stmt->bind_param($types, ...$params);
        $stmt->execute();

        if ($stmt->affected_rows === 0) {
            sendJson(['success' => false, 'error' => 'Category not found or unchanged'], 404);
        }

        logAdminAction($conn, 'category.update', 'category', $categoryId, 'Updated category #' . $categoryId, $input);
        sendJson(['success' => true, 'message' => 'Category updated successfully']);
    } catch (mysqli_sql_exception $error) {
        if ((int) $error->getCode() === 1062) {
            sendJson(['success' => false, 'error' => 'Category name or slug already exists'], 409);
        }
        sendJson(['success' => false, 'error' => 'Category update failed'], 500);
    }
}

if ($method === 'DELETE') {
    $categoryId = (int) ($_GET['id'] ?? 0);
    if ($categoryId <= 0) {
        sendJson(['success' => false, 'error' => 'Category id is required'], 400);
    }

    $stmt = $conn->prepare("UPDATE categories SET status = 'archived' WHERE id = ?");
    $stmt->bind_param('i', $categoryId);
    $stmt->execute();

    if ($stmt->affected_rows === 0) {
        sendJson(['success' => false, 'error' => 'Category not found'], 404);
    }

    logAdminAction($conn, 'category.archive', 'category', $categoryId, 'Archived category #' . $categoryId);
    sendJson(['success' => true, 'message' => 'Category archived successfully']);
}

sendJson(['success' => false, 'error' => 'Method not allowed'], 405);
?>
