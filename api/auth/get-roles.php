<?php
// Load the database connection
require_once __DIR__ . '/../../config/db.php';

// Load authentication helper
require_once __DIR__ . '/auth.php';

// Set response type to JSON
header('Content-Type: application/json');

// Require current user to be authenticated
$currentUser = requireUser();

try {
    // Fetch all roles from database
    $stmt = $pdo->prepare("
        SELECT id, code, name, description
        FROM roles
        ORDER BY id ASC
    ");
    $stmt->execute();
    $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return roles
    http_response_code(200);
    echo json_encode([
        'roles' => $roles
    ]);
} catch (Exception $e) {
    error_log("Error fetching roles: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch roles']);
}
