<?php
// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/db.php';

$userId = $_GET["user_id"] ?? null;

if (!$userId) {
    http_response_code(400);
    echo json_encode([]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT p.code
    FROM user_panel_access upa
    JOIN panels p ON p.id = upa.panel_id
    WHERE upa.user_id = ?
");

$stmt->execute([$userId]);

$rows = $stmt->fetchAll(PDO::FETCH_COLUMN);

echo json_encode($rows);
