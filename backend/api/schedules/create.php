<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

$user = getUserFromToken();
if (!$user || $user['role'] !== 'doctor') {
    sendResponse(false, 'Unauthorized', null, 401);
}

$data = getJSONInput();
$error = validateRequired($data, ['date', 'start_time', 'end_time', 'slot_limit']);
if ($error) {
    sendResponse(false, $error, null, 400);
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // Get doctor ID from user
    $doctorQuery = "SELECT id FROM doctors WHERE user_id = :user_id";
    $doctorStmt = $db->prepare($doctorQuery);
    $doctorStmt->bindParam(':user_id', $user['user_id']);
    $doctorStmt->execute();
    $doctor = $doctorStmt->fetch();

    if (!$doctor) {
        sendResponse(false, 'Doctor profile not found', null, 404);
    }

    $doctorId = $doctor['id'];

    // Insert schedule
    $query = "INSERT INTO schedules (doctor_id, date, start_time, end_time, slot_limit) 
              VALUES (:doctor_id, :date, :start_time, :end_time, :slot_limit)";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':doctor_id', $doctorId);
    $stmt->bindParam(':date', $data['date']);
    $stmt->bindParam(':start_time', $data['start_time']);
    $stmt->bindParam(':end_time', $data['end_time']);
    $stmt->bindParam(':slot_limit', $data['slot_limit']);
    $stmt->execute();

    sendResponse(true, 'Schedule created successfully');

} catch (PDOException $e) {
    sendResponse(false, 'Failed to create schedule: ' . $e->getMessage(), null, 500);
}
?>