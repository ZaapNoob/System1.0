<?php
// Set CORS headers FIRST
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../config/db.php';

$userId = $_GET["user_id"] ?? null;

if (!$userId) {
    http_response_code(400);
    echo json_encode(["error" => "user_id is required"]);
    exit;
}

try {
    // Get all widgets this user has access to
    $stmt = $pdo->prepare("
        SELECT DISTINCT w.code
        FROM widgets w
        JOIN user_widget_access uwa ON uwa.widget_id = w.id
        WHERE uwa.user_id = ?
    ");

    $stmt->execute([$userId]);
    $widgets = $stmt->fetchAll(PDO::FETCH_COLUMN);

    http_response_code(200);
    echo json_encode($widgets ?: []);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
