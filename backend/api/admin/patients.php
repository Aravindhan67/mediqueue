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

    $query = "SELECT p.id, u.name, u.email, p.age, p.gender, p.phone 
              FROM patients p 
              INNER JOIN users u ON p.user_id = u.id 
              ORDER BY u.name";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $patients = $stmt->fetchAll();

    sendResponse(true, 'Patients retrieved successfully', $patients);

} catch (PDOException $e) {
    sendResponse(false, 'Failed to retrieve patients: ' . $e->getMessage(), null, 500);
}
?>