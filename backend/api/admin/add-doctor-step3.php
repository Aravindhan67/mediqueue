<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

header('Content-Type: application/json');

function sendJsonError($message, $code = 400)
{
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}

// Custom Token Verification for Robustness
function local_base64UrlEncode($data)
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function local_verifyJWT($token)
{
    if (!$token)
        return false;
    $token = str_replace('Bearer ', '', $token);
    $parts = explode('.', $token);
    if (count($parts) !== 3)
        return false;

    $header = $parts[0];
    $payload = $parts[1];
    $signatureProvided = $parts[2];

    // Re-calculate signature
    $signature = hash_hmac('sha256', $header . "." . $payload, JWT_SECRET, true);
    $base64UrlSignature = local_base64UrlEncode($signature);

    if ($base64UrlSignature !== $signatureProvided) {
        // file_put_contents('debug_auth_error.log', "Sig Mismatch:\nCalc: $base64UrlSignature\nSent: $signatureProvided\n");
        // Try alternate encoding (raw base64_encode fallback)
        $altSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        if ($altSignature === $signatureProvided) {
            // file_put_contents('debug_auth_error.log', "MATCHED with ALT encoding!\n", FILE_APPEND);
        } else {
            return false;
        }
    }

    $payloadData = json_decode(base64_decode(strtr($payload, '-_', '+/')), true);
    if ($payloadData['exp'] < time()) {
        return false;
    }
    return $payloadData;
}

try {
    // 1. Verify Admin Auth
    $token = null;
    $headers = null;
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        $token = $headers['Authorization'] ?? $headers['authorization'] ?? null;
    }
    if (!$token && isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $token = $_SERVER['HTTP_AUTHORIZATION'];
    }

    $user = local_verifyJWT($token);

    if (!$user || $user['role'] !== 'admin') {
        sendJsonError('Unauthorized', 401);
    }

    // 2. Get and Validate Input
    $data = json_decode(file_get_contents('php://input'), true);
    $required = ['name', 'email', 'password', 'specialization', 'experience'];

    // Check if data is null (JSON decode failed)
    if ($data === null) {
        // If GET request, just say hi (for debugging)
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            echo json_encode(['success' => true, 'message' => 'Endpoint ready']);
            exit;
        }
        sendJsonError('Invalid JSON input', 400);
    }

    foreach ($required as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            sendJsonError("Field '$field' is required", 400);
        }
    }

    $database = new Database();
    $db = $database->getConnection();

    // 3. Check if email exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$data['email']]);
    if ($stmt->rowCount() > 0) {
        sendJsonError('Email already registered', 409);
    }

    // 4. Create User Account
    $db->beginTransaction();

    $hash = password_hash($data['password'], PASSWORD_DEFAULT);

    $query = "INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, 'doctor')";
    $stmt = $db->prepare($query);
    $stmt->execute([
        ':name' => $data['name'],
        ':email' => $data['email'],
        ':password' => $hash
    ]);

    $userId = $db->lastInsertId();

    // 5. Create Doctor Profile
    $query = "INSERT INTO doctors (user_id, specialization, experience) VALUES (:user_id, :specialization, :experience)";
    $stmt = $db->prepare($query);
    $stmt->execute([
        ':user_id' => $userId,
        ':specialization' => $data['specialization'],
        ':experience' => $data['experience']
    ]);

    $db->commit();

    echo json_encode(['success' => true, 'message' => 'Doctor added successfully']);

} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    sendJsonError('Error: ' . $e->getMessage(), 500);
}
?>