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

// Get doctor_id from query params
$doctorId = isset($_GET['doctor_id']) ? (int)$_GET['doctor_id'] : null;

if (!$doctorId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'doctor_id is required']);
    exit;
}

try {
    // 1️⃣ GET TODAY'S DATE
    $today = date('Y-m-d');

    // 2️⃣ OVERALL COMPLETED (All done consultations by this doctor)
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as count
        FROM doctor_patient_queue
        WHERE doctor_id = :doctor_id
          AND status = 'done'
    ");
    $stmt->execute(['doctor_id' => $doctorId]);
    $overallCompleted = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // 3️⃣ TODAY COMPLETED (Done consultations by this doctor today)
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as count
        FROM doctor_patient_queue
        WHERE doctor_id = :doctor_id
          AND status = 'done'
          AND DATE(created_at) = :today
    ");
    $stmt->execute(['doctor_id' => $doctorId, 'today' => $today]);
    $todayCompleted = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // 4️⃣ WAITING (Waiting consultations assigned to this doctor)
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as count
        FROM doctor_patient_queue
        WHERE doctor_id = :doctor_id
          AND status = 'waiting'
    ");
    $stmt->execute(['doctor_id' => $doctorId]);
    $waiting = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // 5️⃣ IN PROGRESS / SERVING (Currently being served)
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as count
        FROM doctor_patient_queue
        WHERE doctor_id = :doctor_id
          AND status = 'serving'
          AND is_active = 1
    ");
    $stmt->execute(['doctor_id' => $doctorId]);
    $inProgress = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // 6️⃣ CANCELLED (Cancelled consultations by this doctor)
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as count
        FROM doctor_patient_queue
        WHERE doctor_id = :doctor_id
          AND status = 'cancelled'
    ");
    $stmt->execute(['doctor_id' => $doctorId]);
    $cancelled = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    echo json_encode([
        'success' => true,
        'data' => [
            'overallCompleted' => (int)$overallCompleted,
            'todayCompleted' => (int)$todayCompleted,
            'waiting' => (int)$waiting,
            'inProgress' => (int)$inProgress,
            'cancelled' => (int)$cancelled
        ]
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch doctor stats',
        'error' => $e->getMessage()
    ]);
}
