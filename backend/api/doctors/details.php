<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

if (!isset($_GET['id'])) {
    sendResponse(false, 'Doctor ID is required', null, 400);
}

try {
    $database = new Database();
    $db = $database->getConnection();

    $query = "SELECT d.id, u.name, u.email, d.specialization, d.experience 
              FROM doctors d 
              INNER JOIN users u ON d.user_id = u.id 
              WHERE d.id = :id";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $_GET['id']);
    $stmt->execute();

    $doctor = $stmt->fetch();

    if (!$doctor) {
        sendResponse(false, 'Doctor not found', null, 404);
    }

    sendResponse(true, 'Doctor retrieved successfully', $doctor);

} catch (PDOException $e) {
    sendResponse(false, 'Failed to retrieve doctor: ' . $e->getMessage(), null, 500);
}
?>