<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/db.php';

// Set timezone to Philippines (UTC+8)
date_default_timezone_set('Asia/Manila');

// Get user_id from query params
$userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;

if (!$userId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'user_id is required']);
    exit;
}

try {
    // 1️⃣ GET TODAY'S DATE
    $today = date('Y-m-d');

    // 2️⃣ OVERALL COMPLETED (All done patients administered by this user)
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as count
        FROM patient_queue
        WHERE administered_by = :user_id
          AND status = 'done'
    ");
    $stmt->execute(['user_id' => $userId]);
    $overallCompleted = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // 3️⃣ TODAY COMPLETED (Done patients administered by this user today)
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as count
        FROM patient_queue pq
        LEFT JOIN consultations c ON pq.id = c.queue_id
        WHERE pq.administered_by = :user_id
          AND pq.status = 'done'
          AND (
            (c.id IS NOT NULL AND DATE(c.created_at) = :today)
            OR (c.id IS NULL AND DATE(pq.created_at) = :today)
          )
    ");
    $stmt->execute(['user_id' => $userId, 'today' => $today]);
    $todayCompleted = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // 4️⃣ WAITING (Waiting patients administered by this user)
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as count
        FROM patient_queue
        WHERE administered_by = :user_id
          AND status = 'waiting'
    ");
    $stmt->execute(['user_id' => $userId]);
    $waiting = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // 5️⃣ IN PROGRESS (Triage + Serving + With Doctor)
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as count
        FROM patient_queue
        WHERE administered_by = :user_id
          AND status IN ('triage', 'serving', 'with_doctor')
    ");
    $stmt->execute(['user_id' => $userId]);
    $inProgress = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    echo json_encode([
        'success' => true,
        'data' => [
            'overallCompleted' => (int)$overallCompleted,
            'todayCompleted' => (int)$todayCompleted,
            'waiting' => (int)$waiting,
            'inProgress' => (int)$inProgress
        ]
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch queue stats',
        'error' => $e->getMessage()
    ]);
}
