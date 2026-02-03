<?php
header('Content-Type: application/json');
require_once '../../config/db.php';

try {
    if (!isset($_GET['patient_id'])) {
        throw new Exception("patient_id is required");
    }

    $patient_id = (int) $_GET['patient_id'];

    $sql = "
        SELECT 
            id,
            barangay_id,
            purok_id,
            household_no,
            facility_household_no
        FROM patients_db
        WHERE id = :id
        LIMIT 1
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([':id' => $patient_id]);

    $patient = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$patient) {
        throw new Exception("Patient not found");
    }

    echo json_encode([
        'success' => true,
        'data' => $patient
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
