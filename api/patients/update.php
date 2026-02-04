<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/db.php';

try {

    $input = json_decode(file_get_contents("php://input"), true);

    if (!$input) {
        throw new Exception("Invalid JSON input");
    }

    if (empty($input['id'])) {
        throw new Exception("Patient ID is required");
    }

    $id = (int)$input['id'];

    // -------------------------------------------------
    // Whitelist fields that are allowed to be updated
    // (matches your EditPatientModal fields)
    // -------------------------------------------------

    $allowedFields = [
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'date_of_birth',
        'gender',
        'marital_status',
        'barangay_id',
        'birthplace',
        'blood_type',
        'mother_name',
        'spouse_name',
        'contact_number',
        'education_level',
        'employment_status',
        'family_member_type',
        'dswd_nhts',
        'member_4ps',
        'pcb_member',
        'philhealth_member',
        'philhealth_status_type',
        'philhealth_no',
        'philhealth_category'
    ];

    $fields = [];
    $values = [];

    foreach ($allowedFields as $field) {
        if (array_key_exists($field, $input)) {
            $fields[] = "$field = ?";
            $values[] = $input[$field];
        }
    }

    if (empty($fields)) {
        throw new Exception("No valid fields to update");
    }

    $values[] = $id;

    $sql = "
        UPDATE patients_db
        SET " . implode(', ', $fields) . "
        WHERE id = ?
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($values);

    echo json_encode([
        'success' => true,
        'message' => 'Patient updated successfully'
    ]);
} catch (Exception $e) {

    http_response_code(400);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
