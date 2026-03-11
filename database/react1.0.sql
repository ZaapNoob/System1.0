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
	(1, 'Ariman', 0, 0, 0),
	(2, 'Bagacay', 0, 0, 0),
	(3, 'Balud Del Norte (Poblacion)', 1, 0, 1),
	(4, 'Balud Del Sur (Poblacion)', 0, 0, 0),
	(5, 'Benguet', 0, 0, 0),
	(6, 'Bentuco', 0, 0, 0),
	(7, 'Beriran', 0, 0, 0),
	(8, 'Buenavista', 1, 0, 1),
	(9, 'Bulacao', 0, 0, 0),
	(10, 'Cabigaan', 0, 0, 0),
	(11, 'Cabiguhan', 0, 0, 0),
	(12, 'Carriedo', 0, 0, 0),
	(13, 'Casili', 0, 0, 0),
	(14, 'Cogon', 1, 0, 1),
	(15, 'Cota Na Daco (Poblacion)', 1, 0, 1),
	(16, 'Dita', 0, 0, 0),
	(17, 'Jupi', 0, 0, 0),
	(18, 'Lapinig', 0, 0, 0),
	(19, 'Luna-Candol (Poblacion)', 0, 0, 0),
	(20, 'Manapao', 0, 0, 0),
	(21, 'Manook (Poblacion)', 4, 0, 4),
	(22, 'Naagtan', 0, 0, 0),
	(23, 'Nato', 0, 0, 0),
	(24, 'Nazareno', 1, 0, 1),
	(25, 'Ogao', 0, 0, 0),
	(26, 'Paco', 1, 0, 1),
	(27, 'Panganiban (Poblacion)', 1, 0, 1),
	(28, 'Paradijon (Poblacion)', 0, 0, 0),
	(29, 'Patag', 0, 0, 0),
	(30, 'Payawin', 0, 0, 0),
	(31, 'Pinontingan (Poblacion)', 0, 0, 0),
	(32, 'Rizal', 0, 0, 0),
	(33, 'San Ignacio', 2, 0, 2),
	(34, 'Sangat', 0, 0, 0),
	(35, 'Santa Ana', 0, 0, 0),
	(36, 'Tabi', 0, 0, 0),
	(37, 'Tagaytay', 0, 0, 0),
	(38, 'Tigkiw', 0, 0, 0),
	(39, 'Tiris', 0, 0, 0),
	(40, 'Togawe', 0, 0, 0),
	(41, 'Union', 0, 0, 0),
	(42, 'Villareal', 0, 0, 0),
	(43, 'Outside Gubat', 0, 1, 0);

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
  `queue_id` int DEFAULT NULL,
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
  `diagnosis` text,
  `treatment` text,
  `patient_illness` text,
  `remarks` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_queue` (`queue_id`),
  KEY `fk_consult_queue` (`queue_id`),
  KEY `fk_consult_patient` (`patient_id`),
  KEY `fk_consult_doctor` (`doctor_id`),
  CONSTRAINT `fk_consult_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients_db` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_consult_queue` FOREIGN KEY (`queue_id`) REFERENCES `patient_queue` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table react1.0.consultations: ~0 rows (approximately)
DELETE FROM `consultations`;

-- Dumping structure for table react1.0.doctor_patient_queue
CREATE TABLE IF NOT EXISTS `doctor_patient_queue` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `patient_queue_id` int DEFAULT NULL,
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
  KEY `idx_patient_queue` (`patient_queue_id`),
  CONSTRAINT `fk_dpq_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_dpq_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients_db` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_dpq_patient_queue` FOREIGN KEY (`patient_queue_id`) REFERENCES `patient_queue` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table react1.0.doctor_patient_queue: ~0 rows (approximately)
DELETE FROM `doctor_patient_queue`;

-- Dumping structure for table react1.0.household_sequence
CREATE TABLE IF NOT EXISTS `household_sequence` (
  `year` int NOT NULL,
  `seq` int NOT NULL,
  PRIMARY KEY (`year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table react1.0.household_sequence: ~0 rows (approximately)
DELETE FROM `household_sequence`;
INSERT INTO `household_sequence` (`year`, `seq`) VALUES
	(2026, 13);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table react1.0.lab_requests: ~0 rows (approximately)
