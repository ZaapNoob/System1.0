<?php
// --------------------------------------------------
// CORS CONFIGURATION
// --------------------------------------------------

// Allow requests from any origin (frontend domain)
// This enables browser-based apps (like React) to call this API
header('Access-Control-Allow-Origin: *');

// Allow common HTTP methods used by REST APIs
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

// Allow headers that the frontend is allowed to send
// Content-Type: for JSON or form data
// Authorization: for Bearer tokens
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// --------------------------------------------------
// HANDLE CORS PREFLIGHT REQUESTS
// --------------------------------------------------

// Browsers send an OPTIONS request before certain requests (CORS preflight)
// If this is a preflight request, approve it and stop execution
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --------------------------------------------------
// DATABASE CONNECTION SETTINGS
// --------------------------------------------------

// Database server host
// Database server host
$host = 'localhost';

// Database name (your RHU clinic database)
$db = 'react1.0';   // <-- change this to the actual DB name

// Database username (the new user you created)
$user = 'rhu_user';      // <-- the username you set in HeidiSQL

// Database password
$password = 'rhu_pass123'; // <-- the password you set for that user


// --------------------------------------------------
// CREATE PDO DATABASE CONNECTION
// --------------------------------------------------

try {
    // Create a new PDO instance to connect to MySQL
    // charset=utf8mb4 ensures full Unicode support (including emojis)
    $pdo = new PDO(
        "mysql:host=$host;dbname=$db;charset=utf8mb4",
        $user,
        $password
    );

    // Configure PDO to throw exceptions on errors
    // This makes debugging and error handling easier
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {

    // If the database connection fails:
    // - Return HTTP 500 (Internal Server Error)
    // - Send a JSON error response
    http_response_code(500);

    // ⚠️ In production, do NOT expose raw error messages
    echo json_encode([
        'error' => 'Database connection failed: ' . $e->getMessage()
    ]);

    // Stop execution to prevent further errors
    exit;
}
