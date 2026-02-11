<?php
// Check Schedules Data
require_once __DIR__ . '/backend/config/database.php';
$database = new Database();
$db = $database->getConnection();

$stmt = $db->query("SELECT * FROM schedules");
$schedules = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "<h3>Schedules:</h3>";
foreach ($schedules as $s) {
    echo "ID: {$s['id']}, Doc: {$s['doctor_id']}, Date: {$s['date']}, {$s['start_time']} - {$s['end_time']}<br>";
}

// Insert a test schedule if empty
if (empty($schedules)) {
    echo "<br>Inserting test schedule...<br>";
    $db->query("INSERT INTO schedules (doctor_id, date, start_time, end_time, slot_limit) 
                VALUES (1, CURDATE() + INTERVAL 1 DAY, '09:00:00', '17:00:00', 20)");
    echo "Inserted schedule for tomorrow.";
}
?>