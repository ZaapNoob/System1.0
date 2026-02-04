<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../../config/db.php';

try {
    $stmt = $pdo->prepare("
        SELECT 
            q.id,
            q.queue_code,
            q.queue_type,
            q.queue_number,
            q.created_at,
            p.first_name,
            p.last_name
        FROM patient_queue q
        JOIN patients_db p ON p.id = q.patient_id
        WHERE q.queue_date = CURDATE()
          AND q.status = 'waiting'
        ORDER BY 
            FIELD(q.queue_type, 'PRIORITY', 'REGULAR'),
            q.queue_number ASC
    ");

    $stmt->execute();
    $queues = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $queues
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to load waiting queue',
        'error' => $e->getMessage()
    ]);
}
