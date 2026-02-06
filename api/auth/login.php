<?php
// Load the database connection file
// This creates the $pdo object used for database queries
require_once __DIR__ . '/../../config/db.php';

// Tell the client that this endpoint returns JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Read the email from POST data
// trim() removes leading/trailing whitespace
$email = trim($_POST['email'] ?? '');

// Read the password from POST data
$password = $_POST['password'] ?? '';

// Validate required input fields
// If email or password is missing, stop early
if ($email === '' || $password === '') {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Email and password are required']);
    exit;
}

// Prepare a SQL query to fetch the user by email (case-insensitive)
// We also fetch password_hash to verify credentials
$stmt = $pdo->prepare("
    SELECT 
        id,
        uuid,
        name,
        email,
        role,
        status,
        password_hash
    FROM users
    WHERE LOWER(email) = LOWER(?)
");

// Execute the query safely with the provided email
$stmt->execute([$email]);

// Fetch the user record (array if found, false if not)
$user = $stmt->fetch();

// Debug logging (written to PHP error log, NOT sent to client)
error_log("=== LOGIN DEBUG ===");
error_log("Email: $email");
error_log("User found: " . ($user ? "YES" : "NO"));

// If no user exists with this email, deny login
if (!$user) {
    http_response_code(401); // Unauthorized
    echo json_encode(['error' => 'User not found']);
    exit;
}

// Log account status and partial hash for debugging
error_log("Status: " . ($user['status'] ?? 'N/A'));
error_log("Hash: " . substr($user['password_hash'], 0, 20) . "...");

// ⚠️ For production, do NOT log raw passwords
error_log("Password entered: $password");

// Block login if the account is not active
if (($user['status'] ?? 'active') !== 'active') {
    http_response_code(403); // Forbidden
    echo json_encode(['error' => 'Account is not active']);
    exit;
}

// Safely extract the stored password hash
$stored = is_array($user) ? ($user['password_hash'] ?? '') : '';

// Detect whether the stored password is a modern hash
// Supports bcrypt and argon2 hashes
$isHash = is_string($stored) &&
    preg_match('/^\$(2y|2a|2b|argon2i|argon2id)\$/', $stored);

// Initialize password verification result
$passwordOk = false;

// Log whether stored password is hashed
error_log("Is bcrypt/argon hash: " . ($isHash ? "YES" : "NO"));

// Only attempt verification if a user exists
if ($user) {

    // CASE 1: Stored password is hashed (secure)
    if ($isHash) {
        // Verify entered password against hash
        $passwordOk = password_verify($password, $stored);
        error_log("Password verify result: " . ($passwordOk ? "TRUE" : "FALSE"));

        // CASE 2: Stored password is plain text (legacy)
    } else {
        // Compare passwords using constant-time comparison
        $passwordOk = is_string($stored) && hash_equals($stored, $password);
        error_log("Plain text match: " . ($passwordOk ? "TRUE" : "FALSE"));

        // If legacy password matches, upgrade it to a secure hash
        if ($passwordOk) {
            $newHash = password_hash($password, PASSWORD_DEFAULT);

            // Update the database with the new hash
            $pdo->prepare("
                UPDATE users
                SET password_hash = ?
                WHERE id = ?
            ")->execute([$newHash, $user['id']]);
        }
    }
}

// Final debug result
error_log("Final passwordOk: " . ($passwordOk ? "TRUE" : "FALSE"));
error_log("=== END DEBUG ===");

// If authentication failed, deny access
if (!$user || !$passwordOk) {
    http_response_code(401); // Unauthorized
    echo json_encode(['error' => 'Invalid credentials']);
    exit;
}

// --------------------
// CREATE SESSION TOKEN
// --------------------

// Generate a cryptographically secure random token
$token = bin2hex(random_bytes(32)); // 64-character token

// Set token expiration time (1 day from now)
$expires = date('Y-m-d H:i:s', time() + 86400);

// Store the session token in the database
$pdo->prepare("
    INSERT INTO user_sessions (user_id, token, expires_at)
    VALUES (?, ?, ?)
")->execute([$user['id'], $token, $expires]);

// Send success response back to the client
// Includes the token and safe user data
echo json_encode([
    'token' => $token,
    'user' => [
        'id' => $user['id'],
        'uuid' => $user['uuid'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role'],
        'status' => $user['status']
    ]
]);
