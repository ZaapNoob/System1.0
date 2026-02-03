<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit;
}

require_once '../../config/db.php';

try {

    // Make sure PDO throws real errors
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $status = $_GET['status'] ?? '';
    $barangay_id = isset($_GET['barangay_id']) ? (int)$_GET['barangay_id'] : 0;
    $search = trim($_GET['search'] ?? '');
    $gender = trim($_GET['gender'] ?? '');
    $dob = trim($_GET['dob'] ?? '');

    $sql = "
        SELECT 
            p.id,
            p.patient_code,
            CONCAT(
                p.first_name, ' ',
                IFNULL(p.middle_name, ''), ' ',
                p.last_name,
                IFNULL(CONCAT(' ', p.suffix), '')
            ) AS name,
            p.age,
            p.gender,
            p.status,
            p.contact_number,
            p.birthplace,
            p.education_level,
            p.barangay_id,
            b.name AS barangay_name,
            p.purok_id,
            p.facility_household_no,
            p.household_no
        FROM patients_db p
        LEFT JOIN barangays b 
            ON p.barangay_id = b.id
        WHERE 1=1
    ";

    $params = [];

    if ($status !== '') {
        $sql .= " AND p.status = :status";
        $params[':status'] = $status;
    }

    if ($barangay_id > 0) {
        $sql .= " AND p.barangay_id = :barangay_id";
        $params[':barangay_id'] = $barangay_id;
    }

    if ($search !== '') {
        $sql .= " AND (
            p.first_name LIKE :search
            OR p.last_name LIKE :search
            OR p.patient_code LIKE :search
            OR p.facility_household_no LIKE :search
            OR p.household_no LIKE :search
        )";
        $params[':search'] = "%$search%";
    }

    if ($gender !== '') {
        $sql .= " AND p.gender = :gender";
        $params[':gender'] = $gender;
    }

    if ($dob !== '') {
        $sql .= " AND p.date_of_birth = :dob";
        $params[':dob'] = $dob;
    }

    $sql .= " ORDER BY p.created_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    echo json_encode([
        'success' => true,
        'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);
} catch (Throwable $e) {

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error',
        'error'   => $e->getMessage()
    ]);
}
