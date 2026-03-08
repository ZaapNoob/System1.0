<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/db.php';

try {
    // Validate input
    if (empty($_POST['patient_id'])) {
        throw new Exception("Patient ID is required");
    }

    if (empty($_FILES['file'])) {
        throw new Exception("No file uploaded");
    }

    $patient_id = (int)$_POST['patient_id'];
    $file = $_FILES['file'];

    // Validate file
    $allowed_types = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!in_array($file['type'], $allowed_types)) {
        throw new Exception("Invalid file type. Only JPG and PNG allowed.");
    }

    $max_size = 5 * 1024 * 1024; // 5MB
    if ($file['size'] > $max_size) {
        throw new Exception("File size exceeds 5MB limit");
    }

    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception("File upload error: " . $file['error']);
    }

    // Create upload directory if it doesn't exist
    $upload_dir = __DIR__ . '/../../upload/';
    if (!is_dir($upload_dir)) {
        if (!mkdir($upload_dir, 0755, true)) {
            throw new Exception("Failed to create upload directory");
        }
    }

    // Generate unique filename
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'patient_' . $patient_id . '_' . time() . '.' . $ext;
    $filepath = $upload_dir . $filename;

    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $filepath)) {
        throw new Exception("Failed to save file");
    }

    // Store image path in database
    $relative_path = 'upload/' . $filename;

    // Update patient record with profile_image path
    $stmt = $pdo->prepare("
        UPDATE patients_db 
        SET profile_image = ? 
        WHERE id = ?
    ");
    $result = $stmt->execute([$relative_path, $patient_id]);

    if (!$result) {
        // Delete file if database update fails
        unlink($filepath);
        throw new Exception("Failed to update patient record");
    }

    // Return success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Image uploaded successfully',
        'imageUrl' => $relative_path,
        'filename' => $filename
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
