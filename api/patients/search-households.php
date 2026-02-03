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
    $first_name = $_GET['first_name'] ?? '';

    if (!$barangay_id) {
        throw new Exception('Barangay ID required');
    }

    if (strlen($first_name) < 2) {
        throw new Exception('First name must be at least 2 characters');
    }

    // Search for patients by first name in a barangay
    $query = "
        SELECT DISTINCT
            household_no,
            facility_household_no,
            COUNT(*) OVER (PARTITION BY household_no, facility_household_no) as member_count,
            (SELECT CONCAT(first_name, ' ', last_name) 
             FROM patients_db p2 
             WHERE p2.household_no = p.household_no 
             AND p2.facility_household_no = p.facility_household_no
             LIMIT 1) as primary_member
        FROM patients_db p
        WHERE barangay_id = ? 
            AND first_name LIKE ? 
            AND household_no IS NOT NULL
            AND facility_household_no IS NOT NULL
        ORDER BY household_no DESC
        LIMIT 20
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute([
        $barangay_id,
        $first_name . '%'
    ]);

    $households = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Remove duplicates by household
    $unique = [];
    $seen = [];
    foreach ($households as $h) {
        $key = $h['household_no'] . '|' . $h['facility_household_no'];
        if (!isset($seen[$key])) {
            $seen[$key] = true;
            $unique[] = $h;
        }
    }

    echo json_encode([
        'success' => true,
        'households' => $unique
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
