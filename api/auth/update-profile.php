<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit;
}

require_once '../../config/db.php';

try {
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get Authorization token
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';

    if (empty($authHeader)) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Missing authorization token'
        ]);
        exit;
    }

    // Extract token (format: "Bearer TOKEN")
    $token = str_replace('Bearer ', '', $authHeader);
    $token = trim($token);

    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    $phone = $input['phone'] ?? null;
    $address = $input['address'] ?? null;
    $license_no = $input['license_no'] ?? null;
    $title = $input['title'] ?? null;

    // Validate session token against user_sessions table
    $stmt = $pdo->prepare("
        SELECT us.user_id, u.id, u.name, u.role, u.email
        FROM user_sessions us
        JOIN users u ON us.user_id = u.id
        WHERE us.token = ? AND us.expires_at > NOW()
    ");
    $stmt->execute([$token]);
    $sessionData = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$sessionData) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid or expired token'
        ]);
        exit;
    }

    $userId = $sessionData['user_id'];
    $user = [
        'id' => $sessionData['id'],
        'name' => $sessionData['name'],
        'role' => $sessionData['role'],
        'email' => $sessionData['email']
    ];

    $role = $user['role'];

    // Role-based validation
    if ($role === 'doctor' || $role === 'nurse') {
        if (empty($license_no)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'License number is required for ' . $role . 's'
            ]);
            exit;
        }
        if (empty($title)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Title is required for ' . $role . 's'
            ]);
            exit;
        }
    }

    // Check if user profile already exists
    $stmt = $pdo->prepare("SELECT user_id FROM user_profiles WHERE user_id = ?");
    $stmt->execute([$userId]);

    if ($stmt->rowCount() > 0) {
        // UPDATE existing profile
        $sql = "
            UPDATE user_profiles 
            SET phone = ?, address = ?, license_no = ?, title = ?
            WHERE user_id = ?
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $phone,
            $address,
            $license_no,
            $title,
            $userId
        ]);

        $action = 'updated';
    } else {
        // INSERT new profile
        $sql = "
            INSERT INTO user_profiles (user_id, phone, address, license_no, title)
            VALUES (?, ?, ?, ?, ?)
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $userId,
            $phone,
            $address,
            $license_no,
            $title
        ]);

        $action = 'created';
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Profile ' . $action . ' successfully',
        'data' => [
            'user_id' => $userId,
            'name' => $user['name'],
            'role' => $role,
            'phone' => $phone,
            'address' => $address,
            'license_no' => $license_no,
            'title' => $title
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error',
        'error' => $e->getMessage()
    ]);
}
