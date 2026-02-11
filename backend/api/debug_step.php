<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
echo "Start\n";
echo "Header...";
if (function_exists('getallheaders'))
    echo "Exists\n";
else
    echo "Missing\n";

echo "Step 1: CORS...";
try {
    require_once __DIR__ . '/../../config/cors.php';
    echo "OK\n";
} catch (Throwable $e) {
    echo "Error: " . $e->getMessage();
}

echo "Step 2: Database...";
try {
    require_once __DIR__ . '/../../config/database.php';
    echo "OK\n";
} catch (Throwable $e) {
    echo "Error: " . $e->getMessage();
}

echo "Step 3: Helpers...";
try {
    require_once __DIR__ . '/../../utils/helpers.php';
    echo "OK\n";
} catch (Throwable $e) {
    echo "Error: " . $e->getMessage();
}

echo "Done.";
?>