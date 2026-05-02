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
    
    $encodedBy = isset($_GET['encoded_by']) ? (int)$_GET['encoded_by'] : null;
    
    // Get today's date from PHP (same as other stats endpoints for consistency)
    $today = date('Y-m-d');

    if (!$encodedBy) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'encoded_by is required']);
        exit;
    }

    // Get overall count - all consultations encoded by this encoder
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as total
        FROM consultations
        WHERE encoded_by = :encoded_by
    ");
    $stmt->execute(['encoded_by' => $encodedBy]);
    $overallResult = $stmt->fetch(PDO::FETCH_ASSOC);
    $overallEncoded = $overallResult['total'] ?? 0;

    // Get today's count - consultations encoded today by this encoder
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as total
        FROM consultations
        WHERE encoded_by = :encoded_by
          AND DATE(encoded_at) = :today
    ");
    $stmt->execute(['encoded_by' => $encodedBy, 'today' => $today]);
    $todayResult = $stmt->fetch(PDO::FETCH_ASSOC);
    $todayEncoded = $todayResult['total'] ?? 0;

    echo json_encode([
        'success' => true,
        'data' => [
            'overallEncoded' => (int)$overallEncoded,
            'todayEncoded' => (int)$todayEncoded,
            'encoded_by' => $encodedBy
        ]
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch encoder stats',
        'error' => $e->getMessage()
    ]);
}
