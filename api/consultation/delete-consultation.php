<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once("../../config/db.php");

try {
    // Get consultation_id from query parameter or request body
    $consultation_id = isset($_GET['id']) ? intval($_GET['id']) : null;
    
    if (!$consultation_id) {
        // Try to get from POST body for DELETE requests
        $data = json_decode(file_get_contents("php://input"), true);
        $consultation_id = isset($data['id']) ? intval($data['id']) : null;
    }

    if (!$consultation_id) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Consultation ID is required'
        ]);
        exit();
    }

    // Verify consultation exists before deleting
    $verifyStmt = $pdo->prepare("SELECT id FROM consultations WHERE id = ?");
    $verifyStmt->execute([$consultation_id]);
    $consultation = $verifyStmt->fetch(PDO::FETCH_ASSOC);

    if (!$consultation) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Consultation not found'
        ]);
        exit();
    }

    // Delete the consultation
    $deleteStmt = $pdo->prepare("DELETE FROM consultations WHERE id = ?");
    $result = $deleteStmt->execute([$consultation_id]);

    if ($result && $deleteStmt->rowCount() > 0) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Consultation deleted successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to delete consultation'
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Exception: ' . $e->getMessage()
    ]);
}