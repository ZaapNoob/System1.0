<?php
header('Content-Type: application/json');
require_once '../../config/db.php';

try {
    $barangay_id = (int)($_GET['barangay_id'] ?? 0);
    $facility_household_no = trim($_GET['facility_household_no'] ?? '');

    if (!$barangay_id || $facility_household_no === '') {
        throw new Exception('Barangay ID and Facility Household No are required');
    }

    $stmt = $pdo->prepare("
        SELECT DISTINCT household_no
        FROM patients_db
        WHERE barangay_id = ?
          AND facility_household_no = ?
          AND household_no IS NOT NULL
        ORDER BY household_no
    ");

    $stmt->execute([$barangay_id, $facility_household_no]);
    $households = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode([
        'success' => true,
        'households' => $households
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
