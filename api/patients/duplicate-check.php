<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../../config/db.php';

try {

    $firstName = $_GET['first_name'] ?? '';
    $lastName = $_GET['last_name'] ?? '';
    $dob = $_GET['date_of_birth'] ?? '';
    $gender = $_GET['gender'] ?? '';

    if (!$firstName || !$lastName || !$dob || !$gender) {
        echo json_encode([
            "success" => true,
            "duplicate" => false
        ]);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT id, patient_code, first_name, last_name, date_of_birth
        FROM patients_db
        WHERE
            LOWER(first_name) = LOWER(?)
            AND LOWER(last_name) = LOWER(?)
            AND date_of_birth = ?
            AND gender = ?
        LIMIT 1
    ");

    $stmt->execute([
        $firstName,
        $lastName,
        $dob,
        $gender
    ]);

    $existing = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "duplicate" => $existing ? true : false,
        "data" => $existing
    ]);
} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
