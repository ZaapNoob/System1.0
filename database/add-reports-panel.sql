-- Add Reports Panel to Database
-- Run this if you get an error about 'reports' panel not found

INSERT INTO panels (code, name) VALUES ('reports', 'Reports');

-- Verify it was added
SELECT * FROM panels WHERE code = 'reports';
