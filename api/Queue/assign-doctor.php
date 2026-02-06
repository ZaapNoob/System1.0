<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

session_start();

require_once '../../config/db.php'; // must provide $pdo

// Optional: only allow logged in users
// if (!isset($_SESSION['user_id'])) {
//     http_response_code(401);
//     echo json_encode(['success' => false, 'message' => 'Unauthorized']);
//     exit;
// }

/* =========================
   Decode Request Payload
========================= */
$data = json_decode(file_get_contents("php://input"), true);

/* =========================
   TEMP DEBUG LOG (REMOVE AFTER TESTING)
========================= */
file_put_contents(
    __DIR__ . '/assign.log',
    json_encode($data) . PHP_EOL,
    FILE_APPEND
);

/* =========================
   Strong Type Casting
========================= */
$patientQueueId = (int)($data['queue_id'] ?? 0);   // patient_queue.id
$patientId      = (int)($data['patient_id'] ?? 0); // patients_db.id
$doctorId       = (int)($data['doctor_id'] ?? 0);  // users.id

/* =========================
   Validation
========================= */
if ($patientQueueId <= 0 || $patientId <= 0 || $doctorId <= 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing or invalid required fields'
    ]);
    exit;
}

try {
    $pdo->beginTransaction();

    /* =========================
       Get next queue number
    ========================= */
    $stmt = $pdo->prepare("
        SELECT COALESCE(MAX(queue_number), 0) + 1
        FROM doctor_patient_queue
        WHERE doctor_id = ?
          AND queue_date = CURDATE()
    ");
    $stmt->execute([$doctorId]);
    $nextNo = (int)$stmt->fetchColumn();

    /* =========================
       Insert doctor queue
    ========================= */
    $stmt = $pdo->prepare("
        INSERT INTO doctor_patient_queue
            (patient_id, doctor_id, queue_number, queue_date, status)
        VALUES
            (?, ?, ?, CURDATE(), 'waiting')
    ");
    $stmt->execute([$patientId, $doctorId, $nextNo]);

    /* =========================
       Update patient queue status
    ========================= */
    $stmt = $pdo->prepare("
        UPDATE patient_queue
        SET status = 'with_doctor'
        WHERE id = ?
          AND patient_id = ?
    ");
    $stmt->execute([$patientQueueId, $patientId]);

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Patient assigned to doctor',
        'doctor_queue_number' => $nextNo
    ]);
} catch (Throwable $e) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to assign doctor',
        'error' => $e->getMessage()
    ]);
}
