<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../../config/db.php'; // must provide $pdo

/*
  Optional filters:
  - doctor_id (for doctor dashboard)
  - status (waiting | serving | done)
*/

$doctorId = isset($_GET['doctor_id']) ? (int)$_GET['doctor_id'] : null;
$status   = $_GET['status'] ?? null;

$params = [];
$where  = [];

if ($doctorId) {
    $where[] = 'dpq.doctor_id = ?';
    $params[] = $doctorId;
}

if ($status) {
    $where[] = 'dpq.status = ?';
    $params[] = $status;
}

$whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

try {
    $stmt = $pdo->prepare("
        SELECT
            dpq.id,
            dpq.patient_queue_id,
            dpq.queue_number,
            dpq.status,
            dpq.queue_date,
            dpq.is_active,
            p.id AS patient_id,
            p.first_name,
            p.last_name,
            CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
            pq.queue_type,
            pq.queue_code
        FROM doctor_patient_queue dpq
        JOIN patients_db p ON p.id = dpq.patient_id
        LEFT JOIN patient_queue pq ON pq.id = dpq.patient_queue_id
        $whereSql
        ORDER BY dpq.queue_date DESC, dpq.queue_number ASC
    ");

    $stmt->execute($params);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'message' => 'Doctor assignments loaded',
        'data' => $rows
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to load doctor assignments',
        'error' => $e->getMessage()
    ]);
}
