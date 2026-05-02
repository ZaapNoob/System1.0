<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/db.php';

try {
    // Set timezone to Philippines (UTC+8)
    date_default_timezone_set('Asia/Manila');
    
    $userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;
    $doctorId = isset($_GET['doctor_id']) ? (int)$_GET['doctor_id'] : null;
    $encodedBy = isset($_GET['encoded_by']) ? (int)$_GET['encoded_by'] : null;

    if (!$userId && !$doctorId && !$encodedBy) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'user_id, doctor_id, or encoded_by is required']);
        exit;
    }

    // ===========================
    // ENCODER: Get consultations by encoded_by
    // ===========================
    if ($encodedBy) {
        $stmt = $pdo->prepare("
            SELECT 
                c.id,
                c.patient_id,
                c.queue_id,
                c.doctor_id,
                c.encoded_by,
                c.encoded_at,
                c.created_at,
                c.chief_complaint,
                c.diagnosis,
                c.treatment,
                c.systolic_bp,
                c.diastolic_bp,
                c.temperature,
                c.pulse_rate,
                c.respiratory_rate,
                c.oxygen_saturation,
                c.weight,
                c.height,
                p.first_name,
                p.last_name,
                p.middle_name,
                pq.queue_number,
                pq.queue_code,
                pq.queue_date,
                pq.queue_type,
                u.name as encoder_name
            FROM consultations c
            JOIN patients_db p ON c.patient_id = p.id
            LEFT JOIN patient_queue pq ON c.queue_id = pq.id
            LEFT JOIN users u ON c.encoded_by = u.id
            WHERE c.encoded_by = :encoded_by
            ORDER BY c.encoded_at DESC, c.created_at DESC
            LIMIT 500
        ");
        $stmt->execute(['encoded_by' => $encodedBy]);
    }
    // ===========================
    // DOCTOR: Get completed patients by doctor
    // ===========================
    elseif ($doctorId) {
        // Filter by doctor assignment from doctor_patient_queue
        $stmt = $pdo->prepare("
            SELECT 
                pq.id,
                pq.patient_id,
                pq.queue_date,
                pq.queue_type,
                pq.queue_number,
                pq.queue_code,
                pq.status,
                pq.cancelled_by,
                pq.systolic_bp,
                pq.diastolic_bp,
                pq.heart_rate,
                pq.respiratory_rate,
                pq.temperature,
                pq.oxygen_saturation,
                pq.weight,
                pq.height,
                pq.created_at,
                pq.administered_by,
                p.first_name,
                p.last_name,
                p.middle_name,
                u.name as administered_by_name,
                u.role as administered_by_role,
                dpq.doctor_id,
                d.name as doctor_name,
                d.role as doctor_role
            FROM doctor_patient_queue dpq
            JOIN patient_queue pq ON pq.id = dpq.patient_queue_id
            JOIN patients_db p ON pq.patient_id = p.id
            LEFT JOIN users u ON pq.administered_by = u.id
            LEFT JOIN users d ON dpq.doctor_id = d.id
            WHERE dpq.doctor_id = :doctor_id
              AND dpq.status = 'done'
            ORDER BY dpq.queue_date DESC
            LIMIT 500
        ");
        $stmt->execute(['doctor_id' => $doctorId]);
    } else {
        // Filter by user (administered_by) - original behavior
        $stmt = $pdo->prepare("
            SELECT 
                pq.id,
                pq.patient_id,
                pq.queue_date,
                pq.queue_type,
                pq.queue_number,
                pq.queue_code,
                pq.status,
                pq.cancelled_by,
                pq.systolic_bp,
                pq.diastolic_bp,
                pq.heart_rate,
                pq.respiratory_rate,
                pq.temperature,
                pq.oxygen_saturation,
                pq.weight,
                pq.height,
                pq.created_at,
                pq.administered_by,
                COALESCE(p.first_name, 'Unknown') as first_name,
                COALESCE(p.last_name, '') as last_name,
                COALESCE(p.middle_name, '') as middle_name,
                u.name as administered_by_name,
                u.role as administered_by_role,
                NULL as doctor_id,
                NULL as doctor_name,
                NULL as doctor_role
            FROM patient_queue pq
            LEFT JOIN patients_db p ON pq.patient_id = p.id
            LEFT JOIN users u ON pq.administered_by = u.id
            WHERE pq.administered_by = :user_id
              AND pq.status = 'done'
            ORDER BY pq.created_at DESC
            LIMIT 500
        ");
        $stmt->execute(['user_id' => $userId]);
    }
    $completedPatients = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $completedPatients,
        'count' => count($completedPatients)
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch completed patients',
        'error' => $e->getMessage()
    ]);
}
