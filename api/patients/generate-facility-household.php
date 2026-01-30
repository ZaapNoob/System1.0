<?php
header('Content-Type: application/json');
require_once '../../config/db.php';

try {
    $barangay_id = (int)($_GET['barangay_id'] ?? 0);
    if (!$barangay_id) {
        throw new Exception('Barangay ID required');
    }

    $pdo->beginTransaction();

    // Lock barangay row for update
    $stmt = $pdo->prepare("
        SELECT name, facility_household_seq
        FROM barangays
        WHERE id = ?
        FOR UPDATE
    ");
    $stmt->execute([$barangay_id]);
    $barangay = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$barangay) {
        throw new Exception('Barangay not found');
    }

    // Compute next sequence
    $newSeq = $barangay['facility_household_seq'] + 1;

    // Generate prefix from barangay name initials (take up to 2 letters)
    $words = preg_split('/\s+/', $barangay['name']);
    $prefix = '';
    foreach ($words as $w) {
        if (strlen($prefix) < 2) {
            $prefix .= strtoupper($w[0]);
        }
    }

    // Final code: RHU-PREFIX-00001
    $code = 'RHU-' . $prefix . '-' . str_pad($newSeq, 5, '0', STR_PAD_LEFT);

    // Update sequence in DB
    $update = $pdo->prepare("
        UPDATE barangays
        SET facility_household_seq = ?
        WHERE id = ?
    ");
    $update->execute([$newSeq, $barangay_id]);

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'facility_household_no' => $code
    ]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
