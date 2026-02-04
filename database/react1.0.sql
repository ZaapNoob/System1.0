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
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `last_patient_seq` int unsigned NOT NULL DEFAULT '0',
  `is_special` tinyint(1) NOT NULL DEFAULT '0',
  `facility_household_seq` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_barangay_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table react1.0.barangays: ~43 rows (approximately)
DELETE FROM `barangays`;
INSERT INTO `barangays` (`id`, `name`, `last_patient_seq`, `is_special`, `facility_household_seq`) VALUES
	(1, 'Ariman', 27, 0, 13),
	(2, 'Bagacay', 4, 0, 5),
	(3, 'Balud Del Norte (Poblacion)', 5, 0, 11),
	(4, 'Balud Del Sur (Poblacion)', 13, 0, 17),
	(5, 'Benguet', 1, 0, 3),
	(6, 'Bentuco', 6, 0, 10),
	(7, 'Beriran', 1, 0, 2),
	(8, 'Buenavista', 0, 0, 0),
	(9, 'Bulacao', 0, 0, 1),
	(10, 'Cabigaan', 4, 0, 1),
	(11, 'Cabiguhan', 1, 0, 2),
	(12, 'Carriedo', 0, 0, 1),
	(13, 'Casili', 5, 0, 2),
	(14, 'Cogon', 1, 0, 0),
	(15, 'Cota Na Daco (Poblacion)', 0, 0, 1),
	(16, 'Dita', 0, 0, 0),
	(17, 'Jupi', 0, 0, 0),
	(18, 'Lapinig', 1, 0, 1),
	(19, 'Luna-Candol (Poblacion)', 1, 0, 0),
	(20, 'Manapao', 0, 0, 0),
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
	(43, 'Outside Gubat', 2, 1, 1);

-- Dumping structure for event react1.0.cancel_daily_queues
DELIMITER //
CREATE EVENT `cancel_daily_queues` ON SCHEDULE EVERY 1 DAY STARTS '2026-02-05 00:00:00' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    UPDATE patient_queue
    SET status = 'cancelled',
        cancelled_by = 'system'
    WHERE status = 'waiting'
      AND queue_date = CURDATE();
END//
DELIMITER ;

