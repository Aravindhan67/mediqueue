<?php
require_once __DIR__ . '/../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $email = 'admin@mediqueue.com';
    $password = 'admin123';
    $hash = password_hash($password, PASSWORD_DEFAULT);

    // Check if admin exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);

    if ($stmt->rowCount() == 0) {
        echo "Creating Admin User... ";
        $ins = $db->prepare("INSERT INTO users (name, email, password, role) VALUES ('System Admin', ?, ?, 'admin')");
        if ($ins->execute([$email, $hash])) {
            echo "DONE (ID: " . $db->lastInsertId() . ")\n";
        } else {
            echo "FAILED.\n";
        }
    } else {
        echo "Admin User already exists. Updating password... ";
        $upd = $db->prepare("UPDATE users SET password = ? WHERE email = ?");
        if ($upd->execute([$hash, $email])) {
            echo "DONE.\n";
        } else {
            echo "FAILED.\n";
        }
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>