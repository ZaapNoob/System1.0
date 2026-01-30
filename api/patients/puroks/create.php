<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');

require_once '../../../config/db.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate required fields
    if (empty($data['barangay_id']) || empty($data['purok_name'])) {
        throw new Exception('Barangay ID and Purok name are required');
    }

    $barangay_id = (int)$data['barangay_id'];
    $purok_name = trim($data['purok_name']);

    // Validate barangay exists
    $checkBarangay = "SELECT id FROM barangays WHERE id = ?";
    $stmt = $pdo->prepare($checkBarangay);
    $stmt->execute([$barangay_id]);
    if (!$stmt->fetch()) {
        throw new Exception('Barangay not found');
    }

    // Check if purok already exists for this barangay
    $checkPurok = "SELECT id FROM puroks WHERE barangay_id = ? AND purok_name = ?";
    $stmt = $pdo->prepare($checkPurok);
    $stmt->execute([$barangay_id, $purok_name]);
    if ($stmt->fetch()) {
        throw new Exception('Purok already exists for this barangay');
    }

    // Insert new purok
    $insertQuery = "INSERT INTO puroks (barangay_id, purok_name) VALUES (?, ?)";
    $insertStmt = $pdo->prepare($insertQuery);
    $insertStmt->execute([$barangay_id, $purok_name]);

    $purokId = $pdo->lastInsertId();

    echo json_encode([
        'success' => true,
        'message' => 'Purok created successfully',
        'data' => [
            'id' => $purokId,
            'purok_name' => $purok_name
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
