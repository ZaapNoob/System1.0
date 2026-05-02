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
    
    // Helper function: convert empty strings to null
    $nullIfEmpty = function($value) {
        if ($value === '' || $value === null) {
            return null;
        }
        return $value;
    };
    
    $patient_id = isset($input['patient_id']) && $input['patient_id'] !== '' ? intval($input['patient_id']) : null;
    // Get doctor_id from input - prioritize it over encoded_by for the doctor field
    $doctor_id = isset($input['doctor_id']) && $input['doctor_id'] !== '' ? intval($input['doctor_id']) : null;
    $encoded_by = isset($input['encoded_by']) && $input['encoded_by'] !== '' ? intval($input['encoded_by']) : (isset($input['doctor_id']) ? intval($input['doctor_id']) : null);
    $purpose_visit = $nullIfEmpty($input['purpose_visit'] ?? null);
    $nature_visit = $nullIfEmpty($input['nature_visit'] ?? null);
    $visit_date = $nullIfEmpty($input['visit_date'] ?? null);
    $systolic_bp = isset($input['systolic_bp']) && $input['systolic_bp'] !== '' ? intval($input['systolic_bp']) : null;
    $diastolic_bp = isset($input['diastolic_bp']) && $input['diastolic_bp'] !== '' ? intval($input['diastolic_bp']) : null;
    $temperature = isset($input['temperature']) && $input['temperature'] !== '' ? floatval($input['temperature']) : null;
    $pulse_rate = isset($input['pulse_rate']) && $input['pulse_rate'] !== '' ? intval($input['pulse_rate']) : null;
    $respiratory_rate = isset($input['respiratory_rate']) && $input['respiratory_rate'] !== '' ? intval($input['respiratory_rate']) : null;
    $oxygen_saturation = isset($input['oxygen_saturation']) && $input['oxygen_saturation'] !== '' ? intval($input['oxygen_saturation']) : null;
    $weight = isset($input['weight']) && $input['weight'] !== '' ? floatval($input['weight']) : null;
    $height = isset($input['height']) && $input['height'] !== '' ? floatval($input['height']) : null;
    $chief_complaint = $nullIfEmpty($input['chief_complaint'] ?? null);
    $diagnosis = $nullIfEmpty($input['diagnosis'] ?? null);
    $treatment = $nullIfEmpty($input['treatment'] ?? null);
    $patient_illness = $nullIfEmpty($input['patient_illness'] ?? null);
    $remarks = $nullIfEmpty($input['remarks'] ?? null);
    
    // Referral fields
    $receiving_facility = $nullIfEmpty($input['receiving_facility'] ?? null);
    $receiving_personnel = $nullIfEmpty($input['receiving_personnel'] ?? null);
    $referral_category = $nullIfEmpty($input['referral_category'] ?? null);
    $reason_for_referral_2 = $nullIfEmpty($input['reason_for_referral_2'] ?? null);
    $identity_number_manual = $nullIfEmpty($input['identity_number_manual'] ?? null);

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
        remarks = :remarks,
        receiving_facility = :receiving_facility,
        receiving_personnel = :receiving_personnel,
        referral_category = :referral_category,
        reason_for_referral_2 = :reason_for_referral_2,
        identity_number_manual = :identity_number_manual
    WHERE id = :consultation_id AND patient_id = :patient_id";

    $stmt = $pdo->prepare($sql);

    // Bind values - handle NULLs properly
    $stmt->bindValue(':consultation_id', $consultation_id, PDO::PARAM_INT);
    $stmt->bindValue(':patient_id', $patient_id, PDO::PARAM_INT);
    $stmt->bindValue(':doctor_id', $doctor_id === null ? null : (int)$doctor_id, $doctor_id === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
    $stmt->bindValue(':purpose_visit', $purpose_visit, PDO::PARAM_STR);
    $stmt->bindValue(':nature_visit', $nature_visit, PDO::PARAM_STR);
    $stmt->bindValue(':visit_date', $visit_date, PDO::PARAM_STR);
    $stmt->bindValue(':systolic_bp', $systolic_bp === null ? null : (int)$systolic_bp, $systolic_bp === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
    $stmt->bindValue(':diastolic_bp', $diastolic_bp === null ? null : (int)$diastolic_bp, $diastolic_bp === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
    $stmt->bindValue(':temperature', $temperature, PDO::PARAM_STR);
    $stmt->bindValue(':pulse_rate', $pulse_rate === null ? null : (int)$pulse_rate, $pulse_rate === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
    $stmt->bindValue(':respiratory_rate', $respiratory_rate === null ? null : (int)$respiratory_rate, $respiratory_rate === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
    $stmt->bindValue(':oxygen_saturation', $oxygen_saturation === null ? null : (int)$oxygen_saturation, $oxygen_saturation === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
    $stmt->bindValue(':weight', $weight, PDO::PARAM_STR);
    $stmt->bindValue(':height', $height, PDO::PARAM_STR);
    $stmt->bindValue(':chief_complaint', $chief_complaint, PDO::PARAM_STR);
    $stmt->bindValue(':diagnosis', $diagnosis, PDO::PARAM_STR);
    $stmt->bindValue(':treatment', $treatment, PDO::PARAM_STR);
    $stmt->bindValue(':patient_illness', $patient_illness, PDO::PARAM_STR);
    $stmt->bindValue(':remarks', $remarks, PDO::PARAM_STR);
    
    // Bind referral fields
    $stmt->bindValue(':receiving_facility', $receiving_facility, PDO::PARAM_STR);
    $stmt->bindValue(':receiving_personnel', $receiving_personnel, PDO::PARAM_STR);
    $stmt->bindValue(':referral_category', $referral_category, PDO::PARAM_STR);
    $stmt->bindValue(':reason_for_referral_2', $reason_for_referral_2, PDO::PARAM_STR);
    $stmt->bindValue(':identity_number_manual', $identity_number_manual, PDO::PARAM_STR);

    $stmt->execute();

    error_log("✅ [UpdateConsultation] Query executed successfully. Rows affected: " . $stmt->rowCount());
    error_log("📋 [UpdateConsultation] Referral fields saved: receiving_personnel=" . $receiving_personnel . ", referral_category=" . $referral_category . ", reason_for_referral_2=" . $reason_for_referral_2 . ", identity_number_manual=" . $identity_number_manual);

    // Try to update encoded_by if provided and column exists (won't break if column doesn't exist)
    if ($encoded_by !== null) {
        try {
            $encodedStmt = $pdo->prepare("UPDATE consultations SET encoded_by = :encoded_by, encoded_at = NOW() WHERE id = :consultation_id");
            $encodedStmt->bindValue(':encoded_by', $encoded_by, PDO::PARAM_INT);
            $encodedStmt->bindValue(':consultation_id', $consultation_id, PDO::PARAM_INT);
            $encodedStmt->execute();
            error_log("✅ [UpdateConsultation] Updated encoded_by: " . $encoded_by);
        } catch (Exception $e) {
            // Column might not exist, silently continue
            error_log("⚠️ [UpdateConsultation] encoded_by update failed (column may not exist): " . $e->getMessage());
        }
    }

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
    $errorMsg = $e->getMessage();
    error_log("❌ [UpdateConsultation] ERROR: " . $errorMsg);
    error_log("❌ [UpdateConsultation] Trace: " . $e->getTraceAsString());
    echo json_encode([
        'success' => false,
        'message' => $errorMsg,
        'debug' => 'Check server error logs for details'
    ]);
}
