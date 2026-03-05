<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit;
}

require_once '../../config/db.php';

try {
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);

    // Validate required fields
    if (
        !isset($data['certificate_no']) || !isset($data['patient_id']) ||
        !isset($data['doctor_id']) || !isset($data['impression'])
    ) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Missing required fields'
        ]);
        exit;
    }

    $certificate_no = trim($data['certificate_no']);
    $patient_id = (int)$data['patient_id'];
    $doctor_id = (int)$data['doctor_id'];
    $impression = trim($data['impression']);
    $remarks = isset($data['remarks']) ? trim($data['remarks']) : '';

    // Check if patient exists
    $patientCheck = $pdo->prepare("SELECT id FROM patients_db WHERE id = ?");
    $patientCheck->execute([$patient_id]);
    if (!$patientCheck->fetch()) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Patient not found'
        ]);
        exit;
    }

    // Check if doctor exists
    $doctorCheck = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $doctorCheck->execute([$doctor_id]);
    if (!$doctorCheck->fetch()) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Doctor not found'
        ]);
        exit;
    }

    // Insert certificate
    $sql = "INSERT INTO medical_certificates 
            (certificate_no, patient_id, doctor_id, impression, remarks, issued_at) 
            VALUES (?, ?, ?, ?, ?, NOW())";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $certificate_no,
        $patient_id,
        $doctor_id,
        $impression,
        $remarks
    ]);

    $certificateId = $pdo->lastInsertId();

    echo json_encode([
        'success' => true,
        'message' => 'Medical certificate saved successfully',
        'data' => [
            'id' => $certificateId,
            'certificate_no' => $certificate_no,
            'patient_id' => $patient_id,
            'doctor_id' => $doctor_id,
            'issued_at' => date('Y-m-d H:i:s')
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error',
        'error' => $e->getMessage()
    ]);
}
