<?php
// Set JSON response headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once("../../config/db.php");

try {
    // Get queue_id from request
    $queue_id = isset($_GET['queue_id']) ? intval($_GET['queue_id']) : null;

    if (!$queue_id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'queue_id is required']);
        exit;
    }

    // Fetch vital signs from patient_queue table
    $stmt = $pdo->prepare("
        SELECT 
            systolic_bp,
            diastolic_bp,
            heart_rate,
            respiratory_rate,
            temperature,
            oxygen_saturation,
            weight,
            height
        FROM patient_queue 
        WHERE id = ?
        LIMIT 1
    ");

    $stmt->execute([$queue_id]);
    $vitals = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$vitals) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Queue record not found for ID: ' . $queue_id]);
        exit;
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $vitals
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Exception: ' . $e->getMessage()]);
}
