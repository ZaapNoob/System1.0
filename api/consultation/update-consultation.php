<?php
// --------------------------------------------------
// CORS CONFIGURATION
// --------------------------------------------------
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --------------------------------------------------
// INCLUDE DATABASE CONNECTION
// --------------------------------------------------
require_once __DIR__ . '/../../config/db.php';

try {
    // --------------------------------------------------
    // GET REQUEST BODY
    // --------------------------------------------------
    $input = json_decode(file_get_contents('php://input'), true);

    // DEBUG: Log raw input
    error_log("📝 [UpdateConsultation] Raw input received: " . json_encode($input));

    // --------------------------------------------------
    // VALIDATE INPUT
    // --------------------------------------------------
    if (!isset($input['consultation_id']) || !$input['consultation_id']) {
        error_log("❌ [UpdateConsultation] Missing consultation_id. Input keys: " . json_encode(array_keys($input)));
        throw new Exception('Consultation ID is required');
    }

    $consultation_id = intval($input['consultation_id']);
    $patient_id = isset($input['patient_id']) ? intval($input['patient_id']) : null;
    $doctor_id = isset($input['doctor_id']) ? intval($input['doctor_id']) : null;
    $purpose_visit = $input['purpose_visit'] ?? null;
    $nature_visit = $input['nature_visit'] ?? null;
    $visit_date = $input['visit_date'] ?? null;
    $systolic_bp = isset($input['systolic_bp']) ? intval($input['systolic_bp']) : null;
    $diastolic_bp = isset($input['diastolic_bp']) ? intval($input['diastolic_bp']) : null;
    $temperature = isset($input['temperature']) ? floatval($input['temperature']) : null;
    $pulse_rate = isset($input['pulse_rate']) ? intval($input['pulse_rate']) : null;
    $respiratory_rate = isset($input['respiratory_rate']) ? intval($input['respiratory_rate']) : null;
    $oxygen_saturation = isset($input['oxygen_saturation']) ? intval($input['oxygen_saturation']) : null;
    $weight = isset($input['weight']) ? floatval($input['weight']) : null;
    $height = isset($input['height']) ? floatval($input['height']) : null;
    $chief_complaint = $input['chief_complaint'] ?? null;
    $diagnosis = $input['diagnosis'] ?? null;
    $treatment = $input['treatment'] ?? null;
    $patient_illness = $input['patient_illness'] ?? null;
    $remarks = $input['remarks'] ?? null;

    // Ensure PDO throws exceptions
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // --------------------------------------------------
    // UPDATE CONSULTATION
    // --------------------------------------------------
    $sql = "UPDATE consultations SET 
        doctor_id = :doctor_id,
        purpose_visit = :purpose_visit,
        nature_visit = :nature_visit,
        visit_date = :visit_date,
        systolic_bp = :systolic_bp,
        diastolic_bp = :diastolic_bp,
        temperature = :temperature,
        pulse_rate = :pulse_rate,
        respiratory_rate = :respiratory_rate,
        oxygen_saturation = :oxygen_saturation,
        weight = :weight,
        height = :height,
        chief_complaint = :chief_complaint,
        diagnosis = :diagnosis,
        treatment = :treatment,
        patient_illness = :patient_illness,
        remarks = :remarks
    WHERE id = :consultation_id AND patient_id = :patient_id";

    $stmt = $pdo->prepare($sql);

    $stmt->bindValue(':consultation_id', $consultation_id, PDO::PARAM_INT);
    $stmt->bindValue(':patient_id', $patient_id, PDO::PARAM_INT);
    $stmt->bindValue(':doctor_id', $doctor_id, PDO::PARAM_INT);
    $stmt->bindValue(':purpose_visit', $purpose_visit, PDO::PARAM_STR);
    $stmt->bindValue(':nature_visit', $nature_visit, PDO::PARAM_STR);
    $stmt->bindValue(':visit_date', $visit_date, PDO::PARAM_STR);
    $stmt->bindValue(':systolic_bp', $systolic_bp, PDO::PARAM_INT);
    $stmt->bindValue(':diastolic_bp', $diastolic_bp, PDO::PARAM_INT);
    $stmt->bindValue(':temperature', $temperature, PDO::PARAM_STR);
    $stmt->bindValue(':pulse_rate', $pulse_rate, PDO::PARAM_INT);
    $stmt->bindValue(':respiratory_rate', $respiratory_rate, PDO::PARAM_INT);
    $stmt->bindValue(':oxygen_saturation', $oxygen_saturation, PDO::PARAM_INT);
    $stmt->bindValue(':weight', $weight, PDO::PARAM_STR);
    $stmt->bindValue(':height', $height, PDO::PARAM_STR);
    $stmt->bindValue(':chief_complaint', $chief_complaint, PDO::PARAM_STR);
    $stmt->bindValue(':diagnosis', $diagnosis, PDO::PARAM_STR);
    $stmt->bindValue(':treatment', $treatment, PDO::PARAM_STR);
    $stmt->bindValue(':patient_illness', $patient_illness, PDO::PARAM_STR);
    $stmt->bindValue(':remarks', $remarks, PDO::PARAM_STR);

    $stmt->execute();

    error_log("✅ [UpdateConsultation] Query executed successfully. Rows affected: " . $stmt->rowCount());

    // --------------------------------------------------
    // RETURN JSON RESPONSE
    // --------------------------------------------------
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Consultation updated successfully',
            'consultation_id' => $consultation_id
        ]);
    } else {
        error_log("⚠️ [UpdateConsultation] No rows updated. Checking if record exists...");
        throw new Exception('No consultation found or no changes made. Verify consultation_id=' . $consultation_id . ' and patient_id=' . $patient_id);
    }
} catch (Exception $e) {
    // Handle errors gracefully
    http_response_code(500);
    error_log("❌ [UpdateConsultation] ERROR: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'debug' => 'Check server error logs for details'
    ]);
}
