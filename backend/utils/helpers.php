<?php
/**
 * Utility Helper Functions
 */

/**
 * Generate JWT Token
 */
function generateJWT($userId, $email, $role)
{
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode([
        'user_id' => $userId,
        'email' => $email,
        'role' => $role,
        'iat' => time(),
        'exp' => time() + (60 * 60 * 24 * 7) // 7 days
    ]);

    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

/**
 * Verify JWT Token
 */
function verifyJWT($token)
{
    if (!$token)
        return false;

    // Remove "Bearer " if present
    $token = str_replace('Bearer ', '', $token);

    $tokenParts = explode('.', $token);
    if (count($tokenParts) !== 3)
        return false;

    $header = base64_decode(strtr($tokenParts[0], '-_', '+/'));
    $payload = base64_decode(strtr($tokenParts[1], '-_', '+/'));
    $signatureProvided = $tokenParts[2];

    // Verify signature
    $base64UrlHeader = $tokenParts[0];
    $base64UrlPayload = $tokenParts[1];
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    if ($base64UrlSignature !== $signatureProvided)
        return false;

    // Check expiration
    $payloadData = json_decode($payload, true);
    if ($payloadData['exp'] < time())
        return false;

    return $payloadData;
}

/**
 * Get User from Token
 */
function getUserFromToken()
{
    $token = null;
    $headers = null;

    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        if ($headers && is_array($headers)) {
            if (isset($headers['Authorization'])) {
                $token = $headers['Authorization'];
            } elseif (isset($headers['authorization'])) { // lowercase check
                $token = $headers['authorization'];
            }
        }
    }

    if (!$token) {
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $token = $_SERVER['HTTP_AUTHORIZATION'];
        } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $token = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }
    }

    return verifyJWT($token);
}

/**
 * Send JSON Response
 */
function sendResponse($success, $message, $data = null, $statusCode = 200)
{
    http_response_code($statusCode);
    header('Content-Type: application/json');

    $response = [
        'success' => $success,
        'message' => $message
    ];

    if ($data !== null) {
        $response['data'] = $data;
    }

    echo json_encode($response);
    exit();
}

/**
 * Get JSON Input
 */
function getJSONInput()
{
    return json_decode(file_get_contents('php://input'), true);
}

/**
 * Validate Required Fields
 */
function validateRequired($data, $fields)
{
    foreach ($fields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            return "Field '$field' is required";
        }
    }
    return null;
}
?>