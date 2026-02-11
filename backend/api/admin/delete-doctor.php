<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

$user = getUserFromToken();
if (!$user || $user['role'] !== 'admin') {
    sendResponse(false, 'Unauthorized', null, 401);
}

$data = getJSONInput();
$error = validateRequired($data, ['doctor_id']);
if ($error) {
    sendResponse(false, $error, null, 400);
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // Get doctor user_id
    $doctorQuery = "SELECT user_id FROM doctors WHERE id = :doctor_id";
    $doctorStmt = $db->prepare($doctorQuery);
    $doctorStmt->bindParam(':doctor_id', $data['doctor_id']);
    $doctorStmt->execute();
    $doctor = $doctorStmt->fetch();

    if (!$doctor) {
        sendResponse(false, 'Doctor not found', null, 404);
    }

    // Delete user (cascade will handle doctor and related data)
    $deleteQuery = "DELETE FROM users WHERE id = :user_id";
    $deleteStmt = $db->prepare($deleteQuery);
    $deleteStmt->bindParam(':user_id', $doctor['user_id']);
    $deleteStmt->execute();

    sendResponse(true, 'Doctor deleted successfully');

} catch (PDOException $e) {
    sendResponse(false, 'Failed to delete doctor: ' . $e->getMessage(), null, 500);
}
?>