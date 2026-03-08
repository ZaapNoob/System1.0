<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once("../../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Consultation ID is required'
    ]);
    exit;
}

try {

    $stmt = $pdo->prepare("
UPDATE consultations
SET
    chief_complaint = ?,
    diagnosis = ?,
    treatment = ?,
    patient_illness = ?
WHERE id = ?
");

    $stmt->execute([
        $data['chiefComplaint'] ?? null,
        $data['diagnosis'] ?? null,
        $data['treatment'] ?? null,
        $data['patientIllness'] ?? null,
        $data['id']
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Consultation updated successfully'
    ]);
} catch (Exception $e) {

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
