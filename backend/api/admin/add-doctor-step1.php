<?php
// Step 1: Test Includes
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
// require_once __DIR__ . '/../../utils/helpers.php'; // Commented out for now

header('Content-Type: application/json');

try {
    $database = new Database();
    $db = $database->getConnection();
    echo json_encode(['success' => true, 'message' => 'Database connection successful']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database failed: ' . $e->getMessage()]);
}
?>