DELETE FROM `lab_requests`;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table react1.0.lab_request_tests: ~0 rows (approximately)
DELETE FROM `lab_request_tests`;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table react1.0.medical_certificates: ~0 rows (approximately)
DELETE FROM `medical_certificates`;

-- Dumping structure for table react1.0.panels
CREATE TABLE IF NOT EXISTS `panels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table react1.0.panels: ~4 rows (approximately)
DELETE FROM `panels`;
INSERT INTO `panels` (`id`, `code`, `name`) VALUES
	(1, 'patient', 'Patient'),
	(2, 'queuegen', 'Queue Generator'),
	(3, 'medical', 'Medical'),
	(4, 'laboratory', 'Laboratory'),
	(5, 'reports', 'Reports');

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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table react1.0.patients_db: ~12 rows (approximately)
DELETE FROM `patients_db`;
INSERT INTO `patients_db` (`id`, `barangay_id`, `purok_id`, `patient_code`, `first_name`, `middle_name`, `last_name`, `suffix`, `date_of_birth`, `birthplace`, `age`, `gender`, `marital_status`, `blood_type`, `mother_name`, `spouse_name`, `contact_number`, `household_no`, `facility_household_no`, `education_level`, `employment_status`, `family_member_type`, `dswd_nhts`, `member_4ps`, `pcb_member`, `philhealth_member`, `philhealth_status_type`, `philhealth_no`, `philhealth_category`, `profile_image`, `status`, `created_at`, `last_household_move_at`, `region`, `province`, `city_municipality`, `barangay_name`, `street`) VALUES
	(1, 21, NULL, 'manook_(poblacion)_001', 'John Rafael', NULL, 'Escanilla', NULL, '2002-10-25', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00001', 'RHU-M(-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-09 03:44:48', '2026-03-09 11:45:08', NULL, NULL, NULL, NULL, NULL),
	(2, 24, NULL, 'nazareno_001', 'ZENAIDA', 'HABITAN', 'ENCINARES', NULL, '1945-06-27', NULL, 80, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00002', 'RHU-N-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-09 05:20:11', NULL, NULL, NULL, NULL, NULL, NULL),
	(3, 27, NULL, 'panganiban_(poblacion)_001', 'YVONNE', 'ROCHA', 'MACARAEG', '', '1956-10-26', '', 69, 'Female', 'Widowed', '', '', '', '', '2026-00003', 'RHU-P(-00001', 'Unknown', 'Others', NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-09 05:24:39', NULL, NULL, NULL, NULL, NULL, NULL),
	(4, 3, NULL, 'balud_del_norte_(poblacion)_001', 'Luz', 'Flestado', 'Divina', NULL, '1968-03-01', NULL, 58, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00004', 'RHU-BD-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-09 05:31:28', NULL, NULL, NULL, NULL, NULL, NULL),
	(5, 15, NULL, 'cota_na_daco_(poblacion)_001', 'RUTH', 'SALVAN', 'HASOPARDO', NULL, '1963-08-01', NULL, 62, 'Female', 'Co-habitation', NULL, NULL, NULL, NULL, '2026-00005', 'RHU-CN-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-09 05:33:11', NULL, NULL, NULL, NULL, NULL, NULL),
	(6, 8, NULL, 'buenavista_001', 'ISIDRO', 'ESPENIDA', 'FERERRAS', NULL, '1954-08-06', NULL, 71, 'Male', 'Married', NULL, NULL, NULL, NULL, '2026-00006', 'RHU-B-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-09 05:38:02', NULL, NULL, NULL, NULL, NULL, NULL),
	(7, 14, NULL, 'cogon_001', 'ZAFRIAH MADISSON', 'ENANO', 'FEOLINO', NULL, '2025-09-20', NULL, 0, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00007', 'RHU-C-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-09 05:40:45', NULL, NULL, NULL, NULL, NULL, NULL),
	(8, 33, NULL, 'san_ignacio_001', 'DIOGENES', 'ESTREBILLO', 'DOGILLO', NULL, '1947-03-20', NULL, 78, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00008', 'RHU-SI-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-09 05:44:30', NULL, NULL, NULL, NULL, NULL, NULL),
	(9, 21, NULL, 'manook_(poblacion)_002', 'CYNTHIA', 'AGUSTIN', 'MARCIAL', NULL, '1952-08-20', NULL, 73, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00009', 'RHU-M(-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-09 06:19:53', NULL, NULL, NULL, NULL, NULL, NULL),
	(10, 26, NULL, 'paco_001', 'ANNIANA', 'ESPENILE', 'BRONOLA', NULL, '2026-01-20', NULL, 0, 'Female', NULL, NULL, NULL, NULL, NULL, '2026-00010', 'RHU-P-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-09 06:20:55', NULL, NULL, NULL, NULL, NULL, NULL),
	(11, 33, NULL, 'san_ignacio_002', 'ELENA', 'BALALA', 'ESTAYANE', NULL, '1961-05-20', NULL, 64, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00011', 'RHU-SI-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-09 06:26:44', NULL, NULL, NULL, NULL, NULL, NULL),
	(12, 21, 1, 'manook_(poblacion)_003', 'JAMES ALDRIN', 'ESCANILLA', 'TIN', NULL, '2010-03-28', NULL, 15, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00012', 'RHU-M(-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-09 07:03:32', NULL, NULL, NULL, NULL, NULL, NULL),
	(13, 21, 1, 'manook_(poblacion)_004', 'DAISY', 'ENCONADO', 'ESCANILLA', NULL, '1988-02-28', NULL, 38, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00013', 'RHU-M(-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-09 07:08:59', NULL, NULL, NULL, NULL, NULL, NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table react1.0.patient_household_history: ~0 rows (approximately)
DELETE FROM `patient_household_history`;
INSERT INTO `patient_household_history` (`id`, `patient_id`, `old_barangay_id`, `old_household_no`, `old_facility_household_no`, `new_barangay_id`, `new_household_no`, `new_facility_household_no`, `move_reason`, `moved_at`, `moved_by`) VALUES
	(1, 1, 21, NULL, NULL, 21, '2026-00001', 'RHU-M(-00001', 'Patient transfer', '2026-03-09 03:45:08', 1);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table react1.0.patient_queue: ~0 rows (approximately)
DELETE FROM `patient_queue`;

-- Dumping structure for table react1.0.puroks
CREATE TABLE IF NOT EXISTS `puroks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `barangay_id` int NOT NULL,
  `purok_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_purok` (`barangay_id`,`purok_name`),
  CONSTRAINT `fk_purok_barangay` FOREIGN KEY (`barangay_id`) REFERENCES `barangays` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table react1.0.puroks: ~4 rows (approximately)
