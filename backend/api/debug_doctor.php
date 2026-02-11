<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../utils/helpers.php';

$headers = getallheaders();
$user = getUserFromToken();

echo json_encode([
    'headers' => $headers,
    'user_from_token' => $user,
    'server_auth' => $_SERVER['HTTP_AUTHORIZATION'] ?? 'NOT SET',
    'redirect_auth' => $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? 'NOT SET',
]);
?>