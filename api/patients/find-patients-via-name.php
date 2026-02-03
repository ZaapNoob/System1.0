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
    // Grab query parameters
    $barangay_id = isset($_GET['barangay_id']) ? (int)$_GET['barangay_id'] : 0;
    $first_name = trim($_GET['first_name'] ?? '');
    $middle_name = trim($_GET['middle_name'] ?? '');
    $last_name = trim($_GET['last_name'] ?? '');
    $suffix = trim($_GET['suffix'] ?? '');
    $dob = trim($_GET['date_of_birth'] ?? ''); // expected format: YYYY-MM-DD
    $gender = trim($_GET['gender'] ?? '');
    $philhealth_no = trim($_GET['philhealth_no'] ?? '');

    if (!$barangay_id) {
        throw new Exception('Barangay ID is required');
    }

    // Build dynamic WHERE clause
    $conditions = ['barangay_id = ?'];
    $params = [$barangay_id];

    if ($first_name !== '') {
        $conditions[] = 'first_name LIKE ?';
        $params[] = "%$first_name%";
    }
    if ($middle_name !== '') {
        $conditions[] = 'middle_name LIKE ?';
        $params[] = "%$middle_name%";
    }
    if ($last_name !== '') {
        $conditions[] = 'last_name LIKE ?';
        $params[] = "%$last_name%";
    }
    if ($suffix !== '') {
        $conditions[] = 'suffix LIKE ?';
        $params[] = "%$suffix%";
    }
    if ($dob !== '') {
        $conditions[] = 'date_of_birth = ?';
        $params[] = $dob;
    }
    if ($gender !== '') {
        $conditions[] = 'gender = ?';
        $params[] = $gender;
    }
    if ($philhealth_no !== '') {
        $conditions[] = 'philhealth_no LIKE ?';
        $params[] = "%$philhealth_no%";
    }

    $where = implode(' AND ', $conditions);

    $stmt = $pdo->prepare("
        SELECT DISTINCT
            p.household_no, 
            p.facility_household_no,
            (SELECT COUNT(*) FROM patients_db WHERE household_no = p.household_no AND facility_household_no = p.facility_household_no) as member_count
        FROM patients_db p
        WHERE $where
        ORDER BY p.household_no, p.facility_household_no
    ");

    $stmt->execute($params);
    $households = $stmt->fetchAll(PDO::FETCH_ASSOC);

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
