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

    $query = "SELECT d.id, u.name, u.email, d.specialization, d.experience 
              FROM doctors d 
              INNER JOIN users u ON d.user_id = u.id 
              ORDER BY u.name";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $doctors = $stmt->fetchAll();

    sendResponse(true, 'Doctors retrieved successfully', $doctors);

} catch (PDOException $e) {
    sendResponse(false, 'Failed to retrieve doctors: ' . $e->getMessage(), null, 500);
}
?>