<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

// Force JSON response
header('Content-Type: application/json');
ini_set('display_errors', 0);
error_reporting(E_ALL);

function sendJsonError($message, $code = 400)
{
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}

$user = getUserFromToken();
if (!$user || $user['role'] !== 'patient') {
    sendResponse(false, 'Unauthorized', null, 401);
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // Get patient ID
    $patientQuery = "SELECT id FROM patients WHERE user_id = :user_id";
    $patientStmt = $db->prepare($patientQuery);
    $patientStmt->bindParam(':user_id', $user['user_id']);
    $patientStmt->execute();
    $patient = $patientStmt->fetch();

    if (!$patient) {
        sendResponse(false, 'Patient profile not found', null, 404);
    }

    $query = "SELECT a.*, 
              u.name as doctor_name, 
              d.specialization,
              pr.file_path as prescription_file
              FROM appointments a
              INNER JOIN doctors d ON a.doctor_id = d.id
              INNER JOIN users u ON d.user_id = u.id
              LEFT JOIN prescriptions pr ON a.id = pr.appointment_id
              WHERE a.patient_id = :patient_id
              ORDER BY a.date DESC, a.time DESC";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':patient_id', $patient['id']);
    $stmt->execute();

    $appointments = $stmt->fetchAll();

    sendResponse(true, 'Appointments retrieved successfully', $appointments);

} catch (Exception $e) {
    sendJsonError('Error: ' . $e->getMessage(), 500);
}
?>