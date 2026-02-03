<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/db.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);

    $patient_id = (int)($input['patient_id'] ?? 0);
    $new_barangay_id = (int)($input['new_barangay_id'] ?? 0);
    $household_type = $input['household_type'] ?? ''; // 'new' or 'existing'
    $new_household_no = $input['new_household_no'] ?? null;
    $new_facility_household_no = $input['new_facility_household_no'] ?? null;
    $move_reason = $input['move_reason'] ?? 'Patient transfer';
    $moved_by = (int)($input['moved_by'] ?? 0);

    // Validate inputs
    if (!$patient_id || !$new_barangay_id) {
        throw new Exception('Patient ID and Barangay ID required');
    }

    if ($household_type !== 'new' && $household_type !== 'existing') {
        throw new Exception('Invalid household type');
    }

    // For new household, both should be provided
    if ($household_type === 'new' && (!$new_household_no || !$new_facility_household_no)) {
        throw new Exception('Household numbers required for new household type');
    }

    // For existing household, patient must have existing household
    if ($household_type === 'existing' && (!$new_household_no || !$new_facility_household_no)) {
        throw new Exception('Household numbers required for existing household move');
    }

    // Get current patient details
    $stmt = $pdo->prepare("
        SELECT id, patient_code, barangay_id, household_no, facility_household_no
        FROM patients_db
        WHERE id = ?
    ");
    $stmt->execute([$patient_id]);
    $patient = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$patient) {
        throw new Exception('Patient not found');
    }

    $old_barangay_id = $patient['barangay_id'];
    $old_household_no = $patient['household_no'];
    $old_facility_household_no = $patient['facility_household_no'];

    // Start transaction
    $pdo->beginTransaction();

    // Record history (even if moving within same barangay)
    $historyStmt = $pdo->prepare("
        INSERT INTO patient_household_history
        (patient_id, old_barangay_id, old_household_no, old_facility_household_no,
         new_barangay_id, new_household_no, new_facility_household_no, move_reason, moved_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $historyStmt->execute([
        $patient_id,
        $old_barangay_id,
        $old_household_no,
        $old_facility_household_no,
        $new_barangay_id,
        $new_household_no,
        $new_facility_household_no,
        $move_reason,
        $moved_by
    ]);

    // Update patient: barangay, household numbers, and last_household_move_at
    // IMPORTANT: Keep patient_code unchanged
    $updateStmt = $pdo->prepare("
        UPDATE patients_db
        SET barangay_id = ?,
            household_no = ?,
            facility_household_no = ?,
            last_household_move_at = NOW()
        WHERE id = ?
    ");
    $updateStmt->execute([
        $new_barangay_id,
        $new_household_no,
        $new_facility_household_no,
        $patient_id
    ]);

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Patient moved successfully',
        'patient' => [
            'id' => $patient_id,
            'patient_code' => $patient['patient_code'], // Patient code remains unchanged
            'old_barangay_id' => $old_barangay_id,
            'old_household_no' => $old_household_no,
            'old_facility_household_no' => $old_facility_household_no,
            'new_barangay_id' => $new_barangay_id,
            'new_household_no' => $new_household_no,
            'new_facility_household_no' => $new_facility_household_no
        ]
    ]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
