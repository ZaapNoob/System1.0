<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

    $data = json_decode(file_get_contents('php://input'), true);

    // Validate required fields
    if (
        !isset($data['request_no']) || !isset($data['patient_id']) ||
        !isset($data['doctor_id']) || !isset($data['diagnosis'])
    ) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Missing required fields'
        ]);
        exit;
    }

    $request_no = trim($data['request_no']);
    $patient_id = (int)$data['patient_id'];
    $doctor_id = (int)$data['doctor_id'];
    $diagnosis = trim($data['diagnosis']);
    $xray_findings = isset($data['xray_findings']) ? trim($data['xray_findings']) : null;
    $utz_findings = isset($data['utz_findings']) ? trim($data['utz_findings']) : null;
    $tests = isset($data['tests']) && is_array($data['tests']) ? $data['tests'] : [];

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

    // Check if doctor exists
    $doctorCheck = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $doctorCheck->execute([$doctor_id]);
    if (!$doctorCheck->fetch()) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Doctor not found'
        ]);
        exit;
    }

    // Check if request_no already exists
    $requestCheck = $pdo->prepare("SELECT id FROM lab_requests WHERE request_no = ?");
    $requestCheck->execute([$request_no]);
    if ($requestCheck->fetch()) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Request number already exists'
        ]);
        exit;
    }

    // Start transaction
    $pdo->beginTransaction();

    // Insert lab request
    $sql = "INSERT INTO lab_requests 
            (request_no, patient_id, doctor_id, diagnosis, xray_findings, utz_findings, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, NOW())";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $request_no,
        $patient_id,
        $doctor_id,
        $diagnosis,
        $xray_findings,
        $utz_findings
    ]);

    $labRequestId = $pdo->lastInsertId();

    // Insert tests
    if (!empty($tests)) {
        $testSql = "INSERT INTO lab_request_tests 
                    (lab_request_id, category, test_name, other_value) 
                    VALUES (?, ?, ?, ?)";
        $testStmt = $pdo->prepare($testSql);

        foreach ($tests as $test) {
            $category = isset($test['category']) ? trim($test['category']) : '';
            $test_name = isset($test['test_name']) ? trim($test['test_name']) : '';
            $other_value = isset($test['other_value']) ? trim($test['other_value']) : null;

            if (!empty($category) && !empty($test_name)) {
                $testStmt->execute([
                    $labRequestId,
                    $category,
                    $test_name,
                    $other_value
                ]);
            }
        }
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Laboratory request saved successfully',
        'data' => [
            'id' => $labRequestId,
            'request_no' => $request_no,
            'patient_id' => $patient_id,
            'doctor_id' => $doctor_id,
            'created_at' => date('Y-m-d H:i:s')
        ]
    ]);
} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
    exit;
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
    exit;
}
