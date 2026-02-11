<?php
require_once __DIR__ . '/../config/database.php';
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    $database = new Database();
    $db = $database->getConnection();

    $email = 'doctor@mediqueue.com';
    $password = 'doctor123';
    $hash = password_hash($password, PASSWORD_DEFAULT);

    echo "Updating password for $email to hash: $hash\n";

    $stmt = $db->prepare("UPDATE users SET password = :p WHERE email = :e");
    $stmt->bindParam(':p', $hash);
    $stmt->bindParam(':e', $email);

    if ($stmt->execute()) {
        echo "Execute Success. Rows affected: " . $stmt->rowCount() . "\n";
    } else {
        echo "Execute Failed.\n";
        print_r($stmt->errorInfo());
    }

} catch (Exception $e) {
    echo "Exception: " . $e->getMessage();
}
?>