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
    $user = getUserFromToken();
    if (!$user) {
        sendJsonError('Unauthorized', 401);
    }

    $database = new Database();
    $db = $database->getConnection();

    $query = "SELECT p.*, a.date as appointment_date, u.name as patient_name 
              FROM prescriptions p 
              JOIN appointments a ON p.appointment_id = a.id 
              JOIN patients pat ON a.patient_id = pat.id 
              JOIN users u ON pat.user_id = u.id ";

    if ($user['role'] === 'patient') {
        $query .= "WHERE pat.user_id = :user_id";
    } elseif ($user['role'] === 'doctor') {
        $query .= "JOIN doctors d ON a.doctor_id = d.id WHERE d.user_id = :user_id";
    }

    $stmt = $db->prepare($query);
    $stmt->execute([':user_id' => $user['user_id']]);
    $prescriptions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $prescriptions]);

} catch (Exception $e) {
    sendJsonError('Error: ' . $e->getMessage(), 500);
}
?>