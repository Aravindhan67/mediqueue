<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

$user = getUserFromToken();
if (!$user || $user['role'] !== 'doctor') {
    sendResponse(false, 'Unauthorized', null, 401);
}

$data = getJSONInput();
$error = validateRequired($data, ['appointment_id', 'status']);
if ($error) {
    sendResponse(false, $error, null, 400);
}

if (!in_array($data['status'], ['completed', 'cancelled'])) {
    sendResponse(false, 'Invalid status', null, 400);
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // Verify doctor owns this appointment
    $query = "UPDATE appointments a
              INNER JOIN doctors d ON a.doctor_id = d.id
              SET a.status = :status
              WHERE a.id = :appointment_id AND d.user_id = :user_id";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':appointment_id', $data['appointment_id']);
    $stmt->bindParam(':status', $data['status']);
    $stmt->bindParam(':user_id', $user['user_id']);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        sendResponse(true, 'Appointment status updated successfully');
    } else {
        sendResponse(false, 'Appointment not found or unauthorized', null, 404);
    }

} catch (PDOException $e) {
    sendResponse(false, 'Failed to update status: ' . $e->getMessage(), null, 500);
}
?>