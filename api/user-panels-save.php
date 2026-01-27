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

require_once __DIR__ . '/../config/db.php'; // your PDO connection

$userId = $_GET["user_id"] ?? null;
$data = json_decode(file_get_contents("php://input"), true);

if (!$userId || !isset($data["pages"])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input"]);
    exit;
}

$pages = $data["pages"]; // ["patient","queuegen"]

try {
    $pdo->beginTransaction();

    // 1. Delete old permissions
    $stmt = $pdo->prepare("DELETE FROM user_panel_access WHERE user_id = ?");
    $stmt->execute([$userId]);

    // 2. Insert new permissions
    $stmtPanel = $pdo->prepare("SELECT id FROM panels WHERE code = ?");
    $stmtInsert = $pdo->prepare("INSERT INTO user_panel_access (user_id, panel_id) VALUES (?, ?)");

    foreach ($pages as $code) {
        $stmtPanel->execute([$code]);
        $panel = $stmtPanel->fetch();

        if ($panel) {
            $stmtInsert->execute([$userId, $panel["id"]]);
        } else {
            throw new Exception("Panel code '$code' not found in database");
        }
    }

    $pdo->commit();

    echo json_encode(["success" => true]);
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);

    // Log to PHP error log
    error_log("Panel save error: " . $e->getMessage());

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage(),
        "details" => [
            "userId" => $userId,
            "pages" => $pages ?? [],
            "trace" => $e->getTraceAsString()
        ]
    ]);
}
