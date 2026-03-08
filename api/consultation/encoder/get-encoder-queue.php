<?php
// --------------------------------------------------
// CORS CONFIGURATION
// --------------------------------------------------
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --------------------------------------------------
// INCLUDE DATABASE CONNECTION
// --------------------------------------------------
require_once __DIR__ . '/../../../config/db.php'; // $pdo is defined here

try {
    // --------------------------------------------------
    // GET PARAMETERS
    // --------------------------------------------------
    $doctor_id = isset($_GET['doctor_id']) ? intval($_GET['doctor_id']) : null;
    $queue_date = isset($_GET['queue_date']) ? $_GET['queue_date'] : date('Y-m-d');

    // Ensure PDO throws exceptions
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // --------------------------------------------------
    // BUILD QUERY
    // --------------------------------------------------
    $sql = "SELECT *
FROM (
    SELECT 
        dpq.id AS queue_id,
        dpq.patient_id,
        dpq.doctor_id,
        dpq.queue_number,
        dpq.queue_date,
        dpq.status,
        dpq.is_active,
        dpq.created_at,
        p.first_name,
        p.last_name,
        u.name AS doctor_name,
        (SELECT COUNT(*) 
         FROM consultations c 
         WHERE c.patient_id = dpq.patient_id 
           AND (
             c.diagnosis IS NOT NULL 
             OR c.treatment IS NOT NULL
           )
        ) AS has_consultation,
        pq.created_at AS visit_date,

        ROW_NUMBER() OVER (
            PARTITION BY dpq.patient_id
            ORDER BY dpq.queue_number ASC
        ) AS rn

    FROM doctor_patient_queue dpq
    JOIN patients_db p ON p.id = dpq.patient_id
    JOIN users u ON u.id = dpq.doctor_id
    LEFT JOIN patient_queue pq ON pq.id = dpq.patient_queue_id

    WHERE dpq.queue_date = :queue_date
      AND dpq.status = 'done'
) t
WHERE rn = 1
ORDER BY queue_number ASC;
    ";

    if ($doctor_id) {
        $sql .= " AND dpq.doctor_id = :doctor_id";
    }

    $sql .= " ORDER BY dpq.queue_number ASC";

    // --------------------------------------------------
    // EXECUTE QUERY
    // --------------------------------------------------
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':queue_date', $queue_date);
    if ($doctor_id) {
        $stmt->bindValue(':doctor_id', $doctor_id, PDO::PARAM_INT);
    }
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Add full patient name
    foreach ($data as &$row) {
        $row['patient_name'] = trim($row['first_name'] . ' ' . $row['last_name']);
    }

    // --------------------------------------------------
    // RETURN JSON RESPONSE
    // --------------------------------------------------
    echo json_encode([
        'success' => true,
        'message' => 'Encoder queue fetched successfully',
        'data' => $data,
        'count' => count($data)
    ]);
} catch (Exception $e) {
    // Handle errors gracefully
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'data' => []
    ]);
}
