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
    if (!isset($data['id']) || !isset($data['impression'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Missing required fields: id and impression'
        ]);
        exit;
    }

    $certificate_id = (int)$data['id'];
    $impression = trim($data['impression']);
    $remarks = isset($data['remarks']) ? trim($data['remarks']) : '';

    // Validate certificate exists
    $checkStmt = $pdo->prepare("SELECT id FROM medical_certificates WHERE id = ?");
    $checkStmt->execute([$certificate_id]);
    if (!$checkStmt->fetch()) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Certificate not found'
        ]);
        exit;
    }

    // Update certificate
    $sql = "UPDATE medical_certificates 
            SET impression = ?, remarks = ? 
            WHERE id = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $impression,
        $remarks,
        $certificate_id
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Medical certificate updated successfully',
        'data' => [
            'id' => $certificate_id,
            'impression' => $impression,
            'remarks' => $remarks
        ]
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
