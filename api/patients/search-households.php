<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/db.php';

try {
    $barangay_id = (int)($_GET['barangay_id'] ?? 0);
    $search_query = trim($_GET['q'] ?? '');

    if (!$barangay_id || $search_query === '') {
        echo json_encode(['success' => true, 'households' => []]);
        exit;
    }

    $searchType = 'name';
    $searchParam = "%$search_query%";

    // =============================
    // AUTO DETECT SEARCH TYPE
    // =============================

    // Facility Household No (RHU-XX-00001)
    if (preg_match('/^RHU-/i', $search_query)) {
        $searchType = 'facility_household_no';
    }

    // Household No (YYYY-00001)
    elseif (preg_match('/^\d{4}-\d{5}$/', $search_query)) {
        $searchType = 'household_no';
    }

    // Patient Code (must contain underscore: TAG_0001, ariman_026)
    elseif (preg_match('/^[A-Z0-9_]*_[A-Z0-9_]*$/i', $search_query)) {
        $searchType = 'patient_code';
    }

    // Otherwise: NAME SEARCH (default)
    // SQL QUERY
    // =============================
    if ($searchType === 'household_no') {

        $sql = "
        SELECT DISTINCT household_no, facility_household_no,
               COUNT(*) OVER (PARTITION BY household_no) AS member_count
        FROM patients_db
        WHERE barangay_id = ? AND household_no LIKE ?
        LIMIT 20
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$barangay_id, $searchParam]);
    } elseif ($searchType === 'facility_household_no') {

        $sql = "
        SELECT DISTINCT household_no, facility_household_no,
               COUNT(*) OVER (PARTITION BY household_no) AS member_count
        FROM patients_db
        WHERE barangay_id = ? AND facility_household_no LIKE ?
        LIMIT 20
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$barangay_id, $searchParam]);
    } elseif ($searchType === 'patient_code') {

        $sql = "
        SELECT DISTINCT household_no, facility_household_no
        FROM patients_db
        WHERE barangay_id = ? AND patient_code LIKE ?
        LIMIT 20
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$barangay_id, $searchParam]);
    } else {
        // NAME SEARCH
        $sql = "
        SELECT DISTINCT household_no, facility_household_no
        FROM patients_db
        WHERE barangay_id = ?
        AND (
            first_name LIKE ? OR
            last_name LIKE ? OR
            CONCAT(first_name,' ',last_name) LIKE ?
        )
        LIMIT 20
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$barangay_id, $searchParam, $searchParam, $searchParam]);
    }

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'households' => $data]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
