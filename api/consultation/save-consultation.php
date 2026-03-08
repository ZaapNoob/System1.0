<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once("../../config/db.php");

try {
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate required fields - queue_id is now optional
    $required = ['patient_id'];
    foreach ($required as $field) {
        if (!isset($data[$field])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => ucfirst($field) . ' is required']);
            exit;
        }
    }

    $stmt = $pdo->prepare("
        INSERT INTO consultations (
            queue_id,
            patient_id,
            doctor_id,
            referral,
            referred_to,
            reason_for_referral,
            referred_by,
            purpose_visit,
            nature_visit,
            visit_date,
            systolic_bp,
            diastolic_bp,
            temperature,
            pulse_rate,
            respiratory_rate,
            oxygen_saturation,
            weight,
            height,
            chief_complaint,
            diagnosis,
            treatment,
            patient_illness
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    // Map form fields to database columns
    $result = $stmt->execute([
        $data['queue_id'],
        $data['patient_id'],
        $data['physician'] ?? null,
        $data['referral'] ?? null,
        $data['referredTo'] ?? null,
        $data['reasonForReferral'] ?? null,
        $data['referredBy'] ?? null,
        $data['purpose'] ?? null,
        $data['nature'] ?? null,
        $data['visitDate'] ?? null,
        $data['systolic'] ?? null,
        $data['diastolic'] ?? null,
        $data['temperature'] ?? null,
        $data['pulse'] ?? null,
        $data['respiratory'] ?? null,
        $data['oxygen'] ?? null,
        $data['weight'] ?? null,
        $data['height'] ?? null,
        $data['chiefComplaint'] ?? null,
        $data['diagnosis'] ?? null,
        $data['treatment'] ?? null,
        $data['patientIllness'] ?? null
    ]);

    if ($result) {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Consultation saved successfully',
            'id' => $pdo->lastInsertId()
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to save consultation']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Exception: ' . $e->getMessage()]);
}
