<?php
// --------------------------------------------------
// CORS CONFIGURATION
// --------------------------------------------------
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --------------------------------------------------
// INCLUDE DATABASE CONNECTION
// --------------------------------------------------
require_once __DIR__ . '/../../config/db.php'; // $pdo is defined here

try {
    // --------------------------------------------------
    // GET PARAMETERS
    // --------------------------------------------------
    $patient_id = isset($_GET['patient_id']) ? intval($_GET['patient_id']) : null;

    if (!$patient_id) {
        throw new Exception('Patient ID is required');
    }

    // Ensure PDO throws exceptions
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // --------------------------------------------------
    // FETCH CONSULTATION HISTORY
    // --------------------------------------------------
    $sql = "SELECT 
        c.id AS consultation_id,
        c.patient_id,
        c.doctor_id,
        c.visit_date,
        c.purpose_visit,
        c.nature_visit,
        c.chief_complaint,
        c.diagnosis,
        c.treatment,
        c.patient_illness,
        c.systolic_bp,
        c.diastolic_bp,
        c.temperature,
        c.pulse_rate,
        c.respiratory_rate,
        c.oxygen_saturation,
        c.weight,
        c.height,
        c.created_at AS consultation_date,
        c.receiving_facility,
        c.receiving_personnel,
        c.referral_category,
        c.reason_for_referral_2,
        c.identity_number_manual,
        u.name AS doctor_name,
        dpq.id AS queue_id,
        dpq.queue_number,
        dpq.queue_date,
        dpq.status AS queue_status
    FROM consultations c
    LEFT JOIN users u ON u.id = c.doctor_id
    LEFT JOIN doctor_patient_queue dpq ON dpq.id = c.queue_id
    WHERE c.patient_id = :patient_id
    ORDER BY c.visit_date DESC, c.created_at DESC";

    // --------------------------------------------------
    // EXECUTE QUERY
    // --------------------------------------------------
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':patient_id', $patient_id, PDO::PARAM_INT);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // --------------------------------------------------
    // RETURN JSON RESPONSE
    // --------------------------------------------------
    echo json_encode([
        'success' => true,
        'message' => 'Consultation history fetched successfully',
        'data' => $data,
        'count' => count($data)
    ]);
} catch (Exception $e) {
    // Handle errors gracefully
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'data' => []
    ]);
}