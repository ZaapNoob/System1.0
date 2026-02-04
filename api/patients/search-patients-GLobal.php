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
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $barangay_id = isset($_GET['barangay_id']) ? (int)$_GET['barangay_id'] : 0;
    $search = trim($_GET['search'] ?? '');

    // Global query joins barangays to include their name
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
            p.gender,
            p.date_of_birth,
            p.blood_type,
            b.name AS barangay_name
        FROM patients_db p
        LEFT JOIN barangays b ON p.barangay_id = b.id
        WHERE 1=1
    ";

    $params = [];

    // Only filter by barangay if a specific barangay is chosen
    if ($barangay_id > 0) {
        $sql .= " AND p.barangay_id = :barangay_id";
        $params[':barangay_id'] = $barangay_id;
    }

    if ($search !== '') {
        // Search by first name, last name, full name, patient code, or DOB
        $sql .= " AND (
            p.first_name LIKE :search
            OR p.last_name LIKE :search
            OR CONCAT(p.first_name, ' ', p.last_name) LIKE :search
            OR p.patient_code LIKE :search
            OR DATE_FORMAT(p.date_of_birth, '%Y-%m-%d') LIKE :search
        )";
        $params[':search'] = "%$search%";
    }

    $sql .= " ORDER BY p.created_at DESC LIMIT 20";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $patients = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'patients' => $patients
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error',
        'error'   => $e->getMessage()
    ]);
}
