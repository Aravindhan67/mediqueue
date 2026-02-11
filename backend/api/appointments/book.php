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
    if (!$user || $user['role'] !== 'patient') {
        sendJsonError('Unauthorized', 401);
    }

    $data = getJSONInput();
    $error = validateRequired($data, ['doctor_id', 'date', 'time']);
    if ($error) {
        sendJsonError($error, 400);
    }

    $database = new Database();
    $db = $database->getConnection();

    // Get patient ID
    $patientQuery = "SELECT id FROM patients WHERE user_id = :user_id";
    $patientStmt = $db->prepare($patientQuery);
    $patientStmt->execute([':user_id' => $user['user_id']]); // Fix: use user_id from token payload if strictly named that way, or just id. 
    // In helpers.php generateJWT uses 'user_id' => $userId. verified.
    $patient = $patientStmt->fetch(PDO::FETCH_ASSOC);

    if (!$patient) {
        sendJsonError('Patient profile not found', 404);
    }

    $patientId = $patient['id'];

    // Validate Time Slot against Schedule
    $checkQuery = "SELECT start_time, end_time FROM schedules 
                   WHERE doctor_id = :doctor_id AND date = :date";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->execute([':doctor_id' => $data['doctor_id'], ':date' => $data['date']]);
    $schedule = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if (!$schedule) {
        sendJsonError('Doctor is not available on this date', 404);
    }

    $startTime = strtotime($schedule['start_time']);
    $endTime = strtotime($schedule['end_time']);
    $requestTime = strtotime($data['time']);

    // Check if time is within schedule
    if ($requestTime < $startTime || $requestTime >= $endTime) {
        sendJsonError('Selected time is out of doctor\'s schedule', 400);
    }

    // Check availability (Is this specific slot already booked?)
    $availabilityQuery = "SELECT id FROM appointments 
                         WHERE doctor_id = :doctor_id 
                         AND date = :date 
                         AND time = :time 
                         AND status != 'cancelled'";

    $availStmt = $db->prepare($availabilityQuery);
    $availStmt->execute([':doctor_id' => $data['doctor_id'], ':date' => $data['date'], ':time' => $data['time']]);

    if ($availStmt->rowCount() > 0) {
        sendJsonError('This slot is already booked', 409);
    }

    // Book appointment
    $query = "INSERT INTO appointments (patient_id, doctor_id, date, time, status) 
              VALUES (:patient_id, :doctor_id, :date, :time, 'pending')";

    $stmt = $db->prepare($query);
    $stmt->execute([
        ':patient_id' => $patientId,
        ':doctor_id' => $data['doctor_id'],
        ':date' => $data['date'],
        ':time' => $data['time']
    ]);

    echo json_encode(['success' => true, 'message' => 'Appointment booked successfully']);

} catch (Exception $e) {
    sendJsonError('Error: ' . $e->getMessage(), 500);
}
?>