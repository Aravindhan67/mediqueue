<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/helpers.php';
ini_set('display_errors', 1);
error_reporting(E_ALL);
echo "DEBUG START\n";

try {
    $database = new Database();
    $db = $database->getConnection();

    $stmt = $db->query("SELECT id, name, email, role FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($users);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>