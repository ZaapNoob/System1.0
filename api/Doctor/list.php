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
    // Check if a specific doctor ID was requested
    $doctorId = $_GET['id'] ?? null;

    if ($doctorId) {
        // Fetch specific doctor by ID with profile info
        $stmt = $pdo->prepare("
            SELECT 
                u.id, 
                u.name,
                up.license_no,
                up.title
            FROM users u
            LEFT JOIN user_profiles up ON u.id = up.user_id
            WHERE u.id = :id
              AND u.role = 'doctor'
              AND u.status = 'active'
            LIMIT 1
        ");
        $stmt->execute([':id' => $doctorId]);
    } else {
        // Fetch all active doctors with profile info
        $stmt = $pdo->prepare("
            SELECT 
                u.id, 
                u.name,
                up.license_no,
                up.title
            FROM users u
            LEFT JOIN user_profiles up ON u.id = up.user_id
            WHERE u.role = 'doctor'
              AND u.status = 'active'
            ORDER BY u.name ASC
        ");
        $stmt->execute();
    }

    // Debug: If no results, check what role code exists for doctors
    // Uncomment to debug: SELECT DISTINCT role FROM users;
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
