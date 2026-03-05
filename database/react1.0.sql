-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for react1.0
CREATE DATABASE IF NOT EXISTS `react1.0` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `react1.0`;

-- Dumping structure for table react1.0.barangays
CREATE TABLE IF NOT EXISTS `barangays` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `last_patient_seq` int unsigned NOT NULL DEFAULT '0',
  `is_special` tinyint(1) NOT NULL DEFAULT '0',
  `facility_household_seq` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_barangay_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table react1.0.barangays: ~43 rows (approximately)
DELETE FROM `barangays`;
INSERT INTO `barangays` (`id`, `name`, `last_patient_seq`, `is_special`, `facility_household_seq`) VALUES
	(1, 'Ariman', 28, 0, 18),
	(2, 'Bagacay', 5, 0, 14),
	(3, 'Balud Del Norte (Poblacion)', 5, 0, 19),
	(4, 'Balud Del Sur (Poblacion)', 14, 0, 20),
	(5, 'Benguet', 1, 0, 3),
	(6, 'Bentuco', 6, 0, 11),
	(7, 'Beriran', 2, 0, 5),
	(8, 'Buenavista', 0, 0, 0),
	(9, 'Bulacao', 1, 0, 3),
	(10, 'Cabigaan', 5, 0, 2),
	(11, 'Cabiguhan', 3, 0, 7),
	(12, 'Carriedo', 1, 0, 5),
	(13, 'Casili', 7, 0, 3),
	(14, 'Cogon', 1, 0, 2),
	(15, 'Cota Na Daco (Poblacion)', 0, 0, 1),
	(16, 'Dita', 1, 0, 1),
	(17, 'Jupi', 0, 0, 0),
	(18, 'Lapinig', 1, 0, 2),
	(19, 'Luna-Candol (Poblacion)', 3, 0, 2),
	(20, 'Manapao', 1, 0, 2),
	(21, 'Manook (Poblacion)', 0, 0, 0),
	(22, 'Naagtan', 0, 0, 0),
	(23, 'Nato', 0, 0, 0),
	(24, 'Nazareno', 0, 0, 0),
	(25, 'Ogao', 0, 0, 0),
	(26, 'Paco', 0, 0, 0),
	(27, 'Panganiban (Poblacion)', 0, 0, 0),
	(28, 'Paradijon (Poblacion)', 0, 0, 0),
	(29, 'Patag', 0, 0, 0),
	(30, 'Payawin', 0, 0, 3),
	(31, 'Pinontingan (Poblacion)', 0, 0, 0),
	(32, 'Rizal', 0, 0, 0),
	(33, 'San Ignacio', 0, 0, 0),
	(34, 'Sangat', 0, 0, 0),
	(35, 'Santa Ana', 0, 0, 0),
	(36, 'Tabi', 0, 0, 0),
	(37, 'Tagaytay', 2, 0, 7),
	(38, 'Tigkiw', 0, 0, 0),
	(39, 'Tiris', 0, 0, 0),
	(40, 'Togawe', 0, 0, 0),
	(41, 'Union', 0, 0, 1),
	(42, 'Villareal', 1, 0, 1),
	(43, 'Outside Gubat', 16, 1, 15);

-- Dumping structure for event react1.0.cancel_daily_queues
DELIMITER //
CREATE EVENT `cancel_daily_queues` ON SCHEDULE EVERY 1 DAY STARTS '2026-02-06 00:00:00' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    UPDATE patient_queue
    SET
        status = 'cancelled',
        cancelled_by = 'system'
    WHERE status = 'waiting'
      AND queue_date < CURDATE()
      AND cancelled_by IS NULL;
END//
DELIMITER ;

-- Dumping structure for table react1.0.consultations
CREATE TABLE IF NOT EXISTS `consultations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `queue_id` int NOT NULL,
  `patient_id` int NOT NULL,
  `doctor_id` int DEFAULT NULL,
  `referral` enum('Yes','No') DEFAULT NULL,
  `referred_to` varchar(255) DEFAULT NULL,
  `reason_for_referral` text,
  `referred_by` varchar(255) DEFAULT NULL,
  `purpose_visit` enum('General','Prenatal','Dental Care','Child Care','Child Nutrition','Injury','Adult Immunization','Family Planning','Postpartum','Tuberculosis','Child Immunization','Sick Children','Firecracker Injury','Mental Health') DEFAULT NULL,
  `nature_visit` enum('New Consultation','Follow-up Consultation','Problem Consultation (New Symptoms)') DEFAULT NULL,
  `visit_date` date DEFAULT NULL,
  `systolic_bp` int DEFAULT NULL,
  `diastolic_bp` int DEFAULT NULL,
  `temperature` decimal(4,1) DEFAULT NULL,
  `pulse_rate` int DEFAULT NULL,
  `respiratory_rate` int DEFAULT NULL,
  `oxygen_saturation` int DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `chief_complaint` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_consult_queue` (`queue_id`),
  KEY `fk_consult_patient` (`patient_id`),
  KEY `fk_consult_doctor` (`doctor_id`),
  CONSTRAINT `fk_consult_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients_db` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_consult_queue` FOREIGN KEY (`queue_id`) REFERENCES `patient_queue` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table react1.0.consultations: ~4 rows (approximately)
DELETE FROM `consultations`;
INSERT INTO `consultations` (`id`, `queue_id`, `patient_id`, `doctor_id`, `referral`, `referred_to`, `reason_for_referral`, `referred_by`, `purpose_visit`, `nature_visit`, `visit_date`, `systolic_bp`, `diastolic_bp`, `temperature`, `pulse_rate`, `respiratory_rate`, `oxygen_saturation`, `weight`, `height`, `chief_complaint`, `created_at`) VALUES
	(30, 242, 90, 12, NULL, NULL, NULL, NULL, 'General', 'New Consultation', '2026-03-03', 120, 80, 36.0, 90, 20, 90, 120.00, 80.00, 'HEADACHE', '2026-03-03 10:50:20'),
	(31, 245, 92, 20, NULL, NULL, NULL, NULL, 'Sick Children', 'New Consultation', '2026-03-03', 120, 90, 80.0, 90, 80, 70, 7.00, 8.00, 'KILOWATSHOUR', '2026-03-03 10:57:19'),
	(32, 246, 90, 12, NULL, NULL, NULL, NULL, 'Child Immunization', 'Problem Consultation (New Symptoms)', '2026-03-04', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-04 01:55:07'),
	(33, 247, 93, 20, NULL, NULL, NULL, NULL, 'Prenatal', 'Problem Consultation (New Symptoms)', '2026-03-04', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-04 15:29:05');

-- Dumping structure for table react1.0.doctor_patient_queue
CREATE TABLE IF NOT EXISTS `doctor_patient_queue` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `doctor_id` bigint unsigned NOT NULL,
  `queue_number` int NOT NULL,
  `queue_date` date NOT NULL,
  `status` enum('waiting','serving','done','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'waiting',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '0' COMMENT '1 = currently being seen by doctor',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_doctor_queue` (`doctor_id`,`queue_number`,`queue_date`),
  KEY `idx_patient` (`patient_id`),
  KEY `idx_doctor` (`doctor_id`),
  CONSTRAINT `fk_dpq_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_dpq_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients_db` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=134 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table react1.0.doctor_patient_queue: ~5 rows (approximately)
DELETE FROM `doctor_patient_queue`;
INSERT INTO `doctor_patient_queue` (`id`, `patient_id`, `doctor_id`, `queue_number`, `queue_date`, `status`, `created_at`, `is_active`) VALUES
	(129, 92, 12, 1, '2026-03-03', 'done', '2026-03-03 10:48:15', 0),
	(130, 90, 12, 2, '2026-03-03', 'done', '2026-03-03 10:51:08', 0),
	(131, 90, 12, 3, '2026-03-03', 'done', '2026-03-03 10:55:44', 0),
	(132, 92, 12, 4, '2026-03-03', 'done', '2026-03-03 10:55:55', 0),
	(133, 92, 12, 5, '2026-03-03', 'serving', '2026-03-03 10:57:30', 0);

