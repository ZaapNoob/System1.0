<?php
// ===============================
// CORS HEADERS
// ===============================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../../config/db.php";

// Get JSON body
$input = json_decode(file_get_contents("php://input"), true);
$queue_id = $input['queue_id'] ?? null;

if (!$queue_id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "queue_id is required"]);
    exit;
}

try {
    // Revert triage status back to waiting (only if currently in triage)
    $stmt = $pdo->prepare("
        UPDATE patient_queue 
        SET status = 'waiting' 
        WHERE id = :id AND status = 'triage'
    ");

    $stmt->execute([':id' => $queue_id]);

    if ($stmt->rowCount() > 0) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Patient reverted to waiting queue"
        ]);
    } else {
        // Patient not in triage status (might already be served)
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "Patient not in triage status or already assigned"
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
