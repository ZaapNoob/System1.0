<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();
require_once '../../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$assignmentId = (int)($data['id'] ?? 0);

if ($assignmentId <= 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing or invalid assignment ID'
    ]);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. Get assignment info from doctor_patient_queue
    $stmt = $pdo->prepare("
        SELECT 
            dpq.id AS assignment_id,
            dpq.doctor_id,
            dpq.patient_id,
            dpq.queue_date
        FROM doctor_patient_queue dpq
        WHERE dpq.id = ?
        LIMIT 1
    ");
    $stmt->execute([$assignmentId]);
    $assignment = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$assignment) {
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Assignment not found'
        ]);
        exit;
    }

    $doctorId  = $assignment['doctor_id'];
    $patientId = $assignment['patient_id'];
    $queueDate = $assignment['queue_date'];

    // 2. Find the patient_queue record for this patient on this date
    $stmt = $pdo->prepare("
        SELECT id FROM patient_queue
        WHERE patient_id = ? AND queue_date = ?
        ORDER BY id DESC
        LIMIT 1
    ");
    $stmt->execute([$patientId, $queueDate]);
    $queueRecord = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$queueRecord) {
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Patient queue record not found'
        ]);
        exit;
    }

    $queueId = $queueRecord['id'];

    // 2. Clear active patient for this doctor
    $stmt = $pdo->prepare("
        UPDATE doctor_patient_queue
        SET is_active = 0
        WHERE doctor_id = ?
    ");
    $stmt->execute([$doctorId]);

    // 3. Set this assignment as active
    $stmt = $pdo->prepare("
        UPDATE doctor_patient_queue
        SET is_active = 1, status = 'serving'
        WHERE id = ?
    ");
    $stmt->execute([$assignmentId]);

    // 4. Update queue status to serving
    $stmt = $pdo->prepare("
        UPDATE patient_queue
        SET status = 'serving'
        WHERE id = ?
    ");
    $stmt->execute([$queueId]);

    // 5. Fetch patient + vitals
    $stmt = $pdo->prepare("
        SELECT
            p.id AS patient_id,
            p.patient_code,
            p.first_name,
            p.middle_name,
            p.last_name,
            p.suffix,
            p.gender,
            p.age,
            p.date_of_birth,
            p.contact_number,
            p.blood_type,

            q.queue_number,
            q.queue_code,
            q.queue_type,
            q.queue_date,

            q.systolic_bp,
            q.diastolic_bp,
            q.heart_rate,
            q.respiratory_rate,
            q.temperature,
            q.oxygen_saturation,
            q.weight,
            q.height
        FROM patient_queue q
        JOIN patients_db p ON p.id = q.patient_id
        WHERE q.id = ?
        LIMIT 1
    ");
    $stmt->execute([$queueId]);
    $patientData = $stmt->fetch(PDO::FETCH_ASSOC);

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Patient set as active',
        'data' => $patientData
    ]);
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to set active patient',
        'error' => $e->getMessage()
    ]);
}
