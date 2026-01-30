<?php
header('Content-Type: application/json');
require_once '../../config/db.php';

try {
    $status = $_GET['status'] ?? '';
    $barangay_id = isset($_GET['barangay_id']) ? (int)$_GET['barangay_id'] : 0;
    $search = trim($_GET['search'] ?? '');

    $sql = "
        SELECT 
            id,
            patient_code,
            CONCAT(
                first_name, ' ',
                IFNULL(middle_name, ''), ' ',
                last_name,
                IFNULL(CONCAT(' ', suffix), '')
            ) AS name,
            age,
            gender,
            status,
            contact_number,
            birthplace,
            education_level,
            barangay_id,
            purok_id
        FROM patients_db
        WHERE 1=1
    ";

    $params = [];

    if ($status !== '') {
        $sql .= " AND status = :status";
        $params[':status'] = $status;
    }

    if ($barangay_id > 0) {
        $sql .= " AND barangay_id = :barangay_id";
        $params[':barangay_id'] = $barangay_id;
    }

    if ($search !== '') {
        $sql .= " AND (
            first_name LIKE :search
            OR last_name LIKE :search
            OR patient_code LIKE :search
        )";
        $params[':search'] = "%$search%";
    }

    $sql .= " ORDER BY created_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    echo json_encode([
        'success' => true,
        'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
