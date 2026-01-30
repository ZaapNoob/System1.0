<?php
header('Content-Type: application/json');
require_once '../../config/db.php';

try {
    $year = date('Y');

    $pdo->beginTransaction();

    // Lock sequence table
    $stmt = $pdo->prepare("
        SELECT seq
        FROM household_sequence
        WHERE year = ?
        FOR UPDATE
    ");
    $stmt->execute([$year]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        $newSeq = $row['seq'] + 1;
        $update = $pdo->prepare("
            UPDATE household_sequence
            SET seq = ?
            WHERE year = ?
        ");
        $update->execute([$newSeq, $year]);
    } else {
        $newSeq = 1;
        $insert = $pdo->prepare("
            INSERT INTO household_sequence (year, seq)
            VALUES (?, ?)
        ");
        $insert->execute([$year, $newSeq]);
    }

    $pdo->commit();

    $householdNo = $year . '-' . str_pad($newSeq, 5, '0', STR_PAD_LEFT);

    echo json_encode([
        'success' => true,
        'household_no' => $householdNo
    ]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
