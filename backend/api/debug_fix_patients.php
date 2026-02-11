<?php
require_once __DIR__ . '/../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Get all users with role 'patient'
    $stmt = $db->query("SELECT id, name, email FROM users WHERE role = 'patient'");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "Found " . count($users) . " users with role 'patient'.\n";

    foreach ($users as $u) {
        $userId = $u['id'];
        echo "Checking User: " . $u['email'] . " (ID: $userId)... ";

        // Check if patient record exists
        $check = $db->prepare("SELECT id FROM patients WHERE user_id = ?");
        $check->execute([$userId]);

        if ($check->rowCount() == 0) {
            echo "MISSING patient profile. Creating... ";

            // Insert dummy patient record
            $ins = $db->prepare("INSERT INTO patients (user_id, age, gender, phone) VALUES (?, 30, 'other', '0000000000')");
            if ($ins->execute([$userId])) {
                echo "DONE.\n";
            } else {
                echo "FAILED.\n";
            }
        } else {
            echo "OK.\n";
        }
    }

    echo "Patient profile check complete.";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>