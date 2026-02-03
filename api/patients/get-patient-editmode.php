<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/db.php';

try {
    $patient_id = (int)($_GET['id'] ?? 0);

    if (!$patient_id) {
        throw new Exception('Patient ID is required');
    }

    $query = "
        SELECT *
        FROM patients_db
        WHERE id = ?
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute([$patient_id]);
    $patient = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$patient) {
        throw new Exception('Patient not found');
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
