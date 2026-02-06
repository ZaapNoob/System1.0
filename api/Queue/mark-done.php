<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$assignmentId = isset($data['id']) ? (int)$data['id'] : null;

if (!$assignmentId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing assignment id']);
    exit;
}

try {
    $stmt = $pdo->prepare("
    UPDATE doctor_patient_queue
    SET status = 'done', is_active = 0
    WHERE id = ?
  ");
    $stmt->execute([$assignmentId]);

    echo json_encode([
        'success' => true,
        'message' => 'Consultation marked as done'
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to mark done',
        'error' => $e->getMessage()
    ]);
}