DELETE FROM `puroks`;
INSERT INTO `puroks` (`id`, `barangay_id`, `purok_name`) VALUES
	(3, 8, 'Purok 1b'),
	(4, 14, 'Avocado'),
	(2, 15, 'Purok 1-d Gumang'),
	(1, 21, 'Purok 4');

-- Dumping structure for table react1.0.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table react1.0.roles: ~11 rows (approximately)
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
	(17, 'encoder', 'Encoder', NULL, '2026-03-05 01:03:02'),
	(18, 'tv', 'TV', NULL, '2026-03-09 02:25:02');

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
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table react1.0.users: ~11 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `uuid`, `name`, `email`, `password_hash`, `role`, `status`, `created_at`, `updated_at`) VALUES
	(5, '550e8400-e29b-41d4-a716-446655440000', 'John Doe', 'john@example.com', '$2y$10$mkFxgzkE8AYnTVgtOQPnMuctPun99qHtq6WGMAmbZx0q3sOm0UV2i', 'user', 'active', '2026-01-08 13:29:09', '2026-01-08 14:53:48'),
	(12, '9109a251-f911-11f0-a427-34e6d71ed611', 'Ronald E. Fererras', 'ronald@gmail.com', '$2y$10$hfT.hDCVr0BiFpqbZRPArOoNsmKWburBKASZ8byv0YoJoTCo88riG', 'doctor', 'active', '2026-01-24 10:43:49', '2026-03-09 03:25:23'),
	(13, '3806a1ac-f912-11f0-a427-34e6d71ed611', 'Rona', 'rona@gmail.com', '$2y$10$BvSZoQYUzjVCz2pGi6A/TeFzIH6a9y3dfH0.lVCnRm8r2E/HsOoXa', 'triage', 'active', '2026-01-24 10:48:29', '2026-01-24 10:48:29'),
	(14, 'bc13750e-f912-11f0-a427-34e6d71ed611', 'Nurses', 'nurse@gmail.com', '$2y$10$AmAbXIO1htpyPfSNNUY7Yu/YhdivaTXGnL1fi/i03uO.XQe069/ka', 'nurse', 'active', '2026-01-24 10:52:10', '2026-01-24 10:52:10'),
	(15, '3e4b337c-f913-11f0-a427-34e6d71ed611', 'cashier', 'cashier@gmail.com', '$2y$10$miMxELICWHAH/S7ysZTzFe9do4C4BEqhGxmTWY32HB8b.U2SPu9.a', 'cashier', 'active', '2026-01-24 10:55:49', '2026-01-24 10:55:49'),
	(16, '34ed2c28-f9ba-11f0-a612-34e6d71ed611', 'Loki', 'Pet@gmail.com', '$2y$10$XIttzMrF8Rk8eGgok23mg.fGsSeiM7a/fJ2HwcT9H5d9CumAeXQQy', 'pet', 'active', '2026-01-25 06:50:59', '2026-01-25 06:50:59'),
	(17, '5d75e27d-f9c0-11f0-a612-34e6d71ed611', 'Seller', 'seller@gmail.com', '$2y$10$7UxBawEgcPd.SKj2xRPwlOxr65OkU7ThuzGIVRiQzRsn9B..dl0xu', 'seller', 'active', '2026-01-25 07:35:04', '2026-01-25 07:35:04'),
	(18, 'be4d2b2b-f9c0-11f0-a612-34e6d71ed611', 'Rafael', 'rafael@gmail.com', '$2y$10$Yb.9G0N1REL27ANen9lWc.FzFjCtnrf6aFTaGSX96NGJJ7CYHQpxG', 'user', 'active', '2026-01-25 07:37:47', '2026-01-25 07:37:47'),
	(19, '0a67ad70-fb3f-11f0-92de-34e6d71ed611', 'Ian', 'ian@gmail.com', '$2y$10$rBx8JoTHUwUjZCaWfYKJz.Txgm9Z5jXA6ochFP6tD48qXRXE/aiU.', 'admin', 'active', '2026-01-27 05:14:22', '2026-01-27 05:14:22'),
	(20, '07266b90-022f-11f1-89a5-34e6d71ed611', 'Mari-Ann Kristine P. Ecleo', 'Mari-Ann@gmail.com', '$2y$10$osxlehTAqNnrY8zhB0wjzuXwVWexZSo9gyUSkWHH.1tjr6lO5hVFO', 'doctor', 'active', '2026-02-05 01:07:23', '2026-03-09 03:26:30'),
	(23, '19a8551f-182f-11f1-b669-34e6d71ed611', 'encoder', 'encoder@gmail.com', '$2y$10$vTuIy6ilsmDqszx0AZnou.DEpZ8c24V0TgsKQu6JdHzqqoGkQU.uG', 'encoder', 'active', '2026-03-05 01:03:19', '2026-03-05 01:03:19'),
	(24, 'bb6b7f26-1af6-11f1-b875-34e6d71ed611', 'Johan Joseph E. Gamil', 'gamil@gmail.com', '$2y$10$6LAN6Lqtm6p82JBiBXiaoOPmUFSw8pw6XtEbFDiQIC8CFW4svvWI2', 'doctor', 'active', '2026-03-08 13:57:23', '2026-03-08 13:57:23'),
	(25, '501a65a4-1af7-11f1-b875-34e6d71ed611', 'Gian Carlo E. Escobedo', 'escobedo@gmail.com', '$2y$10$A9aWwBzyOxc9ZN20eUM63ObjL/dUz8arlTNk6fTTVeawhemrpxZXe', 'doctor', 'active', '2026-03-08 14:01:32', '2026-03-08 14:01:32'),
	(26, '3b2ca3f5-1b5f-11f1-bb49-34e6d71ed611', 'TV', 'TV@gmail.com', '$2y$10$Q5GsW4ddGH8ftEcZEwOnreRouTejiYZOhLoP3xdJZeJRyDHQSW.4y', 'tv', 'active', '2026-03-09 02:25:25', '2026-03-09 02:25:25');

