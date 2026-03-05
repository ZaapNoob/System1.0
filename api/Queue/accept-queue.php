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
error_log("[ACCEPT] 🟡 Processing accept for queue_id: " . $queueId);

try {
    // 1. Mark as triage (patient accepted but not yet assigned to doctor)
    error_log("[ACCEPT] 📝 Updating status to 'triage'");
    $stmt = $pdo->prepare("
        UPDATE patient_queue
        SET status = 'triage'
        WHERE id = :id
          AND status = 'waiting'
    ");
    $stmt->execute(['id' => $queueId]);

    if ($stmt->rowCount() === 0) {
        error_log("[ACCEPT] ❌ Update failed - rowCount is 0");
        http_response_code(409);
        echo json_encode([
            'success' => false,
            'message' => 'Patient already served or not found'
        ]);
        exit;
    }

    error_log("[ACCEPT] ✅ Update successful - rowCount: " . $stmt->rowCount());

    // 2. Fetch full queue + patient info including vitals, barangay, and purok details
    $stmt = $pdo->prepare("
        SELECT pq.*, 
               p.first_name, p.middle_name, p.last_name, p.suffix, p.date_of_birth,
               p.age, p.gender, p.blood_type, p.contact_number, p.profile_image, p.patient_code,
               p.region, p.province, p.city_municipality, p.barangay_name, p.street,
               b.name as barangay_name_db, b.is_special,
               pr.purok_name
        FROM patient_queue pq
        INNER JOIN patients_db p ON pq.patient_id = p.id
        LEFT JOIN barangays b ON p.barangay_id = b.id
        LEFT JOIN puroks pr ON p.purok_id = pr.id
        WHERE pq.id = :id
    ");
    $stmt->execute(['id' => $queueId]);
    $patientData = $stmt->fetch(PDO::FETCH_ASSOC);

    error_log("[ACCEPT] 📊 Final status: " . $patientData['status']);

    echo json_encode([
        'success' => true,
        'message' => 'Patient marked as serving',
        'data' => $patientData
    ]);
} catch (Throwable $e) {
    error_log("[ACCEPT] ❌ Exception: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to accept patient',
        'error' => $e->getMessage()
    ]);
}
