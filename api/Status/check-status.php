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
    // Get patient_id from URL parameter
    $patient_id = isset($_GET['patient_id']) ? (int)$_GET['patient_id'] : 0;

    if (!$patient_id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Patient ID is required']);
        exit;
    }

    // Check if patient is already in queue for today with blocking statuses
    $stmt = $pdo->prepare("
        SELECT 
            id,
            queue_date,
            queue_type,
            queue_number,
            queue_code,
            status
        FROM patient_queue
        WHERE patient_id = :patient_id
            AND queue_date = CURDATE()
            AND status IN ('waiting', 'triage', 'serving')
        LIMIT 1
    ");

    $stmt->execute([':patient_id' => $patient_id]);
    $queue = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($queue) {
        // Patient is already in queue or triage
        echo json_encode([
            'success' => true,
            'inQueue' => true,
            'inTriage' => $queue['status'] === 'triage',
            'queueNumber' => $queue['queue_code'],
            'queueCode' => $queue['queue_code'],
            'status' => $queue['status']
        ]);
    } else {
        // Patient is not in queue
        echo json_encode([
            'success' => true,
            'inQueue' => false,
            'inTriage' => false
        ]);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error',
        'error' => $e->getMessage()
    ]);
}
