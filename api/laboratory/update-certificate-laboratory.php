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
    if (!isset($data['id']) || !isset($data['diagnosis'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Missing required fields: id and diagnosis'
        ]);
        exit;
    }

    $lab_request_id = (int)$data['id'];
    $diagnosis = trim($data['diagnosis']);
    $xray_findings = isset($data['xray_findings']) ? trim($data['xray_findings']) : null;
    $utz_findings = isset($data['utz_findings']) ? trim($data['utz_findings']) : null;
    $tests = isset($data['tests']) && is_array($data['tests']) ? $data['tests'] : [];

    // Validate lab request exists
    $checkStmt = $pdo->prepare("SELECT id FROM lab_requests WHERE id = ?");
    $checkStmt->execute([$lab_request_id]);
    if (!$checkStmt->fetch()) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Lab request not found'
        ]);
        exit;
    }

    // Start transaction
    $pdo->beginTransaction();

    // Update lab request
    $sql = "UPDATE lab_requests 
            SET diagnosis = ?, xray_findings = ?, utz_findings = ? 
            WHERE id = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $diagnosis,
        $xray_findings,
        $utz_findings,
        $lab_request_id
    ]);

    // Delete old tests
    $deleteTestsStmt = $pdo->prepare("DELETE FROM lab_request_tests WHERE lab_request_id = ?");
    $deleteTestsStmt->execute([$lab_request_id]);

    // Insert new tests
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
                    $lab_request_id,
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
        'message' => 'Lab request updated successfully',
        'data' => [
            'id' => $lab_request_id,
            'diagnosis' => $diagnosis,
            'xray_findings' => $xray_findings,
            'utz_findings' => $utz_findings
        ]
    ]);
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error',
        'error' => $e->getMessage()
    ]);
}
