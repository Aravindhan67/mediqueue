<?php
// CORS Handler - MUST be first
require_once __DIR__ . '/../../config/cors.php';

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

$data = getJSONInput();

// Validate common fields
$error = validateRequired($data, ['name', 'email', 'password', 'role']);
if ($error) {
    sendResponse(false, $error, null, 400);
}

// Validate role-specific fields
if ($data['role'] === 'patient') {
    $error = validateRequired($data, ['age', 'gender', 'phone']);
    if ($error)
        sendResponse(false, $error, null, 400);
} elseif ($data['role'] === 'doctor') {
    $error = validateRequired($data, ['specialization', 'experience']);
    if ($error)
        sendResponse(false, $error, null, 400);
} else {
    sendResponse(false, 'Invalid role', null, 400);
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // Check if email exists
    $checkQuery = "SELECT id FROM users WHERE email = :email";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':email', $data['email']);
    $checkStmt->execute();

    if ($checkStmt->rowCount() > 0) {
        sendResponse(false, 'Email already registered', null, 409);
    }

    // Start transaction
    $db->beginTransaction();

    // Insert user
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
    $userQuery = "INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)";
    $userStmt = $db->prepare($userQuery);
    $userStmt->bindParam(':name', $data['name']);
    $userStmt->bindParam(':email', $data['email']);
    $userStmt->bindParam(':password', $hashedPassword);
    $userStmt->bindParam(':role', $data['role']);
    $userStmt->execute();

    $userId = $db->lastInsertId();

    // Insert role-specific data
    if ($data['role'] === 'patient') {
        $patientQuery = "INSERT INTO patients (user_id, age, gender, phone) VALUES (:user_id, :age, :gender, :phone)";
        $patientStmt = $db->prepare($patientQuery);
        $patientStmt->bindParam(':user_id', $userId);
        $patientStmt->bindParam(':age', $data['age']);
        $patientStmt->bindParam(':gender', $data['gender']);
        $patientStmt->bindParam(':phone', $data['phone']);
        $patientStmt->execute();
    } elseif ($data['role'] === 'doctor') {
        $doctorQuery = "INSERT INTO doctors (user_id, specialization, experience) VALUES (:user_id, :specialization, :experience)";
        $doctorStmt = $db->prepare($doctorQuery);
        $doctorStmt->bindParam(':user_id', $userId);
        $doctorStmt->bindParam(':specialization', $data['specialization']);
        $doctorStmt->bindParam(':experience', $data['experience']);
        $doctorStmt->execute();
    }

    // Commit transaction
    $db->commit();

    sendResponse(true, 'Registration successful! Please login.');

} catch (PDOException $e) {
    $db->rollBack();
    sendResponse(false, 'Registration failed: ' . $e->getMessage(), null, 500);
}
?>