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
    $barangay_id = (int)($_GET['barangay_id'] ?? 0);
    $household_no = trim($_GET['household_no'] ?? '');

    if (!$barangay_id || $household_no === '') {
        throw new Exception('Barangay ID and Household No are required');
    }

    $stmt = $pdo->prepare("
        SELECT DISTINCT facility_household_no
        FROM patients_db
        WHERE barangay_id = ?
          AND household_no = ?
          AND facility_household_no IS NOT NULL
        LIMIT 1
    ");

    $stmt->execute([$barangay_id, $household_no]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'facility_household_no' => $row['facility_household_no'] ?? null
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
