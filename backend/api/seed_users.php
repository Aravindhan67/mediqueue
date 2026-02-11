<?php
require_once __DIR__ . '/../config/database.php';

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected successfully\n";

// Password hash for 'patient123'
$password = password_hash('patient123', PASSWORD_DEFAULT);
$email = 'patient@mediqueue.com';

// Check if user exists
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    echo "User $email already exists.\n";
    $row = $result->fetch_assoc();
    $user_id = $row['id'];
} else {
    // Insert User
    $stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
    $name = 'Jane Doe';
    $role = 'patient';
    $stmt->bind_param("ssss", $name, $email, $password, $role);

    if ($stmt->execute()) {
        $user_id = $conn->insert_id;
        echo "User $email created successfully (ID: $user_id).\n";

        // Insert Patient Profile
        $stmt_profile = $conn->prepare("INSERT INTO patients (user_id, age, gender, phone) VALUES (?, ?, ?, ?)");
        $age = 28;
        $gender = 'female';
        $phone = '1234567890';
        $stmt_profile->bind_param("isss", $user_id, $age, $gender, $phone);

        if ($stmt_profile->execute()) {
            echo "Patient profile created.\n";
        } else {
            echo "Error creating profile: " . $stmt_profile->error . "\n";
        }
    } else {
        echo "Error creating user: " . $stmt->error . "\n";
    }
}

$conn->close();
?>