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
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit;
}

require_once '../../config/db.php';

try {
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $certificate_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

    // Validate required fields
    if ($certificate_id <= 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Certificate ID is required'
        ]);
        exit;
    }

    // Fetch certificate with patient and doctor details
    $sql = "SELECT 
                mc.id,
                mc.certificate_no,
                mc.patient_id,
                mc.doctor_id,
                mc.impression,
                mc.remarks,
                mc.issued_at,
                p.first_name,
                p.middle_name,
                p.last_name,
                p.date_of_birth,
                p.gender,
                p.barangay_name,
                p.street,
                p.city_municipality,
                p.province,
                p.region,
                ba.is_special,
                pr.purok_name,
                u.name as doctor_name,
                up.license_no as doctor_license,
                up.title as doctor_title
            FROM medical_certificates mc
            JOIN patients_db p ON mc.patient_id = p.id
            JOIN barangays ba ON p.barangay_id = ba.id
            LEFT JOIN puroks pr ON p.purok_id = pr.id
            JOIN users u ON mc.doctor_id = u.id
            LEFT JOIN user_profiles up ON u.id = up.user_id
            WHERE mc.id = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$certificate_id]);
    $certificate = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$certificate) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Certificate not found'
        ]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'data' => $certificate
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error',
        'error' => $e->getMessage()
    ]);
}
