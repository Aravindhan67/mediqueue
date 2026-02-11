<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

$user = getUserFromToken();
if (!$user) {
    sendResponse(false, 'Unauthorized', null, 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method not allowed', null, 405);
}

if (!isset($_FILES['prescription'])) {
    sendResponse(false, 'No file uploaded', null, 400);
}

if (!isset($_POST['appointment_id'])) {
    sendResponse(false, 'Appointment ID is required', null, 400);
}

$file = $_FILES['prescription'];
$appointmentId = $_POST['appointment_id'];

// Validate file
$allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
if (!in_array($file['type'], $allowedTypes)) {
    sendResponse(false, 'Invalid file type. Only PDF and Images are allowed.', null, 400);
}

// Max size 5MB
if ($file['size'] > 5 * 1024 * 1024) {
    sendResponse(false, 'File size too large. Max 5MB.', null, 400);
}

// Generate filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'prescription_' . $appointmentId . '_' . time() . '.' . $extension;
$uploadPath = __DIR__ . '/../../uploads/' . $filename;

if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
    try {
        $database = new Database();
        $db = $database->getConnection();

        // Check if prescription already exists for this appointment
        $check = $db->prepare("SELECT id FROM prescriptions WHERE appointment_id = ?");
        $check->execute([$appointmentId]);

        if ($check->rowCount() > 0) {
            $stmt = $db->prepare("UPDATE prescriptions SET file_path = ?, uploaded_by = ? WHERE appointment_id = ?");
            $stmt->execute([$filename, $user['role'], $appointmentId]);
        } else {
            $stmt = $db->prepare("INSERT INTO prescriptions (appointment_id, file_path, uploaded_by) VALUES (?, ?, ?)");
            $stmt->execute([$appointmentId, $filename, $user['role']]);
        }

        sendResponse(true, 'Prescription uploaded successfully', ['file' => $filename]);

    } catch (PDOException $e) {
        sendResponse(false, 'Database error: ' . $e->getMessage(), null, 500);
    }
} else {
    sendResponse(false, 'Failed to save file', null, 500);
}
?>