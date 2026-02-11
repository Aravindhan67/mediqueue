<?php
// CORS Handler - MUST be first
require_once __DIR__ . '/../../config/cors.php';

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

$debugFile = 'C:\xampp\htdocs\login_debug.log';
file_put_contents($debugFile, "Login request received at " . date('Y-m-d H:i:s') . "\n", FILE_APPEND);

$data = getJSONInput();
file_put_contents($debugFile, "Input data: " . print_r($data, true) . "\n", FILE_APPEND);

// Validate input
$error = validateRequired($data, ['email', 'password']);
if ($error) {
    file_put_contents($debugFile, "Validation error: $error\n", FILE_APPEND);
    sendResponse(false, $error, null, 400);
}

$email = $data['email'];
$password = $data['password'];

try {
    $database = new Database();
    $db = $database->getConnection();

    // Get user
    $query = "SELECT u.*, 
              CASE 
                WHEN u.role = 'doctor' THEN d.id
                WHEN u.role = 'patient' THEN p.id
                ELSE NULL
              END as role_id
              FROM users u
              LEFT JOIN doctors d ON u.id = d.user_id
              LEFT JOIN patients p ON u.id = p.user_id
              WHERE u.email = :email";

    // Auto-seed demo patient if missing (Fix for "Invalid email or password")
    if ($email === 'patient@mediqueue.com' && $password === 'patient123') {
        $check = $db->prepare("SELECT id FROM users WHERE email = :email");
        $check->bindParam(':email', $email);
        $check->execute();

        if ($check->rowCount() === 0) {
            // Create Demo User
            $hashed_password = password_hash('patient123', PASSWORD_DEFAULT);
            $insert_user = $db->prepare("INSERT INTO users (name, email, password, role) VALUES ('Jane Doe', :email, :password, 'patient')");
            $insert_user->bindParam(':email', $email);
            $insert_user->bindParam(':password', $hashed_password);

            if ($insert_user->execute()) {
                $user_id = $db->lastInsertId();
                // Create Patient Profile
                $insert_patient = $db->prepare("INSERT INTO patients (user_id, age, gender, phone) VALUES (:user_id, 28, 'female', '1234567890')");
                $insert_patient->bindParam(':user_id', $user_id);
                $insert_patient->execute();

                error_log("Demo patient created successfully: $email", 3, __DIR__ . '/../../login_debug.log');
            } else {
                error_log("Failed to create demo patient: " . print_r($insert_user->errorInfo(), true), 3, __DIR__ . '/../../login_debug.log');
            }
        }
    }

    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        // Debug info in response
        $debugInfo = "Received: Email='$email', Password='$password'. Auto-seed logic skipped or failed.";
        sendResponse(false, 'Invalid email or password. ' . $debugInfo, null, 401);
    }

    // Generate token
    $token = generateJWT($user['role_id'] ?? $user['id'], $user['email'], $user['role']);

    // Prepare response
    $userData = [
        'id' => $user['role_id'] ?? $user['id'],
        'user_id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role']
    ];

    sendResponse(true, 'Login successful', [
        'token' => $token,
        'user' => $userData
    ]);

} catch (PDOException $e) {
    sendResponse(false, 'Login failed: ' . $e->getMessage(), null, 500);
}
?>