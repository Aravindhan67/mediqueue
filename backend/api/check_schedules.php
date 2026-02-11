<?php
// Check Schedules Data
require_once __DIR__ . '/../config/database.php';
$database = new Database();
$db = $database->getConnection();

// Insert a test schedule if empty
$stmt = $db->query("SELECT * FROM schedules");
if ($stmt->rowCount() == 0) {
    echo "Inserting test schedule...<br>";
    // Get a doctor ID
    $doc = $db->query("SELECT id FROM doctors LIMIT 1")->fetch();
    if ($doc) {
        $docId = $doc['id'];
        $db->query("INSERT INTO schedules (doctor_id, date, start_time, end_time, slot_limit) 
                    VALUES ($docId, CURDATE() + INTERVAL 1 DAY, '09:00:00', '17:00:00', 20)");
        echo "Inserted schedule for Doctor ID $docId for tomorrow.<br>";
    } else {
        echo "No doctors found to schedule.<br>";
    }
}

$stmt = $db->query("SELECT * FROM schedules");
$schedules = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "<h3>Schedules:</h3>";
foreach ($schedules as $s) {
    echo "ID: {$s['id']}, Doc: {$s['doctor_id']}, Date: {$s['date']}, {$s['start_time']} - {$s['end_time']}<br>";
}
?>