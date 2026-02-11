<?php
/**
 * Admin: Add New Doctor
 */

// CORS Handler
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

header('Content-Type: application/json');
ini_set('display_errors', 0);
error_reporting(E_ALL);

try {
    // 1. Verify Admin Authentication
    $user = getUserFromToken();

    if (!$user || $user['role'] !== 'admin') {
        sendResponse(false, 'Unauthorized: Admin access required', null, 401);
    }

    // 2. Get and Validate Input
    $data = getJSONInput();
    $requiredFields = ['name', 'email', 'password', 'specialization', 'experience'];
    $validationError = validateRequired($data, $requiredFields);

    if ($validationError) {
        sendResponse(false, $validationError, null, 400);
    }

    $database = new Database();
    $db = $database->getConnection();

    // 3. Check if Email Already Exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$data['email']]);
    if ($stmt->rowCount() > 0) {
        sendResponse(false, 'Email address is already registered', null, 409);
    }

    // 4. Create User and Doctor Profile (Atomic Transaction)
    $db->beginTransaction();

    // Hash the password
    $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);

    // Insert into users table
    $userQuery = "INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, 'doctor')";
    $userStmt = $db->prepare($userQuery);
    $userStmt->execute([
        ':name' => $data['name'],
        ':email' => $data['email'],
        ':password' => $passwordHash
    ]);

    $userId = $db->lastInsertId();

    // Insert into doctors table
    $doctorQuery = "INSERT INTO doctors (user_id, specialization, experience) VALUES (:user_id, :specialization, :experience)";
    $doctorStmt = $db->prepare($doctorQuery);
    $doctorStmt->execute([
        ':user_id' => $userId,
        ':specialization' => $data['specialization'],
        ':experience' => (int) $data['experience']
    ]);

    $db->commit();

    sendResponse(true, 'Doctor account created successfully', ['doctor_id' => $db->lastInsertId()]);

} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    sendResponse(false, 'Failed to add doctor: ' . $e->getMessage(), null, 500);
}
?>