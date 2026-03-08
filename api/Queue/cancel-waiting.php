<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

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

try {
    error_log("📍 [cancel-waiting.php] Request received");

    require_once '../../config/db.php';

    if (!isset($pdo)) {
        throw new Exception('Database connection not initialized');
    }

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->beginTransaction();

    // Cancel ONLY waiting patients for TODAY
    $sql = "
        UPDATE patient_queue
        SET status = 'cancelled',
            cancelled_by = 'manual'
        WHERE DATE(queue_date) = CURDATE()
          AND status = 'waiting'
    ";

    error_log("📍 [cancel-waiting.php] Executing SQL: " . $sql);

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $affected = $stmt->rowCount();

    error_log("📍 [cancel-waiting.php] Cancelled $affected rows");

    $pdo->commit();

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'affected_rows' => $affected,
        'message' => 'All waiting patients cancelled successfully'
    ]);
} catch (PDOException $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log("❌ [cancel-waiting.php] PDOException: " . $e->getMessage());
    error_log("❌ [cancel-waiting.php] Error Code: " . $e->getCode());

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage(),
        'error' => $e->getMessage()
    ]);
} catch (Exception $e) {
    error_log("❌ [cancel-waiting.php] Exception: " . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage(),
        'error' => $e->getMessage()
    ]);
}
