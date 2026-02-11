<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

if (!isset($_GET['doctor_id'])) {
    sendResponse(false, 'Doctor ID is required', null, 400);
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // Get doctor's schedules
    $query = "SELECT * FROM schedules 
              WHERE doctor_id = :doctor_id 
              AND date >= CURDATE()
              ORDER BY date";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':doctor_id', $_GET['doctor_id']);
    $stmt->execute();
    $schedules = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get existing appointments to check availability
    $appQuery = "SELECT date, time FROM appointments 
                 WHERE doctor_id = :doctor_id 
                 AND status != 'cancelled'
                 AND date >= CURDATE()";

    $appStmt = $db->prepare($appQuery);
    $appStmt->bindParam(':doctor_id', $_GET['doctor_id']);
    $appStmt->execute();
    $booked = $appStmt->fetchAll(PDO::FETCH_ASSOC);

    // Create a fast lookup for booked slots "YYYY-MM-DD HH:MM:SS"
    $bookedSlots = [];
    foreach ($booked as $b) {
        $bookedSlots[$b['date'] . ' ' . $b['time']] = true;
    }

    $finalSchedules = [];

    foreach ($schedules as $schedule) {
        $slots = [];
        $startTime = strtotime($schedule['date'] . ' ' . $schedule['start_time']);
        $endTime = strtotime($schedule['date'] . ' ' . $schedule['end_time']);
        $interval = 20 * 60; // 20 minutes

        for ($time = $startTime; $time < $endTime; $time += $interval) {
            $slotTime = date('H:i:s', $time);
            $dateTimeKey = $schedule['date'] . ' ' . $slotTime;

            // formatting for frontend
            $displayTime = date('h:i A', $time);

            $isBooked = isset($bookedSlots[$dateTimeKey]);

            $slots[] = [
                'time' => $displayTime, // For display
                'value' => $slotTime,   // For DB
                'available' => !$isBooked
            ];
        }

        if (!empty($slots)) {
            $finalSchedules[] = [
                'id' => $schedule['id'],
                'date' => $schedule['date'],
                'slots' => $slots
            ];
        }
    }

    sendResponse(true, 'Schedules retrieved successfully', $finalSchedules);

} catch (PDOException $e) {
    sendResponse(false, 'Failed to retrieve schedules: ' . $e->getMessage(), null, 500);
}
?>