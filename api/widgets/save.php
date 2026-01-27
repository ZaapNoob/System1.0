<?php
// Set CORS headers FIRST
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../config/db.php';

$userId = $_GET["user_id"] ?? null;
$data = json_decode(file_get_contents("php://input"), true);

if (!$userId || !isset($data["widgets"])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input"]);
    exit;
}

$widgets = $data["widgets"];

try {
    $pdo->beginTransaction();

    $pdo->prepare("DELETE FROM user_widget_access WHERE user_id = ?")
        ->execute([$userId]);

    $stmtWidget = $pdo->prepare("SELECT id FROM widgets WHERE code = ?");
    $stmtInsert = $pdo->prepare("INSERT INTO user_widget_access (user_id, widget_id) VALUES (?, ?)");

    foreach ($widgets as $code) {
        $stmtWidget->execute([$code]);
        $widget = $stmtWidget->fetch(PDO::FETCH_ASSOC);

        if (!$widget) {
            throw new Exception("Widget '$code' not found");
        }

        $stmtInsert->execute([$userId, $widget["id"]]);
    }

    $pdo->commit();
    echo json_encode(["success" => true]);
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
