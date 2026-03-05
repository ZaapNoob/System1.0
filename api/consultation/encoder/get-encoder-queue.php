<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../../../config/db.php';

$doctor_id = isset($_GET['doctor_id']) ? (int)$_GET['doctor_id'] : 0;
$queue_date = isset($_GET['queue_date']) ? $_GET['queue_date'] : null;

if ($doctor_id <= 0) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid doctor ID'
    ]);
    exit;
}

$sql = "
SELECT 
    dpq.id AS queue_id,
    dpq.patient_id,
    dpq.queue_number,
    dpq.queue_date,
    dpq.status,
    dpq.created_at,
    p.first_name,
    p.last_name,
    c.id AS consultation_id,
    c.visit_date
FROM doctor_patient_queue dpq
LEFT JOIN patients_db p ON dpq.patient_id = p.id
LEFT JOIN consultations c ON c.queue_id = dpq.id
WHERE dpq.doctor_id = ?
AND dpq.status = 'done'
";

$params = [$doctor_id];

if ($queue_date) {
    $sql .= " AND dpq.queue_date = ?";
    $params[] = $queue_date;
}

$sql .= " ORDER BY dpq.queue_date DESC, dpq.queue_number ASC";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $data = [];

    foreach ($rows as $row) {
        $data[] = [
            "queue_id" => (int)$row['queue_id'],
            "patient_id" => (int)$row['patient_id'],
            "patient_name" => $row['first_name'] . ' ' . $row['last_name'],
            "queue_number" => (int)$row['queue_number'],
            "queue_date" => $row['queue_date'],
            "created_at" => $row['created_at'],
            "consultation_id" => $row['consultation_id'] ? (int)$row['consultation_id'] : null,
            "visit_date" => $row['visit_date'],
            "has_consultation" => $row['consultation_id'] ? true : false
        ];
    }

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
