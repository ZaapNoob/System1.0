<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/db.php';

try {
    if (!isset($pdo)) {
        throw new Exception("Database connection not initialized");
    }

    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        throw new Exception("Invalid JSON input");
    }

    // Required fields
    $required = ['barangay_id', 'first_name', 'last_name', 'gender', 'date_of_birth'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }

    $pdo->beginTransaction();

    // Lock barangay row
    $lockStmt = $pdo->prepare(
        "SELECT id, name, last_patient_seq 
         FROM barangays 
         WHERE id = ? 
         FOR UPDATE"
    );
    $lockStmt->execute([$data['barangay_id']]);
    $barangay = $lockStmt->fetch(PDO::FETCH_ASSOC);

    if (!$barangay) {
        throw new Exception("Barangay not found");
    }

    $newSeq = (int)$barangay['last_patient_seq'] + 1;

    // Generate patient code
    $barangayName = strtolower(preg_replace('/\s+/', '_', $barangay['name']));
    $patientCode = $barangayName . '_' . str_pad($newSeq, 3, '0', STR_PAD_LEFT);

    // Age calculation
    $birthDate = new DateTime($data['date_of_birth']);
    $age = (new DateTime())->diff($birthDate)->y;

    // INSERT patient
    $insertQuery = "
        INSERT INTO patients_db (
            barangay_id, purok_id, patient_code,
            first_name, middle_name, last_name, suffix,
            date_of_birth, birthplace, age, gender,
            marital_status, blood_type,
            mother_name, spouse_name,
            contact_number, household_no, facility_household_no,
            education_level, employment_status,
            family_member_type, dswd_nhts, member_4ps, pcb_member,
            philhealth_member, philhealth_status_type,
            philhealth_no, philhealth_category,
            status
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
    ";

    $stmt = $pdo->prepare($insertQuery);
    $stmt->execute([
        $data['barangay_id'],
        $data['purok_id'] ?? null,
        $patientCode,
        $data['first_name'],
        $data['middle_name'] ?? null,
        $data['last_name'],
        $data['suffix'] ?? null,
        $data['date_of_birth'],
        $data['birthplace'] ?? null,
        $age,
        $data['gender'],
        $data['marital_status'] ?? null,
        $data['blood_type'] ?? null,
        $data['mother_name'] ?? null,
        $data['spouse_name'] ?? null,
        $data['contact_number'] ?? null,
        $data['household_no'] ?? null,
        $data['facility_household_no'] ?? null,
        $data['education_level'] ?? 'Unknown',
        $data['employment_status'] ?? null,
        $data['family_member_type'] ?? null,
        $data['dswd_nhts'] ?? 'No',
        $data['member_4ps'] ?? 'No',
        $data['pcb_member'] ?? 'No',
        $data['philhealth_member'] ?? 'No',
        $data['philhealth_member'] === 'Yes' ? $data['philhealth_status_type'] ?? null : null,
        $data['philhealth_member'] === 'Yes' ? $data['philhealth_no'] ?? null : null,
        $data['philhealth_member'] === 'Yes' ? $data['philhealth_category'] ?? 'None' : null,
        'active'
    ]);

    $patientId = $pdo->lastInsertId();

    // Update sequence
    $updateStmt = $pdo->prepare(
        "UPDATE barangays SET last_patient_seq = ? WHERE id = ?"
    );
    $updateStmt->execute([$newSeq, $data['barangay_id']]);

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Patient created successfully',
        'data' => [
            'id' => $patientId,
            'patient_code' => $patientCode
        ]
    ]);
} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
