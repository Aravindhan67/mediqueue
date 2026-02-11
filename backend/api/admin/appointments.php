<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

$user = getUserFromToken();
if (!$user || $user['role'] !== 'admin') {
    sendResponse(false, 'Unauthorized', null, 401);
}

try {
    $database = new Database();
    $db = $database->getConnection();

    $query = "SELECT a.*, 
              u1.name as patient_name,
              u2.name as doctor_name,
              d.specialization
              FROM appointments a
              INNER JOIN patients p ON a.patient_id = p.id
              INNER JOIN users u1 ON p.user_id = u1.id
              INNER JOIN doctors d ON a.doctor_id = d.id
              INNER JOIN users u2 ON d.user_id = u2.id
              ORDER BY a.date DESC, a.time DESC";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $appointments = $stmt->fetchAll();

    sendResponse(true, 'Appointments retrieved successfully', $appointments);

} catch (PDOException $e) {
    sendResponse(false, 'Failed to retrieve appointments: ' . $e->getMessage(), null, 500);
}
?>