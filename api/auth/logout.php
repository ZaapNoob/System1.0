<?php
// Load the database connection
// This provides the $pdo object for database operations
require_once __DIR__ . '/../../config/db.php';

// Load the authentication helper
// This gives access to the requireUser() function
require_once __DIR__ . '/auth.php';

// Tell the client that this endpoint returns JSON
header('Content-Type: application/json');

// Require the user to be authenticated
// This will:
// - Read the Authorization header
// - Validate the token
// - Exit with 401 if invalid
// - Return the authenticated user if valid
$user = requireUser();

// Retrieve all HTTP request headers
$headers = getallheaders();

// Extract the Authorization header value
// Example value: "Bearer abc123"
$token = $headers['Authorization'] ?? null;

// Delete the session from the database using the token
// This invalidates the session so it cannot be used again
$pdo->prepare("
    DELETE FROM user_sessions
    WHERE token = ?
")->execute([$token]);

// Send a success response back to the client
echo json_encode([
    'message' => 'Logout successful'
]);
