<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/db.php';

try {
    $barangay_id = (int)($_GET['barangay_id'] ?? 0);
    $facility_household_no = trim($_GET['facility_household_no'] ?? '');
    $household_no = trim($_GET['household_no'] ?? '');
    $exclude_id = (int)($_GET['exclude_id'] ?? 0);

    if (!$barangay_id || !$facility_household_no || !$household_no) {
        throw new Exception("Missing required parameters");
    }

    $stmt = $pdo->prepare("
        SELECT 
            p.id,
            p.patient_code,
            CONCAT(
                p.first_name, ' ',
                IFNULL(p.middle_name, ''), ' ',
                p.last_name,
                IFNULL(CONCAT(' ', p.suffix), '')
            ) AS name,
            p.first_name,
            p.middle_name,
            p.last_name,
            p.suffix,
            p.age,
            p.gender,
            p.family_member_type,
            p.status,
            p.barangay_id,
            b.name AS barangay_name,
            p.facility_household_no,
            p.household_no
        FROM patients_db p
        LEFT JOIN barangays b ON p.barangay_id = b.id
        WHERE p.barangay_id = ?
          AND p.facility_household_no = ?
          AND p.household_no = ?
          AND p.id != ?
        ORDER BY p.family_member_type
    ");

    $stmt->execute([
        $barangay_id,
        $facility_household_no,
        $household_no,
        $exclude_id
    ]);

    echo json_encode([
        'success' => true,
        'members' => $stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
