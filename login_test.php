<?php
// Minimal Test Script
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

try {
    // Database Config (Hardcoded for testing)
    $host = 'localhost';
    $db_name = 'hospital';
    $username = 'root';
    $password = '';

    echo " connecting to db... ";
    $conn = new mysqli($host, $username, $password, $db_name);

    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    echo " Connected! ";

    $email = 'patient@mediqueue.com';

    // Check user
    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $result = $check->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode(["status" => "User exists", "id" => $row['id']]);
    } else {
        echo " Creating user... ";
        $pass = password_hash('patient123', PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES ('Jane Doe', ?, ?, 'patient')");
        $stmt->bind_param("ss", $email, $pass);

        if ($stmt->execute()) {
            $user_id = $conn->insert_id;
            echo " User created ($user_id)... ";

            $stmt2 = $conn->prepare("INSERT INTO patients (user_id, age, gender, phone) VALUES (?, 28, 'female', '1234567890')");
            $stmt2->bind_param("i", $user_id);
            $stmt2->execute();

            echo json_encode(["status" => "User Created Successfully", "id" => $user_id]);
        } else {
            throw new Exception("Insert failed: " . $stmt->error);
        }
    }

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>