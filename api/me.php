<?php
// Load the database connection
// This creates the $pdo object used by authentication logic
require_once __DIR__ . '/../config/db.php';

// Load the authentication helper
// This provides the requireUser() function
require_once __DIR__ . '/auth/auth.php';

// Tell the client that this endpoint returns JSON
header('Content-Type: application/json');

// Require the user to be authenticated
// This will:
// - Read the Authorization header
// - Validate the token
// - Exit with 401 if invalid or expired
// - Return the authenticated user's data
$user = requireUser();

// Return information about the currently authenticated user
// Only safe, non-sensitive fields are exposed
echo json_encode([
    'user' => [
        // Internal numeric ID (useful for backend logic)
        'id'    => $user['id'],

        // Public unique identifier (safe for frontend use)
        'uuid'  => $user['uuid'],

        // User's display name
        'name'  => $user['name'],

        // User's email address
        'email' => $user['email'],

        // User role (used for permissions and UI logic)
        'role'  => $user['role']
    ]
]);
