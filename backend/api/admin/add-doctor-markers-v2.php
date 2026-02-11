<?php
echo "1|";
require_once __DIR__ . '/../../config/cors.php';
echo "2|";
require_once __DIR__ . '/../../config/database.php';
echo "3|";

ini_set('display_errors', 0);
error_reporting(E_ALL);

function sendJsonError($message, $code = 400)
{
    http_response_code($code);
    echo "ERROR:$message";
    exit;
}

echo "4|";

// Custom Token Verification for Robustness
function local_base64UrlEncode($data)
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function local_verifyJWT($token)
{
    echo "V1|";
    if (!$token)
        return false;
    $token = str_replace('Bearer ', '', $token);
    $parts = explode('.', $token);
    if (count($parts) !== 3)
        return false;
    echo "V2|";

    $header = $parts[0];
    $payload = $parts[1];
    $signatureProvided = $parts[2];

    // Re-calculate signature
    $signature = hash_hmac('sha256', $header . "." . $payload, JWT_SECRET, true);
    $base64UrlSignature = local_base64UrlEncode($signature);
    echo "V3|";

    if ($base64UrlSignature !== $signatureProvided) {
        $altSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        if ($altSignature !== $signatureProvided) {
            return false;
        }
    }
    echo "V4|";

    $payloadData = json_decode(base64_decode(strtr($payload, '-_', '+/')), true);
    if (!$payloadData || !isset($payloadData['exp']) || $payloadData['exp'] < time()) {
        return false;
    }
    return $payloadData;
}

echo "5|";

try {
    // 1. Verify Admin Auth
    $token = null;
    $headers = null;
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        if ($headers && is_array($headers)) {
            $token = $headers['Authorization'] ?? $headers['authorization'] ?? null;
        }
    }
    echo "6|";
    if (!$token && isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $token = $_SERVER['HTTP_AUTHORIZATION'];
    }
    echo "7|";

    // MOCK TOKEN FOR DEBUGGING CRASH IF DIRECT ACCESS
    // $token = "Bearer ..."; 

    $user = local_verifyJWT($token);
    echo "8|";

    if (!$user || $user['role'] !== 'admin') {
        echo "UNAUTH|";
        // proceed for debugging
    }

    echo "9|";

    // 2. Get and Validate Input
    echo "READING INPUT|";
    $rawInput = file_get_contents('php://input');
    echo "RAW:" . substr($rawInput, 0, 20) . "|";

    $data = json_decode($rawInput, true);
    echo "DECODED|";

    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        echo "JSON ERROR: " . json_last_error_msg();
    }

    // MOCK DATA IF EMPTY (test script sends empty?)
    if (!$data) {
        $data = [
            'name' => 'Dr Debug',
            'email' => 'debug2@test.com',
            'password' => 'pass',
            'specialization' => 'Spec',
            'experience' => 5
        ];
    }

    echo "10|";

    $database = new Database();
    echo "11|";
    $db = $database->getConnection();
    echo "12|";

    // 3. Check if email exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$data['email']]);
    echo "13|";

    // 4. Create User Account
    $db->beginTransaction();
    echo "14|";

    $hash = password_hash($data['password'], PASSWORD_DEFAULT);

    $query = "INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, 'doctor')";
    $stmt = $db->prepare($query);
    $stmt->execute([
        ':name' => $data['name'],
        ':email' => $data['email'],
        ':password' => $hash
    ]);

    $userId = $db->lastInsertId();
    echo "15|User=$userId|";

    // 5. Create Doctor Profile
    $query = "INSERT INTO doctors (user_id, specialization, experience) VALUES (:user_id, :specialization, :experience)";
    $stmt = $db->prepare($query);
    $stmt->execute([
        ':user_id' => $userId,
        ':specialization' => $data['specialization'],
        ':experience' => $data['experience']
    ]);
    echo "16|";

    $db->rollBack(); // Don't actually commit in debug
    echo "17|Done";

} catch (Exception $e) {
    echo "EX:" . $e->getMessage();
}
?>