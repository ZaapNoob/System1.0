<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/auth.php';

header('Content-Type: application/json');
$currentUser = requireUser(); // Only admins allowed, ideally

$name     = trim($_POST['name'] ?? '');
$email    = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$role     = $_POST['role'] ?? '';

if (!$name || !$email || !$password || !$role) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required']);
    exit;
}

/* 0️⃣ Check email doesn't already exist */
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    http_response_code(400);
    echo json_encode(['error' => 'Email already exists']);
    exit;
}

/* 1️⃣ Validate role exists */
$stmt = $pdo->prepare("SELECT code FROM roles WHERE code = ?");
$stmt->execute([$role]);
if (!$stmt->fetch()) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid role selected']);
    exit;
}

/* 2️⃣ Hash password */
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

/* 3️⃣ Insert user */
try {
    $stmt = $pdo->prepare("
        INSERT INTO users (uuid, name, email, password_hash, role)
        VALUES (UUID(), ?, ?, ?, ?)
    ");
    $stmt->execute([$name, $email, $passwordHash, $role]);

    $userId = $pdo->lastInsertId();

    echo json_encode([
        'message' => 'Account created successfully',
        'user_id' => $userId,
        'role'    => $role
    ]);
} catch (PDOException $e) {
    error_log("Register Error: " . $e->getMessage());
    error_log("Register Error Code: " . $e->getCode());
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to create account',
        'details' => $e->getMessage()  // Remove this in production
    ]);
} catch (Exception $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to create account',
        'details' => $e->getMessage()  // Remove this in production
    ]);
}
