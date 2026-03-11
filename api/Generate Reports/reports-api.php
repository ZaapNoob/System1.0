<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

session_start();
require_once '../../config/db.php';

try {
    $action = $_GET['action'] ?? 'dashboard';

    // COMMON FILTERS
    $startDate = $_GET['startDate'] ?? null;
    $endDate = $_GET['endDate'] ?? null;
    $barangay = $_GET['barangay'] ?? null;
    $gender = $_GET['gender'] ?? null;
    $ageGroup = $_GET['ageGroup'] ?? null;
    $visitType = $_GET['visitType'] ?? null;
    $consultationType = $_GET['consultationType'] ?? null;
    $referral = $_GET['referral'] ?? null;
    $patientStatus = $_GET['patientStatus'] ?? null;
    $doctor = $_GET['doctor'] ?? null;
    $certificate = $_GET['certificate'] ?? null;
    $labRequest = $_GET['labRequest'] ?? null;

    /*
    ======================================
    BARANGAY STATISTICS (CONSULTATIONS)
    ======================================
    */
    if ($action === "barangayStats") {
        $conditions = [];
        $params = [];

        if ($startDate) {
            $conditions[] = "c.visit_date >= :startDate";
            $params[':startDate'] = $startDate;
        }
        if ($endDate) {
            $conditions[] = "c.visit_date <= :endDate";
            $params[':endDate'] = $endDate;
        }
        if ($barangay && $barangay !== "all") {
            $conditions[] = "p.barangay_id = :barangay";
            $params[':barangay'] = $barangay;
        }
        if ($consultationType && $consultationType !== "all") {
            $conditions[] = "c.purpose_visit = :consultationType";
            $params[':consultationType'] = $consultationType;
        }
        if ($gender && $gender !== "all") {
            $conditions[] = "p.gender = :gender";
            $params[':gender'] = $gender;
        }
        if ($doctor && $doctor !== "all") {
            $conditions[] = "c.doctor_id = :doctor";
            $params[':doctor'] = $doctor;
        }
        if ($referral && $referral !== "all") {
            $conditions[] = "c.referral = :referral";
            $params[':referral'] = $referral;
        }
        if ($patientStatus && $patientStatus !== "all") {
            $conditions[] = "p.status = :patientStatus";
            $params[':patientStatus'] = $patientStatus;
        }

        switch ($ageGroup) {
            case "0-5":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 0 AND 5";
                break;
            case "6-12":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 6 AND 12";
                break;
            case "13-17":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 13 AND 17";
                break;
            case "18-59":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 18 AND 59";
                break;
            case "60+":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) >= 60";
                break;
        }

        $where = $conditions ? "WHERE " . implode(" AND ", $conditions) : "";

        $stmt = $pdo->prepare("
            SELECT 
                b.name AS barangay,
                COUNT(c.id) AS total
            FROM consultations c
            JOIN patients_db p ON p.id = c.patient_id
            JOIN barangays b ON b.id = p.barangay_id
            $where
            GROUP BY b.name
            ORDER BY total DESC
        ");

        $stmt->execute($params);

        echo json_encode([
            "success" => true,
            "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)
        ]);
        exit;
    }

    /*
    ======================================
    PATIENTS PER BARANGAY (CHART)
    ======================================
    */
    if ($action === "patientsPerBarangay") {
        $conditions = [];
        $params = [];

        if ($barangay && $barangay !== "all") {
            $conditions[] = "p.barangay_id = :barangay";
            $params[':barangay'] = $barangay;
        }
        if ($gender && $gender !== "all") {
            $conditions[] = "p.gender = :gender";
            $params[':gender'] = $gender;
        }
        if ($patientStatus && $patientStatus !== "all") {
            $conditions[] = "p.status = :patientStatus";
            $params[':patientStatus'] = $patientStatus;
        }

        switch ($ageGroup) {
            case "0-5":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 0 AND 5";
                break;
            case "6-12":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 6 AND 12";
                break;
            case "13-17":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 13 AND 17";
                break;
            case "18-59":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 18 AND 59";
                break;
            case "60+":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) >= 60";
                break;
        }

        $where = $conditions ? "WHERE " . implode(" AND ", $conditions) : "";

        $stmt = $pdo->prepare("
            SELECT 
                b.name AS barangay,
                COUNT(DISTINCT p.id) AS total
            FROM patients_db p
            LEFT JOIN barangays b ON b.id = p.barangay_id
            $where
            GROUP BY b.name
            ORDER BY total DESC
        ");

        $stmt->execute($params);

        echo json_encode([
            "success" => true,
            "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)
        ]);
        exit;
    }

    /*
    ======================================
    LAB REQUESTS PER BARANGAY
    ======================================
    */
    if ($action === "labRequestsPerBarangay") {
        $conditions = [];
        $params = [];

        if ($barangay && $barangay !== "all") {
            $conditions[] = "p.barangay_id = :barangay";
            $params[':barangay'] = $barangay;
        }
        if ($gender && $gender !== "all") {
            $conditions[] = "p.gender = :gender";
            $params[':gender'] = $gender;
        }
        if ($patientStatus && $patientStatus !== "all") {
            $conditions[] = "p.status = :patientStatus";
            $params[':patientStatus'] = $patientStatus;
        }
        if ($doctor && $doctor !== "all") {
            $conditions[] = "lr.doctor_id = :doctor";
            $params[':doctor'] = $doctor;
        }

        switch ($ageGroup) {
            case "0-5":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 0 AND 5";
                break;
            case "6-12":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 6 AND 12";
                break;
            case "13-17":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 13 AND 17";
                break;
            case "18-59":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 18 AND 59";
                break;
            case "60+":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) >= 60";
                break;
        }

        $where = $conditions ? "WHERE " . implode(" AND ", $conditions) : "";

        $stmt = $pdo->prepare("
            SELECT b.name AS barangay, COUNT(lr.id) AS total
            FROM lab_requests lr
            JOIN patients_db p ON p.id = lr.patient_id
            LEFT JOIN barangays b ON b.id = p.barangay_id
            $where
            GROUP BY b.name
            ORDER BY total DESC
        ");
        $stmt->execute($params);

        echo json_encode([
            "success" => true,
            "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)
        ]);
        exit;
    }

    /*
    ======================================
    MEDICAL CERTIFICATES PER BARANGAY
    ======================================
    */
    if ($action === "medicalCertificatesPerBarangay") {
        $conditions = [];
        $params = [];

        if ($barangay && $barangay !== "all") {
            $conditions[] = "p.barangay_id = :barangay";
            $params[':barangay'] = $barangay;
        }
        if ($gender && $gender !== "all") {
            $conditions[] = "p.gender = :gender";
            $params[':gender'] = $gender;
        }
        if ($patientStatus && $patientStatus !== "all") {
            $conditions[] = "p.status = :patientStatus";
            $params[':patientStatus'] = $patientStatus;
        }
        if ($doctor && $doctor !== "all") {
            $conditions[] = "mc.doctor_id = :doctor";
            $params[':doctor'] = $doctor;
        }

        switch ($ageGroup) {
            case "0-5":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 0 AND 5";
                break;
            case "6-12":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 6 AND 12";
                break;
            case "13-17":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 13 AND 17";
                break;
            case "18-59":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 18 AND 59";
                break;
            case "60+":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) >= 60";
                break;
        }

        $where = $conditions ? "WHERE " . implode(" AND ", $conditions) : "";

        $stmt = $pdo->prepare("
            SELECT b.name AS barangay, COUNT(mc.id) AS total
            FROM medical_certificates mc
            JOIN patients_db p ON p.id = mc.patient_id
            LEFT JOIN barangays b ON b.id = p.barangay_id
            $where
            GROUP BY b.name
            ORDER BY total DESC
        ");
        $stmt->execute($params);

        echo json_encode([
            "success" => true,
            "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)
        ]);
        exit;
    }

    /*
    ======================================
    PATIENTS LIST
    ======================================
    */
    if ($action === "patientsList") {
        $conditions = [];
        $params = [];

        if ($barangay && $barangay !== "all") {
            $conditions[] = "p.barangay_id = :barangay";
            $params[':barangay'] = $barangay;
        }
        if ($gender && $gender !== "all") {
            $conditions[] = "p.gender = :gender";
            $params[':gender'] = $gender;
        }
        if ($patientStatus && $patientStatus !== "all") {
            $conditions[] = "p.status = :patientStatus";
            $params[':patientStatus'] = $patientStatus;
        }

        switch ($ageGroup) {
            case "0-5":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 0 AND 5";
                break;
            case "6-12":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 6 AND 12";
                break;
            case "13-17":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 13 AND 17";
                break;
            case "18-59":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 18 AND 59";
                break;
            case "60+":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) >= 60";
                break;
        }

        $where = $conditions ? "WHERE " . implode(" AND ", $conditions) : "";

        $stmt = $pdo->prepare("
            SELECT DISTINCT
                p.id AS patient_id,
                CONCAT(p.first_name,' ',p.middle_name,' ',p.last_name) AS patient_name,
                p.gender,
                TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) AS age,
                p.status,
                b.name AS barangay
            FROM patients_db p
            LEFT JOIN barangays b ON b.id = p.barangay_id
            $where
            ORDER BY b.name,p.last_name,p.first_name
        ");
        $stmt->execute($params);

        echo json_encode([
            "success" => true,
            "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)
        ]);
        exit;
    }

    /*
    ======================================
    PATIENTS WITH CONSULTATIONS
    ======================================
    */
    if ($action === "patientsWithConsultations") {
        $conditions = [];
        $params = [];

        if ($startDate) {
            $conditions[] = "c.visit_date >= :startDate";
            $params[':startDate'] = $startDate;
        }
        if ($endDate) {
            $conditions[] = "c.visit_date <= :endDate";
            $params[':endDate'] = $endDate;
        }
        if ($barangay && $barangay !== "all") {
            $conditions[] = "p.barangay_id = :barangay";
            $params[':barangay'] = $barangay;
        }
        if ($gender && $gender !== "all") {
            $conditions[] = "p.gender = :gender";
            $params[':gender'] = $gender;
        }
        if ($consultationType && $consultationType !== "all") {
            $conditions[] = "c.purpose_visit = :consultationType";
            $params[':consultationType'] = $consultationType;
        }
        if ($visitType && $visitType !== "all") {
            $conditions[] = "c.nature_visit = :visitType";
            $params[':visitType'] = $visitType;
        }
        if ($patientStatus && $patientStatus !== "all") {
            $conditions[] = "p.status = :patientStatus";
            $params[':patientStatus'] = $patientStatus;
        }

        switch ($ageGroup) {
            case "0-5":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 0 AND 5";
                break;
            case "6-12":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 6 AND 12";
                break;
            case "13-17":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 13 AND 17";
                break;
            case "18-59":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 18 AND 59";
                break;
            case "60+":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) >= 60";
                break;
        }

        $where = $conditions ? "WHERE " . implode(" AND ", $conditions) : "";

        $stmt = $pdo->prepare("
            SELECT DISTINCT
                p.id AS patient_id,
                CONCAT(p.first_name,' ',p.middle_name,' ',p.last_name) AS patient_name,
                p.gender,
                TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) AS age,
                p.status,
                b.name AS barangay
            FROM patients_db p
            LEFT JOIN barangays b ON b.id = p.barangay_id
            LEFT JOIN consultations c ON c.patient_id = p.id
            $where
            ORDER BY b.name,p.last_name,p.first_name
        ");
        $stmt->execute($params);

        echo json_encode([
            "success" => true,
            "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)
        ]);
        exit;
    }

    /*
    ======================================
    PATIENTS WITH LAB REQUESTS
    ======================================
    */
    if ($action === "patientsWithLabRequests") {
        $conditions = [];
        $params = [];

        if ($barangay && $barangay !== "all") {
            $conditions[] = "p.barangay_id = :barangay";
            $params[':barangay'] = $barangay;
        }
        if ($gender && $gender !== "all") {
            $conditions[] = "p.gender = :gender";
            $params[':gender'] = $gender;
        }
        if ($patientStatus && $patientStatus !== "all") {
            $conditions[] = "p.status = :patientStatus";
            $params[':patientStatus'] = $patientStatus;
        }

        switch ($ageGroup) {
            case "0-5":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 0 AND 5";
                break;
            case "6-12":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 6 AND 12";
                break;
            case "13-17":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 13 AND 17";
                break;
            case "18-59":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 18 AND 59";
                break;
            case "60+":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) >= 60";
                break;
        }

        $where = $conditions ? "WHERE lr.id IS NOT NULL AND " . implode(" AND ", $conditions) : "WHERE lr.id IS NOT NULL";

        $stmt = $pdo->prepare("
            SELECT DISTINCT
                p.id AS patient_id,
                CONCAT(p.first_name,' ',p.middle_name,' ',p.last_name) AS patient_name,
                p.gender,
                TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) AS age,
                p.status,
                b.name AS barangay
            FROM patients_db p
            LEFT JOIN barangays b ON b.id = p.barangay_id
            LEFT JOIN lab_requests lr ON lr.patient_id = p.id
            $where
            ORDER BY b.name,p.last_name,p.first_name
        ");
        $stmt->execute($params);

        echo json_encode([
            "success" => true,
            "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)
        ]);
        exit;
    }

    /*
    ======================================
    PATIENTS WITH MEDICAL CERTIFICATES
    ======================================
    */
    if ($action === "patientsWithMedicalCertificates") {
        $conditions = [];
        $params = [];

        if ($barangay && $barangay !== "all") {
            $conditions[] = "p.barangay_id = :barangay";
            $params[':barangay'] = $barangay;
        }
        if ($gender && $gender !== "all") {
            $conditions[] = "p.gender = :gender";
            $params[':gender'] = $gender;
        }
        if ($patientStatus && $patientStatus !== "all") {
            $conditions[] = "p.status = :patientStatus";
            $params[':patientStatus'] = $patientStatus;
        }

        switch ($ageGroup) {
            case "0-5":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 0 AND 5";
                break;
            case "6-12":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 6 AND 12";
                break;
            case "13-17":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 13 AND 17";
                break;
            case "18-59":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) BETWEEN 18 AND 59";
                break;
            case "60+":
                $conditions[] = "TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) >= 60";
                break;
        }

        $where = $conditions ? "WHERE mc.id IS NOT NULL AND " . implode(" AND ", $conditions) : "WHERE mc.id IS NOT NULL";

        $stmt = $pdo->prepare("
            SELECT DISTINCT
                p.id AS patient_id,
                CONCAT(p.first_name,' ',p.middle_name,' ',p.last_name) AS patient_name,
                p.gender,
                TIMESTAMPDIFF(YEAR,p.date_of_birth,CURDATE()) AS age,
                p.status,
                b.name AS barangay
            FROM patients_db p
            LEFT JOIN barangays b ON b.id = p.barangay_id
            LEFT JOIN medical_certificates mc ON mc.patient_id = p.id
            $where
            ORDER BY b.name,p.last_name,p.first_name
        ");
        $stmt->execute($params);

        echo json_encode([
            "success" => true,
            "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)
        ]);
        exit;
    }

    /*
    ======================================
    DEFAULT DASHBOARD RESPONSE
    ======================================
    */
    // Counts
    $consultations = $pdo->query("SELECT COUNT(*) AS total FROM consultations")->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
    $labRequests = $pdo->query("SELECT COUNT(*) AS total FROM lab_requests")->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
    $certificates = $pdo->query("SELECT COUNT(*) AS total FROM medical_certificates")->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
    $referrals = $pdo->query("SELECT COUNT(*) AS total FROM consultations WHERE referral='Yes'")->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;

    echo json_encode([
        "success" => true,
        "data" => [
            "consultations" => (int)$consultations,
            "labRequests" => (int)$labRequests,
            "medicalCertificates" => (int)$certificates,
            "referrals" => (int)$referrals
        ]
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
