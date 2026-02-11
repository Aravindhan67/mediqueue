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
    if (!$user || $user['role'] !== 'doctor') {
        sendJsonError('Unauthorized', 401);
    }

    $database = new Database();
    $db = $database->getConnection();

    // Get doctor ID
    $doctor_query = "SELECT id FROM doctors WHERE user_id = :user_id";
    $stmt = $db->prepare($doctor_query);
    $stmt->execute([':user_id' => $user['user_id']]); // Use 'user_id' from token payload
    $doctor = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$doctor) {
        sendJsonError('Doctor profile not found', 404);
    }

    $query = "SELECT a.*, u.name as patient_name, u.email as patient_email, p.age, p.gender, p.phone 
              FROM appointments a 
              JOIN patients p ON a.patient_id = p.id 
              JOIN users u ON p.user_id = u.id 
              WHERE a.doctor_id = :doctor_id 
              ORDER BY a.date, a.time";

    $stmt = $db->prepare($query);
    $stmt->execute([':doctor_id' => $doctor['id']]);
    $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $appointments]);

} catch (Exception $e) {
    sendJsonError('Error: ' . $e->getMessage(), 500);
}
?>