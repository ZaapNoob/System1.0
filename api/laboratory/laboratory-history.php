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

    // Get patient_id from query parameter
    $patient_id = isset($_GET['patient_id']) ? (int)$_GET['patient_id'] : null;

    if (!$patient_id) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Patient ID is required'
        ]);
        exit;
    }

    // Check if patient exists
    $patientCheck = $pdo->prepare("SELECT id FROM patients_db WHERE id = ?");
    $patientCheck->execute([$patient_id]);
    if (!$patientCheck->fetch()) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Patient not found'
        ]);
        exit;
    }

    // Get lab requests with their tests
    $sql = "SELECT 
                lr.id,
                lr.request_no,
                lr.diagnosis,
                lr.xray_findings,
                lr.utz_findings,
                lr.created_at,
                u.name as doctor_name
            FROM lab_requests lr
            LEFT JOIN users u ON lr.doctor_id = u.id
            WHERE lr.patient_id = ?
            ORDER BY lr.created_at DESC
            LIMIT 10";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$patient_id]);
    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get tests for each request
    if (!empty($requests)) {
        $testSql = "SELECT category, test_name, other_value 
                   FROM lab_request_tests 
                   WHERE lab_request_id = ?";
        $testStmt = $pdo->prepare($testSql);

        foreach ($requests as &$request) {
            $testStmt->execute([$request['id']]);
            $request['tests'] = $testStmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    echo json_encode([
        'success' => true,
        'data' => $requests
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
