<?php
require_once __DIR__ . '/../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Get all users with role 'doctor'
    $stmt = $db->query("SELECT id, name, email FROM users WHERE role = 'doctor'");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "Found " . count($users) . " users with role 'doctor'.\n";

    foreach ($users as $u) {
        $userId = $u['id'];
        echo "Checking Doctor: " . $u['email'] . " (ID: $userId)... ";

        // Check if doctor record exists
        $check = $db->prepare("SELECT id FROM doctors WHERE user_id = ?");
        $check->execute([$userId]);

        if ($check->rowCount() == 0) {
            echo "MISSING doctor profile. Creating... ";

            // Insert dummy doctor record
            $ins = $db->prepare("INSERT INTO doctors (user_id, specialization, experience) VALUES (?, 'General Physician', 5)");
            if ($ins->execute([$userId])) {
                echo "DONE.\n";
            } else {
                echo "FAILED.\n";
            }
        } else {
            echo "OK.\n";
        }
    }

    echo "Doctor profile check complete.";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>