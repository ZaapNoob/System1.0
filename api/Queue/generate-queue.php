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
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

require_once '../../config/db.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);

    $patient_id    = (int)($data['patient_id'] ?? 0);
    $queue_type    = $data['queue_type'] ?? '';
    $manual_number = isset($data['manual_number']) && $data['manual_number'] !== '' ? (int)$data['manual_number'] : null;

    // optional vitals
    $systolic_bp    = isset($data['systolic_bp']) ? (int)$data['systolic_bp'] : null;
    $diastolic_bp   = isset($data['diastolic_bp']) ? (int)$data['diastolic_bp'] : null;
    $heart_rate     = isset($data['heart_rate']) ? (int)$data['heart_rate'] : null;
    $respiratory_rate = isset($data['respiratory_rate']) ? (int)$data['respiratory_rate'] : null;
    $temperature    = isset($data['temperature']) ? (float)$data['temperature'] : null;
    $oxygen_saturation = isset($data['oxygen_saturation']) ? (int)$data['oxygen_saturation'] : null;
    $weight         = isset($data['weight']) ? (float)$data['weight'] : null;
    $height         = isset($data['height']) ? (float)$data['height'] : null;

    if (!$patient_id || !in_array($queue_type, ['PRIORITY', 'REGULAR'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid input']);
        exit;
    }

    if ($manual_number !== null && $manual_number <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid manual queue number']);
        exit;
    }

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->beginTransaction();

    // check patient exists
    $check = $pdo->prepare("SELECT id FROM patients_db WHERE id = :id");
    $check->execute([':id' => $patient_id]);
    if (!$check->fetch()) {
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Patient not found']);
        exit;
    }

    // get last queue number today (locked)
    $stmt = $pdo->prepare("SELECT MAX(queue_number) FROM patient_queue WHERE queue_date = CURDATE() AND queue_type = :type FOR UPDATE");
    $stmt->execute([':type' => $queue_type]);
    $lastNumber = (int)$stmt->fetchColumn();

    // decide next number
    if ($manual_number !== null) {
        $checkManual = $pdo->prepare("SELECT 1 FROM patient_queue WHERE queue_date=CURDATE() AND queue_type=:type AND queue_number=:num LIMIT 1");
        $checkManual->execute([':type' => $queue_type, ':num' => $manual_number]);
        if ($checkManual->fetch()) {
            $pdo->rollBack();
            http_response_code(409);
            echo json_encode(['success' => false, 'message' => 'Queue number already exists']);
            exit;
        }
        $nextNumber = $manual_number;
    } else {
        $nextNumber = $lastNumber + 1;
    }

    $prefix = $queue_type === 'PRIORITY' ? 'P' : 'R';
    $queueCode = sprintf('%s-%03d', $prefix, $nextNumber);

    // insert queue
    $insert = $pdo->prepare("
        INSERT INTO patient_queue
        (patient_id, queue_date, queue_type, queue_number, queue_code,
         systolic_bp, diastolic_bp, heart_rate, respiratory_rate, temperature, oxygen_saturation, weight, height)
        VALUES
        (:pid, CURDATE(), :type, :num, :code,
         :sys, :dia, :hr, :rr, :temp, :oxy, :weight, :height)
    ");
    $insert->execute([
        ':pid'    => $patient_id,
        ':type'   => $queue_type,
        ':num'    => $nextNumber,
        ':code'   => $queueCode,
        ':sys'    => $systolic_bp,
        ':dia'    => $diastolic_bp,
        ':hr'     => $heart_rate,
        ':rr'     => $respiratory_rate,
        ':temp'   => $temperature,
        ':oxy'    => $oxygen_saturation,
        ':weight' => $weight,
        ':height' => $height
    ]);

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'queue' => [
            'queue_code' => $queueCode,
            'queue_number' => $nextNumber,
            'queue_type' => $queue_type,
            'queue_date' => date('Y-m-d')
        ]
    ]);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error', 'error' => $e->getMessage()]);
}
