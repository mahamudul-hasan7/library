<?php
// Migration script to add featured books columns to database

header('Content-Type: application/json; charset=utf-8');

require_once '../config.php';

try {
  // Check if columns already exist
  $result = $conn->query("SHOW COLUMNS FROM books LIKE 'featured_section'");
  
  if ($result && $result->num_rows > 0) {
    echo json_encode(['success' => true, 'message' => 'Columns already exist']);
    exit;
  }

  // Add view_count column
  $conn->query("ALTER TABLE books ADD COLUMN view_count INT DEFAULT 0 AFTER status");
  
  // Add like_count column
  $conn->query("ALTER TABLE books ADD COLUMN like_count INT DEFAULT 0 AFTER view_count");
  
  // Add featured_section column
  $conn->query("ALTER TABLE books ADD COLUMN featured_section ENUM('trending', 'top_reading', 'most_liked', 'none') DEFAULT 'none' AFTER like_count");

  echo json_encode([
    'success' => true,
    'message' => 'Migration completed successfully'
  ]);

} catch (Exception $e) {
  http_response_code(500);
  echo json_encode([
    'success' => false,
    'error' => $e->getMessage()
  ]);
}
?>
