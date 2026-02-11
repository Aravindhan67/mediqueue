<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

header('Content-Type: application/json');
ini_set('display_errors', 0);
error_reporting(E_ALL);

function sendJsonError($message, $code = 400)
{
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}

try {
    $database = new Database();
    $db = $database->getConnection();

    $query = "SELECT d.id, u.name, u.email, d.specialization, d.experience 
              FROM doctors d 
              INNER JOIN users u ON d.user_id = u.id 
              ORDER BY u.name";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $doctors = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $doctors]);

} catch (Exception $e) {
    sendJsonError('Error: ' . $e->getMessage(), 500);
}
?>