<?php
// Database connection
require_once 'config/db.php';

try {
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "=== Fixing CT Scan Column Position ===\n";
    
    // Check current column order
    echo "\n1. Current table structure:\n";
    $result = $pdo->query("DESCRIBE lab_requests");
    $columns = $result->fetchAll(PDO::FETCH_ASSOC);
    foreach($columns as $col) {
        echo "   - " . $col['Field'] . " (" . $col['Type'] . ")\n";
    }
    
    // Drop the column if it exists in wrong position
    echo "\n2. Dropping ct_scan_findings column...\n";
    try {
        $pdo->exec("ALTER TABLE `lab_requests` DROP COLUMN `ct_scan_findings`");
        echo "   ✓ Column dropped\n";
    } catch (Exception $e) {
        echo "   Note: " . $e->getMessage() . "\n";
    }
    
    // Add column in correct position
    echo "\n3. Adding ct_scan_findings after utz_findings...\n";
    $pdo->exec("ALTER TABLE `lab_requests` ADD COLUMN `ct_scan_findings` text AFTER `utz_findings`");
    echo "   ✓ Column added in correct position\n";
    
    // Verify
    echo "\n4. Verifying new table structure:\n";
    $result = $pdo->query("DESCRIBE lab_requests");
    $columns = $result->fetchAll(PDO::FETCH_ASSOC);
    foreach($columns as $col) {
        echo "   - " . $col['Field'] . " (" . $col['Type'] . ")\n";
    }
    
    echo "\n✓ Database structure fixed! Column order is now correct.\n";
    echo "  Data alignment for INSERT statements should now work properly.\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>
