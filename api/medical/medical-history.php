<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

require_once '../../config/db.php';

try {

    $patient_id = isset($_GET['patient_id']) ? (int)$_GET['patient_id'] : 0;

    if ($patient_id <= 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'patient_id is required'
        ]);
        exit;
    }

    $sql = "
        SELECT
            mc.id,
            mc.certificate_no,
            mc.impression,
            mc.remarks,
            mc.issued_at,
            u.name AS doctor_name
        FROM medical_certificates mc
        LEFT JOIN users u ON mc.doctor_id = u.id
        WHERE mc.patient_id = ?
        ORDER BY mc.issued_at DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$patient_id]);

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $rows
    ]);
} catch (Throwable $e) {

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error',
        'error' => $e->getMessage()
    ]);
}
