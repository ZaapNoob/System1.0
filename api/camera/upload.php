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

    // ===============================
    // SUPPORT BASE64 OR URL IMAGE
    // ===============================
    if (!empty($_POST['imageUrl'])) {

        $patient_id = (int)$_POST['patient_id'];
        $imageData = $_POST['imageUrl'];

        // create upload folder
        $upload_dir = __DIR__ . '/../../upload/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }

        // detect base64 image
        if (strpos($imageData, 'data:image') === 0) {

            $image_parts = explode(";base64,", $imageData);
            $image_type_aux = explode("image/", $image_parts[0]);
            $image_type = $image_type_aux[1];

            $image_base64 = base64_decode($image_parts[1]);

            $filename = 'patient_' . $patient_id . '_' . time() . '.' . $image_type;
            $filepath = $upload_dir . $filename;

            file_put_contents($filepath, $image_base64);
        } else {

            // download image from URL
            $imageContent = file_get_contents($imageData);
            if (!$imageContent) {
                throw new Exception("Failed to download image");
            }

            $filename = 'patient_' . $patient_id . '_' . time() . '.jpg';
            $filepath = $upload_dir . $filename;

            file_put_contents($filepath, $imageContent);
        }

        $relative_path = 'upload/' . $filename;

        $stmt = $pdo->prepare("
        UPDATE patients_db 
        SET profile_image = ? 
        WHERE id = ?
    ");
        $stmt->execute([$relative_path, $patient_id]);

        echo json_encode([
            "success" => true,
            "imageUrl" => $relative_path
        ]);

        exit;
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

    // ============================================
    // DELETE OLD IMAGE IF EXISTS
    // ============================================
    $stmt_get_old = $pdo->prepare("SELECT profile_image FROM patients_db WHERE id = ?");
    $stmt_get_old->execute([$patient_id]);
    $old_patient = $stmt_get_old->fetch(PDO::FETCH_ASSOC);

    if ($old_patient && !empty($old_patient['profile_image'])) {
        $old_image_path = __DIR__ . '/../../' . $old_patient['profile_image'];
        // Only delete if file exists and is in upload directory (safety check)
        if (file_exists($old_image_path) && strpos($old_image_path, $upload_dir) === 0) {
            if (!unlink($old_image_path)) {
                // Log error but don't throw - continue with new upload
                error_log("Warning: Could not delete old image: " . $old_image_path);
            } else {
                error_log("✅ Deleted old image: " . $old_patient['profile_image']);
            }
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
