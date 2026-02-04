<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../../config/db.php';

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['queue_id'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'queue_id is required'
    ]);
    exit;
}

$queueId = (int)$input['queue_id'];

try {
    // 1. Mark as serving
    $stmt = $pdo->prepare("
        UPDATE patient_queue
        SET status = 'serving'
        WHERE id = :id
          AND status = 'waiting'
    ");
    $stmt->execute(['id' => $queueId]);

    if ($stmt->rowCount() === 0) {
        http_response_code(409);
        echo json_encode([
            'success' => false,
            'message' => 'Patient already served or not found'
        ]);
        exit;
    }

    // 2. Fetch full queue + patient info including vitals
    $stmt = $pdo->prepare("
        SELECT pq.*, p.first_name, p.middle_name, p.last_name, p.suffix, p.date_of_birth,
               p.age, p.gender, p.blood_type, p.contact_number, p.profile_image
        FROM patient_queue pq
        INNER JOIN patients_db p ON pq.patient_id = p.id
        WHERE pq.id = :id
    ");
    $stmt->execute(['id' => $queueId]);
    $patientData = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'message' => 'Patient marked as serving',
        'data' => $patientData
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to accept patient',
        'error' => $e->getMessage()
    ]);
}