-- Dumping structure for table react1.0.household_sequence
CREATE TABLE IF NOT EXISTS `household_sequence` (
  `year` int NOT NULL,
  `seq` int NOT NULL,
  PRIMARY KEY (`year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table react1.0.household_sequence: ~0 rows (approximately)
DELETE FROM `household_sequence`;
INSERT INTO `household_sequence` (`year`, `seq`) VALUES
	(2026, 64);

-- Dumping structure for table react1.0.panels
CREATE TABLE IF NOT EXISTS `panels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table react1.0.panels: ~2 rows (approximately)
DELETE FROM `panels`;
INSERT INTO `panels` (`id`, `code`, `name`) VALUES
	(1, 'patient', 'Patient'),
	(2, 'queuegen', 'Queue Generator');

-- Dumping structure for table react1.0.patients_db
CREATE TABLE IF NOT EXISTS `patients_db` (
  `id` int NOT NULL AUTO_INCREMENT,
  `barangay_id` int NOT NULL,
  `purok_id` int DEFAULT NULL,
  `patient_code` varchar(64) COLLATE utf8mb4_general_ci NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `middle_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `suffix` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date_of_birth` date NOT NULL,
  `birthplace` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `age` int DEFAULT NULL,
  `gender` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `marital_status` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `blood_type` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mother_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `spouse_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contact_number` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `household_no` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `facility_household_no` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `education_level` enum('No Formal Education','Elementary','High School','Vocational','College','Post Graduate','Unknown') COLLATE utf8mb4_general_ci DEFAULT 'Unknown',
  `employment_status` enum('Employed','Unemployed','Retired','Others') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `family_member_type` enum('Father','Mother','Daughter','Son','Others') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dswd_nhts` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT 'No',
  `member_4ps` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT 'No',
  `pcb_member` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT 'No',
  `philhealth_member` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT 'No',
  `philhealth_status_type` enum('Member','Dependent') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `philhealth_no` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `philhealth_category` enum('None','FE - Private','FE - Government','DIRECT CONTRIBUTOR - PROFESSIONAL PRACTITIONER','DIRECT CONTRIBUTOR - SELF-EARNING INDIVIDUAL - SOLE PROPRIETOR','FE - ENTERPRISE OWNER','FE - FAMILY DRIVER','FE - GOVT - CASUAL','FE - GOVT - CONTRACT/PROJECT BASED','FE - GOVT - PERMANENT REGULAR','FE - HOUSEHOLD HELP/KASAMBAHAY','FE - PRIVATE - CASUAL','FE - PRIVATE - CONTRACT/PROJECT BASED','FE - PRIVATE - PERMANENT REGULAR','IE - CITIZEN OF OTHER COUNTRIES WORKING/RESIDING/STUDYING IN THE PHILIPPINES','IE - FILIPINO WITH DUAL CITIZENSHIP','IE - INFORMAL SECTOR','IE - MIGRANT WORKER - LAND BASED','IE - MIGRANT WORKER - SEA BASED','IE - NATURALIZED FILIPINO CITIZEN','IE - ORGANIZED GROUP','IE - SELF EARNING INDIVIDUAL','INDIGENT - NHTS-PR','INDIRECT CONTRIBUTOR - 4PS/MCCT','INDIRECT CONTRIBUTOR - BANGSAMORO/NORMALIZATION','INDIRECT CONTRIBUTOR - FINANCIALLY INCAPABLE','INDIRECT CONTRIBUTOR - KIA/KIPO','INDIRECT CONTRIBUTOR - LISTAHANAN','INDIRECT CONTRIBUTOR - PAMANA','INDIRECT CONTRIBUTOR - PERSON WITH DISABILITY','INDIRECT CONTRIBUTOR - PRIVATE-SPONSORED','INDIRECT CONTRIBUTOR - SOLO PARENT','LIFETIME MEMBER - RETIREE/PENSIONER','LIFETIME MEMBER - WITH 120 MONTHS CONTRIBUTION AND HAS REACHED RETIREMENT AGE','SENIOR CITIZEN','SPONSORED - LGU','SPONSORED - NGA','SPONSORED - OTHERS','SPONSORED - POS - FINANCIALLY INCAPABLE') COLLATE utf8mb4_general_ci DEFAULT 'None',
  `profile_image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('active','inactive','deceased') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_household_move_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_patient_code` (`patient_code`),
  UNIQUE KEY `uq_barangay_patient` (`barangay_id`,`patient_code`),
  KEY `idx_identity` (`first_name`,`last_name`,`date_of_birth`,`gender`),
  KEY `fk_barangay_id` (`barangay_id`),
  KEY `fk_purok_id` (`purok_id`),
  CONSTRAINT `fk_patient_barangay` FOREIGN KEY (`barangay_id`) REFERENCES `barangays` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_patient_purok` FOREIGN KEY (`purok_id`) REFERENCES `puroks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table react1.0.patients_db: ~72 rows (approximately)
DELETE FROM `patients_db`;
INSERT INTO `patients_db` (`id`, `barangay_id`, `purok_id`, `patient_code`, `first_name`, `middle_name`, `last_name`, `suffix`, `date_of_birth`, `birthplace`, `age`, `gender`, `marital_status`, `blood_type`, `mother_name`, `spouse_name`, `contact_number`, `household_no`, `facility_household_no`, `education_level`, `employment_status`, `family_member_type`, `dswd_nhts`, `member_4ps`, `pcb_member`, `philhealth_member`, `philhealth_status_type`, `philhealth_no`, `philhealth_category`, `profile_image`, `status`, `created_at`, `last_household_move_at`) VALUES
	(1, 3, 1, 'balud_del_norte_(poblacion)_001', 'John', 'E', 'Doe', 'Jr', '2002-02-22', 'Manila', 23, 'Male', 'Single', 'A+', 'Joel', NULL, '09125517311', NULL, '100', 'No Formal Education', 'Employed', 'Daughter', 'No', 'No', 'No', 'No', NULL, NULL, 'None', NULL, 'active', '2026-01-28 01:27:14', NULL),
	(2, 4, 2, 'balud_del_sur_(poblacion)_001', 'John', 'S', 'Sie', 'III', '2002-02-22', 'Manila', 23, 'Male', 'Married', 'AB-', 'Johse', NULL, '091273124', NULL, '10', 'No Formal Education', 'Others', 'Mother', 'Yes', 'Yes', 'No', 'Yes', NULL, NULL, 'None', NULL, 'active', '2026-01-28 01:42:51', NULL),
	(3, 3, 1, 'balud_del_norte_(poblacion)_002', 'john', 'e', 'Jie', '', '1999-11-11', 'Manila', 26, 'Male', 'Separated', 'B-', 'Jul', NULL, '0128391213332', NULL, '10', 'Vocational', 'Retired', 'Son', 'Yes', 'Yes', 'No', 'Yes', NULL, NULL, 'None', NULL, 'active', '2026-01-28 01:45:14', NULL),
	(4, 3, 1, 'balud_del_norte_(poblacion)_003', 'john', 'h', 'Nie', '', '1999-11-11', 'Manila', 26, 'Male', 'Single', 'A+', 'Jouek', NULL, '0128391213332', NULL, '10', 'High School', 'Employed', 'Daughter', 'No', 'No', 'No', 'No', NULL, NULL, 'None', NULL, 'active', '2026-01-28 01:47:58', NULL),
	(5, 2, 3, 'bagacay_001', 'John', 'E', 'Fie', 'Jr', '1999-11-11', 'Manila', 26, 'Male', 'Single', 'A+', 'Kiel', NULL, '0912312321312', NULL, 'N/A', 'No Formal Education', 'Others', 'Mother', 'No', 'No', 'No', 'No', NULL, NULL, 'None', NULL, 'active', '2026-01-28 02:45:37', NULL),
	(6, 14, 4, 'cogon_001', 'Kersten', 'Flor', 'Labastida', '', '2002-04-10', 'Home', 23, 'Male', 'Separated', '', 'Narita F. Labastida', NULL, '', NULL, '', 'College', 'Unemployed', 'Son', 'No', 'No', 'No', 'No', NULL, NULL, 'None', NULL, 'active', '2026-01-28 03:16:20', NULL),
	(7, 10, NULL, 'cabigaan_001', 'John', 'e', 'wei', 'Jr', '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, 'None', NULL, 'active', '2026-01-28 03:31:01', NULL),
	(8, 5, NULL, 'benguet_001', 'john', 'e', 'Hie', 'Sr', '2002-02-22', 'Basud Sorsogon City', 23, 'Male', 'Single', 'A+', 'Es', NULL, '0928123', NULL, '222', 'No Formal Education', 'Employed', 'Mother', 'No', 'Yes', 'No', 'Yes', 'Member', '091263812', 'None', NULL, 'active', '2026-01-28 03:50:13', NULL),
	(9, 10, NULL, 'cabigaan_002', 'johan', 'E', 'Iee', 'Jr', '2001-02-22', 'JOoa', 24, 'Male', 'Single', 'A-', 'kiells', NULL, '0912312321312', '91', '09', 'College', 'Unemployed', 'Father', 'Yes', 'Yes', 'No', 'Yes', 'Member', '981231', 'IE - CITIZEN OF OTHER COUNTRIES WORKING/RESIDING/STUDYING IN THE PHILIPPINES', NULL, 'active', '2026-01-28 04:02:41', NULL),
	(10, 13, NULL, 'casili_001', 'john', 'd', 'Gie', 'Sr', '2002-02-22', 'Manila', 23, 'Male', 'Single', 'B+', 'Ia', NULL, 'no', '21', '100', 'Elementary', 'Unemployed', 'Mother', 'Yes', 'Yes', 'No', 'Yes', 'Member', '09123123', 'DIRECT CONTRIBUTOR - PROFESSIONAL PRACTITIONER', NULL, 'active', '2026-01-28 05:21:32', NULL),
	(11, 7, 6, 'beriran_001', 'jose', 'S', 'Marichan', 'III', '2002-02-22', 'Maria', 23, 'Male', 'Single', 'O+', 'SHA', NULL, '12', '172', '671', 'No Formal Education', 'Unemployed', 'Father', 'Yes', 'Yes', 'No', 'Yes', 'Dependent', '91281', 'IE - INFORMAL SECTOR', NULL, 'active', '2026-01-28 05:23:31', NULL),
	(12, 11, NULL, 'cabiguhan_001', 'john', 's', 'Hie', 'Sr', '2002-02-22', 'Manila', 23, 'Male', 'Married', 'B+', 'Huasd', NULL, '09125517311', '123', '12', 'College', 'Unemployed', 'Father', 'No', 'No', 'No', 'Yes', 'Dependent', '12831', 'IE - INFORMAL SECTOR', NULL, 'active', '2026-01-28 05:34:47', NULL),
	(13, 19, 7, 'luna-candol_(poblacion)_001', 'Rafael', 'E', 'Escanilla', 'Sr', '2002-02-22', 'Manila', 23, 'Male', 'Single', 'A-', 'Daisy Escanilla', NULL, '091234567891', '100', 'DOH', 'College', 'Unemployed', 'Son', 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-28 06:04:08', NULL),
	(14, 10, NULL, 'cabigaan_003', 'James', 'e', 'Tin', 'Sr', '2019-02-22', 'Manila', 6, 'Male', 'Single', 'B+', NULL, NULL, '09876912456', '10', 'DOH 01', 'High School', 'Unemployed', 'Son', 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-28 06:22:40', NULL),
	(15, 3, 1, 'balud_del_norte_(poblacion)_004', 'Dela`', NULL, 'Cruz', 'III', '2001-02-22', 'Basud Sorsogon City', 24, 'Male', 'Single', 'O-', 'Dela Cruz', NULL, '928132133123', '01', 'BALU-HH-00002', 'No Formal Education', 'Employed', 'Father', 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-28 06:51:01', NULL),
	(16, 4, 2, 'balud_del_sur_(poblacion)_002', 'john', 'E', 'Hie', 'Jr', '2002-02-22', 'Manila', 23, 'Male', 'Single', 'A-', 'John Shiw', NULL, '09123', '10', 'BALU-HH-00002', 'No Formal Education', 'Employed', 'Daughter', 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-28 07:11:34', NULL),
	(17, 4, 2, 'balud_del_sur_(poblacion)_003', 'john', 's', 'Nie', 'II', '1999-11-11', 'Manila', 26, 'Male', 'Single', 'A-', 'Jouek', NULL, '09123', '11', 'BALU-HH-00003', 'No Formal Education', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-28 07:13:19', NULL),
	(18, 2, NULL, 'bagacay_002', 'John', 's', 'Mie', 'II', '1999-11-11', NULL, 26, 'Male', 'Single', NULL, NULL, NULL, NULL, '10', 'BAGA-HH-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-28 07:13:54', NULL),
	(19, 4, 2, 'balud_del_sur_(poblacion)_004', 'John', NULL, 'Vie', 'Sr', '1999-11-11', 'manila', 26, 'Male', 'Single', 'A-', 'Escanilla', NULL, '1232131233', '11', 'BALU-HH-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-28 07:26:37', NULL),
	(20, 4, NULL, 'balud_del_sur_(poblacion)_005', 'john', 'w', 'Gie', 'Sr', '1992-02-22', 'Mania', 33, 'Male', 'Single', NULL, NULL, NULL, NULL, '90', 'RHUBD-HH-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-28 07:35:00', NULL),
	(21, 4, NULL, 'balud_del_sur_(poblacion)_006', 'jose', 'Ge', 'Gie', 'Jr', '1888-02-22', NULL, 137, 'Male', 'Single', NULL, NULL, NULL, NULL, '19', 'RHU-BD-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-28 07:37:03', NULL),
	(22, 4, NULL, 'balud_del_sur_(poblacion)_007', 'jo', 'sd', 'cie', 'Sr', '1888-11-11', NULL, 137, 'Male', 'Single', NULL, NULL, NULL, NULL, '19', 'RHU-BD-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-28 07:38:15', NULL),
	(23, 4, NULL, 'balud_del_sur_(poblacion)_008', 'john', 's', 'Cie', 'II', '1999-02-22', NULL, 26, 'Male', 'Single', NULL, NULL, NULL, NULL, '20', 'RHU-BD-00007', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-28 07:40:39', NULL),
	(24, 4, NULL, 'balud_del_sur_(poblacion)_009', 'joh', 's', 'Viea', 'Jr', '1888-11-11', NULL, 137, 'Male', 'Single', NULL, NULL, NULL, NULL, '20', 'RHU-BD-00007', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-28 07:41:49', NULL),
	(25, 6, NULL, 'bentuco_001', 'Juan', 'Escandor', 'Escarda', NULL, '2002-02-22', 'Manila', 23, 'Male', 'Single', 'A+', NULL, NULL, NULL, '128', 'RHU-B-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-29 05:34:15', NULL),
	(26, 6, NULL, 'bentuco_002', 'Maria', 'Escandor', 'Escarda', NULL, '1999-11-11', NULL, 26, 'Female', NULL, NULL, NULL, NULL, NULL, '128', 'RHU-B-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-29 05:36:04', NULL),
	(27, 6, NULL, 'bentuco_003', 'Carlo', 'E', 'Escandor', NULL, '1999-11-11', NULL, 26, 'Male', 'Single', NULL, NULL, NULL, NULL, '128', 'RHU-B-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-29 05:43:55', NULL),
	(28, 4, 2, 'balud_del_sur_(poblacion)_010', 'cyrus', 'HIlda', 'Jean', 'Jr', '2002-02-22', NULL, 23, 'Female', 'Single', 'B+', NULL, NULL, NULL, '190', 'RHU-BD-00008', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-29 05:45:11', NULL),
	(29, 4, NULL, 'balud_del_sur_(poblacion)_011', 'John', 's', 'Hie', NULL, '2025-02-22', NULL, 0, 'Female', 'Married', NULL, NULL, NULL, NULL, '20', 'RHU-BD-00007', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-29 06:19:34', NULL),
	(30, 1, 11, 'ariman_001', 'Jose', 'Escandors', 'Escopete', 'Jr', '1999-11-11', 'Manila', 26, 'Male', 'Single', 'A+', 'Carla Escandor', NULL, '09876912456', '128', 'RHU-A-00001', 'High School', 'Employed', 'Son', 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-29 06:37:32', NULL),
	(31, 1, 11, 'ariman_002', 'John', 'Escandors', 'Escasinas', NULL, '2009-11-11', 'Manila', 16, 'Female', 'Single', 'A+', 'Carla Escandor', NULL, '091234567891', '128', 'RHU-A-00001', 'High School', 'Unemployed', 'Mother', 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-29 06:39:39', NULL),
	(32, 1, NULL, 'ariman_003', 'Dea', 'd', 'Escandor', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00001', 'RHU-A-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-29 07:33:40', NULL),
	(33, 1, 11, 'ariman_004', 'John', 'S', 'Die', NULL, '2002-02-22', 'Manila', 23, 'Male', 'Single', 'B+', 'Miriam Detablan Ditan', NULL, '091234567891', '2026-00002', 'RHU-A-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-29 08:04:01', NULL),
	(34, 1, NULL, 'ariman_005', 'Joels', 'D', 'E', NULL, '1999-11-11', NULL, 26, 'Female', NULL, NULL, NULL, NULL, NULL, '2026-00002', 'RHU-A-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-29 08:27:13', NULL),
	(35, 1, NULL, 'ariman_006', 'JP', NULL, 'Dad', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '128', 'RHU-A-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-30 05:40:19', NULL),
	(36, 1, NULL, 'ariman_007', 'John', 'q', 'ww', NULL, '2019-11-11', NULL, 6, 'Male', 'Single', NULL, NULL, NULL, NULL, '128', 'RHU-A-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-30 05:41:24', NULL),
	(37, 1, NULL, 'ariman_008', 'jo', 's', 'JP', NULL, '1928-02-22', NULL, 97, 'Male', 'Single', NULL, NULL, NULL, NULL, '128', 'RHU-A-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-30 05:49:08', NULL),
	(38, 6, NULL, 'bentuco_004', 'joe', 'we', 'dad', NULL, '2009-02-22', NULL, 16, 'Female', 'Married', NULL, NULL, NULL, NULL, '2026-00011', 'RHU-B-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-30 05:57:53', NULL),
	(39, 42, NULL, 'villareal_001', 'J', 'w', 'w', NULL, '1929-11-11', NULL, 96, 'Female', NULL, NULL, NULL, NULL, NULL, '2026-00012', 'RHU-V-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-30 05:59:50', NULL),
	(40, 4, NULL, 'balud_del_sur_(poblacion)_012', 'j', 'jasd', 'd', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00013', 'RHU-BD-00009', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-30 06:01:46', NULL),
	(41, 1, NULL, 'ariman_009', 'asdas', 'adsasd', 'asdsa', NULL, '1999-11-11', NULL, 26, 'Male', 'Single', NULL, NULL, NULL, NULL, '128', 'RHU-A-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-30 07:22:56', NULL),
	(42, 5, NULL, 'ariman_010', 'Althea ', 'N', 'nicole', '', '1999-11-11', 'N/A', 26, 'Male', 'Single', '', 'N/A', 'N/A', 'N/A', '2026-00058', 'RHU-B-00003', 'Elementary', 'Employed', NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-30 07:40:22', '2026-02-03 11:24:02'),
	(43, 1, NULL, 'ariman_011', 'Jose', 'M', 'Marc', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00001', '-', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-30 07:48:32', NULL),
	(44, 1, NULL, 'ariman_012', 'hon', 'ad', 'Joda', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00001', 'RHU-A-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-30 07:52:10', NULL),
	(45, 1, NULL, 'ariman_013', 'Hoand', 'ad', 'ee', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '128', 'RHU-A-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-30 07:56:43', NULL),
	(46, 1, NULL, 'ariman_014', 'Zap', NULL, 'N/a', NULL, '2021-02-22', NULL, 4, 'Male', 'Single', NULL, NULL, NULL, NULL, '128', 'RHU-A-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-31 02:18:04', NULL),
	(47, 1, NULL, 'ariman_015', 'Noob', 'e', 'e', NULL, '2019-02-22', NULL, 6, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00001', 'RHU-A-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-01-31 02:20:24', NULL),
	(48, 43, 12, 'outside_gubat_001', 'Cryslyn', 'e', 'Lareza', NULL, '2004-04-09', 'Manila', 21, 'Female', 'Single', 'A+', 'N/A', NULL, 'N/a', '2026-00025', 'RHU-OG-00001', 'College', 'Unemployed', 'Daughter', 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 01:54:03', NULL),
	(49, 43, 12, 'outside_gubat_002', 'Angels', NULL, 'Lareza', NULL, '2003-04-25', 'N/A', 22, 'Female', 'Single', 'O-', 'N/A', NULL, 'N/A', '2026-00025', 'RHU-OG-00001', 'College', 'Unemployed', 'Mother', 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 01:56:28', NULL),
	(50, 1, NULL, 'ariman_016', 'Jose', 'as', 'Dan', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00026', 'RHU-A-00011', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:16:27', NULL),
	(51, 1, NULL, 'ariman_017', 'Jessa', 'e', 'Beth', NULL, '2002-02-22', NULL, 23, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:26:43', NULL),
	(52, 1, NULL, 'ariman_018', 'Juls', 'e', 'escanod', NULL, '2002-02-22', NULL, 23, 'Male', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:29:43', NULL),
	(53, 1, NULL, 'ariman_019', 'Hie', 'd', 'Hie', NULL, '2002-02-22', NULL, 23, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:33:51', NULL),
	(54, 1, NULL, 'ariman_020', 'Gie', 'gie', 'gie', NULL, '2002-02-22', NULL, 23, 'Male', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:35:49', NULL),
	(55, 1, NULL, 'ariman_021', 'jonatan', 'e', 'wsa22', NULL, '2002-02-22', NULL, 23, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00026', 'RHU-A-00011', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:42:45', NULL),
	(56, 3, NULL, 'balud_del_norte_(poblacion)_005', 'Kiko', NULL, 'Kie', NULL, '2002-02-22', NULL, 23, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00028', 'RHU-BD-00008', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:43:46', NULL),
	(57, 1, NULL, 'ariman_022', 'Hulu', NULL, 'Hui', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:46:27', NULL),
	(58, 1, NULL, 'ariman_023', 'Jisi', 'e', 'Es', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00026', 'RHU-A-00011', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:48:37', NULL),
	(59, 1, NULL, 'ariman_024', 'Jigi', 'e', 'J', NULL, '0002-02-22', NULL, 2023, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00026', 'RHU-A-00011', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:52:10', NULL),
	(60, 1, NULL, 'ariman_025', 'Joel', 'e', 'Els', NULL, '2020-02-22', NULL, 5, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00026', 'RHU-A-00011', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:57:33', NULL),
	(61, 1, NULL, 'ariman_026', 'Hesa', 'e', 'Esa', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00026', 'RHU-A-00011', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:57:48', NULL),
	(62, 1, NULL, 'ariman_027', 'Jousas', '2', 'weq', NULL, '2002-02-22', NULL, 23, 'Male', NULL, NULL, NULL, NULL, NULL, '2026-00026', 'RHU-A-00011', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:58:05', NULL),
	(63, 13, NULL, 'casili_002', 'Biee', 'ie', 'Bee', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00029', 'RHU-C-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:58:56', NULL),
	(64, 13, NULL, 'casili_003', 'Baa', 'b', 'Baa', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00029', 'RHU-C-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 05:59:40', NULL),
	(65, 13, NULL, 'casili_004', 'Nie', 'n', 'Nie', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00029', 'RHU-C-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 06:05:09', NULL),
	(66, 13, NULL, 'casili_005', 'Vi', 'e', 'e', NULL, '2020-02-22', NULL, 5, 'Male', NULL, NULL, NULL, NULL, NULL, '2026-00029', 'RHU-C-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 06:05:20', NULL),
	(67, 6, NULL, 'bentuco_005', 'Balmond', 'e', 'e', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00033', 'RHU-B-00007', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 06:11:47', NULL),
	(68, 4, NULL, 'balud_del_sur_(poblacion)_013', 'layla ', 'e', 'e', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00034', 'RHU-BD-00015', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 06:12:06', NULL),
	(69, 6, NULL, 'bentuco_006', 'Nolam', 'w', 'e', NULL, '2002-02-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00033', 'RHU-B-00007', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 06:12:37', NULL),
	(70, 37, NULL, 'tagaytay_001', 'Andy', NULL, 'Esperansate', NULL, '2002-02-22', 'Manila', 23, 'Male', 'Single', 'A+', 'N/A', NULL, '091234567891', '2026-00038', 'RHU-T-00001', 'Unknown', 'Unemployed', 'Son', 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 08:03:29', NULL),
	(71, 10, NULL, 'tagaytay_002', 'jonatans', 'N/A', 'Esperansate', 'Sr.', '2002-02-22', 'Gubat, Sorsogon', 26, 'Male', 'Married', 'A+', 'Hahawer', 'Maria', '09125517311', '91', '09', 'Elementary', 'Employed', 'Mother', 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-02 08:07:04', '2026-02-03 10:57:09'),
	(72, 5, NULL, 'cabigaan_004', 'Maria', 'Santos', 'Dela Cruz', 'Jr', '1999-02-22', ' Elena Santos', 26, 'Female', 'Married', 'O+', 'Gubat, Sorsogon', 'Morald', ' 0917-456-7890', '2026-00058', 'RHU-B-00003', 'High School', 'Employed', 'Mother', 'Yes', 'Yes', 'Yes', 'Yes', 'Member', '09123123', 'DIRECT CONTRIBUTOR - PROFESSIONAL PRACTITIONER', NULL, 'active', '2026-02-03 03:01:47', '2026-02-03 11:57:17'),
	(73, 2, 13, 'bagacay_003', 'Pedro', 'Cruz', 'Villanueva', 'III', '2009-02-22', 'Del Pilar', 16, 'Male', 'Single', 'B+', 'Fernandez', '', '091234567891', '2026-00060', 'RHU-B-00004', 'High School', 'Unemployed', 'Mother', 'Yes', 'Yes', 'Yes', 'Yes', 'Member', '09561234567', 'IE - NATURALIZED FILIPINO CITIZEN', NULL, 'active', '2026-02-03 06:01:16', '2026-02-03 14:01:50'),
	(74, 6, NULL, 'lapinig_001', 'Robertos', 'Aquino', 'Garcia', 'Sr', '1999-02-22', 'd	Del Pilar', 26, 'Male', 'Single', '', 'Rizal', '', '09561234567', '2026-00011', 'RHU-B-00005', 'Post Graduate', 'Employed', 'Daughter', 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-02-03 06:06:17', '2026-02-03 14:07:35'),
	(75, 9, 13, 'bagacay_004', 'Mones', 'N/A', 'MUNS', 'Sr', '2002-02-22', 'Manila', 23, 'Male', 'Single', '', 'N/A', 'N/A', '091234567891', '2026-00063', 'RHU-B-00001', 'Unknown', 'Employed', 'Mother', 'Yes', 'Yes', 'Yes', 'Yes', 'Member', '09123123', 'IE - MIGRANT WORKER - LAND BASED', NULL, 'active', '2026-02-03 06:46:11', '2026-02-03 14:53:13');

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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table react1.0.patient_household_history: ~21 rows (approximately)
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
	(25, 75, 2, '2026-00062', 'RHU-B-00005', 9, '2026-00063', 'RHU-B-00001', 'Patient transfer', '2026-02-03 06:53:13', 1);

-- Dumping structure for table react1.0.patient_queue
CREATE TABLE IF NOT EXISTS `patient_queue` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `queue_date` date NOT NULL,
  `queue_type` enum('PRIORITY','REGULAR') NOT NULL,
  `queue_number` int NOT NULL,
  `queue_code` varchar(20) NOT NULL,
  `status` enum('waiting','serving','with_doctor','done','cancelled') DEFAULT 'waiting',
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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table react1.0.patient_queue: ~24 rows (approximately)
DELETE FROM `patient_queue`;
INSERT INTO `patient_queue` (`id`, `patient_id`, `queue_date`, `queue_type`, `queue_number`, `queue_code`, `status`, `cancelled_by`, `systolic_bp`, `diastolic_bp`, `heart_rate`, `respiratory_rate`, `temperature`, `oxygen_saturation`, `weight`, `height`, `created_at`) VALUES
	(1, 42, '2026-02-03', 'PRIORITY', 1, 'P-001', 'waiting', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-03 08:31:33'),
	(2, 71, '2026-02-03', 'PRIORITY', 2, 'P-002', 'waiting', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-03 08:39:39'),
	(3, 71, '2026-02-03', 'PRIORITY', 3, 'P-003', 'waiting', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-03 08:47:09'),
	(4, 42, '2026-02-04', 'PRIORITY', 25, 'P-025', 'serving', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 00:40:01'),
	(5, 71, '2026-02-04', 'PRIORITY', 26, 'P-026', 'serving', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 01:24:25'),
	(6, 75, '2026-02-04', 'PRIORITY', 27, 'P-027', 'serving', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 02:02:04'),
	(7, 71, '2026-02-04', 'PRIORITY', 28, 'P-028', 'serving', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 02:06:27'),
	(8, 62, '2026-02-04', 'PRIORITY', 29, 'P-029', 'serving', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 02:08:34'),
	(9, 60, '2026-02-04', 'PRIORITY', 30, 'P-030', 'serving', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 02:17:31'),
	(10, 75, '2026-02-04', 'PRIORITY', 31, 'P-031', 'serving', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 02:22:02'),
	(11, 70, '2026-02-04', 'PRIORITY', 32, 'P-032', 'waiting', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 02:22:54'),
	(12, 72, '2026-02-04', 'PRIORITY', 33, 'P-033', 'waiting', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 02:31:37'),
	(13, 62, '2026-02-04', 'PRIORITY', 34, 'P-034', 'waiting', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 03:14:26'),
	(14, 60, '2026-02-04', 'PRIORITY', 35, 'P-035', 'waiting', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 03:24:25'),
	(15, 72, '2026-02-04', 'PRIORITY', 36, 'P-036', 'waiting', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 03:27:13'),
	(16, 71, '2026-02-04', 'PRIORITY', 37, 'P-037', 'waiting', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 05:19:40'),
	(17, 71, '2026-02-04', 'PRIORITY', 38, 'P-038', 'waiting', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 05:19:51'),
	(18, 71, '2026-02-04', 'PRIORITY', 40, 'P-040', 'waiting', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 05:20:24'),
	(19, 13, '2026-02-04', 'PRIORITY', 41, 'P-041', 'waiting', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 05:23:59'),
	(20, 13, '2026-02-04', 'REGULAR', 1, 'R-001', 'serving', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 05:24:55'),
	(21, 13, '2026-02-04', 'REGULAR', 2, 'R-002', 'waiting', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 05:25:56'),
	(22, 13, '2026-02-04', 'REGULAR', 3, 'R-003', 'waiting', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 05:29:08'),
	(23, 71, '2026-02-04', 'PRIORITY', 60, 'P-060', 'waiting', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 05:29:43'),
	(24, 46, '2026-02-04', 'PRIORITY', 61, 'P-061', 'waiting', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 05:29:57'),
	(25, 71, '2026-02-04', 'REGULAR', 4, 'R-004', 'serving', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 06:28:45'),
	(26, 11, '2026-02-04', 'PRIORITY', 62, 'P-062', 'waiting', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 06:30:13'),
	(27, 62, '2026-02-04', 'PRIORITY', 63, 'P-063', 'waiting', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 06:44:04'),
	(28, 55, '2026-02-04', 'PRIORITY', 64, 'P-064', 'waiting', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-04 06:45:36'),
	(29, 62, '2026-02-04', 'PRIORITY', 65, 'P-065', 'waiting', NULL, NULL, NULL, 123, 73, 12.0, 32, 23.00, 13.00, '2026-02-04 06:47:58'),
	(30, 55, '2026-02-04', 'PRIORITY', 66, 'P-066', 'waiting', NULL, NULL, NULL, 28, 23, 11.0, 23, 31.00, 23.00, '2026-02-04 06:55:47'),
	(31, 49, '2026-02-04', 'PRIORITY', 67, 'P-067', 'waiting', NULL, 120, 928, 271, 26, 93.0, 26, 94.00, 12.00, '2026-02-04 07:00:16'),
	(32, 62, '2026-02-04', 'REGULAR', 5, 'R-005', 'serving', NULL, 120, 928, 271, 26, 93.0, 26, 94.00, 12.00, '2026-02-04 07:01:00'),
	(33, 56, '2026-02-04', 'REGULAR', 6, 'R-006', 'serving', NULL, 129, 82, 126, 2361, 31.0, 64, 172.00, 271.00, '2026-02-04 07:03:21'),
	(34, 62, '2026-02-04', 'REGULAR', 100, 'R-100', 'serving', NULL, 120, 8, 725, 23, 93.0, 16, 936.00, 926.00, '2026-02-04 08:20:05');

-- Dumping structure for table react1.0.puroks
CREATE TABLE IF NOT EXISTS `puroks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `barangay_id` int NOT NULL,
  `purok_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_purok` (`barangay_id`,`purok_name`),
  CONSTRAINT `fk_purok_barangay` FOREIGN KEY (`barangay_id`) REFERENCES `barangays` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table react1.0.puroks: ~9 rows (approximately)
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
	(14, 'seller', 'Seller', NULL, '2026-01-25 07:34:46');

-- Dumping structure for table react1.0.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','disabled','banned') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_user_role` (`role`),
  CONSTRAINT `fk_user_role` FOREIGN KEY (`role`) REFERENCES `roles` (`code`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table react1.0.users: ~7 rows (approximately)
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
	(19, '0a67ad70-fb3f-11f0-92de-34e6d71ed611', 'Ian', 'ian@gmail.com', '$2y$10$rBx8JoTHUwUjZCaWfYKJz.Txgm9Z5jXA6ochFP6tD48qXRXE/aiU.', 'admin', 'active', '2026-01-27 05:14:22', '2026-01-27 05:14:22');

-- Dumping structure for table react1.0.user_panel_access
CREATE TABLE IF NOT EXISTS `user_panel_access` (
  `user_id` bigint unsigned NOT NULL,
  `panel_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`panel_id`),
  KEY `panel_id` (`panel_id`),
  CONSTRAINT `user_panel_access_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_panel_access_ibfk_2` FOREIGN KEY (`panel_id`) REFERENCES `panels` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table react1.0.user_panel_access: ~7 rows (approximately)
DELETE FROM `user_panel_access`;
INSERT INTO `user_panel_access` (`user_id`, `panel_id`) VALUES
	(13, 1),
	(18, 1),
	(19, 1),
	(5, 2),
	(13, 2),
	(15, 2),
	(19, 2);

-- Dumping structure for table react1.0.user_profiles
CREATE TABLE IF NOT EXISTS `user_profiles` (
  `user_id` bigint unsigned NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` mediumtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table react1.0.user_profiles: ~0 rows (approximately)
DELETE FROM `user_profiles`;

-- Dumping structure for table react1.0.user_sessions
CREATE TABLE IF NOT EXISTS `user_sessions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `token` char(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table react1.0.user_sessions: ~35 rows (approximately)
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
	(101, 13, '94165d7b38eafdc1ca1e08d05272a1bb0f12ee73fd9891f81fff8f5705313cab', '2026-02-05 06:10:03', '2026-02-04 06:10:03');

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
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table react1.0.user_widget_access: ~6 rows (approximately)
DELETE FROM `user_widget_access`;
INSERT INTO `user_widget_access` (`id`, `user_id`, `widget_id`) VALUES
	(8, 12, 1),
	(64, 13, 2),
	(16, 15, 1),
	(17, 15, 2),
	(54, 19, 1),
	(55, 19, 2);

-- Dumping structure for table react1.0.widgets
CREATE TABLE IF NOT EXISTS `widgets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table react1.0.widgets: ~2 rows (approximately)
DELETE FROM `widgets`;
INSERT INTO `widgets` (`id`, `code`, `name`, `description`) VALUES
	(1, 'doctor', 'Doctor Panel', 'Displays patient consultations, prescriptions, and lab results'),
	(2, 'triage', 'Triage Panel', 'Displays patient queue, vital signs, and triage statistics'),
	(4, 'tv', 'TV Display', 'Displays live queue numbers on TV screen');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
