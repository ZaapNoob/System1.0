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
        'philhealth_category',
        'status',
        'deleted_at' // ✅ Allow soft delete timestamp

    ];

    // ENUM field validation mappings
    $enumValidations = [
        'employment_status' => ['Employed', 'Unemployed', 'Retired', 'Others'],
        'education_level' => ['No Formal Education', 'Elementary', 'High School', 'Vocational', 'College', 'Post Graduate', 'Unknown'],
        'family_member_type' => ['Father', 'Mother', 'Daughter', 'Son', 'Others'],
        'dswd_nhts' => ['Yes', 'No'],
        'member_4ps' => ['Yes', 'No'],
        'pcb_member' => ['Yes', 'No'],
        'philhealth_member' => ['Yes', 'No'],
        'philhealth_status_type' => ['Member', 'Dependent'],
        'gender' => ['Male', 'Female'],
        'marital_status' => ['Single', 'Married', 'Widowed', 'Separated'],
    ];

    $fields = [];
    $values = [];
    $warnings = [];

    foreach ($allowedFields as $field) {
        if (array_key_exists($field, $input)) {
            $value = $input[$field];

            // Validate ENUM fields
            if (isset($enumValidations[$field])) {
                // Skip null values for optional ENUM fields
                if ($value === null || $value === '') {
                    $fields[] = "$field = NULL";
                    continue;  // Don't add to values - no placeholder in SQL
                }

                // Check if value is valid for this ENUM field
                if (!in_array($value, $enumValidations[$field])) {
                    $warnings[] = "Invalid value for $field: '$value'. Allowed values: " . implode(', ', $enumValidations[$field]) . ". Setting to NULL.";
                    $fields[] = "$field = NULL";
                    continue;  // Don't add to values - no placeholder in SQL
                }
            }

            // For non-NULL values, add placeholder and value
            $fields[] = "$field = ?";
            $values[] = $value;
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

    // Debug logging
    error_log("📝 [UpdatePatient] SQL: " . $sql);
    error_log("📝 [UpdatePatient] Values count: " . count($values) . " | Placeholders count: " . substr_count($sql, '?'));
    error_log("📝 [UpdatePatient] Values: " . json_encode($values));

    $stmt = $pdo->prepare($sql);
    $stmt->execute($values);

    $rowsAffected = $stmt->rowCount();
    error_log("✅ [UpdatePatient] SUCCESS - Rows affected: $rowsAffected");

    echo json_encode([
        'success' => true,
        'message' => 'Patient updated successfully',
        'warnings' => $warnings,
        'rows_affected' => $rowsAffected
    ]);
} catch (Exception $e) {

    http_response_code(400);

    error_log("❌ [UpdatePatient] ERROR: " . $e->getMessage());

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'debug' => 'Check server error logs for details'
    ]);
}
