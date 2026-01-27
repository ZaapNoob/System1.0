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
$page = $_GET["page"] ?? null;

if (!$userId || !$page) {
    echo json_encode(["allowed" => false]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT 1
    FROM user_panel_access upa
    JOIN panels p ON p.id = upa.panel_id
    WHERE upa.user_id = ?
    AND p.code = ?
    LIMIT 1
");

$stmt->execute([$userId, $page]);

echo json_encode(["allowed" => (bool) $stmt->fetch()]);
