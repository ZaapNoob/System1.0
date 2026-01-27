<?php
// Load the database connection file
// This file creates the $pdo object used to talk to MySQL
require_once __DIR__ . '/../../config/db.php';

/**
 * requireUser()
 * ----------------
 * This function:
 * - Reads the Authorization header
 * - Extracts the Bearer token
 * - Verifies the token against the database
 * - Checks token expiration
 * - Returns the authenticated user
 * - Stops execution with 401 if authentication fails
 */
function requireUser()
{
    // Get all HTTP request headers as an associative array
    $headers = getallheaders();

    // Try to read the Authorization header
    // Some servers lowercase headers, so we check both versions
    $authHeader = $headers['Authorization'] ?? ($headers['authorization'] ?? '');

    // Remove "Bearer " from the header value and trim whitespace
    // Example: "Bearer abc123" → "abc123"
    $token = preg_replace('/^Bearer\s+/i', '', trim($authHeader));

    // If no token is present, the user is not authenticated
    if (!$token) {
        // Send HTTP 401 Unauthorized
        http_response_code(401);
        // Stop script execution immediately
        exit;
    }

    // Make the PDO database connection available inside this function
    global $pdo;

    // Prepare a SQL query to:
    // - Find a session with the given token
    // - Ensure the session is not expired
    // - Join with the users table to get user details
    $stmt = $pdo->prepare("
        SELECT 
            u.id,
            u.uuid,
            u.name,
            u.email,
            u.role
        FROM user_sessions s
        JOIN users u ON u.id = s.user_id
        WHERE s.token = ?
          AND s.expires_at > NOW()
    ");

    // Execute the prepared statement safely with the token
    $stmt->execute([$token]);

    // Fetch the matching user record (or false if none found)
    $user = $stmt->fetch();

    // If no valid session/user was found:
    // - token is invalid
    // - token is expired
    // - token was deleted (logout)
    if (!$user) {
        // Send HTTP 401 Unauthorized
        http_response_code(401);
        // Stop script execution
        exit;
    }

    // Authentication successful
    // Return the authenticated user's data to the caller
    return $user;
}
