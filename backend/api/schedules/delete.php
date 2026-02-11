<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

$user = getUserFromToken();
if (!$user || $user['role'] !== 'doctor') {
    sendResponse(false, 'Unauthorized', null, 401);
}

$data = getJSONInput();
$error = validateRequired($data, ['schedule_id']);
if ($error) {
    sendResponse(false, $error, null, 400);
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // Verify ownership and delete
    $query = "DELETE s FROM schedules s
              INNER JOIN doctors d ON s.doctor_id = d.id
              WHERE s.id = :schedule_id AND d.user_id = :user_id";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':schedule_id', $data['schedule_id']);
    $stmt->bindParam(':user_id', $user['user_id']);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        sendResponse(true, 'Schedule deleted successfully');
    } else {
        sendResponse(false, 'Schedule not found or unauthorized', null, 404);
    }

} catch (PDOException $e) {
    sendResponse(false, 'Failed to delete schedule: ' . $e->getMessage(), null, 500);
}
?>