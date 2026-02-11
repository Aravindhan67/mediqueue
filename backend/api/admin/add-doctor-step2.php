<?php
// Step 2: Test Helpers
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

header('Content-Type: application/json');

try {
    if (function_exists('getUserFromToken')) {
        echo json_encode(['success' => true, 'message' => 'Helpers loaded successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Helpers loaded but function missing']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Helpers failed: ' . $e->getMessage()]);
}
?>