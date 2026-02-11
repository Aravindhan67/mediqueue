<?php
require_once __DIR__ . '/../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $email = 'doctor_new@mediqueue.com';
    $password = 'doctor123';
    $hash = password_hash($password, PASSWORD_DEFAULT);

    // Check if exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = :e");
    $stmt->bindParam(':e', $email);
    $stmt->execute();
    if ($stmt->rowCount() > 0) {
        // Delete if exists
        $del = $db->prepare("DELETE FROM users WHERE email = :e");
        $del->bindParam(':e', $email);
        $del->execute();
    }

    $insert = $db->prepare("INSERT INTO users (name, email, password, role) VALUES ('New Doctor', :e, :p, 'doctor')");
    $insert->bindParam(':e', $email);
    $insert->bindParam(':p', $hash);

    if ($insert->execute()) {
        $user_id = $db->lastInsertId();
        $doc = $db->prepare("INSERT INTO doctors (user_id, specialization, phone) VALUES ($user_id, 'Neuro', '9999999999')");
        $doc->execute();
        echo "Created User ID: " . $user_id;
    } else {
        echo "Insert Failed";
        print_r($insert->errorInfo());
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>