<?php
require_once __DIR__ . '/../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $email = 'doctor_beta@mediqueue.com';
    $password = 'doctor123';
    $hash = password_hash($password, PASSWORD_DEFAULT);

    $insert = $db->prepare("INSERT INTO users (name, email, password, role) VALUES ('Beta Doctor', :e, :p, 'doctor')");
    $insert->bindParam(':e', $email);
    $insert->bindParam(':p', $hash);

    if ($insert->execute()) {
        $user_id = $db->lastInsertId();
        $doc = $db->prepare("INSERT INTO doctors (user_id, specialization, phone) VALUES ($user_id, 'Ortho', '8888888888')");
        $doc->execute();
        echo "Created Beta User ID: " . $user_id;
    } else {
        echo "Insert Failed";
        print_r($insert->errorInfo());
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>