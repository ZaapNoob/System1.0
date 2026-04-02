<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$assignmentId = isset($data['id']) ? (int)$data['id'] : null;

if (!$assignmentId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing assignment id']);
    exit;
}

try {
    // 1️⃣ Get the patient_queue_id from doctor_patient_queue
    $stmt = $pdo->prepare("
        SELECT patient_queue_id 
        FROM doctor_patient_queue
        WHERE id = ?
    ");
    $stmt->execute([$assignmentId]);
    $assignment = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$assignment) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Assignment not found']);
        exit;
    }

    $patientQueueId = $assignment['patient_queue_id'];

    // 2️⃣ Mark doctor_patient_queue as done
    $stmt = $pdo->prepare("
        UPDATE doctor_patient_queue
        SET status = 'done', is_active = 0
        WHERE id = ?
    ");
    $stmt->execute([$assignmentId]);

    // 3️⃣ Mark patient_queue as done (if patient_queue_id exists)
    if ($patientQueueId) {
        $stmt = $pdo->prepare("
            UPDATE patient_queue
            SET status = 'done'
            WHERE id = ?
        ");
        $stmt->execute([$patientQueueId]);
        error_log("[MARK-DONE] ✅ Updated patient_queue (id: $patientQueueId) to status='done'");
    }

    echo json_encode([
        'success' => true,
        'message' => 'Consultation marked as done',
        'data' => [
            'assignment_id' => $assignmentId,
            'patient_queue_id' => $patientQueueId
        ]
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to mark done',
        'error' => $e->getMessage()
    ]);
}
