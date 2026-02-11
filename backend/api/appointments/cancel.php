<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

$user = getUserFromToken();
if (!$user) {
    sendResponse(false, 'Unauthorized', null, 401);
}

$data = getJSONInput();
$error = validateRequired($data, ['appointment_id']);
if ($error) {
    sendResponse(false, $error, null, 400);
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // Verify ownership before canceling
    if ($user['role'] === 'patient') {
        $query = "UPDATE appointments a
                  INNER JOIN patients p ON a.patient_id = p.id
                  SET a.status = 'cancelled'
                  WHERE a.id = :appointment_id AND p.user_id = :user_id";
    } else {
        sendResponse(false, 'Unauthorized', null, 403);
    }

    $stmt = $db->prepare($query);
    $stmt->bindParam(':appointment_id', $data['appointment_id']);
    $stmt->bindParam(':user_id', $user['user_id']);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        sendResponse(true, 'Appointment cancelled successfully');
    } else {
        sendResponse(false, 'Appointment not found or already cancelled', null, 404);
    }

} catch (PDOException $e) {
    sendResponse(false, 'Failed to cancel appointment: ' . $e->getMessage(), null, 500);
}
?>