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

    // Get lab_request_id from query parameter
    $lab_request_id = isset($_GET['id']) ? (int)$_GET['id'] : null;

    if (!$lab_request_id) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Lab Request ID is required'
        ]);
        exit;
    }

    // Get lab request details
    $sql = "SELECT 
                lr.id,
                lr.request_no,
                lr.patient_id,
                lr.diagnosis,
                lr.xray_findings,
                lr.utz_findings,
                lr.created_at,
                p.first_name,
                p.middle_name,
                p.last_name,
                p.gender,
                p.date_of_birth,
                p.blood_type,
                p.barangay_id,
                COALESCE(p.barangay_name, ba.name) as barangay_name,
                p.street,
                p.city_municipality,
                p.province,
                p.region,
                p.purok_id,
                ba.is_special,
                pr.purok_name,
                u.name as doctor_name,
                up.license_no,
                up.title
            FROM lab_requests lr
            LEFT JOIN patients_db p ON lr.patient_id = p.id
            LEFT JOIN barangays ba ON p.barangay_id = ba.id
            LEFT JOIN puroks pr ON p.purok_id = pr.id
            LEFT JOIN users u ON lr.doctor_id = u.id
            LEFT JOIN user_profiles up ON u.id = up.user_id
            WHERE lr.id = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$lab_request_id]);
    $request = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$request) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Lab request not found'
        ]);
        exit;
    }

    // Get tests for this lab request
    $testSql = "SELECT category, test_name, other_value 
               FROM lab_request_tests 
               WHERE lab_request_id = ?";
    $testStmt = $pdo->prepare($testSql);
    $testStmt->execute([$lab_request_id]);
    $request['tests'] = $testStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $request
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
    exit;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
    exit;
}
