<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

session_start();

require_once '../../config/db.php'; // Make sure this sets up $pdo (PDO instance)

// Optional: only allow logged in users
// Temporarily disabled for debugging
// if (!isset($_SESSION['user_id'])) {
//     http_response_code(401);
//     echo json_encode([
//         'success' => false,
//         'message' => 'Unauthorized'
//     ]);
//     exit;
// }

try {
    // Fetch active doctors only
    $stmt = $pdo->prepare("
        SELECT id, name
        FROM users
        WHERE role = 'doctor'
          AND status = 'active'
        ORDER BY name ASC
    ");

    // Debug: If no results, check what role code exists for doctors
    // Uncomment to debug: SELECT DISTINCT role FROM users;
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $rows
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch doctors',
        'error' => $e->getMessage()
    ]);
}
