<?php
require_once __DIR__ . '/../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Get all doctors
    $stmt = $db->query("SELECT id, user_id FROM doctors");
    $doctors = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "Found " . count($doctors) . " doctors.\n";

    foreach ($doctors as $doc) {
        $doctor_id = $doc['id'];
        echo "Seeding/Checking schedules for Doctor ID: $doctor_id\n";

        // Seed next 7 days
        for ($i = 0; $i < 7; $i++) {
            $date = date('Y-m-d', strtotime("+$i days"));

            // Check if exists
            $check = $db->prepare("SELECT id FROM schedules WHERE doctor_id = ? AND date = ?");
            $check->execute([$doctor_id, $date]);

            if ($check->rowCount() == 0) {
                $ins = $db->prepare("INSERT INTO schedules (doctor_id, date, start_time, end_time, slot_limit) VALUES (?, ?, '09:00:00', '17:00:00', 10)");
                $ins->execute([$doctor_id, $date]);
                echo "  - Added schedule for $date\n";
            } else {
                echo "  - Schedule exists for $date\n";
            }
        }
    }

    echo "Done.";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>