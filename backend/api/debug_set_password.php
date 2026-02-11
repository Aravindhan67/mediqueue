<?php
require_once __DIR__ . '/../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $email = 'doctor@mediqueue.com';
    $password = 'doctor123';
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $db->prepare("UPDATE users SET password = :password WHERE email = :email");
    $stmt->bindParam(':password', $hashed_password);
    $stmt->bindParam(':email', $email);

    if ($stmt->execute()) {
        echo "Password updated successfully for $email";
    } else {
        echo "Update failed";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>