<?php
require_once __DIR__ . '/../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $email = 'doctor@mediqueue.com';
    $password = 'doctor123';
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Check user
    $stmt = $db->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        // Update password
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $user_id = $row['id'];
        $update = $db->prepare("UPDATE users SET password = :password WHERE id = :id");
        $update->bindParam(':password', $hashed_password);
        $update->bindParam(':id', $user_id);
        $update->execute();
        echo json_encode(["status" => "Password Updated", "id" => $user_id]);
    } else {
        // Create user
        $insert = $db->prepare("INSERT INTO users (name, email, password, role) VALUES ('Doctor', :email, :password, 'doctor')");
        $insert->bindParam(':email', $email);
        $insert->bindParam(':password', $hashed_password);
        $insert->execute();
        $user_id = $db->lastInsertId();

        // Create doctor profile
        $insert_doc = $db->prepare("INSERT INTO doctors (user_id, specialization, phone) VALUES (:user_id, 'General', '1234567890')");
        $insert_doc->bindParam(':user_id', $user_id);
        $insert_doc->execute();

        echo json_encode(["status" => "User Created", "id" => $user_id]);
    }

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>