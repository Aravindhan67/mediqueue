<?php
// DB Fix Script
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "1. Starting...<br>";

$host = 'localhost';
$db_name = 'hospital';
$username = 'root';
$password = '';

try {
    echo "2. Connecting to DB...<br>";
    $conn = new mysqli($host, $username, $password, $db_name);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    echo "3. Connected! Server info: " . $conn->server_info . "<br>";

    $email = 'patient@mediqueue.com';
    echo "4. Checking for user $email...<br>";

    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    if (!$check)
        die("Prepare failed: " . $conn->error);

    $check->bind_param("s", $email);
    $check->execute();
    $result = $check->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo "5. User exists! ID: " . $row['id'] . "<br>";

        // Check patient profile
        $check_p = $conn->query("SELECT * FROM patients WHERE user_id = " . $row['id']);
        if ($check_p->num_rows > 0) {
            echo "6. Patient profile exists!<br>";
        } else {
            echo "6. Creating patient profile...<br>";
            $conn->query("INSERT INTO patients (user_id, age, gender, phone) VALUES (" . $row['id'] . ", 28, 'female', '1234567890')");
            echo "7. Patient profile created!<br>";
        }

        // Reset password just in case
        echo "8. Resetting password to 'patient123'...<br>";
        $pass = password_hash('patient123', PASSWORD_DEFAULT);
        $conn->query("UPDATE users SET password = '$pass' WHERE id = " . $row['id']);
        echo "9. Password reset!<br>";

    } else {
        echo "5. User does NOT exist. Creating...<br>";
        $pass = password_hash('patient123', PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES ('Jane Doe', ?, ?, 'patient')");
        $stmt->bind_param("ss", $email, $pass);

        if ($stmt->execute()) {
            $user_id = $conn->insert_id;
            echo "6. User created! ID: $user_id<br>";

            $conn->query("INSERT INTO patients (user_id, age, gender, phone) VALUES ($user_id, 28, 'female', '1234567890')");
            echo "7. Patient profile created!<br>";
        } else {
            echo "6. Insert failed: " . $stmt->error . "<br>";
        }
    }

    echo "DONE! Try logging in now.";

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
?>