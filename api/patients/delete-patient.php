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
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || empty($data['patient_id'])) {
        throw new Exception('Patient ID is required');
    }

    $patient_id = (int)$data['patient_id'];

    // Soft delete the patient using PDO prepared statement
    $sql = "UPDATE patients_db 
            SET deleted_at = NOW()
            WHERE id = ?";

    error_log("🗑️ [DeletePatient] Setting deleted_at for patient ID: $patient_id");

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$patient_id]);

    $rowsAffected = $stmt->rowCount();

    error_log("✅ [DeletePatient] Rows affected: $rowsAffected");

    if ($rowsAffected > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Patient deleted successfully",
            "rows_affected" => $rowsAffected
        ]);
    } else {
        throw new Exception("No patient found with ID: $patient_id");
    }
} catch (Exception $e) {
    http_response_code(400);
    error_log("❌ [DeletePatient] ERROR: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
