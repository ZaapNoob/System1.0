<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/db.php';

$userId = $_GET["user_id"] ?? null;
$widget = $_GET["widget"] ?? null;

if (!$userId || !$widget) {
    echo json_encode(["allowed" => false]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT 1
    FROM user_widget_access uwa
    JOIN widgets w ON w.id = uwa.widget_id
    WHERE uwa.user_id = ?
      AND w.code = ?
    LIMIT 1
");

$stmt->execute([$userId, $widget]);

echo json_encode(["allowed" => (bool)$stmt->fetch()]);
