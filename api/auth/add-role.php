<?php
// Load the database connection
require_once __DIR__ . '/../../config/db.php';

// Load authentication helper
require_once __DIR__ . '/auth.php';

// Set response type to JSON
header('Content-Type: application/json');

// Require current user to be authenticated
$currentUser = requireUser();

// Read POST data
$roleName = trim($_POST['roleName'] ?? '');

// Validate required field
if ($roleName === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Role name is required']);
    exit;
}

// Validate role name length
if (strlen($roleName) > 50) {
    http_response_code(400);
    echo json_encode(['error' => 'Role name must be less than 50 characters']);
    exit;
}

// Convert role name to lowercase for code (e.g., "Nurse" → "nurse")
$roleCode = strtolower(str_replace(' ', '_', $roleName));

// Check if role already exists
$stmt = $pdo->prepare("SELECT id FROM roles WHERE code = ? OR name = ?");
$stmt->execute([$roleCode, $roleName]);
if ($stmt->fetch()) {
    http_response_code(409);  // Conflict
    echo json_encode(['error' => 'This role already exists']);
    exit;
}

try {
    // Insert new role into roles table
    $stmt = $pdo->prepare("
        INSERT INTO roles (code, name)
        VALUES (?, ?)
    ");
    $stmt->execute([$roleCode, $roleName]);

    $roleId = $pdo->lastInsertId();

    // Return success with new role data
    http_response_code(201);  // Created
    echo json_encode([
        'message' => 'Role created successfully',
        'role' => [
            'id' => $roleId,
            'code' => $roleCode,
            'name' => $roleName
        ]
    ]);
} catch (Exception $e) {
    error_log("Role creation error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create role']);
}