-- Dumping structure for table react1.0.household_sequence
CREATE TABLE IF NOT EXISTS `household_sequence` (
  `year` int NOT NULL,
  `seq` int NOT NULL,
  PRIMARY KEY (`year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table react1.0.household_sequence: ~0 rows (approximately)
DELETE FROM `household_sequence`;
INSERT INTO `household_sequence` (`year`, `seq`) VALUES
	(2026, 128);

-- Dumping structure for table react1.0.lab_requests
CREATE TABLE IF NOT EXISTS `lab_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `request_no` varchar(50) NOT NULL,
  `patient_id` int NOT NULL,
  `doctor_id` bigint unsigned NOT NULL,
  `diagnosis` text,
  `xray_findings` text,
  `utz_findings` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `request_no` (`request_no`),
  KEY `patient_id` (`patient_id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `lab_requests_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients_db` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lab_requests_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table react1.0.lab_requests: ~0 rows (approximately)
DELETE FROM `lab_requests`;
INSERT INTO `lab_requests` (`id`, `request_no`, `patient_id`, `doctor_id`, `diagnosis`, `xray_findings`, `utz_findings`, `created_at`) VALUES
	(1, 'LR-2026-8856', 90, 12, 'DIAGNOSIS', 'XRAYY', 'ULTRASI', '2026-03-04 13:48:57'),
	(2, 'LR-2026-7925', 104, 12, 'RESULTS', NULL, NULL, '2026-03-04 14:03:45'),
	(3, 'LR-2026-2278', 90, 12, 'JILS', 'JULS', 'JALS', '2026-03-04 14:24:52'),
	(4, 'LR-2026-5071', 90, 12, 'DIAGNOSIS', 'XRAY', 'ULTRASOUNT', '2026-03-04 14:37:53'),
	(5, 'LR-2026-2488', 90, 12, 'JIJI', 'JIJI', 'IJI', '2026-03-04 14:41:35'),
	(6, 'LR-2026-8012', 90, 12, 'NASD', 'XRAYS', 'XRAYS', '2026-03-04 15:04:36'),
	(7, 'LR-2026-9543', 90, 12, 'JJK', NULL, NULL, '2026-03-04 15:33:28'),
	(8, 'LR-2026-7772', 90, 12, 'KILUA', NULL, NULL, '2026-03-04 15:45:32'),
	(9, 'LR-2026-8660', 90, 12, 'JILUS', 'XRAYS', 'ULTRA SOUNDS', '2026-03-04 15:48:45'),
	(10, 'LR-2026-6392', 90, 12, 'DIAGS', 'XRAYS', 'ULTRA', '2026-03-04 15:50:29'),
	(11, 'LR-2026-4339', 90, 12, 'HASD', 'ahdajs', 'adhasj', '2026-03-04 15:58:52'),
	(12, 'LR-2026-1980', 90, 12, 'JJJJ', NULL, NULL, '2026-03-04 16:01:58'),
	(13, 'LR-2026-6641', 90, 20, 'MARRY', 'FINDINGS', 'FINDINGS', '2026-03-04 16:07:13'),
	(14, 'LR-2026-2325', 90, 20, 'NOSIS', 'FINDINGS', 'FINDINGS', '2026-03-04 16:09:58'),
	(15, 'LR-2026-6593', 90, 20, 'jjj', NULL, NULL, '2026-03-04 16:14:55'),
	(16, 'LR-2026-6832', 90, 20, 'JJJO', NULL, NULL, '2026-03-04 16:15:22'),
	(17, 'LR-2026-6114', 90, 20, 'DJUA', NULL, NULL, '2026-03-04 16:15:45'),
	(18, 'LR-2026-4261', 90, 20, 'JSOAD', 'AJDia', 'askdak', '2026-03-04 16:16:05'),
	(19, 'LR-2026-4240', 90, 20, 'dada', NULL, NULL, '2026-03-04 16:16:29'),
	(20, 'LR-2026-5388', 90, 20, 'DIAGNOSIS', NULL, NULL, '2026-03-04 16:18:38'),
	(21, 'LR-2026-2821', 92, 20, '>', NULL, NULL, '2026-03-04 16:19:15'),
	(22, 'LR-2026-9091', 104, 12, 'SIGIBAM', 'NOT FOUND', 'NOTFOUND', '2026-03-05 01:05:50'),
	(23, 'LR-2026-7929', 92, 12, 'NISIS', NULL, NULL, '2026-03-05 01:06:57'),
	(24, 'LR-2026-7669', 92, 12, 'ddddd', NULL, NULL, '2026-03-05 01:09:06'),
	(25, 'LR-2026-4326', 104, 12, 'EVEN', 'IF', 'NOT', '2026-03-05 01:53:22');

-- Dumping structure for table react1.0.lab_request_tests
CREATE TABLE IF NOT EXISTS `lab_request_tests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lab_request_id` int NOT NULL,
  `category` varchar(100) NOT NULL,
  `test_name` varchar(100) NOT NULL,
  `other_value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lab_request_id` (`lab_request_id`),
  CONSTRAINT `lab_request_tests_ibfk_1` FOREIGN KEY (`lab_request_id`) REFERENCES `lab_requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=220 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table react1.0.lab_request_tests: ~0 rows (approximately)
DELETE FROM `lab_request_tests`;
INSERT INTO `lab_request_tests` (`id`, `lab_request_id`, `category`, `test_name`, `other_value`) VALUES
	(1, 1, 'Bacteriology', 'Others', 'BACTERIOLOGY'),
	(2, 1, 'Hematology', 'Others', 'HEMATOLOGY'),
	(3, 1, 'Cardiology', 'Others', 'CARDIOLOGY'),
	(4, 1, 'Chemistry', 'Others', 'CHEMISTRY'),
	(5, 1, 'Cardiology', 'ECG', NULL),
	(6, 1, 'Cardiology', '2D Echo', NULL),
	(7, 1, 'Chemistry', 'BUN', NULL),
	(8, 1, 'Chemistry', 'Crea', NULL),
	(9, 1, 'Chemistry', 'FBS', NULL),
	(10, 1, 'Chemistry', 'HbA1c', NULL),
	(11, 1, 'Chemistry', 'Lipid Profile', NULL),
	(12, 1, 'Chemistry', 'BUA', NULL),
	(13, 1, 'Chemistry', 'Na', NULL),
	(14, 1, 'Chemistry', 'K', NULL),
	(15, 1, 'Chemistry', 'Cl', NULL),
	(16, 1, 'Chemistry', 'AST/ALT', NULL),
	(17, 1, 'Bacteriology', 'AFB Stain', NULL),
	(18, 1, 'Bacteriology', 'Gen Expert', NULL),
	(19, 1, 'Hematology', 'CBC', NULL),
	(20, 1, 'Hematology', 'PC', NULL),
	(21, 1, 'Hematology', 'Blood Typing', NULL),
	(22, 1, 'Hematology', 'Fecalysis', NULL),
	(23, 1, 'Hematology', 'Urinalysis', NULL),
	(24, 1, 'Hematology', 'Covid 19 Test', NULL),
	(25, 2, 'Chemistry', 'BUN', NULL),
	(26, 2, 'Chemistry', 'Lipid Profile', NULL),
	(27, 3, 'Chemistry', 'Crea', NULL),
	(28, 3, 'Chemistry', 'BUN', NULL),
	(29, 3, 'Chemistry', 'FBS', NULL),
	(30, 3, 'Chemistry', 'Lipid Profile', NULL),
	(31, 3, 'Chemistry', 'HbA1c', NULL),
	(32, 3, 'Chemistry', 'BUA', NULL),
	(33, 3, 'Chemistry', 'Na', NULL),
	(34, 3, 'Chemistry', 'K', NULL),
	(35, 3, 'Chemistry', 'CI', NULL),
	(36, 3, 'Chemistry', 'AST/ALT', NULL),
	(37, 3, 'Chemistry', 'Others', NULL),
	(38, 3, 'Cardiology', '2D Echo', NULL),
	(39, 3, 'Cardiology', 'ECG', NULL),
	(40, 3, 'Cardiology', 'Others', 'TEST'),
	(41, 3, 'Bacteriology', 'Gen Expert', NULL),
	(42, 3, 'Bacteriology', 'AFB Stain', NULL),
	(43, 3, 'Bacteriology', 'Others', 'TEST'),
	(44, 3, 'Hematology', 'CBC', NULL),
	(45, 3, 'Hematology', 'PC', NULL),
	(46, 3, 'Hematology', 'Blood Typing', NULL),
	(47, 3, 'Hematology', 'Others', 'TEST'),
	(48, 3, 'Urinalysis & Others', 'Fecalysis', NULL),
	(49, 3, 'Urinalysis & Others', 'Urinalysis', NULL),
	(50, 3, 'Urinalysis & Others', 'Covid 19 Test', NULL),
	(51, 3, 'Urinalysis & Others', 'Others', 'TEST'),
	(52, 4, 'Chemistry', 'BUN', NULL),
	(53, 4, 'Chemistry', 'Crea', NULL),
	(54, 4, 'Chemistry', 'FBS', NULL),
	(55, 4, 'Chemistry', 'HbA1c', NULL),
	(56, 4, 'Chemistry', 'BUA', NULL),
	(57, 4, 'Chemistry', 'Na', NULL),
	(58, 4, 'Chemistry', 'Lipid Profile', NULL),
	(59, 4, 'Chemistry', 'K', NULL),
	(60, 4, 'Chemistry', 'CI', NULL),
	(61, 4, 'Chemistry', 'AST/ALT', NULL),
	(62, 4, 'Chemistry', 'Others', 'SPECTRE'),
	(63, 4, 'Cardiology', '2D Echo', NULL),
	(64, 4, 'Cardiology', 'ECG', NULL),
	(65, 4, 'Bacteriology', 'Gen Expert', NULL),
	(66, 4, 'Cardiology', 'Others', 'SPECTRE'),
	(67, 4, 'Bacteriology', 'AFB Stain', NULL),
	(68, 4, 'Bacteriology', 'Others', 'SPECTRE'),
	(69, 4, 'Hematology', 'CBC', NULL),
	(70, 4, 'Hematology', 'PC', NULL),
	(71, 4, 'Hematology', 'Blood Typing', NULL),
	(72, 4, 'Hematology', 'Others', 'SPECTRE'),
	(73, 4, 'Urinalysis & Others', 'Fecalysis', NULL),
	(74, 4, 'Urinalysis & Others', 'Urinalysis', NULL),
	(75, 4, 'Urinalysis & Others', 'Covid 19 Test', NULL),
	(76, 4, 'Urinalysis & Others', 'Others', 'SPECTRE'),
	(77, 5, 'Chemistry', 'BUN', NULL),
	(78, 5, 'Chemistry', 'Crea', NULL),
	(79, 5, 'Chemistry', 'FBS', NULL),
	(80, 5, 'Chemistry', 'Lipid Profile', NULL),
	(81, 5, 'Chemistry', 'HbA1c', NULL),
	(82, 5, 'Chemistry', 'BUA', NULL),
	(83, 5, 'Chemistry', 'Na', NULL),
	(84, 5, 'Chemistry', 'CI', NULL),
	(85, 5, 'Chemistry', 'K', NULL),
	(86, 5, 'Chemistry', 'AST/ALT', NULL),
	(87, 5, 'Chemistry', 'Others', 'SPEED UO'),
	(88, 5, 'Cardiology', 'ECG', NULL),
	(89, 5, 'Cardiology', '2D Echo', NULL),
	(90, 5, 'Cardiology', 'Others', 'SPEED UP'),
	(91, 5, 'Bacteriology', 'Gen Expert', NULL),
	(92, 5, 'Bacteriology', 'AFB Stain', NULL),
	(93, 5, 'Bacteriology', 'Others', 'speed up'),
	(94, 5, 'Hematology', 'CBC', NULL),
	(95, 5, 'Hematology', 'PC', NULL),
	(96, 5, 'Hematology', 'Blood Typing', NULL),
	(97, 5, 'Hematology', 'Others', 'speed uo'),
	(98, 5, 'Urinalysis & Others', 'Fecalysis', NULL),
	(99, 5, 'Urinalysis & Others', 'Urinalysis', NULL),
	(100, 5, 'Urinalysis & Others', 'Covid 19 Test', NULL),
	(101, 5, 'Urinalysis & Others', 'Others', 'speed up'),
	(102, 6, 'Chemistry', 'BUN', NULL),
	(103, 6, 'Chemistry', 'Crea', NULL),
	(104, 6, 'Chemistry', 'FBS', NULL),
	(105, 6, 'Chemistry', 'HbA1c', NULL),
	(106, 6, 'Chemistry', 'Lipid Profile', NULL),
	(107, 6, 'Chemistry', 'BUA', NULL),
	(108, 6, 'Chemistry', 'Na', NULL),
	(109, 6, 'Chemistry', 'K', NULL),
	(110, 6, 'Chemistry', 'CI', NULL),
	(111, 6, 'Chemistry', 'AST/ALT', NULL),
	(112, 6, 'Chemistry', 'Others', 'SPECTRE'),
	(113, 6, 'Cardiology', '2D Echo', NULL),
	(114, 6, 'Cardiology', 'ECG', NULL),
	(115, 6, 'Cardiology', 'Others', 'AFFKAS'),
	(116, 6, 'Bacteriology', 'Gen Expert', NULL),
	(117, 6, 'Bacteriology', 'AFB Stain', NULL),
	(118, 6, 'Bacteriology', 'Others', 'OTHERS'),
	(119, 6, 'Hematology', 'CBC', NULL),
	(120, 6, 'Hematology', 'PC', NULL),
	(121, 6, 'Hematology', 'Blood Typing', NULL),
	(122, 6, 'Hematology', 'Others', 'SPECIFY'),
	(123, 6, 'Urinalysis & Others', 'Fecalysis', NULL),
	(124, 6, 'Urinalysis & Others', 'Urinalysis', NULL),
	(125, 6, 'Urinalysis & Others', 'Covid 19 Test', NULL),
	(126, 6, 'Urinalysis & Others', 'Others', 'SIL'),
	(127, 7, 'Chemistry', 'BUN', NULL),
	(128, 7, 'Cardiology', '2D Echo', NULL),
	(129, 7, 'Bacteriology', 'Gen Expert', NULL),
	(130, 7, 'Hematology', 'CBC', NULL),
	(131, 7, 'Urinalysis & Others', 'Fecalysis', NULL),
	(132, 8, 'Chemistry', 'BUN', NULL),
	(133, 8, 'Cardiology', '2D Echo', NULL),
	(134, 8, 'Bacteriology', 'Gen Expert', NULL),
	(135, 8, 'Hematology', 'CBC', NULL),
	(136, 8, 'Urinalysis & Others', 'Fecalysis', NULL),
	(137, 9, 'Chemistry', 'BUA', NULL),
	(138, 9, 'Cardiology', '2D Echo', NULL),
	(139, 9, 'Bacteriology', 'Gen Expert', NULL),
	(140, 9, 'Hematology', 'CBC', NULL),
	(141, 10, 'Chemistry', 'BUN', NULL),
	(142, 10, 'Cardiology', '2D Echo', NULL),
	(143, 10, 'Bacteriology', 'Gen Expert', NULL),
	(144, 10, 'Hematology', 'CBC', NULL),
	(145, 10, 'Urinalysis & Others', 'Fecalysis', NULL),
	(146, 11, 'Chemistry', 'BUN', NULL),
	(147, 11, 'Chemistry', 'BUA', NULL),
	(148, 11, 'Chemistry', 'Others', NULL),
	(149, 11, 'Cardiology', '2D Echo', NULL),
	(150, 11, 'Bacteriology', 'Gen Expert', NULL),
	(151, 11, 'Hematology', 'CBC', NULL),
	(152, 11, 'Urinalysis & Others', 'Fecalysis', NULL),
	(153, 12, 'Chemistry', 'BUN', NULL),
	(154, 12, 'Chemistry', 'Others', NULL),
	(155, 12, 'Chemistry', 'BUA', NULL),
	(156, 12, 'Cardiology', '2D Echo', NULL),
	(157, 12, 'Bacteriology', 'Gen Expert', NULL),
	(158, 12, 'Hematology', 'CBC', NULL),
	(159, 12, 'Urinalysis & Others', 'Fecalysis', NULL),
	(160, 13, 'Chemistry', 'BUN', NULL),
	(161, 13, 'Chemistry', 'Na', NULL),
	(162, 13, 'Cardiology', 'ECG', NULL),
	(163, 13, 'Bacteriology', 'AFB Stain', NULL),
	(164, 13, 'Bacteriology', 'Gen Expert', NULL),
	(165, 13, 'Hematology', 'CBC', NULL),
	(166, 13, 'Urinalysis & Others', 'Fecalysis', NULL),
	(167, 14, 'Chemistry', 'Na', NULL),
	(168, 14, 'Cardiology', 'ECG', NULL),
	(169, 14, 'Bacteriology', 'AFB Stain', NULL),
	(170, 14, 'Hematology', 'PC', NULL),
	(171, 14, 'Hematology', 'CBC', NULL),
	(172, 14, 'Urinalysis & Others', 'Urinalysis', NULL),
	(173, 15, 'Chemistry', 'BUA', NULL),
	(174, 16, 'Chemistry', 'BUN', NULL),
	(175, 17, 'Chemistry', 'BUN', NULL),
	(176, 17, 'Cardiology', '2D Echo', NULL),
	(177, 17, 'Bacteriology', 'Gen Expert', NULL),
	(178, 18, 'Chemistry', 'BUN', NULL),
	(179, 18, 'Chemistry', 'BUA', NULL),
	(180, 18, 'Chemistry', 'Na', NULL),
	(181, 18, 'Cardiology', '2D Echo', NULL),
	(182, 18, 'Bacteriology', 'Gen Expert', NULL),
	(183, 18, 'Hematology', 'CBC', NULL),
	(184, 18, 'Urinalysis & Others', 'Fecalysis', NULL),
	(185, 19, 'Chemistry', 'BUA', NULL),
	(186, 20, 'Chemistry', 'BUN', NULL),
	(187, 21, 'Chemistry', 'BUN', NULL),
	(188, 22, 'Chemistry', 'BUN', NULL),
	(189, 22, 'Chemistry', 'BUA', NULL),
	(190, 22, 'Chemistry', 'Others', 'CHEMISTRY TEST'),
	(191, 22, 'Chemistry', 'Crea', NULL),
	(192, 22, 'Chemistry', 'Na', NULL),
	(193, 22, 'Chemistry', 'FBS', NULL),
	(194, 22, 'Chemistry', 'K', NULL),
	(195, 22, 'Chemistry', 'Lipid Profile', NULL),
	(196, 22, 'Chemistry', 'CI', NULL),
	(197, 22, 'Chemistry', 'HbA1c', NULL),
	(198, 22, 'Chemistry', 'AST/ALT', NULL),
	(199, 22, 'Cardiology', '2D Echo', NULL),
	(200, 22, 'Cardiology', 'ECG', NULL),
	(201, 22, 'Cardiology', 'Others', 'CARDIOLOGY TEST'),
	(202, 22, 'Bacteriology', 'Gen Expert', NULL),
	(203, 22, 'Bacteriology', 'AFB Stain', NULL),
	(204, 22, 'Bacteriology', 'Others', 'BACTERIOLOGY TEST'),
	(205, 22, 'Hematology', 'CBC', NULL),
	(206, 22, 'Hematology', 'PC', NULL),
	(207, 22, 'Hematology', 'Blood Typing', NULL),
	(208, 22, 'Hematology', 'Others', 'HEMATOLOGY TEST'),
	(209, 22, 'Urinalysis & Others', 'Fecalysis', NULL),
	(210, 22, 'Urinalysis & Others', 'Urinalysis', NULL),
	(211, 22, 'Urinalysis & Others', 'Covid 19 Test', NULL),
	(212, 22, 'Urinalysis & Others', 'Others', 'URINALYSIS TEST'),
	(213, 23, 'Urinalysis & Others', 'Fecalysis', NULL),
	(214, 24, 'Chemistry', 'Crea', NULL),
	(215, 25, 'Chemistry', 'Others', 'OTHERS'),
	(216, 25, 'Cardiology', 'Others', 'CAN'),
	(217, 25, 'Bacteriology', 'Others', 'NOT'),
	(218, 25, 'Hematology', 'Others', 'ALWAYS'),
	(219, 25, 'Urinalysis & Others', 'Others', 'DONE');

-- Dumping structure for table react1.0.medical_certificates
CREATE TABLE IF NOT EXISTS `medical_certificates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `certificate_no` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `patient_id` int NOT NULL,
  `doctor_id` bigint unsigned NOT NULL,
  `impression` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `issued_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `certificate_no` (`certificate_no`),
  KEY `patient_id` (`patient_id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `medical_certificates_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients_db` (`id`) ON DELETE CASCADE,
  CONSTRAINT `medical_certificates_ibfk_3` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table react1.0.medical_certificates: ~15 rows (approximately)
DELETE FROM `medical_certificates`;
INSERT INTO `medical_certificates` (`id`, `certificate_no`, `patient_id`, `doctor_id`, `impression`, `remarks`, `issued_at`) VALUES
	(10, 'MC-2026-6221', 92, 12, 'IMPRESSIONIST', 'REMARKS', '2026-03-03 18:53:38'),
	(11, 'MC-2026-4858', 92, 12, 'IMPRESSIONISM', 'REMARKABLE', '2026-03-03 18:54:07'),
	(12, 'MC-2026-9012', 92, 12, 'NOSAN', 'ESON', '2026-03-03 18:56:23'),
	(13, 'MC-2026-6582', 92, 12, 'KILOWATS', 'HOURS', '2026-03-03 18:58:00'),
	(14, 'MC-2026-3068', 90, 12, 'IMORAL', 'ROMAL', '2026-03-04 09:02:47'),
	(15, 'MC-2026-4180', 92, 12, 'CLINICAL', 'ADDITIONAL', '2026-03-04 09:04:16'),
	(16, 'MC-2026-6809', 92, 12, 'CLINICALS', 'ADDITIONALS', '2026-03-04 09:08:09'),
	(17, 'MC-2026-3064', 102, 12, '.............', '............', '2026-03-04 09:13:10'),
	(18, 'MC-2026-3326', 98, 12, '..............', '............', '2026-03-04 09:14:13'),
	(19, 'MC-2026-2572', 104, 12, '...........', '...........', '2026-03-04 09:20:14'),
	(20, 'MC-2026-5398', 90, 12, '............', '...........', '2026-03-04 09:20:41'),
	(21, 'MC-2026-3275', 71, 12, '...........', '...........', '2026-03-04 09:21:22'),
	(22, 'MC-2026-4020', 92, 12, '...............', '..............', '2026-03-04 09:59:53'),
	(23, 'MC-2026-3831', 104, 20, '..............', '............', '2026-03-04 10:01:51'),
	(24, 'MC-2026-1688', 104, 20, '..........', '..........', '2026-03-04 10:10:02'),
	(25, 'MC-2026-2597', 71, 20, '...........', '...........', '2026-03-04 10:12:15'),
	(26, 'MC-2026-1710', 104, 20, '...........', '............', '2026-03-04 10:18:42'),
	(27, 'MC-2026-7310', 90, 12, '>>', '>>', '2026-03-04 23:30:57'),
	(28, 'MC-2026-5837', 90, 12, '>>>>', '>>>', '2026-03-04 23:32:20'),
	(29, 'MC-2026-8870', 90, 12, 'ww', 'ww', '2026-03-04 23:34:35'),
	(30, 'MC-2026-7624', 92, 12, 'ddd', 'ddd', '2026-03-04 23:34:51'),
	(31, 'MC-2026-3404', 90, 12, 'kkk', 'kkk', '2026-03-04 23:39:21');

-- Dumping structure for table react1.0.panels
CREATE TABLE IF NOT EXISTS `panels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table react1.0.panels: ~4 rows (approximately)
DELETE FROM `panels`;
INSERT INTO `panels` (`id`, `code`, `name`) VALUES
	(1, 'patient', 'Patient'),
	(2, 'queuegen', 'Queue Generator'),
	(3, 'medical', 'Medical'),
	(4, 'laboratory', 'Laboratory');

-- Dumping structure for table react1.0.patients_db
CREATE TABLE IF NOT EXISTS `patients_db` (
  `id` int NOT NULL AUTO_INCREMENT,
  `barangay_id` int NOT NULL,
  `purok_id` int DEFAULT NULL,
  `patient_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `middle_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `suffix` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date_of_birth` date NOT NULL,
  `birthplace` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `age` int DEFAULT NULL,
  `gender` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `marital_status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `blood_type` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mother_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `spouse_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contact_number` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `household_no` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `facility_household_no` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `education_level` enum('No Formal Education','Elementary','High School','Vocational','College','Post Graduate','Unknown') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Unknown',
  `employment_status` enum('Employed','Unemployed','Retired','Others') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `family_member_type` enum('Father','Mother','Daughter','Son','Others') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dswd_nhts` enum('Yes','No') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'No',
  `member_4ps` enum('Yes','No') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'No',
  `pcb_member` enum('Yes','No') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'No',
  `philhealth_member` enum('Yes','No') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'No',
  `philhealth_status_type` enum('Member','Dependent') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `philhealth_no` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `philhealth_category` enum('None','FE - Private','FE - Government','DIRECT CONTRIBUTOR - PROFESSIONAL PRACTITIONER','DIRECT CONTRIBUTOR - SELF-EARNING INDIVIDUAL - SOLE PROPRIETOR','FE - ENTERPRISE OWNER','FE - FAMILY DRIVER','FE - GOVT - CASUAL','FE - GOVT - CONTRACT/PROJECT BASED','FE - GOVT - PERMANENT REGULAR','FE - HOUSEHOLD HELP/KASAMBAHAY','FE - PRIVATE - CASUAL','FE - PRIVATE - CONTRACT/PROJECT BASED','FE - PRIVATE - PERMANENT REGULAR','IE - CITIZEN OF OTHER COUNTRIES WORKING/RESIDING/STUDYING IN THE PHILIPPINES','IE - FILIPINO WITH DUAL CITIZENSHIP','IE - INFORMAL SECTOR','IE - MIGRANT WORKER - LAND BASED','IE - MIGRANT WORKER - SEA BASED','IE - NATURALIZED FILIPINO CITIZEN','IE - ORGANIZED GROUP','IE - SELF EARNING INDIVIDUAL','INDIGENT - NHTS-PR','INDIRECT CONTRIBUTOR - 4PS/MCCT','INDIRECT CONTRIBUTOR - BANGSAMORO/NORMALIZATION','INDIRECT CONTRIBUTOR - FINANCIALLY INCAPABLE','INDIRECT CONTRIBUTOR - KIA/KIPO','INDIRECT CONTRIBUTOR - LISTAHANAN','INDIRECT CONTRIBUTOR - PAMANA','INDIRECT CONTRIBUTOR - PERSON WITH DISABILITY','INDIRECT CONTRIBUTOR - PRIVATE-SPONSORED','INDIRECT CONTRIBUTOR - SOLO PARENT','LIFETIME MEMBER - RETIREE/PENSIONER','LIFETIME MEMBER - WITH 120 MONTHS CONTRIBUTION AND HAS REACHED RETIREMENT AGE','SENIOR CITIZEN','SPONSORED - LGU','SPONSORED - NGA','SPONSORED - OTHERS','SPONSORED - POS - FINANCIALLY INCAPABLE') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'None',
  `profile_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('active','inactive','deceased') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_household_move_at` datetime DEFAULT NULL,
  `region` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `province` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `city_municipality` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `barangay_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `street` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_patient_code` (`patient_code`),
  UNIQUE KEY `uq_barangay_patient` (`barangay_id`,`patient_code`),
  KEY `idx_identity` (`first_name`,`last_name`,`date_of_birth`,`gender`),
  KEY `fk_barangay_id` (`barangay_id`),
  KEY `fk_purok_id` (`purok_id`),
  CONSTRAINT `fk_patient_barangay` FOREIGN KEY (`barangay_id`) REFERENCES `barangays` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_patient_purok` FOREIGN KEY (`purok_id`) REFERENCES `puroks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table react1.0.patients_db: ~94 rows (approximately)
DELETE FROM `patients_db`;
INSERT INTO `patients_db` (`id`, `barangay_id`, `purok_id`, `patient_code`, `first_name`, `middle_name`, `last_name`, `suffix`, `date_of_birth`, `birthplace`, `age`, `gender`, `marital_status`, `blood_type`, `mother_name`, `spouse_name`, `contact_number`, `household_no`, `facility_household_no`, `education_level`, `employment_status`, `family_member_type`, `dswd_nhts`, `member_4ps`, `pcb_member`, `philhealth_member`, `philhealth_status_type`, `philhealth_no`, `philhealth_category`, `profile_image`, `status`, `created_at`, `last_household_move_at`, `region`, `province`, `city_municipality`, `barangay_name`, `street`) VALUES
	(1, 3, 1, 'balud_del_norte_(poblacion)_001', 'John', 'E', 'Doe', 'Jr', '2002-02-22', 'Manila', 23, 'Male', 'Single', 'A+', 'Joel', NULL, '09125517311', NULL, '100', 'No Formal Education', 'Employed', 'Daughter', 'No', 'No', 'No', 'No', NULL, NULL, 'None', NULL, 'active', '2026-01-28 01:27:14', NULL, NULL, NULL, NULL, NULL, NULL),
	(2, 4, 2, 'balud_del_sur_(poblacion)_001', 'John', 'S', 'Sie', 'III', '2002-02-22', 'Manila', 23, 'Male', 'Married', 'AB-', 'Johse', NULL, '091273124', NULL, '10', 'No Formal Education', 'Others', 'Mother', 'Yes', 'Yes', 'No', 'Yes', NULL, NULL, 'None', NULL, 'active', '2026-01-28 01:42:51', NULL, NULL, NULL, NULL, NULL, NULL),
	(3, 3, 1, 'balud_del_norte_(poblacion)_002', 'john', 'e', 'Jie', '', '1999-11-11', 'Manila', 26, 'Male', 'Separated', 'B-', 'Jul', NULL, '0128391213332', NULL, '10', 'Vocational', 'Retired', 'Son', 'Yes', 'Yes', 'No', 'Yes', NULL, NULL, 'None', NULL, 'active', '2026-01-28 01:45:14', NULL, NULL, NULL, NULL, NULL, NULL),
	(4, 3, 1, 'balud_del_norte_(poblacion)_003', 'john', 'h', 'Nie', '', '1999-11-11', 'Manila', 26, 'Male', 'Single', 'A+', 'Jouek', NULL, '0128391213332', NULL, '10', 'High School', 'Employed', 'Daughter', 'No', 'No', 'No', 'No', NULL, NULL, 'None', NULL, 'active', '2026-01-28 01:47:58', NULL, NULL, NULL, NULL, NULL, NULL),
	(5, 2, 3, 'bagacay_001', 'John', 'E', 'Fie', 'Jr', '1999-11-11', 'Manila', 26, 'Male', 'Single', 'A+', 'Kiel', NULL, '0912312321312', NULL, 'N/A', 'No Formal Education', 'Others', 'Mother', 'No', 'No', 'No', 'No', NULL, NULL, 'None', NULL, 'active', '2026-01-28 02:45:37', NULL, NULL, NULL, NULL, NULL, NULL),
	(6, 14, 4, 'cogon_001', 'Kersten', 'Flor', 'Labastida', '', '2002-04-10', 'Home', 23, 'Male', 'Separated', '', 'Narita F. Labastida', NULL, '', NULL, '', 'College', 'Unemployed', 'Son', 'No', 'No', 'No', 'No', NULL, NULL, 'None', NULL, 'active', '2026-01-28 03:16:20', NULL, NULL, NULL, NULL, NULL, NULL),
	(7, 10, NULL, 'cabigaan_001', 'John', 'e', 'wei', 'Jr', '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, 'None', NULL, 'active', '2026-01-28 03:31:01', NULL, NULL, NULL, NULL, NULL, NULL),
	(8, 5, NULL, 'benguet_001', 'john', 'e', 'Hie', 'Sr', '2002-02-22', 'Basud Sorsogon City', 23, 'Male', 'Single', 'A+', 'Es', NULL, '0928123', NULL, '222', 'No Formal Education', 'Employed', 'Mother', 'No', 'Yes', 'No', 'Yes', 'Member', '091263812', 'None', NULL, 'active', '2026-01-28 03:50:13', NULL, NULL, NULL, NULL, NULL, NULL),
	(9, 10, NULL, 'cabigaan_002', 'johan', 'E', 'Iee', 'Jr', '2001-02-22', 'JOoa', 24, 'Male', 'Single', 'A-', 'kiells', NULL, '0912312321312', '91', '09', 'College', 'Unemployed', 'Father', 'Yes', 'Yes', 'No', 'Yes', 'Member', '981231', 'IE - CITIZEN OF OTHER COUNTRIES WORKING/RESIDING/STUDYING IN THE PHILIPPINES', NULL, 'active', '2026-01-28 04:02:41', NULL, NULL, NULL, NULL, NULL, NULL),
	(10, 13, NULL, 'casili_001', 'john', 'd', 'Gie', 'Sr', '2002-02-22', 'Manila', 23, 'Male', 'Single', 'B+', 'Ia', NULL, 'no', '21', '100', 'Elementary', 'Unemployed', 'Mother', 'Yes', 'Yes', 'No', 'Yes', 'Member', '09123123', 'DIRECT CONTRIBUTOR - PROFESSIONAL PRACTITIONER', NULL, 'active', '2026-01-28 05:21:32', NULL, NULL, NULL, NULL, NULL, NULL),
	(11, 7, 6, 'beriran_001', 'jose', 'S', 'Marichan', 'III', '2002-02-22', 'Maria', 23, 'Male', 'Single', 'O+', 'SHA', NULL, '12', '172', '671', 'No Formal Education', 'Unemployed', 'Father', 'Yes', 'Yes', 'No', 'Yes', 'Dependent', '91281', 'IE - INFORMAL SECTOR', NULL, 'active', '2026-01-28 05:23:31', NULL, NULL, NULL, NULL, NULL, NULL),
	(12, 11, NULL, 'cabiguhan_001', 'john', 's', 'Hie', 'Sr', '2002-02-22', 'Manila', 23, 'Male', 'Married', 'B+', 'Huasd', NULL, '09125517311', '123', '12', 'College', 'Unemployed', 'Father', 'No', 'No', 'No', 'Yes', 'Dependent', '12831', 'IE - INFORMAL SECTOR', NULL, 'active', '2026-01-28 05:34:47', NULL, NULL, NULL, NULL, NULL, NULL),
	(13, 19, 7, 'luna-candol_(poblacion)_001', 'Rafael', 'E', 'Escanilla', 'Sr', '2002-02-22', 'Manila', 23, 'Male', 'Single', 'A-', 'Daisy Escanilla', NULL, '091234567891', '100', 'DOH', 'College', 'Unemployed', 'Son', 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-28 06:04:08', NULL, NULL, NULL, NULL, NULL, NULL),
	(14, 10, NULL, 'cabigaan_003', 'James', 'e', 'Tin', 'Sr', '2019-02-22', 'Manila', 6, 'Male', 'Single', 'B+', NULL, NULL, '09876912456', '10', 'DOH 01', 'High School', 'Unemployed', 'Son', 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-28 06:22:40', NULL, NULL, NULL, NULL, NULL, NULL),
	(15, 3, 1, 'balud_del_norte_(poblacion)_004', 'Dela`', NULL, 'Cruz', 'III', '2001-02-22', 'Basud Sorsogon City', 24, 'Male', 'Single', 'O-', 'Dela Cruz', NULL, '928132133123', '01', 'BALU-HH-00002', 'No Formal Education', 'Employed', 'Father', 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-28 06:51:01', NULL, NULL, NULL, NULL, NULL, NULL),
	(16, 4, 2, 'balud_del_sur_(poblacion)_002', 'john', 'E', 'Hie', 'Jr', '2002-02-22', 'Manila', 23, 'Male', 'Single', 'A-', 'John Shiw', NULL, '09123', '10', 'BALU-HH-00002', 'No Formal Education', 'Employed', 'Daughter', 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-28 07:11:34', NULL, NULL, NULL, NULL, NULL, NULL),
	(17, 4, 2, 'balud_del_sur_(poblacion)_003', 'john', 's', 'Nie', 'II', '1999-11-11', 'Manila', 26, 'Male', 'Single', 'A-', 'Jouek', NULL, '09123', '11', 'BALU-HH-00003', 'No Formal Education', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-28 07:13:19', NULL, NULL, NULL, NULL, NULL, NULL),
	(18, 2, NULL, 'bagacay_002', 'John', 's', 'Mie', 'II', '1999-11-11', NULL, 26, 'Male', 'Single', NULL, NULL, NULL, NULL, '10', 'BAGA-HH-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-28 07:13:54', NULL, NULL, NULL, NULL, NULL, NULL),
	(19, 4, 2, 'balud_del_sur_(poblacion)_004', 'John', NULL, 'Vie', 'Sr', '1999-11-11', 'manila', 26, 'Male', 'Single', 'A-', 'Escanilla', NULL, '1232131233', '11', 'BALU-HH-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-28 07:26:37', NULL, NULL, NULL, NULL, NULL, NULL),
	(20, 4, NULL, 'balud_del_sur_(poblacion)_005', 'john', 'w', 'Gie', 'Sr', '1992-02-22', 'Mania', 33, 'Male', 'Single', NULL, NULL, NULL, NULL, '90', 'RHUBD-HH-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-28 07:35:00', NULL, NULL, NULL, NULL, NULL, NULL),
	(21, 4, NULL, 'balud_del_sur_(poblacion)_006', 'jose', 'Ge', 'Gie', 'Jr', '1888-02-22', NULL, 137, 'Male', 'Single', NULL, NULL, NULL, NULL, '19', 'RHU-BD-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-28 07:37:03', NULL, NULL, NULL, NULL, NULL, NULL),
	(22, 4, NULL, 'balud_del_sur_(poblacion)_007', 'jo', 'sd', 'cie', 'Sr', '1888-11-11', NULL, 137, 'Male', 'Single', NULL, NULL, NULL, NULL, '19', 'RHU-BD-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-28 07:38:15', NULL, NULL, NULL, NULL, NULL, NULL),
	(23, 4, NULL, 'balud_del_sur_(poblacion)_008', 'john', 's', 'Cie', 'II', '1999-02-22', NULL, 26, 'Male', 'Single', NULL, NULL, NULL, NULL, '20', 'RHU-BD-00007', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-28 07:40:39', NULL, NULL, NULL, NULL, NULL, NULL),
	(24, 4, NULL, 'balud_del_sur_(poblacion)_009', 'joh', 's', 'Viea', 'Jr', '1888-11-11', NULL, 137, 'Male', 'Single', NULL, NULL, NULL, NULL, '20', 'RHU-BD-00007', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-28 07:41:49', NULL, NULL, NULL, NULL, NULL, NULL),
	(25, 6, NULL, 'bentuco_001', 'Juan', 'Escandor', 'Escarda', NULL, '2002-02-22', 'Manila', 23, 'Male', 'Single', 'A+', NULL, NULL, NULL, '128', 'RHU-B-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-29 05:34:15', NULL, NULL, NULL, NULL, NULL, NULL),
	(26, 6, NULL, 'bentuco_002', 'Maria', 'Escandor', 'Escarda', NULL, '1999-11-11', NULL, 26, 'Female', NULL, NULL, NULL, NULL, NULL, '128', 'RHU-B-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-29 05:36:04', NULL, NULL, NULL, NULL, NULL, NULL),
	(27, 6, NULL, 'bentuco_003', 'Carlo', 'E', 'Escandor', NULL, '1999-11-11', NULL, 26, 'Male', 'Single', NULL, NULL, NULL, NULL, '128', 'RHU-B-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-29 05:43:55', NULL, NULL, NULL, NULL, NULL, NULL),
	(28, 4, 2, 'balud_del_sur_(poblacion)_010', 'cyrus', 'HIlda', 'Jean', 'Jr', '2002-02-22', NULL, 23, 'Female', 'Single', 'B+', NULL, NULL, NULL, '190', 'RHU-BD-00008', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-29 05:45:11', NULL, NULL, NULL, NULL, NULL, NULL),
	(29, 4, NULL, 'balud_del_sur_(poblacion)_011', 'John', 's', 'Hie', NULL, '2025-02-22', NULL, 0, 'Female', 'Married', NULL, NULL, NULL, NULL, '20', 'RHU-BD-00007', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-29 06:19:34', NULL, NULL, NULL, NULL, NULL, NULL),
	(30, 1, 11, 'ariman_001', 'Jose', 'Escandors', 'Escopete', 'Jr', '1999-11-11', 'Manila', 26, 'Male', 'Single', 'A+', 'Carla Escandor', NULL, '09876912456', '128', 'RHU-A-00001', 'High School', 'Employed', 'Son', 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-29 06:37:32', NULL, NULL, NULL, NULL, NULL, NULL),
	(31, 1, 11, 'ariman_002', 'John', 'Escandors', 'Escasinas', NULL, '2009-11-11', 'Manila', 16, 'Female', 'Single', 'A+', 'Carla Escandor', NULL, '091234567891', '128', 'RHU-A-00001', 'High School', 'Unemployed', 'Mother', 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-29 06:39:39', NULL, NULL, NULL, NULL, NULL, NULL),
	(32, 1, NULL, 'ariman_003', 'Dea', 'd', 'Escandor', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00001', 'RHU-A-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-29 07:33:40', NULL, NULL, NULL, NULL, NULL, NULL),
	(33, 1, 11, 'ariman_004', 'John', 'S', 'Die', NULL, '2002-02-22', 'Manila', 23, 'Male', 'Single', 'B+', 'Miriam Detablan Ditan', NULL, '091234567891', '2026-00002', 'RHU-A-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-29 08:04:01', NULL, NULL, NULL, NULL, NULL, NULL),
	(34, 1, NULL, 'ariman_005', 'Joels', 'D', 'E', NULL, '1999-11-11', NULL, 26, 'Female', NULL, NULL, NULL, NULL, NULL, '2026-00002', 'RHU-A-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-29 08:27:13', NULL, NULL, NULL, NULL, NULL, NULL),
	(35, 1, NULL, 'ariman_006', 'JP', NULL, 'Dad', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '128', 'RHU-A-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-30 05:40:19', NULL, NULL, NULL, NULL, NULL, NULL),
	(36, 1, NULL, 'ariman_007', 'John', 'q', 'ww', NULL, '2019-11-11', NULL, 6, 'Male', 'Single', NULL, NULL, NULL, NULL, '128', 'RHU-A-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-30 05:41:24', NULL, NULL, NULL, NULL, NULL, NULL),
	(37, 1, NULL, 'ariman_008', 'jo', 's', 'JP', NULL, '1928-02-22', NULL, 97, 'Male', 'Single', NULL, NULL, NULL, NULL, '128', 'RHU-A-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-30 05:49:08', NULL, NULL, NULL, NULL, NULL, NULL),
	(38, 6, NULL, 'bentuco_004', 'joe', 'we', 'dad', NULL, '2009-02-22', NULL, 16, 'Female', 'Married', NULL, NULL, NULL, NULL, '2026-00011', 'RHU-B-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-30 05:57:53', NULL, NULL, NULL, NULL, NULL, NULL),
	(39, 42, NULL, 'villareal_001', 'J', 'w', 'w', NULL, '1929-11-11', NULL, 96, 'Female', NULL, NULL, NULL, NULL, NULL, '2026-00012', 'RHU-V-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-30 05:59:50', NULL, NULL, NULL, NULL, NULL, NULL),
	(40, 4, NULL, 'balud_del_sur_(poblacion)_012', 'j', 'jasd', 'd', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00013', 'RHU-BD-00009', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-30 06:01:46', NULL, NULL, NULL, NULL, NULL, NULL),
	(41, 1, NULL, 'ariman_009', 'asdas', 'adsasd', 'asdsa', NULL, '1999-11-11', NULL, 26, 'Male', 'Single', NULL, NULL, NULL, NULL, '128', 'RHU-A-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-30 07:22:56', NULL, NULL, NULL, NULL, NULL, NULL),
	(42, 5, NULL, 'ariman_010', 'Althea ', 'N', 'nicole', '', '1999-11-11', 'N/A', 26, 'Male', 'Single', '', 'N/A', 'N/A', 'N/A', '2026-00058', 'RHU-B-00003', 'Elementary', 'Employed', NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-30 07:40:22', '2026-02-03 11:24:02', NULL, NULL, NULL, NULL, NULL),
	(43, 1, NULL, 'ariman_011', 'Jose', 'M', 'Marc', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00001', '-', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-30 07:48:32', NULL, NULL, NULL, NULL, NULL, NULL),
	(44, 1, NULL, 'ariman_012', 'hon', 'ad', 'Joda', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00001', 'RHU-A-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-30 07:52:10', NULL, NULL, NULL, NULL, NULL, NULL),
	(45, 1, NULL, 'ariman_013', 'Hoand', 'ad', 'ee', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '128', 'RHU-A-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-30 07:56:43', NULL, NULL, NULL, NULL, NULL, NULL),
	(46, 1, NULL, 'ariman_014', 'Zap', NULL, 'N/a', NULL, '2021-02-22', NULL, 4, 'Male', 'Single', NULL, NULL, NULL, NULL, '128', 'RHU-A-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-31 02:18:04', NULL, NULL, NULL, NULL, NULL, NULL),
	(47, 1, NULL, 'ariman_015', 'Noob', 'e', 'e', NULL, '2019-02-22', NULL, 6, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00001', 'RHU-A-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-31 02:20:24', NULL, NULL, NULL, NULL, NULL, NULL),
	(48, 43, 12, 'outside_gubat_001', 'Cryslyn', 'e', 'Lareza', NULL, '2004-04-09', 'Manila', 21, 'Female', 'Single', 'A+', 'N/A', NULL, 'N/a', '2026-00025', 'RHU-OG-00001', 'College', 'Unemployed', 'Daughter', 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 01:54:03', NULL, NULL, NULL, NULL, NULL, NULL),
	(49, 43, 12, 'outside_gubat_002', 'Angels', NULL, 'Lareza', NULL, '2003-04-25', 'N/A', 22, 'Female', 'Single', 'O-', 'N/A', NULL, 'N/A', '2026-00025', 'RHU-OG-00001', 'College', 'Unemployed', 'Mother', 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 01:56:28', NULL, NULL, NULL, NULL, NULL, NULL),
	(50, 1, NULL, 'ariman_016', 'Jose', 'as', 'Dan', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00026', 'RHU-A-00011', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:16:27', NULL, NULL, NULL, NULL, NULL, NULL),
	(51, 1, NULL, 'ariman_017', 'Jessa', 'e', 'Beth', NULL, '2002-02-22', NULL, 23, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:26:43', NULL, NULL, NULL, NULL, NULL, NULL),
	(52, 1, NULL, 'ariman_018', 'Juls', 'e', 'escanod', NULL, '2002-02-22', NULL, 23, 'Male', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:29:43', NULL, NULL, NULL, NULL, NULL, NULL),
	(53, 1, NULL, 'ariman_019', 'Hie', 'd', 'Hie', NULL, '2002-02-22', NULL, 23, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:33:51', NULL, NULL, NULL, NULL, NULL, NULL),
	(54, 1, NULL, 'ariman_020', 'Gie', 'gie', 'gie', NULL, '2002-02-22', NULL, 23, 'Male', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:35:49', NULL, NULL, NULL, NULL, NULL, NULL),
	(55, 1, NULL, 'ariman_021', 'jonatan', 'e', 'wsa22', NULL, '2002-02-22', NULL, 23, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00026', 'RHU-A-00011', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:42:45', NULL, NULL, NULL, NULL, NULL, NULL),
	(56, 3, NULL, 'balud_del_norte_(poblacion)_005', 'Kiko', NULL, 'Kie', NULL, '2002-02-22', NULL, 23, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00028', 'RHU-BD-00008', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:43:46', NULL, NULL, NULL, NULL, NULL, NULL),
	(57, 1, NULL, 'ariman_022', 'Hulu', NULL, 'Hui', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:46:27', NULL, NULL, NULL, NULL, NULL, NULL),
	(58, 1, NULL, 'ariman_023', 'Jisi', 'e', 'Es', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00026', 'RHU-A-00011', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:48:37', NULL, NULL, NULL, NULL, NULL, NULL),
	(59, 1, NULL, 'ariman_024', 'Jigi', 'e', 'J', NULL, '0002-02-22', NULL, 2023, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00026', 'RHU-A-00011', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:52:10', NULL, NULL, NULL, NULL, NULL, NULL),
	(60, 1, NULL, 'ariman_025', 'Joel', 'e', 'Els', NULL, '2020-02-22', NULL, 5, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00026', 'RHU-A-00011', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:57:33', NULL, NULL, NULL, NULL, NULL, NULL),
	(61, 1, NULL, 'ariman_026', 'Hesa', 'e', 'Esa', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00026', 'RHU-A-00011', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:57:48', NULL, NULL, NULL, NULL, NULL, NULL),
	(62, 1, NULL, 'ariman_027', 'Jousas', '2', 'weq', NULL, '2002-02-22', NULL, 23, 'Male', NULL, NULL, NULL, NULL, NULL, '2026-00026', 'RHU-A-00011', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:58:05', NULL, NULL, NULL, NULL, NULL, NULL),
	(63, 13, NULL, 'casili_002', 'Biee', 'ie', 'Bee', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00029', 'RHU-C-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:58:56', NULL, NULL, NULL, NULL, NULL, NULL),
	(64, 13, NULL, 'casili_003', 'Baa', 'b', 'Baa', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00029', 'RHU-C-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:59:40', NULL, NULL, NULL, NULL, NULL, NULL),
	(65, 13, NULL, 'casili_004', 'Nie', 'n', 'Nie', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00029', 'RHU-C-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 06:05:09', NULL, NULL, NULL, NULL, NULL, NULL),
	(66, 13, NULL, 'casili_005', 'Vi', 'e', 'e', NULL, '2020-02-22', NULL, 5, 'Male', NULL, NULL, NULL, NULL, NULL, '2026-00029', 'RHU-C-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 06:05:20', NULL, NULL, NULL, NULL, NULL, NULL),
	(67, 6, NULL, 'bentuco_005', 'Balmond', 'e', 'e', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00033', 'RHU-B-00007', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 06:11:47', NULL, NULL, NULL, NULL, NULL, NULL),
	(68, 4, NULL, 'balud_del_sur_(poblacion)_013', 'layla ', 'e', 'e', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00034', 'RHU-BD-00015', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 06:12:06', NULL, NULL, NULL, NULL, NULL, NULL),
	(69, 6, NULL, 'bentuco_006', 'Nolam', 'w', 'e', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00033', 'RHU-B-00007', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 06:12:37', NULL, NULL, NULL, NULL, NULL, NULL),
	(70, 37, NULL, 'tagaytay_001', 'Andy', NULL, 'Esperansate', NULL, '2002-02-22', 'Manila', 23, 'Male', 'Single', 'A+', 'N/A', NULL, '091234567891', '2026-00038', 'RHU-T-00001', 'Unknown', 'Unemployed', 'Son', 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 08:03:29', NULL, NULL, NULL, NULL, NULL, NULL),
	(71, 10, NULL, 'tagaytay_002', 'jonatans', 'N/A', 'Esperansate', 'Sr.', '2002-02-22', 'Gubat, Sorsogon', 26, 'Male', 'Married', 'A+', 'Hahawer', 'Maria', '09125517311', '91', '09', 'Elementary', 'Employed', 'Mother', 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 08:07:04', '2026-02-03 10:57:09', NULL, NULL, NULL, NULL, NULL),
	(72, 5, NULL, 'cabigaan_004', 'Maria', 'Santos', 'Dela Cruz', 'Jr', '1999-02-22', ' Elena Santos', 26, 'Female', 'Married', 'O+', 'Gubat, Sorsogon', 'Morald', ' 0917-456-7890', '2026-00058', 'RHU-B-00003', 'High School', 'Employed', 'Mother', 'Yes', 'Yes', 'Yes', 'Yes', 'Member', '09123123', 'DIRECT CONTRIBUTOR - PROFESSIONAL PRACTITIONER', NULL, 'active', '2026-02-03 03:01:47', '2026-02-03 11:57:17', NULL, NULL, NULL, NULL, NULL),
	(73, 2, 13, 'bagacay_003', 'Pedro', 'Cruz', 'Villanueva', 'III', '2009-02-22', 'Del Pilar', 16, 'Male', 'Single', 'B+', 'Fernandez', '', '091234567891', '2026-00060', 'RHU-B-00004', 'High School', 'Unemployed', 'Mother', 'Yes', 'Yes', 'Yes', 'Yes', 'Member', '09561234567', 'IE - NATURALIZED FILIPINO CITIZEN', NULL, 'active', '2026-02-03 06:01:16', '2026-02-03 14:01:50', NULL, NULL, NULL, NULL, NULL),
	(74, 6, NULL, 'lapinig_001', 'Robertos', 'Aquino', 'Garcia', 'Sr', '1999-02-22', 'd	Del Pilar', 26, 'Male', 'Single', '', 'Rizal', '', '09561234567', '2026-00011', 'RHU-B-00005', 'Post Graduate', 'Employed', 'Daughter', 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-03 06:06:17', '2026-02-03 14:07:35', NULL, NULL, NULL, NULL, NULL),
	(75, 9, 13, 'bagacay_004', 'Mones', 'N/A', 'MUNS', 'Sr', '2002-02-22', 'Manila', 23, 'Male', 'Single', '', 'N/A', 'N/A', '091234567891', '2026-00063', 'RHU-B-00001', 'Unknown', 'Employed', 'Mother', 'Yes', 'Yes', 'Yes', 'Yes', 'Member', '09123123', 'IE - MIGRANT WORKER - LAND BASED', NULL, 'active', '2026-02-03 06:46:11', '2026-02-03 14:53:13', NULL, NULL, NULL, NULL, NULL),
	(76, 19, 7, 'luna-candol_(poblacion)_002', 'jeyms', 'E', 'Tin', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '100', 'DOH', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-09 03:21:21', '2026-02-09 11:23:18', NULL, NULL, NULL, NULL, NULL),
	(77, 2, 13, 'bagacay_005', 'zitian', 'e', 'esno', NULL, '2002-02-22', NULL, 23, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00067', 'RHU-B-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-10 01:04:26', NULL, NULL, NULL, NULL, NULL, NULL),
	(78, 4, 2, 'balud_del_sur_(poblacion)_014', 'Moa', 'Oa', 'MOAM', 'Sr', '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00068', 'RHU-BD-00018', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-10 01:07:35', NULL, NULL, NULL, NULL, NULL, NULL),
	(79, 19, NULL, 'luna-candol_(poblacion)_003', 'Nisa', 'Hu', 'wya', 'Jr', '2010-02-22', NULL, 15, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00069', 'RHU-L(-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-10 01:08:01', NULL, NULL, NULL, NULL, NULL, NULL),
	(80, 13, NULL, 'casili_006', 'jroam', 'asd', 'e', 'Sr', '1999-02-22', NULL, 26, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-10 01:08:23', NULL, NULL, NULL, NULL, NULL, NULL),
	(81, 13, NULL, 'casili_007', 'johan', 'asd', 'd', NULL, '2002-02-22', NULL, 23, 'Male', NULL, NULL, NULL, NULL, NULL, '2026-00076', 'RHU-C-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-10 02:10:24', NULL, NULL, NULL, NULL, NULL, NULL),
	(82, 11, NULL, 'cabiguhan_002', 'BABY', 'SA', 'BABY', NULL, '2002-02-22', NULL, 23, 'Male', NULL, NULL, NULL, NULL, NULL, '2026-00079', 'RHU-C-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-10 02:26:25', NULL, NULL, NULL, NULL, NULL, NULL),
	(83, 11, NULL, 'cabiguhan_003', 'ZOLAT', 'ASD', 'EJA', NULL, '1999-02-22', NULL, 26, 'Male', NULL, NULL, NULL, NULL, NULL, '2026-00081', 'RHU-C-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-10 02:28:53', NULL, NULL, NULL, NULL, NULL, NULL),
	(84, 12, NULL, 'carriedo_001', 'gau', 'asdh', 'ashd', NULL, '1999-11-11', NULL, 26, 'Male', NULL, NULL, NULL, NULL, NULL, '2026-00083', 'RHU-C-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-10 02:31:57', NULL, NULL, NULL, NULL, NULL, NULL),
	(85, 20, NULL, 'manapao_001', 'HONDA', 'ADD', 'DA', NULL, '1999-11-11', NULL, 26, 'Male', NULL, NULL, NULL, NULL, NULL, '2026-00086', 'RHU-M-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-10 02:35:27', NULL, NULL, NULL, NULL, NULL, NULL),
	(86, 10, NULL, 'cabigaan_005', 'JO', 'SAD', 'E', 'Sr', '2002-12-22', NULL, 23, 'Male', NULL, NULL, NULL, NULL, NULL, '2026-00091', 'RHU-C-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-10 02:40:37', NULL, NULL, NULL, NULL, NULL, NULL),
	(87, 9, NULL, 'bulacao_001', 'JAson', 'asd', 'qe3', 'II', '2026-12-22', NULL, 0, 'Male', NULL, NULL, NULL, NULL, NULL, '2026-00094', 'RHU-B-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-12 02:28:19', NULL, NULL, NULL, NULL, NULL, NULL),
	(88, 7, NULL, 'beriran_002', 'LOLO', 'E', 'Loasd', 'Sr', '1900-12-31', NULL, 125, 'Male', NULL, NULL, NULL, NULL, NULL, '2026-00095', 'RHU-B-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-12 02:31:59', NULL, NULL, NULL, NULL, NULL, NULL),
	(89, 1, 11, 'ariman_028', 'willy', 'Wil', 'WILLY', 'Sr', '2002-02-22', NULL, 24, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00113', 'RHU-A-00018', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-24 03:36:18', NULL, NULL, NULL, NULL, NULL, NULL),
	(90, 43, 14, 'outside_gubat_003', 'JOHN RAFAEL', NULL, 'ESCANILLA', 'IV', '2002-02-22', NULL, 24, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-01 07:12:19', NULL, NULL, NULL, NULL, NULL, NULL),
	(91, 43, 14, 'outside_gubat_004', 'JAMES', 'E', 'TIN', 'Jr', '1999-11-11', NULL, 26, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00114', 'RHU-OG-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-01 07:14:01', NULL, NULL, NULL, NULL, NULL, NULL),
	(92, 43, 14, 'outside_gubat_005', 'DAISY', NULL, 'ESCANILLA', 'Jr', '1999-02-22', NULL, 27, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00115', 'RHU-OG-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-01 07:15:32', NULL, NULL, NULL, NULL, NULL, NULL),
	(93, 43, NULL, 'outside_gubat_006', 'HONDA', NULL, 'DASIO', 'Jr', '2009-02-22', NULL, 17, 'Female', 'Married', NULL, NULL, NULL, NULL, '2026-00116', 'RHU-OG-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-01 07:23:42', NULL, NULL, NULL, NULL, NULL, NULL),
	(94, 43, NULL, 'outside_gubat_007', 'JOHN', 'ajdoa', 'ajdoa', NULL, '2026-12-22', NULL, 0, 'Male', NULL, NULL, NULL, NULL, NULL, '2026-00118', 'RHU-OG-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-01 10:27:03', NULL, NULL, NULL, NULL, NULL, NULL),
	(95, 43, NULL, 'outside_gubat_008', 'KASDL', 'adsj', 'asdnd', NULL, '2026-12-22', NULL, 0, 'Male', NULL, NULL, NULL, NULL, NULL, '2026-00119', 'RHU-OG-00007', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-01 11:24:58', NULL, NULL, NULL, NULL, NULL, NULL),
	(96, 43, NULL, 'outside_gubat_009', 'JACOBS', 'H', 'JAJA', NULL, '1999-11-11', NULL, 26, 'Male', NULL, NULL, NULL, NULL, NULL, '2026-00120', 'RHU-OG-00008', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-01 11:28:30', NULL, NULL, NULL, NULL, NULL, NULL),
	(97, 43, NULL, 'outside_gubat_010', 'KEAYA', 'K', 'K', NULL, '1999-11-11', NULL, 26, 'Male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-01 11:40:19', NULL, '10', 'Queazon', 'Lucaban', 'San Isidro', 'Purok 1'),
	(98, 43, NULL, 'outside_gubat_011', 'KEAYA2', 'E11', 'E', '', '1999-11-11', '', 26, 'Male', '', '', '', '', '', '2026-00122', 'RHU-OG-00010', 'Unknown', 'Employed', NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-01 11:40:55', '2026-03-01 19:41:34', '10', 'Queazon', 'Lucaban', 'San Isidro', 'Purok 1'),
	(99, 16, NULL, 'dita_001', 'hjJHQG', 'HG', 'HJGJ', NULL, '1900-11-11', NULL, 125, 'Male', NULL, NULL, NULL, NULL, NULL, '2026-00124', 'RHU-D-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-01 11:42:55', NULL, NULL, NULL, NULL, NULL, NULL),
	(100, 43, NULL, 'outside_gubat_012', 'IYY', 'IY', 'IY', NULL, '1900-11-11', NULL, 125, 'Male', NULL, NULL, NULL, NULL, NULL, '2026-00125', 'RHU-OG-00012', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-01 11:43:29', NULL, NULL, NULL, NULL, NULL, NULL),
	(101, 43, NULL, 'outside_gubat_013', 'keaya', 'h', 'h', NULL, '1999-11-11', NULL, 26, 'Male', NULL, NULL, NULL, NULL, NULL, '2026-00125', 'RHU-OG-00012', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-01 11:44:15', NULL, NULL, NULL, NULL, NULL, NULL),
	(102, 43, NULL, 'outside_gubat_014', 'diluc', 'd', 'd', NULL, '1900-11-11', NULL, 125, 'Male', NULL, NULL, NULL, NULL, NULL, '2026-00126', 'RHU-OG-00013', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-01 11:45:03', NULL, '10', 'Quezon', 'LUCBAN', 'ISIDRO', '9'),
	(103, 43, NULL, 'outside_gubat_015', 'MMA', 'MMA', 'MMA', NULL, '1999-02-22', NULL, 27, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00127', 'RHU-OG-00014', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-02 12:20:56', NULL, 'SAINT', 'POAS', 'LUCBAN', 'SAN VENIEI', 'PUROK MACABOG'),
	(104, 43, NULL, 'outside_gubat_016', 'JUAN', NULL, 'CARLOS', NULL, '1999-01-01', NULL, 27, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00128', 'RHU-OG-00015', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-03 00:14:41', NULL, 'V', 'Quezon', 'Lucban', 'San Isidro', 'Purok1');

-- Dumping structure for table react1.0.patient_household_history
CREATE TABLE IF NOT EXISTS `patient_household_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `old_barangay_id` int NOT NULL,
  `old_household_no` varchar(100) DEFAULT NULL,
  `old_facility_household_no` varchar(100) DEFAULT NULL,
  `new_barangay_id` int NOT NULL,
  `new_household_no` varchar(100) DEFAULT NULL,
  `new_facility_household_no` varchar(100) DEFAULT NULL,
  `move_reason` varchar(255) DEFAULT NULL,
  `moved_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `moved_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_phh_patient` (`patient_id`),
  CONSTRAINT `fk_phh_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients_db` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table react1.0.patient_household_history: ~27 rows (approximately)
DELETE FROM `patient_household_history`;
INSERT INTO `patient_household_history` (`id`, `patient_id`, `old_barangay_id`, `old_household_no`, `old_facility_household_no`, `new_barangay_id`, `new_household_no`, `new_facility_household_no`, `move_reason`, `moved_at`, `moved_by`) VALUES
	(1, 71, 37, '2026-00038', 'RHU-T-00001', 30, '2026-00046', 'RHU-P-00001', 'Patient transfer', '2026-02-03 01:05:59', 1),
	(2, 71, 30, '2026-00046', 'RHU-P-00001', 43, '2026-00025', 'RHU-OG-00001', 'Patient transfer', '2026-02-03 01:15:42', 1),
	(3, 71, 43, '2026-00025', 'RHU-OG-00001', 30, '2026-00047', 'RHU-P-00002', 'Patient transfer', '2026-02-03 01:18:58', 1),
	(4, 71, 30, '2026-00047', 'RHU-P-00002', 30, '2026-00047', 'RHU-P-00002', 'Patient transfer', '2026-02-03 01:20:22', 1),
	(5, 71, 30, '2026-00047', 'RHU-P-00002', 6, '128', 'RHU-B-00001', 'Patient transfer', '2026-02-03 01:21:34', 1),
	(6, 71, 6, '128', 'RHU-B-00001', 6, '2026-00049', 'RHU-B-00010', 'Patient transfer', '2026-02-03 01:24:34', 1),
	(7, 71, 6, '2026-00049', 'RHU-B-00010', 6, '2026-00049', 'RHU-B-00010', 'Patient transfer', '2026-02-03 01:25:05', 1),
	(8, 71, 6, '2026-00049', 'RHU-B-00010', 5, '2026-00051', 'RHU-B-00002', 'Patient transfer', '2026-02-03 01:40:50', 1),
	(9, 71, 5, '2026-00051', 'RHU-B-00002', 1, '2026-00001', 'RHU-A-00002', 'Patient transfer', '2026-02-03 01:46:21', 1),
	(10, 71, 1, '2026-00001', 'RHU-A-00002', 41, '2026-00052', 'RHU-U-00001', 'Patient transfer', '2026-02-03 01:47:19', 1),
	(11, 71, 41, '2026-00052', 'RHU-U-00001', 1, '2026-00001', 'RHU-A-00002', 'Patient transfer', '2026-02-03 01:58:38', 1),
	(12, 71, 1, '2026-00001', 'RHU-A-00002', 3, '2026-00028', 'RHU-BD-00008', 'Patient transfer', '2026-02-03 01:59:21', 1),
	(13, 71, 3, '2026-00028', 'RHU-BD-00008', 3, '2026-00053', 'RHU-BD-00011', 'Patient transfer', '2026-02-03 02:20:58', 1),
	(14, 71, 3, '2026-00053', 'RHU-BD-00011', 30, '2026-00054', 'RHU-P-00003', 'Patient transfer', '2026-02-03 02:36:15', 1),
	(15, 71, 30, '2026-00054', 'RHU-P-00003', 1, '2026-00001', 'RHU-A-00002', 'Patient transfer', '2026-02-03 02:37:23', 1),
	(16, 71, 1, '2026-00001', 'RHU-A-00002', 13, '2026-00055', 'RHU-C-00002', 'Patient transfer', '2026-02-03 02:49:40', 1),
	(17, 71, 13, '2026-00055', 'RHU-C-00002', 1, '2026-00001', 'RHU-A-00002', 'Patient transfer', '2026-02-03 02:50:11', 1),
	(18, 71, 1, '2026-00001', 'RHU-A-00002', 10, '91', '09', 'Patient transfer', '2026-02-03 02:57:09', 1),
	(19, 42, 1, '2026-00001', 'RHU-A-00002', 1, '2026-00056', 'RHU-A-00012', 'Patient transfer', '2026-02-03 03:21:39', 1),
	(20, 42, 1, '2026-00056', 'RHU-A-00012', 1, '2026-00057', 'RHU-A-00013', 'Patient transfer', '2026-02-03 03:22:38', 1),
	(21, 42, 1, '2026-00057', 'RHU-A-00013', 5, '2026-00058', 'RHU-B-00003', 'Patient transfer', '2026-02-03 03:24:02', 1),
	(22, 72, 10, '91', '09', 5, '2026-00058', 'RHU-B-00003', 'Patient transfer', '2026-02-03 03:57:17', 1),
	(23, 73, 2, NULL, NULL, 2, '2026-00060', 'RHU-B-00004', 'Patient transfer', '2026-02-03 06:01:50', 1),
	(24, 74, 18, '2026-00061', 'RHU-L-00001', 6, '2026-00011', 'RHU-B-00005', 'Patient transfer', '2026-02-03 06:07:35', 1),
	(25, 75, 2, '2026-00062', 'RHU-B-00005', 9, '2026-00063', 'RHU-B-00001', 'Patient transfer', '2026-02-03 06:53:13', 1),
	(26, 76, 19, '100', 'DOH', 11, '2026-00065', 'RHU-C-00003', 'Patient transfer', '2026-02-09 03:22:20', 1),
	(27, 76, 11, '2026-00065', 'RHU-C-00003', 19, '100', 'DOH', 'Patient transfer', '2026-02-09 03:23:18', 1),
	(28, 98, 43, NULL, NULL, 43, '2026-00122', 'RHU-OG-00010', 'Patient transfer', '2026-03-01 11:41:34', 1);

-- Dumping structure for table react1.0.patient_queue
CREATE TABLE IF NOT EXISTS `patient_queue` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `queue_date` date NOT NULL,
  `queue_type` enum('PRIORITY','REGULAR') NOT NULL,
  `queue_number` int NOT NULL,
  `queue_code` varchar(20) NOT NULL,
  `status` enum('waiting','triage','serving','with_doctor','done','cancelled') DEFAULT 'waiting',
  `cancelled_by` enum('manual','system') DEFAULT NULL,
  `systolic_bp` int DEFAULT NULL,
  `diastolic_bp` int DEFAULT NULL,
  `heart_rate` int DEFAULT NULL,
  `respiratory_rate` int DEFAULT NULL,
  `temperature` decimal(4,1) DEFAULT NULL,
  `oxygen_saturation` int DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_daily_queue` (`queue_date`,`queue_type`,`queue_number`),
  KEY `idx_queue_lookup` (`queue_date`,`queue_type`,`status`),
  KEY `fk_patient_queue` (`patient_id`),
  CONSTRAINT `fk_queue_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients_db` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=248 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table react1.0.patient_queue: ~7 rows (approximately)
DELETE FROM `patient_queue`;
INSERT INTO `patient_queue` (`id`, `patient_id`, `queue_date`, `queue_type`, `queue_number`, `queue_code`, `status`, `cancelled_by`, `systolic_bp`, `diastolic_bp`, `heart_rate`, `respiratory_rate`, `temperature`, `oxygen_saturation`, `weight`, `height`, `created_at`) VALUES
	(241, 92, '2026-03-03', 'REGULAR', 1, 'R-001', 'serving', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-03 10:46:56'),
	(242, 90, '2026-03-03', 'REGULAR', 2, 'R-002', 'serving', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-03 10:47:18'),
	(243, 92, '2026-03-03', 'PRIORITY', 1, 'P-001', 'serving', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-03 10:54:32'),
	(244, 90, '2026-03-03', 'PRIORITY', 2, 'P-002', 'serving', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-03 10:55:17'),
	(245, 92, '2026-03-03', 'REGULAR', 3, 'R-003', 'serving', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-03 10:56:46'),
	(246, 90, '2026-03-04', 'REGULAR', 1, 'R-001', 'waiting', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-04 01:54:36'),
	(247, 93, '2026-03-04', 'REGULAR', 2, 'R-002', 'waiting', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-04 15:28:38');

-- Dumping structure for table react1.0.puroks
CREATE TABLE IF NOT EXISTS `puroks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `barangay_id` int NOT NULL,
  `purok_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_purok` (`barangay_id`,`purok_name`),
  CONSTRAINT `fk_purok_barangay` FOREIGN KEY (`barangay_id`) REFERENCES `barangays` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table react1.0.puroks: ~15 rows (approximately)
DELETE FROM `puroks`;
INSERT INTO `puroks` (`id`, `barangay_id`, `purok_name`) VALUES
	(11, 1, 'Purok1'),
	(13, 2, 'Purok 2'),
	(3, 2, 'Purok1'),
	(1, 3, 'Purok1'),
	(2, 4, 'Purok1'),
	(6, 7, 'Purok1'),
	(4, 14, 'Holy Family Subdivision'),
	(9, 17, 'Holy Family Subdivision'),
	(8, 17, 'Purok1'),
	(10, 17, 'Sitio River Side'),
	(7, 19, 'Manook, St.'),
	(5, 32, 'Purok 1'),
	(14, 43, 'Bagacay Sorsogon City'),
	(15, 43, 'Casiguran, Bucalbucalan'),
	(12, 43, 'Purok 5');

-- Dumping structure for table react1.0.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table react1.0.roles: ~10 rows (approximately)
DELETE FROM `roles`;
INSERT INTO `roles` (`id`, `code`, `name`, `description`, `created_at`) VALUES
	(1, 'user', 'User', NULL, '2026-01-22 15:04:24'),
	(2, 'admin', 'Administrator', NULL, '2026-01-22 15:04:24'),
	(3, 'staff', 'Staff Member', NULL, '2026-01-22 15:04:24'),
	(4, 'doctor', 'Doctor', NULL, '2026-01-22 15:04:24'),
	(9, 'nurse', 'Nurse', NULL, '2026-01-22 15:20:23'),
	(10, 'triage', 'Triage', NULL, '2026-01-22 15:23:32'),
	(11, 'runner', 'Runner', NULL, '2026-01-22 15:27:04'),
	(12, 'cashier', 'Cashier', NULL, '2026-01-24 09:07:18'),
	(13, 'pet', 'Pet', NULL, '2026-01-25 06:50:35'),
	(14, 'seller', 'Seller', NULL, '2026-01-25 07:34:46'),
	(17, 'encoder', 'Encoder', NULL, '2026-03-05 01:03:02');

-- Dumping structure for table react1.0.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','disabled','banned') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_user_role` (`role`),
  CONSTRAINT `fk_user_role` FOREIGN KEY (`role`) REFERENCES `roles` (`code`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table react1.0.users: ~10 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `uuid`, `name`, `email`, `password_hash`, `role`, `status`, `created_at`, `updated_at`) VALUES
	(5, '550e8400-e29b-41d4-a716-446655440000', 'John Doe', 'john@example.com', '$2y$10$mkFxgzkE8AYnTVgtOQPnMuctPun99qHtq6WGMAmbZx0q3sOm0UV2i', 'user', 'active', '2026-01-08 13:29:09', '2026-01-08 14:53:48'),
	(12, '9109a251-f911-11f0-a427-34e6d71ed611', 'Ronald Fererras', 'ronald@gmail.com', '$2y$10$hfT.hDCVr0BiFpqbZRPArOoNsmKWburBKASZ8byv0YoJoTCo88riG', 'doctor', 'active', '2026-01-24 10:43:49', '2026-01-24 10:43:49'),
	(13, '3806a1ac-f912-11f0-a427-34e6d71ed611', 'Rona', 'rona@gmail.com', '$2y$10$BvSZoQYUzjVCz2pGi6A/TeFzIH6a9y3dfH0.lVCnRm8r2E/HsOoXa', 'triage', 'active', '2026-01-24 10:48:29', '2026-01-24 10:48:29'),
	(14, 'bc13750e-f912-11f0-a427-34e6d71ed611', 'Nurses', 'nurse@gmail.com', '$2y$10$AmAbXIO1htpyPfSNNUY7Yu/YhdivaTXGnL1fi/i03uO.XQe069/ka', 'nurse', 'active', '2026-01-24 10:52:10', '2026-01-24 10:52:10'),
	(15, '3e4b337c-f913-11f0-a427-34e6d71ed611', 'cashier', 'cashier@gmail.com', '$2y$10$miMxELICWHAH/S7ysZTzFe9do4C4BEqhGxmTWY32HB8b.U2SPu9.a', 'cashier', 'active', '2026-01-24 10:55:49', '2026-01-24 10:55:49'),
	(16, '34ed2c28-f9ba-11f0-a612-34e6d71ed611', 'Loki', 'Pet@gmail.com', '$2y$10$XIttzMrF8Rk8eGgok23mg.fGsSeiM7a/fJ2HwcT9H5d9CumAeXQQy', 'pet', 'active', '2026-01-25 06:50:59', '2026-01-25 06:50:59'),
	(17, '5d75e27d-f9c0-11f0-a612-34e6d71ed611', 'Seller', 'seller@gmail.com', '$2y$10$7UxBawEgcPd.SKj2xRPwlOxr65OkU7ThuzGIVRiQzRsn9B..dl0xu', 'seller', 'active', '2026-01-25 07:35:04', '2026-01-25 07:35:04'),
	(18, 'be4d2b2b-f9c0-11f0-a612-34e6d71ed611', 'Rafael', 'rafael@gmail.com', '$2y$10$Yb.9G0N1REL27ANen9lWc.FzFjCtnrf6aFTaGSX96NGJJ7CYHQpxG', 'user', 'active', '2026-01-25 07:37:47', '2026-01-25 07:37:47'),
	(19, '0a67ad70-fb3f-11f0-92de-34e6d71ed611', 'Ian', 'ian@gmail.com', '$2y$10$rBx8JoTHUwUjZCaWfYKJz.Txgm9Z5jXA6ochFP6tD48qXRXE/aiU.', 'admin', 'active', '2026-01-27 05:14:22', '2026-01-27 05:14:22'),
	(20, '07266b90-022f-11f1-89a5-34e6d71ed611', 'Mari-Ann Kristine', 'Mari-Ann@gmail.com', '$2y$10$osxlehTAqNnrY8zhB0wjzuXwVWexZSo9gyUSkWHH.1tjr6lO5hVFO', 'doctor', 'active', '2026-02-05 01:07:23', '2026-02-05 01:07:23'),
	(23, '19a8551f-182f-11f1-b669-34e6d71ed611', 'encoder', 'encoder@gmail.com', '$2y$10$vTuIy6ilsmDqszx0AZnou.DEpZ8c24V0TgsKQu6JdHzqqoGkQU.uG', 'encoder', 'active', '2026-03-05 01:03:19', '2026-03-05 01:03:19');

-- Dumping structure for table react1.0.user_panel_access
CREATE TABLE IF NOT EXISTS `user_panel_access` (
  `user_id` bigint unsigned NOT NULL,
  `panel_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`panel_id`),
  KEY `panel_id` (`panel_id`),
  CONSTRAINT `user_panel_access_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_panel_access_ibfk_2` FOREIGN KEY (`panel_id`) REFERENCES `panels` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table react1.0.user_panel_access: ~11 rows (approximately)
DELETE FROM `user_panel_access`;
INSERT INTO `user_panel_access` (`user_id`, `panel_id`) VALUES
	(13, 1),
	(18, 1),
	(19, 1),
	(5, 2),
	(13, 2),
	(15, 2),
	(19, 2),
	(12, 3),
	(20, 3),
	(12, 4),
	(20, 4);

-- Dumping structure for table react1.0.user_profiles
CREATE TABLE IF NOT EXISTS `user_profiles` (
  `user_id` bigint unsigned NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `license_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table react1.0.user_profiles: ~2 rows (approximately)
DELETE FROM `user_profiles`;
INSERT INTO `user_profiles` (`user_id`, `avatar`, `phone`, `address`, `license_no`, `title`) VALUES
	(12, NULL, '', '', '0120227', 'RM, RN, MD, MPM-HSD, CPC-FP '),
	(20, NULL, '', '', '0121966', 'MD, CPC-FP ');

-- Dumping structure for table react1.0.user_sessions
CREATE TABLE IF NOT EXISTS `user_sessions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `token` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=284 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table react1.0.user_sessions: ~137 rows (approximately)
DELETE FROM `user_sessions`;
INSERT INTO `user_sessions` (`id`, `user_id`, `token`, `expires_at`, `created_at`) VALUES
	(8, 5, 'e9abfddabad8a781cd4481951247055f298a8b5a9dbab05b08c8c2108a9ab6b9', '2026-01-12 04:20:55', '2026-01-11 03:20:55'),
	(10, 5, 'df23ca0ca5544830dd2ebbdb38e42e43706885bf831ee1a15c587951a874b611', '2026-01-12 05:03:12', '2026-01-11 04:03:12'),
	(11, 5, '6dec7decc2526c06a733cc0441f399491de7b7489f09db6e25eaaec8172196ad', '2026-01-23 13:04:22', '2026-01-22 13:04:22'),
	(12, 5, '21c5fec1c791b54bc3f9ab3bbafc191737ce024a2574623508c8bb8e5d4ba039', '2026-01-25 07:21:40', '2026-01-24 07:21:40'),
	(17, 15, '32eda4ef8c340024eeae385dd7490f0b94831f63e734c1949fc0c429e6740bc5', '2026-01-25 10:58:17', '2026-01-24 10:58:17'),
	(36, 15, '45fe018319cce51efce28941392e0338b64732b785e6845585d5e56e1fcd695f', '2026-01-26 14:55:45', '2026-01-25 14:55:45'),
	(40, 12, '0a33b24f62abd321ce908814505d8c9aef88dc5b4fc19aabad4d31f79d81f562', '2026-01-28 02:06:08', '2026-01-27 02:06:08'),
	(41, 13, '8709a783d7692414c4bc43478a82cc9f469fa3d270426205ef68c7038755f3ea', '2026-01-28 02:06:48', '2026-01-27 02:06:48'),
	(42, 13, '42ffcaf30290dc7e952044e4dd0ca72b45033dc4483e4b694f0731665866a7ed', '2026-01-28 02:06:50', '2026-01-27 02:06:50'),
	(43, 13, 'edd3f5dec68bc7b3ca336dbc81c9b19c9ded2ffc99be7f2ccab6ae3fa3afd049', '2026-01-28 02:06:53', '2026-01-27 02:06:53'),
	(44, 13, '3d3b030a3315650c0025c1eea1ef25171e9661154e4e0a90fdc5b70a5beb2bc3', '2026-01-28 02:06:54', '2026-01-27 02:06:54'),
	(45, 13, '39b0d27e79d59605cd99de26e7b878043a51a57340efc3574281f49276a75943', '2026-01-28 02:06:54', '2026-01-27 02:06:54'),
	(46, 13, 'a8c9a209236de24b733ce6a455f2d8871497f57189fd6c6429df3c6ae33ac580', '2026-01-28 02:06:55', '2026-01-27 02:06:55'),
	(47, 13, '8de0073af9ef892ba7009e5eee45252785fc0b56cf7932828bc74863e7cdd416', '2026-01-28 02:07:26', '2026-01-27 02:07:26'),
	(57, 19, 'ad72529c8676facd544fd2c4790823b38d4a616d20358964f964153b0aa57aa7', '2026-01-28 05:14:46', '2026-01-27 05:14:46'),
	(65, 13, 'a826b9740e53d51b9ee45a0fd4f0654b22acdc1ae5e79161a9d4cead138961c7', '2026-01-29 02:49:24', '2026-01-28 02:49:24'),
	(68, 13, '321519443b8376bb9887b9aaaee4285e3669a6495942146f0de2d5d3a28b390d', '2026-01-29 02:59:49', '2026-01-28 02:59:49'),
	(72, 19, '3aacec77be43aa20da32d49da3fbf29d6286f90e61f4db93d2cbbe9e6d51116b', '2026-01-29 03:14:19', '2026-01-28 03:14:19'),
	(74, 19, '3d10d42c45ac381f78359a6ffb01e711dfb4d8054ee58f017bdd76e8dccf27bf', '2026-01-29 06:07:13', '2026-01-28 06:07:13'),
	(75, 13, 'acdfaab1ead0ffc23a9f68d0a83e912334648ba9c92da0e7389f1a5e242775bc', '2026-01-29 08:02:17', '2026-01-28 08:02:17'),
	(76, 13, '76f2d4d92d8c97af52ea322d3a03d935460b52fc95a482346a5201424168428a', '2026-01-30 05:18:22', '2026-01-29 05:18:22'),
	(77, 13, '4d5d8d92355b733cfafb2f6258c34e9977602f5f629c8dfe88a53c15e9df3073', '2026-01-31 00:33:10', '2026-01-30 00:33:10'),
	(78, 13, 'a7f799016da38b7c556652e4f35c36bd95eb27fab9f5064634854b7e3991655e', '2026-01-31 02:16:44', '2026-01-30 02:16:44'),
	(79, 13, 'dc8a66a41c768b7c99525e79a34cec023c4c5542abf2eae352445e6a34e8e578', '2026-01-31 02:18:48', '2026-01-30 02:18:48'),
	(80, 13, '9bf2e28304167a95c1e6325f9beb76dd2ffcaade114855c55626156adb32278e', '2026-01-31 03:17:13', '2026-01-30 03:17:13'),
	(81, 13, '7cd9b291798575c27bcde29f7c81339294272a8494b86a64875ed896c626e765', '2026-01-31 06:01:13', '2026-01-30 06:01:13'),
	(82, 13, '0cb758613e3a0cd8dd08512c92dd22b70b5775f4be615050432260b5167982c5', '2026-02-01 02:08:16', '2026-01-31 02:08:16'),
	(83, 13, '053da9fc31a3d2864fa0e84ef5800bfb7b601ca3505532c8e3bb8810b40f3cf1', '2026-02-03 01:50:53', '2026-02-02 01:50:53'),
	(84, 13, '2aa861206471e27bed80e741d96b321ce91e66ec637b84719683462754ad1933', '2026-02-03 05:09:28', '2026-02-02 05:09:28'),
	(85, 13, '1dd5f475cd5789a4a0844e3c6a61f9d5ea392d44560d955a81d0095932ff6946', '2026-02-03 07:10:55', '2026-02-02 07:10:55'),
	(86, 13, '33e61e787b9b21d84dac01b4f0646997a4a2dac92acdbfff2325753ba232aa23', '2026-02-04 00:13:34', '2026-02-03 00:13:34'),
	(87, 13, '76a60f1c92f0875ae6705b570c7c0fa3a0598a654d7c8f422908e6fe8d2f2c2e', '2026-02-04 01:37:03', '2026-02-03 01:37:03'),
	(88, 13, '4308024ae5a0006a51be7d6267563c06ac09f8eb316eb537067db345512a60ca', '2026-02-04 03:20:52', '2026-02-03 03:20:52'),
	(89, 13, 'eba0cc1d7c6f89a206592219c2fb66cd7e66e4b56c660af01da4c1098b719699', '2026-02-04 03:46:21', '2026-02-03 03:46:21'),
	(90, 13, '5c42636f9d25ede7b9ec9649b80b2f0e87c936fa1060a508e162e2833d3c7315', '2026-02-04 05:45:22', '2026-02-03 05:45:22'),
	(91, 13, '2a1608518c541351ad1b5e64bc8eef29844676650ce449ee6f2a20f89c8ff66a', '2026-02-04 06:42:54', '2026-02-03 06:42:54'),
	(92, 13, 'f2c2f3c19436aed486f24621ec97d53c62b0f7102db10278e875cc1e5fda7390', '2026-02-04 07:20:35', '2026-02-03 07:20:35'),
	(93, 13, '0c18cebd56cb502b26fa652619410885e9fa71dcabc941e3af6307bec22da301', '2026-02-04 07:34:45', '2026-02-03 07:34:45'),
	(94, 13, 'e1819d920bf35e4bec4a1e74463a439ede47deca0940c2272dc4339bc53f685f', '2026-02-04 08:03:40', '2026-02-03 08:03:40'),
	(95, 13, '0e7cc5d090021b90262dc88fdc769352fb52476c52ca354a078f5c564237557b', '2026-02-04 08:31:23', '2026-02-03 08:31:23'),
	(96, 13, 'feb216359b3b88dc95cd8aaaceb3cca3796e3ae7ee5eee33f0a34c5fa20d01f0', '2026-02-05 00:31:17', '2026-02-04 00:31:17'),
	(97, 13, '5ff9fda2d9986c750fc527ef05404473ea07fdc8cbaf1beb7554b8b77d7b94b5', '2026-02-05 01:24:03', '2026-02-04 01:24:03'),
	(98, 13, 'b40e16a2a70016cf1c2d4528bdbc7215d38106b634ad87dec3285a850075090d', '2026-02-05 02:00:18', '2026-02-04 02:00:18'),
	(99, 13, '374fe34fa5d954e966e4fff8bc5f1c0e88b159773674b4338b927ea02b854c46', '2026-02-05 02:08:05', '2026-02-04 02:08:05'),
	(100, 13, '210a0c2bb751052b3b81d10fa0f383598fba2c234feb6131e63cbbf83b90bc61', '2026-02-05 05:18:22', '2026-02-04 05:18:22'),
	(101, 13, '94165d7b38eafdc1ca1e08d05272a1bb0f12ee73fd9891f81fff8f5705313cab', '2026-02-05 06:10:03', '2026-02-04 06:10:03'),
	(109, 12, '6776151849ed9aa1f9b50a96cdcbba2172c823d9068374df71c721851dc16d4f', '2026-02-06 03:01:22', '2026-02-05 03:01:22'),
	(111, 13, '275f24a639f99c1454fe59928ab6c114e4fdfd78aa097dedfec67f3e964133c8', '2026-02-06 05:41:09', '2026-02-05 05:41:09'),
	(112, 13, '36ba26181c7df01ed7183862e0426ae2a5a78ca0f184e40f9e2a83c91fcae84e', '2026-02-06 06:03:15', '2026-02-05 06:03:15'),
	(116, 19, '96da11de253b28c01527b297b4c1e93b20ed3fef4c7e0d1cc60e31a17cbfaa85', '2026-02-06 06:35:38', '2026-02-05 06:35:38'),
	(117, 13, 'bd6849c3ed1882f53ffd68e0907383c3abb5932c76b0431e00b3f6dafcb26d37', '2026-02-06 06:46:34', '2026-02-05 06:46:34'),
	(118, 13, '03eaeeee2480196bf37c5aa5d02e58106ea72823241c5fda7cad338682f432e0', '2026-02-06 06:48:31', '2026-02-05 06:48:31'),
	(130, 12, '1a33172228eed9c699268fe00b069aa2c57e5d53a96f26bd99b61a62aa0a43f7', '2026-02-06 08:04:54', '2026-02-05 08:04:54'),
	(131, 13, '74aa6ea3154d28b15c4e11f513b773a924762f8aa11fec2b5a484a4759f4ac20', '2026-02-06 08:06:27', '2026-02-05 08:06:27'),
	(132, 19, '28d55b8fe56da376d925838ba2210a531d68225acdee33d2d8e5db5b547b8004', '2026-02-06 08:06:38', '2026-02-05 08:06:38'),
	(144, 20, '42858b5c07bdedb05ae19d61d698641d97f8062c6ca5b18b800bf4cbfbfebd09', '2026-02-07 01:09:07', '2026-02-06 01:09:07'),
	(147, 13, '44c43be9702aab85e72dff347f4ebde8aa6674512357a056134051106611793a', '2026-02-07 01:11:31', '2026-02-06 01:11:31'),
	(148, 19, 'bea07dbb4d88fb0e71bfe78dc123b7e3b80370ba0e99e661d04ff2b949843bd3', '2026-02-07 01:12:00', '2026-02-06 01:12:00'),
	(149, 12, 'e5d17fa5172bb84221a40ba0f01c598138ae3662dd4b5f4c5c18b3afef7e4db8', '2026-02-07 01:12:58', '2026-02-06 01:12:58'),
	(150, 15, 'a8d1d0d91888897eed09cb8535bab6d7eeffb7efa7e964788f6267981c416315', '2026-02-07 01:13:36', '2026-02-06 01:13:36'),
	(151, 13, 'cc7ad11e2079c8526a2e4e4ff03125a1b425b2629a71e592f1bde5fbdabf9211', '2026-02-07 13:20:53', '2026-02-06 13:20:53'),
	(152, 13, '3a04dbac718953140c549212e83fc66cb6020cadf7775fc2e82bbc7d6d4c5baf', '2026-02-10 00:20:08', '2026-02-09 00:20:08'),
	(153, 13, '83bfea981ccd602b4a50ab179fd7acf9985fa0ac831458bce920e9b39c711e0c', '2026-02-10 02:15:40', '2026-02-09 02:15:40'),
	(154, 13, '74991ab43632fdff9b6db86e002ed8f6b03b25cf6bdad58107ed118d2beb3997', '2026-02-11 00:13:21', '2026-02-10 00:13:21'),
	(155, 13, '893cafc3cd9338fa10d5f307f2d13a6694fa3ff2d990c30947f90f3f1550c9d3', '2026-02-11 00:29:48', '2026-02-10 00:29:48'),
	(156, 13, 'b6d9da4e001c67eee24a2a3e47602b8855bdbb61bb43b9810278d2a643c7d6b7', '2026-02-11 06:54:39', '2026-02-10 06:54:39'),
	(157, 13, '639532a7bd29e9e554a17fb9bcd60215b26981ba1e8a13756df550fcc225b2e6', '2026-02-12 00:38:16', '2026-02-11 00:38:16'),
	(158, 13, '5bbfab5c7b5333c00f90fdb2c281dfba9a9d8e760df5a36de61e1ead696c1ebc', '2026-02-12 08:10:29', '2026-02-11 08:10:29'),
	(159, 13, '1a39ed0a61461c274ab3deb8d44d9150ed7376f45fe95eb5a99aefce2030ad81', '2026-02-13 00:27:53', '2026-02-12 00:27:53'),
	(160, 13, 'a9fad9cab9165f18a3cf801447b5b476f50b0d0f17096870691c3793b9b33229', '2026-02-13 00:28:04', '2026-02-12 00:28:04'),
	(161, 13, 'df2850a827122d61c4b4cc693683aff62b13df1514bded3e3d46d1b85ba22191', '2026-02-13 05:24:29', '2026-02-12 05:24:29'),
	(162, 13, '01f8cfa7da466339c9d66161e97cf358b996151b7acc7e82a096afe585b3dec4', '2026-02-13 06:28:42', '2026-02-12 06:28:42'),
	(163, 13, '011c10ef5c7ab8f6aa10232374e6ff2c831a672c95baa95a91b01e8b8ea5c26f', '2026-02-14 00:57:41', '2026-02-13 00:57:41'),
	(164, 13, 'ec1560c6cd9ba1e4924deb17d659230fc387bb0d823d546ececfe1c2f9a800b2', '2026-02-14 02:22:08', '2026-02-13 02:22:08'),
	(165, 13, 'da45481787e45b7b3f37b4854ca89867dd663a881dbe6e0cf8639175ae03c4c5', '2026-02-25 02:26:28', '2026-02-24 02:26:28'),
	(169, 15, '9c1b4c5e5d02aca5846640e6be1f5af02f2855c4c8ef51220619d69542c0ecdc', '2026-02-25 07:51:15', '2026-02-24 07:51:15'),
	(170, 13, 'd2c1c7f0474eba233c39c2d6fd348e204da994939a54e19fa7fa6fa4910f9830', '2026-02-25 11:59:21', '2026-02-24 11:59:21'),
	(171, 13, '205a22f8c86e467ede82fe4d4e1789591e1e158d8788f8f8215253788594c05f', '2026-02-26 05:59:43', '2026-02-25 05:59:43'),
	(172, 13, '1b04197f6edcffa79b56b2ae2e6d178345df41185883e5f52e2d57dfe823ce17', '2026-02-26 06:29:11', '2026-02-25 06:29:11'),
	(173, 15, '845f5f6c58d29fbdb4b4396783e15dd12bf881a7692637ec296cc9daf28b2d8d', '2026-02-26 06:29:23', '2026-02-25 06:29:23'),
	(175, 15, '3c0c9b877a348a90be543d5b4074da76b159632568e0d85464519b19487ca71d', '2026-02-26 07:59:14', '2026-02-25 07:59:14'),
	(176, 13, 'ae358c5546533f09ff6990701d88ce6e295c89f3d94c7b14ab56bb6d3bed0399', '2026-02-26 09:40:41', '2026-02-25 09:40:41'),
	(178, 15, '5b2a1587251d1b4e227d2c324448741bbc79c2c64be8e3968965fc027f18d0c1', '2026-02-26 09:48:41', '2026-02-25 09:48:41'),
	(179, 15, 'f61fd100142e9fdf46a746a613a8141a97f8817d3c3a73555a87ff315f1dbdd6', '2026-02-27 00:16:29', '2026-02-26 00:16:29'),
	(180, 13, '161ebbd26beaf1e8c5cfd4c085f3b9bd5d3dc61525f3ef7334698745d824352f', '2026-02-27 00:16:34', '2026-02-26 00:16:34'),
	(181, 13, '80ede0ebbd4e89ef51a8ece6bc30bf74afb1b4d5760043758a479b5eab3b1f81', '2026-02-27 00:56:41', '2026-02-26 00:56:41'),
	(182, 13, '60004874f467e09bebe942374b502f903396e15f1bf2c946479c68c68a4c4660', '2026-02-28 02:29:06', '2026-02-27 02:29:06'),
	(183, 15, '6346357718e1a0d8056040f59c0acd996d712ff49cd630751ac1d965921f3f84', '2026-02-28 02:29:21', '2026-02-27 02:29:21'),
	(184, 15, 'ae90cdbb1a46cf59c526ed8b7f9078fc2e190bef5860301c81eb72b3c3627d21', '2026-02-28 03:01:27', '2026-02-27 03:01:27'),
	(185, 13, '7b2b7f44abca2831ca1e37725a2b0b19d6b0455f9d84936872a2d5f8b5c66882', '2026-02-28 03:01:39', '2026-02-27 03:01:39'),
	(186, 13, '8f36b09cb1411e14cb13ad151b634b157166b735deec591e47d1b270a909fbab', '2026-02-28 14:57:51', '2026-02-27 14:57:51'),
	(188, 13, '2335aea61e1c9e7759ae23da0038e04a7644256576733e7f529064f6cd994ee0', '2026-02-28 15:33:06', '2026-02-27 15:33:06'),
	(190, 15, '243bd265cd6285cc23eca03cb23289edf89eb963b4118ffc75ee98d4dd768bfa', '2026-03-01 00:52:50', '2026-02-28 00:52:50'),
	(191, 13, 'ab67812db0b7ebaefffd50c5aaae9a9ea0c94834bb5c6546cf0dba15fb6721bc', '2026-03-01 03:47:56', '2026-02-28 03:47:56'),
	(194, 15, 'a686f4f9b34c54241fb208ad84927d592eeacb7021e7cd5184232be33fe25ad9', '2026-03-01 05:20:34', '2026-02-28 05:20:34'),
	(195, 13, '542bfec089926b5759b1b9d85484b6862cfc85921545852a2801c3f4dd963c27', '2026-03-01 06:12:53', '2026-02-28 06:12:53'),
	(196, 15, '0f89d8cdcad381759e6b8d7f73e5ab9b4c7367276cc267b3002e1fcc99885713', '2026-03-01 06:13:03', '2026-02-28 06:13:03'),
	(197, 13, '0bf54202d579b1f8a7e6e08ac889f11f69dab57a7db6fe87f6ca74e4e8c0fb07', '2026-03-01 06:13:57', '2026-02-28 06:13:57'),
	(201, 15, '54a9a136286e70ba0591e17d47b92dfcd81fa47be09f752d827d923c086ddc50', '2026-03-01 06:18:14', '2026-02-28 06:18:14'),
	(203, 13, 'a88bc556a42f54ea052117cbd9b9d14fb854e266a97461e4b889af55a9cdd3e5', '2026-03-01 06:39:24', '2026-02-28 06:39:24'),
	(204, 12, '00fa7b8c897c2e635dbd4e7326d4a4203e1bc951ec412b5433af09528f875a5e', '2026-03-01 07:14:18', '2026-02-28 07:14:18'),
	(205, 13, 'efa09267de06ac31c02dfa79703835675b8ff0527ccb50756682bdf80399e189', '2026-03-01 07:16:01', '2026-02-28 07:16:01'),
	(206, 12, '5c84e6389a7da8d1ecea0e74a31a3a51165eb2d073e443cdc4a690fe6375253e', '2026-03-01 07:16:51', '2026-02-28 07:16:51'),
	(208, 19, '11ae7e54028f9592cb305a7696cb5c635ed9850c3dddc4347c44bbadade8b98e', '2026-03-01 08:07:03', '2026-02-28 08:07:03'),
	(209, 15, '4e41c741e4afe779a46b979ec7712ab610aab3281c65ac4186cbaa6732ed2258', '2026-03-01 08:07:25', '2026-02-28 08:07:25'),
	(210, 13, '7d71743988e381f3d4aca92cacf8fd16fa97257501e76b420c0c9e449e76c837', '2026-03-01 13:55:07', '2026-02-28 13:55:07'),
	(211, 15, '118ada82bc65abf05d2476b7bc14f35d70dcd2146fa2089a281df9e1d5d4c0bf', '2026-03-01 14:43:24', '2026-02-28 14:43:24'),
	(212, 13, '980fb5b345273948a2e2a68f2b1c7108c3106e4b91757f56c4234eeb1802867b', '2026-03-01 16:57:03', '2026-02-28 16:57:03'),
	(213, 15, '31456a029b8e189c79b861b8eb0c50583b24b4e19cd071d1f483324e66d45340', '2026-03-01 16:57:27', '2026-02-28 16:57:27'),
	(214, 13, 'e5ed0ccfda5e14598ebd844735b2f99afcb1dcc2f78378f2f37d235e2cd3fdc1', '2026-03-02 02:22:46', '2026-03-01 02:22:46'),
	(215, 15, 'e3785f37de77bf658f9d322c34c08211e14b02b6ad9b4dfeaf101b7f468d7a73', '2026-03-02 02:23:28', '2026-03-01 02:23:28'),
	(218, 13, '762b6fea6eabf72d58f79b5ac6ea5498a18d01908605ece7938ba6712b78dad4', '2026-03-02 15:13:08', '2026-03-01 15:13:08'),
	(220, 12, 'be0f7ac49a4099c9d3ebe61557d644aa877a188ed16103f893510130b738ecec', '2026-03-02 15:34:42', '2026-03-01 15:34:42'),
	(221, 13, 'c35b1f5db2a387906bc8f964ced74a5515fe65c41bf20c41ecc43d2675c39e50', '2026-03-03 00:13:55', '2026-03-02 00:13:55'),
	(228, 15, 'c8f0492f825b384353d74f8f5418b2ec2acb0cd3e77dfa145bc66564914fa9e0', '2026-03-03 05:28:21', '2026-03-02 05:28:21'),
	(229, 15, '0ba6a0653049b8e29fd553346ea3fb44f25115c01d28853e0426939fc4cebc0e', '2026-03-03 05:28:58', '2026-03-02 05:28:58'),
	(231, 15, 'f4c467d8be6fc2714a05cc8b24e02184e4fb0f780e204925cf8b780da273a56c', '2026-03-03 05:35:00', '2026-03-02 05:35:00'),
	(233, 19, '6502772c19cf82e13ba1a174da02a743b9207710da0e31a7f01d86aa5b9a3db4', '2026-03-03 05:35:42', '2026-03-02 05:35:42'),
	(234, 13, '9ea53b0494540c43282bc2803f0dff73b707be0434fad2f9ab1585d761da8004', '2026-03-03 05:40:58', '2026-03-02 05:40:58'),
	(236, 13, 'f6f5fb53d7dc1dcd63d80bb15870b13d460f3d5aceb44fa5147e1c30a441613a', '2026-03-03 06:20:42', '2026-03-02 06:20:42'),
	(240, 15, 'cd0b8d0afe9e5f51eadbf1e6bc4407f7834781baea562e6b74c272783742326e', '2026-03-03 11:26:38', '2026-03-02 11:26:38'),
	(241, 12, '4e155e30d8666c286be87874c71a79917e1de2150b21d12df4ed685345cb7833', '2026-03-03 12:30:28', '2026-03-02 12:30:28'),
	(242, 13, '230dc3f19ef63736785346e36a7e48e0ffaf7fc8c8e6b4d8260f13a1f499c05a', '2026-03-03 12:33:38', '2026-03-02 12:33:38'),
	(244, 19, '0fbc961af5b958996584c3bba5d895aaf5a0b92290b21f3b588c90f9e0afc2fc', '2026-03-03 13:19:12', '2026-03-02 13:19:12'),
	(247, 20, '858438962b67d52dd0a39e3c4a1a74e84106045f60b03736aba6ba098d88473f', '2026-03-03 13:53:55', '2026-03-02 13:53:55'),
	(249, 15, '64a5f5a76762abaa4db96e93166663b2446197a0e4ffbc535ee4f90a81216169', '2026-03-04 00:11:09', '2026-03-03 00:11:09'),
	(251, 19, '3c030b9cbb6e12cd8d1ca68e4f25e09449694e466f21cf5e44c99e991184be5a', '2026-03-04 01:11:33', '2026-03-03 01:11:33'),
	(254, 13, '0179681805b790e80f5aa2d26f3a1b33edb56de8febd094a87badd30a5031b51', '2026-03-04 03:15:04', '2026-03-03 03:15:04'),
	(255, 12, 'c633a57816c1da2e8d1a3420ba55bcfc522ad57ccc5b3752fa55ef8051c0ce26', '2026-03-04 05:56:20', '2026-03-03 05:56:20'),
	(258, 12, '9d1db2169b860555717a55374e12a3468a45051dfd31b4494b4bb1e948a8a164', '2026-03-04 08:37:04', '2026-03-03 08:37:04'),
	(259, 13, '0e6dd14d0df861936b0baf751b09ce3a1777618ba22fa579d9e846e4c89a8e8c', '2026-03-04 10:45:16', '2026-03-03 10:45:16'),
	(260, 15, '1169b436121aa3a03e1f8efce8edf2d8d098807b0b0da558fff881ad63a5f7cf', '2026-03-04 10:46:04', '2026-03-03 10:46:04'),
	(261, 19, '413e5e26a6d96a671354ce6ab7705c8d43cfa6e75fdcf8531b0621a478f394e9', '2026-03-04 10:46:17', '2026-03-03 10:46:17'),
	(262, 12, '949d386d064f24a9ff87a08e666b8cc4cc6a823e222a765e815bc62cee789881', '2026-03-04 10:48:09', '2026-03-03 10:48:09'),
	(269, 13, '5fe28ddb31f33ee865b3825b6aab58524d3e2c4c00a52cc3adea2b065b0d28da', '2026-03-05 01:54:27', '2026-03-04 01:54:27'),
	(272, 20, '89aff6266b13157014f693e789ba734181898d1dbadf01f5910b8758cd8c8b8d', '2026-03-05 08:06:45', '2026-03-04 08:06:45'),
	(277, 12, '3ff03864b8792cb8bbda7025f150b704c69c25c47ab5f49f047395fa0976b864', '2026-03-05 15:30:39', '2026-03-04 15:30:39'),
	(283, 23, 'b0bdba075eec06d5fa56af2e0a538a5b4562df8a9f1d59ae2f67c3ae098d469f', '2026-03-06 01:03:48', '2026-03-05 01:03:48');

-- Dumping structure for table react1.0.user_widget_access
CREATE TABLE IF NOT EXISTS `user_widget_access` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `widget_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_widget` (`user_id`,`widget_id`),
  KEY `fk_uw_widget` (`widget_id`),
  CONSTRAINT `fk_uw_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_uw_widget` FOREIGN KEY (`widget_id`) REFERENCES `widgets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table react1.0.user_widget_access: ~5 rows (approximately)
DELETE FROM `user_widget_access`;
INSERT INTO `user_widget_access` (`id`, `user_id`, `widget_id`) VALUES
	(83, 12, 1),
	(80, 13, 2),
	(81, 15, 2),
	(76, 19, 2),
	(70, 20, 1),
	(85, 23, 5);

-- Dumping structure for table react1.0.widgets
CREATE TABLE IF NOT EXISTS `widgets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table react1.0.widgets: ~3 rows (approximately)
DELETE FROM `widgets`;
INSERT INTO `widgets` (`id`, `code`, `name`, `description`) VALUES
	(1, 'doctor', 'Doctor Panel', 'Displays patient consultations, prescriptions, and lab results'),
	(2, 'triage', 'Triage Panel', 'Displays patient queue, vital signs, and triage statistics'),
	(4, 'tv', 'TV Display', 'Displays live queue numbers on TV screen'),
	(5, 'encoder', 'Encoder Panel', 'Displays patient name, consultation description, and list of visits');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
