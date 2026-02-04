<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

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

$data = json_decode(file_get_contents("php://input"), true);

$mode    = $data['mode'] ?? null;       // single | waiting | serving
$queueId = $data['queue_id'] ?? null;   // required only for single

if (!in_array($mode, ['single', 'waiting', 'serving'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid cancel mode'
    ]);
    exit;
}

try {
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->beginTransaction();

    switch ($mode) {

        // 1️⃣ Cancel ALL WAITING (safe default)
        case 'waiting':
            $stmt = $pdo->prepare("
                UPDATE patient_queue
                SET status = 'cancelled',
                    cancelled_by = 'manual'
                WHERE queue_date = CURDATE()
                  AND status = 'waiting'
            ");
            $stmt->execute();
            break;

        // 2️⃣ Cancel ALL SERVING (DANGEROUS – admin only in UI)
        case 'serving':
            $stmt = $pdo->prepare("
                UPDATE patient_queue
                SET status = 'cancelled',
                    cancelled_by = 'manual'
                WHERE queue_date = CURDATE()
                  AND status = 'serving'
            ");
            $stmt->execute();
            break;

        // 3️⃣ Cancel SINGLE patient
        case 'single':
            if (empty($queueId)) {
                throw new Exception('queue_id is required for single cancel');
            }

            $stmt = $pdo->prepare("
                UPDATE patient_queue
                SET status = 'cancelled',
                    cancelled_by = 'manual'
                WHERE id = :id
                  AND status IN ('waiting','serving')
            ");
            $stmt->execute([
                ':id' => $queueId
            ]);
            break;
    }

    $affected = $stmt->rowCount();
    $pdo->commit();

    echo json_encode([
        'success' => true,
        'mode' => $mode,
        'affected_rows' => $affected
    ]);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Cancel operation failed',
        'error' => $e->getMessage()
    ]);
}
