<?php
require_once __DIR__ . '/../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    $email = 'doctor@mediqueue.com';
    $password = 'doctor123';

    $stmt = $db->prepare("SELECT password FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    echo "Stored Hash: " . $row['password'] . "\n";
    echo "Verify: " . (password_verify($password, $row['password']) ? 'MATCH' : 'FAIL') . "\n";
    echo "New Hash: " . password_hash($password, PASSWORD_DEFAULT) . "\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>