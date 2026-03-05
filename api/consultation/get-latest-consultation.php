<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database configuration from db.php
require_once __DIR__ . '/../../config/db.php';

$patient_id = isset($_GET['patient_id']) ? (int)$_GET['patient_id'] : 0;
error_log('get-latest-consultation.php - Received patient_id: ' . $patient_id);

if ($patient_id <= 0) {
    error_log('Invalid patient_id received: ' . $patient_id);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid patient ID: ' . $patient_id
    ]);
    exit;
}

$sql = "SELECT 
            c.id,
            c.doctor_id,
            c.visit_date,
            c.purpose_visit,
            c.nature_visit,
            c.chief_complaint,
            c.systolic_bp,
            c.diastolic_bp,
            c.temperature,
            c.pulse_rate,
            c.respiratory_rate,
            c.oxygen_saturation,
            c.weight,
            c.height,
            c.created_at,
            d.name as doctor_name
        FROM consultations c
        LEFT JOIN users d ON c.doctor_id = d.id
        WHERE c.patient_id = ?
        ORDER BY c.created_at DESC";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$patient_id]);
    $consultations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    error_log('Query executed - Number of rows: ' . count($consultations));
    error_log('Patient ID queried: ' . $patient_id);
    if (count($consultations) === 0) {
        error_log('⚠️ No consultations found for patient_id: ' . $patient_id);
    }

    // Format the consultation data
    $formattedConsultations = [];
    foreach ($consultations as $row) {
        $formattedConsultations[] = [
            'id' => (int)$row['id'],
            'doctor_id' => (int)$row['doctor_id'],
            'doctor_name' => $row['doctor_name'] ?: '',
            'attending_physician_name' => $row['doctor_name'] ?: '',
            'visit_date' => $row['visit_date'],
            'purpose_visit' => $row['purpose_visit'],
            'nature_visit' => $row['nature_visit'],
            'chief_complaint' => $row['chief_complaint'],
            'bp' => $row['systolic_bp'] && $row['diastolic_bp']
                ? $row['systolic_bp'] . '/' . $row['diastolic_bp']
                : null,
            'systolic_bp' => $row['systolic_bp'],
            'diastolic_bp' => $row['diastolic_bp'],
            'temperature' => $row['temperature'],
            'pulse_rate' => $row['pulse_rate'],
            'pulse' => $row['pulse_rate'],
            'respiratory_rate' => $row['respiratory_rate'],
            'respiratory' => $row['respiratory_rate'],
            'oxygen_saturation' => $row['oxygen_saturation'],
            'oxygen' => $row['oxygen_saturation'],
            'weight' => $row['weight'],
            'height' => $row['height'],
            'created_at' => $row['created_at']
        ];
    }

    error_log('Returning consultation data - Count: ' . count($formattedConsultations));

    echo json_encode([
        'success' => true,
        'data' => $formattedConsultations
    ]);
} catch (PDOException $e) {
    error_log('Query execution error: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Query execution failed',
        'error' => $e->getMessage()
    ]);
    exit;
}
