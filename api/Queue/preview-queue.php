<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../../config/db.php';

$type = $_GET['queue_type'] ?? '';

if (!in_array($type, ['PRIORITY', 'REGULAR'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid queue type'
    ]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT MAX(queue_number)
    FROM patient_queue
    WHERE queue_date = CURDATE()
      AND queue_type = :type
");
$stmt->execute([':type' => $type]);

$last = (int)$stmt->fetchColumn();
$next = $last + 1;

$prefix = $type === 'PRIORITY' ? 'P' : 'R';
$code = sprintf('%s-%03d', $prefix, $next);

echo json_encode([
    'success' => true,
    'queue_code' => $code,
    'queue_number' => $next
]);
