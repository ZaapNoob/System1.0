<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/db.php';

try {
    $barangay_id = (int)($_GET['barangay_id'] ?? 0);

    if (!$barangay_id) {
        throw new Exception('Barangay ID required');
    }

    // Get all unique households in a barangay with patient count
    $query = "
        SELECT 
            household_no,
            facility_household_no,
            COUNT(*) as member_count
        FROM patients_db
        WHERE barangay_id = ? 
            AND household_no IS NOT NULL
            AND facility_household_no IS NOT NULL
        GROUP BY household_no, facility_household_no
        ORDER BY household_no DESC
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute([$barangay_id]);
    $households = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $households
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