-- Dumping structure for table react1.0.user_panel_access
CREATE TABLE IF NOT EXISTS `user_panel_access` (
  `user_id` bigint unsigned NOT NULL,
  `panel_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`panel_id`),
  KEY `panel_id` (`panel_id`),
  CONSTRAINT `user_panel_access_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_panel_access_ibfk_2` FOREIGN KEY (`panel_id`) REFERENCES `panels` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table react1.0.user_panel_access: ~16 rows (approximately)
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
	(24, 3),
	(25, 3),
	(12, 4),
	(20, 4),
	(24, 4),
	(25, 4),
	(13, 5);

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
	(20, NULL, '', '', '0121966', 'MD, CPC-FP '),
	(24, NULL, '', '', '0169123', 'MD');

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
) ENGINE=InnoDB AUTO_INCREMENT=394 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table react1.0.user_sessions: ~185 rows (approximately)
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
	(287, 23, '67f3cafae8890049caf3d721c8e6c947597a71a4529d91db9c8830a533ea9f58', '2026-03-06 03:34:57', '2026-03-05 03:34:57'),
	(291, 12, '63c74ed47201f009ff349349a46cc4ab204a3c849b82c70cfc13679aedcb3905', '2026-03-06 07:08:21', '2026-03-05 07:08:21'),
	(292, 23, 'ac88b32ea08c6cf9d5cf76a7f3ca2f75a4452ef9c67219ee3ee6b54ae567fe54', '2026-03-06 08:02:08', '2026-03-05 08:02:08'),
	(293, 23, '69fdf95678f7df7135f7333fb2f0854fa4d0393afc72670e8e8e85ea44ddb0d1', '2026-03-06 08:14:03', '2026-03-05 08:14:03'),
	(298, 12, 'a2119cf75952d4741e9f6937672056d54c37a8d8eca50060d465774ecb1502c4', '2026-03-06 10:49:12', '2026-03-05 10:49:12'),
	(299, 13, 'f7fc6627b9203ae46c206f88b130fd3624131bac60f4de58e43c913afb5fed70', '2026-03-06 10:50:41', '2026-03-05 10:50:41'),
	(300, 15, '4b8f97d8cf8373f57fcd2c6aacd235f2bb47ebcead2dbe98c231752e0e186f2e', '2026-03-06 10:51:12', '2026-03-05 10:51:12'),
	(301, 13, 'ca8e795349615971e860be55f3d485609a1df9f6788c600859f8d3cd53b54783', '2026-03-06 15:45:38', '2026-03-05 15:45:38'),
	(302, 13, 'b6144db7cb252de2bca56116d61dabb228180505c98c68221e4bc90112c1ed15', '2026-03-07 00:11:14', '2026-03-06 00:11:14'),
	(303, 13, '60d724ac4f6f139654e134d07aeab93102ce0fedb994ced5118319818661a1c4', '2026-03-07 02:41:02', '2026-03-06 02:41:02'),
	(304, 13, '5658c0297df74a33c4c13d23406dff28b843fa8b8e0b7dbe832bbdee9f119fb1', '2026-03-07 05:34:01', '2026-03-06 05:34:01'),
	(305, 13, 'fd5593ac18b77b1aee3932fc478fc4df541c92153a97224ce0129b76b62686f5', '2026-03-07 05:41:16', '2026-03-06 05:41:16'),
	(306, 12, '90612c41995f6fd764233dfd04b85c40bd75f6c3d1b1bad9b880b493f55ffb5a', '2026-03-07 05:46:36', '2026-03-06 05:46:36'),
	(307, 13, '9080e596de99f4b049f5a2a6d72f3c45970e6449c8fa6cd24f617381190b0457', '2026-03-07 05:47:44', '2026-03-06 05:47:44'),
	(308, 15, '367acc326d4d71f8811d231839a7044068a77d6fb2947717c23904125e060575', '2026-03-07 05:52:39', '2026-03-06 05:52:39'),
	(309, 13, 'fcfec546968951b30eb32e5ccb7c31b213861d18aa00e0e807a9e0f428a8e272', '2026-03-07 05:53:59', '2026-03-06 05:53:59'),
	(310, 13, '54f18db31bb52b4b1a5c2ada9fc682b4e829e18e1eb263fe293dc20c8a7c5ff5', '2026-03-07 05:58:03', '2026-03-06 05:58:03'),
	(311, 13, '42c737ceeb03d694f62ee92b14f75fe442a7f73fb9c51eac4c6d26bb9247b002', '2026-03-07 06:07:34', '2026-03-06 06:07:34'),
	(312, 13, 'ba04e8e1f8b7060bbbef56387e1f894f5a5aeeb3c2c2e779bc3cde9736783a9a', '2026-03-07 06:15:04', '2026-03-06 06:15:04'),
	(313, 13, '5b02ae0181a025dfb5280c5ac0cfd80c50c2717fb37b585f19e30faade156952', '2026-03-07 06:54:53', '2026-03-06 06:54:53'),
	(314, 13, '28ed44e3b8c2528bb62187b96c17c4e3d5f0e15a74cc2c35b5c8a45da225f46d', '2026-03-07 07:13:55', '2026-03-06 07:13:55'),
	(316, 13, '47855289f509416ddcd7c93e8dca7951a3e7bc1b4ff053eb6c6a2941493f3b93', '2026-03-07 07:50:50', '2026-03-06 07:50:50'),
	(317, 13, '45d8e4a9a995f70cd4ae533408fb5e6de53c9f581b77a74b847f9eb9a8e2c1c8', '2026-03-07 08:19:36', '2026-03-06 08:19:36'),
	(318, 13, '45c0318971b02d517829f4f8e69f7ffed24cba7d007ce3821a77614e6e2606b5', '2026-03-07 08:21:12', '2026-03-06 08:21:12'),
	(319, 13, '0c04300865af21ba17bf1cd450498e2be292c84b64fcf3d8a3f533d31243ba0d', '2026-03-07 08:28:19', '2026-03-06 08:28:19'),
	(322, 13, '66eece27b7c6515f27ed554094a354815d82d6d9b7d984f24e8faa7d1976f8a9', '2026-03-07 10:05:29', '2026-03-06 10:05:29'),
	(323, 13, '62f4f4c059e3ffd5c7086c7b1ec2874a2d5952ba0038a5e6818aaa26ccd4c076', '2026-03-07 10:25:45', '2026-03-06 10:25:45'),
	(326, 13, '62d38395769b558053e0612f647d4bc61c2e227a34e09898a2fcae733d59100e', '2026-03-07 11:04:34', '2026-03-06 11:04:34'),
	(327, 13, 'cb2cffeec88bb328edb7a49c25db9082f228772c87bae8f8c9bb5c03132693dc', '2026-03-07 11:40:40', '2026-03-06 11:40:40'),
	(328, 13, 'd372dbf731317f830302a90abc01fa6dd2724311db7c168a1ac6517f9be1f072', '2026-03-07 12:29:42', '2026-03-06 12:29:42'),
	(330, 12, '441081444442c922ece88598ecb35fdd30c60fb18c14329b087577fd43dd0fdf', '2026-03-08 03:39:40', '2026-03-07 03:39:40'),
	(332, 13, 'cea9b0c1e7bb002372f31decbc7a799e8906ccb1869969f639496507de541755', '2026-03-08 03:43:25', '2026-03-07 03:43:25'),
	(333, 13, 'ed5448f14967c6bfcc313761d4737acd864d1153744a2a1b8906bf83c8acfb70', '2026-03-08 03:46:32', '2026-03-07 03:46:32'),
	(334, 23, '3588e131b8686cab367118e4bf58f402ae70b68d01a92dab1406cdebb42038da', '2026-03-08 05:19:30', '2026-03-07 05:19:30'),
	(335, 13, '2985b219ae409cc0be88a56eeea3219b53a14354a0b67b3811f66646e75fb28d', '2026-03-08 05:20:13', '2026-03-07 05:20:13'),
	(336, 13, '7003f060de5194b9e423e0c93fff02c32c4778edac5f7dd28b52fa0ea0c1fcc4', '2026-03-08 10:22:10', '2026-03-07 10:22:10'),
	(340, 13, '64fd57168cfa8fb45365be8fd15828e533b62087687148617868a7695e90b3e0', '2026-03-08 13:38:55', '2026-03-07 13:38:55'),
	(341, 13, 'a5ba03861389dd551c2c65ff0ab09e7175b2dced96819b6aafe8a522eeac3077', '2026-03-08 14:58:47', '2026-03-07 14:58:47'),
	(342, 13, 'fb97813012e3d4f9327f9ba6f2a39d47b16658a0fb249908dc1ab40c571877e1', '2026-03-09 08:06:18', '2026-03-08 08:06:18'),
	(343, 13, '17dbd932f3aef468104e1d1a595d908f489ecbcb3240128059e3482e48dfce31', '2026-03-09 08:09:08', '2026-03-08 08:09:08'),
	(345, 12, '756dbc16bc72d27d348d4a25734f7c04c2865e95df8f8837540fde7a4fb4a259', '2026-03-09 11:19:27', '2026-03-08 11:19:27'),
	(346, 13, '3c3a04c96175a2cc7655599ae91205573e14c1a523ce17edde0a70ab16c27497', '2026-03-09 12:09:42', '2026-03-08 12:09:42'),
	(349, 13, '2630e26b30d9826c66c7bd8d71375a615d29dd3b2ab8fe4282c2a9cddaf30f3b', '2026-03-09 13:38:27', '2026-03-08 13:38:27'),
	(362, 12, 'c6405ab6feb2255121e05da787e0c359f374cc1ef173313a2820b085b516556c', '2026-03-09 22:17:19', '2026-03-08 22:17:19'),
	(364, 13, 'b863cf6cb28a489976d2a744ff444dd389598fa8d5463099b6367982fb875faf', '2026-03-09 22:37:40', '2026-03-08 22:37:40'),
	(366, 13, '8e9be0e02245c60142c531cfd8e0eaba8c426891d713b0bc5801409a93ab487c', '2026-03-10 00:58:11', '2026-03-09 00:58:11'),
	(378, 12, '0ca407513b3e230180922a3542211ecdcfb6ac44abe3ef21b6c1eb3fca801e4c', '2026-03-10 02:41:50', '2026-03-09 02:41:50'),
	(384, 12, '11a5331aaf38a57f24a0f06235357950b27b685439cab89296a195ed17f0daba', '2026-03-10 03:20:06', '2026-03-09 03:20:06'),
	(386, 20, '240d41c7577f77e7319e3249709f7b64946bf826c91485647792d8afd4809a4b', '2026-03-10 03:20:54', '2026-03-09 03:20:54'),
	(388, 12, '62416bada5f4d7f2388fe8400beb551dbe7d4fa2075a2354ac3c0df6e6f038e4', '2026-03-10 05:11:28', '2026-03-09 05:11:28'),
	(389, 13, 'a2246460c614be34e7e249d3ee25ef19e6059b550c774700e33bd363c57a2442', '2026-03-10 05:27:34', '2026-03-09 05:27:34'),
	(392, 13, 'dd9e5f2344a9f3d019840deec2cfc53d696d8c5adbb2c428fd029e10fd3b9687', '2026-03-11 06:18:06', '2026-03-10 06:18:06'),
	(393, 13, 'd79e04595a294b23705f6f280632ca7ae36ec701a365ab254c8db04b19fbb297', '2026-03-11 09:22:42', '2026-03-10 09:22:42');

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
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table react1.0.user_widget_access: ~8 rows (approximately)
DELETE FROM `user_widget_access`;
INSERT INTO `user_widget_access` (`id`, `user_id`, `widget_id`) VALUES
	(88, 12, 1),
	(80, 13, 2),
	(81, 15, 2),
	(76, 19, 2),
	(70, 20, 1),
	(85, 23, 5),
	(90, 24, 1),
	(89, 25, 1),
	(91, 26, 4);

-- Dumping structure for table react1.0.widgets
CREATE TABLE IF NOT EXISTS `widgets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table react1.0.widgets: ~4 rows (approximately)
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
