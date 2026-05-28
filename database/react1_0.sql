-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 28, 2026 at 05:42 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `react1.0`
--

-- --------------------------------------------------------

--
-- Table structure for table `barangays`
--

CREATE TABLE `barangays` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `last_patient_seq` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_special` tinyint(1) NOT NULL DEFAULT 0,
  `facility_household_seq` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `barangays`
--

INSERT INTO `barangays` (`id`, `name`, `last_patient_seq`, `is_special`, `facility_household_seq`) VALUES
(1, 'Ariman', 12, 0, 8),
(2, 'Bagacay', 12, 0, 6),
(3, 'Balud Del Norte (Poblacion)', 9, 0, 10),
(4, 'Balud Del Sur (Poblacion)', 5, 0, 4),
(5, 'Benguet', 0, 0, 0),
(6, 'Bentuco', 1, 0, 1),
(7, 'Beriran', 6, 0, 4),
(8, 'Buenavista', 8, 0, 5),
(9, 'Bulacao', 8, 0, 5),
(10, 'Cabigaan', 0, 0, 0),
(11, 'Cabiguhan', 1, 0, 1),
(12, 'Carriedo', 24, 0, 11),
(13, 'Casili', 9, 0, 6),
(14, 'Cogon', 21, 0, 18),
(15, 'Cota Na Daco (Poblacion)', 10, 0, 10),
(16, 'Dita', 2, 0, 1),
(17, 'Jupi', 2, 0, 2),
(18, 'Lapinig', 3, 0, 3),
(19, 'Luna-Candol (Poblacion)', 18, 0, 14),
(20, 'Manapao', 10, 0, 4),
(21, 'Manook (Poblacion)', 7, 0, 7),
(22, 'Naagtan', 6, 0, 5),
(23, 'Nato', 0, 0, 0),
(24, 'Nazareno', 5, 0, 6),
(25, 'Ogao', 6, 0, 5),
(26, 'Paco', 7, 0, 6),
(27, 'Panganiban (Poblacion)', 12, 0, 12),
(28, 'Paradijon (Poblacion)', 8, 0, 8),
(29, 'Patag', 1, 0, 1),
(30, 'Payawin', 5, 0, 5),
(31, 'Pinontingan (Poblacion)', 6, 0, 6),
(32, 'Rizal', 10, 0, 9),
(33, 'San Ignacio', 4, 0, 3),
(34, 'Sangat', 4, 0, 4),
(35, 'Santa Ana', 10, 0, 6),
(36, 'Tabi', 4, 0, 4),
(37, 'Tagaytay', 7, 0, 8),
(38, 'Tigkiw', 5, 0, 2),
(39, 'Tiris', 8, 0, 7),
(40, 'Togawe', 3, 0, 3),
(41, 'Union', 4, 0, 3),
(42, 'Villareal', 6, 0, 5),
(43, 'Outside Gubat', 22, 1, 12);

-- --------------------------------------------------------

--
-- Table structure for table `consultations`
--

CREATE TABLE `consultations` (
  `id` int(11) NOT NULL,
  `queue_id` int(11) DEFAULT NULL,
  `patient_id` int(11) NOT NULL,
  `doctor_id` int(11) DEFAULT NULL,
  `referral` enum('Yes','No') DEFAULT NULL,
  `referred_to` varchar(255) DEFAULT NULL,
  `reason_for_referral` text DEFAULT NULL,
  `referred_by` varchar(255) DEFAULT NULL,
  `purpose_visit` enum('General','Prenatal','Dental Care','Child Care','Child Nutrition','Injury','Adult Immunization','Family Planning','Postpartum','Tuberculosis','Child Immunization','Sick Children','Firecracker Injury','Mental Health') DEFAULT NULL,
  `nature_visit` enum('New Consultation','Follow-up Consultation','Problem Consultation (New Symptoms)') DEFAULT NULL,
  `visit_date` date DEFAULT NULL,
  `systolic_bp` int(11) DEFAULT NULL,
  `diastolic_bp` int(11) DEFAULT NULL,
  `temperature` decimal(4,1) DEFAULT NULL,
  `pulse_rate` int(11) DEFAULT NULL,
  `respiratory_rate` int(11) DEFAULT NULL,
  `oxygen_saturation` int(11) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `chief_complaint` text DEFAULT NULL,
  `diagnosis` text DEFAULT NULL,
  `treatment` text DEFAULT NULL,
  `patient_illness` text DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `encoded_by` int(11) DEFAULT NULL,
  `encoded_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `receiving_personnel` varchar(255) DEFAULT NULL,
  `receiving_facility` varchar(100) DEFAULT NULL,
  `referral_category` enum('Emergency','Outpatient') DEFAULT NULL,
  `reason_for_referral_2` text DEFAULT NULL,
  `identity_number_manual` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `consultations`
--

INSERT INTO `consultations` (`id`, `queue_id`, `patient_id`, `doctor_id`, `referral`, `referred_to`, `reason_for_referral`, `referred_by`, `purpose_visit`, `nature_visit`, `visit_date`, `systolic_bp`, `diastolic_bp`, `temperature`, `pulse_rate`, `respiratory_rate`, `oxygen_saturation`, `weight`, `height`, `chief_complaint`, `diagnosis`, `treatment`, `patient_illness`, `remarks`, `encoded_by`, `encoded_at`, `created_at`, `receiving_personnel`, `receiving_facility`, `referral_category`, `reason_for_referral_2`, `identity_number_manual`) VALUES
(67, NULL, 204, 12, NULL, NULL, NULL, NULL, 'Prenatal', 'New Consultation', '2026-04-19', 120, 80, 90.0, 120, 90, 12, 90.00, 129.00, 'Severe headache for 2 days', 'Uncontrolled Hypertension', 'Monitor vital signs (especially blood pressure) every 15–30 minutes', 'The patient reports a sudden onset of severe, throbbing headache located in the occipital region, rated 8/10 in intensity. The headache started 2 days prior to consultation and is persistent. It is associated with dizziness and occasional blurred vision. No history of trauma, fever, or vomiting.', NULL, 23, '2026-04-19 17:18:26', '2026-04-19 17:18:00', 'XRUZ', 'HOSPITal', 'Emergency', '[\"No Equipment Available\",\"No Available Doctor\",\"Diagnostics\"]', NULL),
(69, 128, 1, 12, NULL, NULL, NULL, NULL, 'General', 'New Consultation', '2026-04-20', 120, 80, 36.0, 90, 19, 90, 45.00, 120.00, 'Fever and cough for 3 days', 'Acute Upper Respiratory Tract Infection (URTI)', 'Paracetamol 500 mg every 6 hours as needed for fever', 'The patient is a 25-year-old male who presented with a 3-day history of fever accompanied by dry cough. Fever was intermittent, with a highest recorded temperature of 38.5°C. The patient also reported mild sore throat and body weakness. No history of difficulty breathing, chest pain, or recent travel. No known exposure to sick contacts.', NULL, 12, '2026-04-20 06:19:47', '2026-04-20 06:18:11', NULL, NULL, NULL, NULL, NULL),
(70, 129, 236, 12, NULL, NULL, NULL, NULL, 'General', 'New Consultation', '2026-04-20', 120, 80, 36.0, 90, 19, 90, 50.00, 100.00, 'Chough and Cold', 'Acute Respiratory', 'Paracetamol', NULL, NULL, 12, '2026-04-20 08:35:04', '2026-04-20 08:21:20', NULL, NULL, NULL, NULL, NULL),
(71, 131, 1, 12, 'No', NULL, NULL, NULL, 'General', 'Follow-up Consultation', '2026-04-24', 120, 80, 36.0, 90, 19, 90, 45.00, 120.00, 'Fever and cough for 3 days', 'Hypertension', NULL, NULL, NULL, 12, '2026-04-24 14:49:01', '2026-04-24 14:46:58', NULL, 'District Hospital', 'Emergency', '[\"No Laboratory Available\"]', '1');

-- --------------------------------------------------------

--
-- Table structure for table `doctor_patient_queue`
--

CREATE TABLE `doctor_patient_queue` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `patient_queue_id` int(11) DEFAULT NULL,
  `patient_id` int(11) NOT NULL,
  `doctor_id` bigint(20) UNSIGNED NOT NULL,
  `queue_number` int(11) NOT NULL,
  `queue_date` date NOT NULL,
  `status` enum('waiting','serving','done','cancelled') NOT NULL DEFAULT 'waiting',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) DEFAULT 0 COMMENT '1 = currently being seen by doctor'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `doctor_patient_queue`
--

INSERT INTO `doctor_patient_queue` (`id`, `patient_queue_id`, `patient_id`, `doctor_id`, `queue_number`, `queue_date`, `status`, `created_at`, `is_active`) VALUES
(121, 128, 1, 12, 1, '2026-04-20', 'done', '2026-04-20 06:18:32', 0),
(122, 129, 236, 12, 2, '2026-04-20', 'done', '2026-04-20 08:21:41', 0),
(123, 130, 1, 12, 3, '2026-04-20', 'done', '2026-04-20 08:28:52', 0),
(124, 131, 1, 12, 1, '2026-04-24', 'done', '2026-04-24 14:47:06', 0),
(125, 132, 237, 12, 2, '2026-04-24', 'serving', '2026-04-24 14:53:21', 1),
(126, 133, 236, 12, 3, '2026-04-24', 'waiting', '2026-04-24 15:11:35', 0);

-- --------------------------------------------------------

--
-- Table structure for table `household_sequence`
--

CREATE TABLE `household_sequence` (
  `year` int(11) NOT NULL,
  `seq` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `household_sequence`
--

INSERT INTO `household_sequence` (`year`, `seq`) VALUES
(2026, 240);

-- --------------------------------------------------------

--
-- Table structure for table `lab_requests`
--

CREATE TABLE `lab_requests` (
  `id` int(11) NOT NULL,
  `request_no` varchar(50) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `doctor_id` bigint(20) UNSIGNED NOT NULL,
  `diagnosis` text DEFAULT NULL,
  `xray_findings` text DEFAULT NULL,
  `utz_findings` text DEFAULT NULL,
  `ct_scan_findings` text DEFAULT NULL,
  `other_findings` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lab_requests`
--

INSERT INTO `lab_requests` (`id`, `request_no`, `patient_id`, `doctor_id`, `diagnosis`, `xray_findings`, `utz_findings`, `ct_scan_findings`, `other_findings`, `created_at`) VALUES
(36, 'LR-2026-1639', 1, 12, 'CHEST', NULL, NULL, NULL, 'CHEST PAIN', '2026-04-13 11:44:56'),
(37, 'LR-2026-4978', 1, 12, 'To consider Bronchial Asthma in Acute Exacerbation', 'X-Ray Findings (Optional)', 'Ultrasound Findings (Optional)', 'CT Scan Findings (Optional)', 'Others (Optional)', '2026-04-13 12:01:43'),
(38, 'LR-2026-2804', 1, 12, 'Diagnosis', NULL, NULL, NULL, NULL, '2026-04-13 12:39:17'),
(39, 'LR-2026-5028', 1, 12, 'PTB', 'X-RAY PA View', NULL, NULL, NULL, '2026-04-13 15:19:44'),
(40, 'LR-2026-2440', 238, 12, 'Diagnosis', 'X-Ray Findings (Optional)', 'Ultrasound Findings (Optional)', 'CT Scan Findings (Optional)', 'Others (Optional)', '2026-04-14 22:07:04'),
(41, 'LR-2026-3403', 1, 12, 'Community-Acquired Pneumonia (CAP), Moderate Risk', 'Chest X-ray shows right lower lobe infiltrates with minimal pleural effusion.', 'No significant abnormalities noted in abdominal ultrasound.', 'Not performed.', 'Patient is febrile with productive cough and difficulty breathing.', '2026-04-19 20:06:11'),
(42, 'LR-2026-4933', 1, 12, 'Abnormality detected', NULL, NULL, NULL, NULL, '2026-04-20 16:42:35'),
(43, 'LR-2026-5733', 1, 24, 'r/o ptb', 'chest pa view', NULL, NULL, NULL, '2026-04-21 08:20:23'),
(44, 'LR-2026-8712', 246, 24, 'R. ARTHRITIS', 'XRAY KNEE/ANKLE, LEFT', NULL, NULL, NULL, '2026-04-21 08:30:12'),
(45, 'LR-2026-3862', 246, 24, 'R. ATHRITIS, DM TYPE II', NULL, NULL, NULL, NULL, '2026-04-21 08:31:49'),
(46, 'LR-2026-3466', 248, 12, 'Hypertension', NULL, NULL, NULL, 'prolactin', '2026-04-24 08:44:53'),
(47, 'LR-2026-4085', 1, 12, 'T', 'CHEST', NULL, NULL, NULL, '2026-05-04 09:18:17'),
(48, 'LR-2026-8626', 271, 12, 'Hypertension St. II', NULL, NULL, NULL, NULL, '2026-05-04 11:06:59'),
(49, 'LR-2026-3474', 272, 12, 'Hypercholesterolemia', NULL, NULL, NULL, NULL, '2026-05-04 11:22:34'),
(50, 'LR-2026-9142', 276, 12, 'Pre-employment exam', NULL, NULL, NULL, NULL, '2026-05-04 11:48:33'),
(51, 'LR-2026-8633', 281, 12, 'Pre-employment examination', NULL, NULL, NULL, NULL, '2026-05-04 12:20:45'),
(52, 'LR-2026-8421', 282, 12, 'Pre-employment examination', NULL, NULL, NULL, NULL, '2026-05-04 12:28:17'),
(53, 'LR-2026-1233', 291, 12, 'Hyperuricemia', NULL, NULL, NULL, NULL, '2026-05-04 13:01:13'),
(54, 'LR-2026-5763', 1, 12, 'T/C Hyperuricemia', NULL, NULL, NULL, NULL, '2026-05-04 15:28:02'),
(55, 'LR-2026-3742', 301, 12, 'Cervicalia\nScoliosis\nSpondylosthisis', NULL, NULL, NULL, NULL, '2026-05-06 10:10:18'),
(56, 'LR-2026-9767', 302, 12, 'Hypertension Urgency', NULL, NULL, NULL, NULL, '2026-05-06 10:21:00'),
(57, 'LR-2026-8950', 303, 12, 'AGE', NULL, NULL, NULL, NULL, '2026-05-06 10:40:02'),
(58, 'LR-2026-7075', 304, 12, 'Hyperuricemia', NULL, NULL, NULL, NULL, '2026-05-06 10:59:42'),
(59, 'LR-2026-3569', 305, 12, 'Pre-employment exam', NULL, NULL, NULL, NULL, '2026-05-06 11:15:10'),
(60, 'LR-2026-5140', 306, 12, 'T/C UTI', NULL, NULL, NULL, NULL, '2026-05-06 11:39:14'),
(61, 'LR-2026-5181', 307, 12, 'Pre-employment exam', 'CHEST PA', NULL, NULL, NULL, '2026-05-06 11:45:00'),
(62, 'LR-2026-5007', 309, 12, 'Pregnancy Uterine', NULL, NULL, NULL, NULL, '2026-05-06 12:15:07');

-- --------------------------------------------------------

--
-- Table structure for table `lab_request_tests`
--

CREATE TABLE `lab_request_tests` (
  `id` int(11) NOT NULL,
  `lab_request_id` int(11) NOT NULL,
  `category` varchar(100) NOT NULL,
  `test_name` varchar(100) NOT NULL,
  `other_value` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lab_request_tests`
--

INSERT INTO `lab_request_tests` (`id`, `lab_request_id`, `category`, `test_name`, `other_value`) VALUES
(541, 37, 'Chemistry', 'Others', 'Chemistry'),
(542, 37, 'Cardiology', 'Others', 'cardiology'),
(543, 37, 'Bacteriology', 'Others', 'Bacteriology'),
(544, 37, 'Hematology', 'Others', 'Hematology'),
(545, 37, 'Fecalysis & Others', 'Others', 'Hematology'),
(546, 37, 'Bacteriology', 'Covid 19 Test', NULL),
(547, 37, 'Urinalysis & Others', 'Others', 'Urinalysis & Others'),
(548, 37, 'Hematology', 'CBC', NULL),
(549, 37, 'Hematology', 'PC', NULL),
(550, 37, 'Bacteriology', 'AFB Stain', NULL),
(551, 37, 'Cardiology', 'ECG', NULL),
(552, 37, 'Cardiology', '2D Echo', NULL),
(553, 37, 'Chemistry', 'Crea', NULL),
(554, 37, 'Chemistry', 'Na', NULL),
(555, 37, 'Urinalysis & Others', 'Urinalysis', NULL),
(556, 40, 'Chemistry', 'BUN', NULL),
(557, 40, 'Chemistry', 'BUA', NULL),
(558, 40, 'Chemistry', 'Crea', NULL),
(559, 40, 'Chemistry', 'Others', 'Chemistry'),
(560, 40, 'Cardiology', '2D Echo', NULL),
(561, 40, 'Cardiology', 'Others', 'Cardiology'),
(562, 40, 'Bacteriology', 'AFB Stain', NULL),
(563, 40, 'Bacteriology', 'Covid 19 Test', NULL),
(564, 40, 'Bacteriology', 'Others', 'Bacteriology'),
(565, 40, 'Hematology', 'CBC', NULL),
(566, 40, 'Hematology', 'PC', NULL),
(567, 40, 'Hematology', 'Others', 'Bacteriology'),
(568, 40, 'Urinalysis & Others', 'Fecalysis', NULL),
(569, 40, 'Urinalysis & Others', 'Urinalysis', NULL),
(570, 41, 'Chemistry', 'BUN', NULL),
(571, 41, 'Chemistry', 'Crea', NULL),
(572, 41, 'Chemistry', 'FBS', NULL),
(573, 41, 'Chemistry', 'Lipid Profile', NULL),
(574, 41, 'Chemistry', 'HbA1c', NULL),
(575, 41, 'Chemistry', 'BUA', NULL),
(576, 41, 'Cardiology', 'Others', 'No cardiac abnormalities detected'),
(577, 41, 'Bacteriology', 'Others', 'Sputum culture pending'),
(578, 41, 'Hematology', 'CBC', NULL),
(579, 41, 'Urinalysis & Others', 'Urinalysis', NULL),
(580, 42, 'Chemistry', 'BUA', NULL),
(581, 42, 'Chemistry', 'BUN', NULL),
(582, 42, 'Cardiology', 'ECG', NULL),
(601, 45, 'Chemistry', 'BUN', NULL),
(602, 45, 'Chemistry', 'Crea', NULL),
(603, 45, 'Chemistry', 'HbA1c', NULL),
(604, 45, 'Chemistry', 'BUA', NULL),
(605, 45, 'Chemistry', 'Na', NULL),
(606, 45, 'Chemistry', 'K', NULL),
(607, 45, 'Chemistry', 'Cl', NULL),
(608, 45, 'Chemistry', 'AST/ALT', NULL),
(609, 45, 'Hematology', 'CBC', NULL),
(610, 45, 'Urinalysis & Others', 'Urinalysis', NULL),
(611, 46, 'Chemistry', 'HbA1c', NULL),
(612, 46, 'Chemistry', 'Lipid Profile', NULL),
(613, 46, 'Chemistry', 'AST/ALT', NULL),
(614, 48, 'Chemistry', 'BUN', NULL),
(615, 48, 'Chemistry', 'BUA', NULL),
(616, 48, 'Chemistry', 'Crea', NULL),
(617, 48, 'Chemistry', 'FBS', NULL),
(618, 48, 'Chemistry', 'Lipid Profile', NULL),
(619, 48, 'Chemistry', 'AST/ALT', NULL),
(620, 48, 'Hematology', 'CBC', NULL),
(621, 48, 'Urinalysis & Others', 'Urinalysis', NULL),
(622, 49, 'Chemistry', 'BUN', NULL),
(623, 49, 'Chemistry', 'BUA', NULL),
(624, 49, 'Chemistry', 'Crea', NULL),
(625, 49, 'Chemistry', 'FBS', NULL),
(626, 49, 'Chemistry', 'Lipid Profile', NULL),
(627, 49, 'Chemistry', 'AST/ALT', NULL),
(628, 49, 'Urinalysis & Others', 'Urinalysis', NULL),
(629, 49, 'Hematology', 'CBC', NULL),
(630, 50, 'Chemistry', 'BUN', NULL),
(631, 50, 'Chemistry', 'AST/ALT', NULL),
(632, 50, 'Chemistry', 'Crea', NULL),
(633, 50, 'Chemistry', 'FBS', NULL),
(634, 50, 'Hematology', 'CBC', NULL),
(635, 50, 'Urinalysis & Others', 'Urinalysis', NULL),
(636, 51, 'Urinalysis & Others', 'Fecalysis', NULL),
(637, 52, 'Hematology', 'CBC', NULL),
(638, 52, 'Urinalysis & Others', 'Fecalysis', NULL),
(639, 52, 'Urinalysis & Others', 'Urinalysis', NULL),
(640, 52, 'Bacteriology', 'Others', 'HbSag (Hep B testing)'),
(641, 53, 'Chemistry', 'BUN', NULL),
(642, 53, 'Chemistry', 'Crea', NULL),
(643, 53, 'Chemistry', 'BUA', NULL),
(644, 53, 'Chemistry', 'FBS', NULL),
(645, 53, 'Chemistry', 'Lipid Profile', NULL),
(646, 53, 'Hematology', 'CBC', NULL),
(647, 53, 'Urinalysis & Others', 'Urinalysis', NULL),
(648, 53, 'Chemistry', 'AST/ALT', NULL),
(649, 54, 'Chemistry', 'BUN', NULL),
(650, 54, 'Chemistry', 'Crea', NULL),
(651, 54, 'Chemistry', 'BUA', NULL),
(652, 54, 'Chemistry', 'AST/ALT', NULL),
(653, 55, 'Chemistry', 'BUN', NULL),
(654, 55, 'Chemistry', 'Crea', NULL),
(655, 55, 'Chemistry', 'FBS', NULL),
(656, 55, 'Chemistry', 'Lipid Profile', NULL),
(657, 55, 'Chemistry', 'AST/ALT', NULL),
(658, 55, 'Chemistry', 'BUA', NULL),
(659, 55, 'Urinalysis & Others', 'Urinalysis', NULL),
(660, 55, 'Hematology', 'CBC', NULL),
(661, 56, 'Chemistry', 'BUN', NULL),
(662, 56, 'Chemistry', 'Crea', NULL),
(663, 56, 'Chemistry', 'FBS', NULL),
(664, 56, 'Chemistry', 'Lipid Profile', NULL),
(665, 56, 'Urinalysis & Others', 'Urinalysis', NULL),
(666, 57, 'Chemistry', 'BUN', NULL),
(667, 57, 'Chemistry', 'BUA', NULL),
(668, 57, 'Chemistry', 'Crea', NULL),
(669, 57, 'Chemistry', 'FBS', NULL),
(670, 57, 'Chemistry', 'Lipid Profile', NULL),
(671, 57, 'Chemistry', 'AST/ALT', NULL),
(672, 57, 'Hematology', 'CBC', NULL),
(673, 57, 'Urinalysis & Others', 'Urinalysis', NULL),
(674, 58, 'Chemistry', 'BUN', NULL),
(675, 58, 'Chemistry', 'BUA', NULL),
(676, 58, 'Chemistry', 'Crea', NULL),
(677, 58, 'Chemistry', 'FBS', NULL),
(678, 58, 'Chemistry', 'AST/ALT', NULL),
(679, 58, 'Chemistry', 'Lipid Profile', NULL),
(680, 58, 'Urinalysis & Others', 'Urinalysis', NULL),
(681, 58, 'Hematology', 'CBC', NULL),
(686, 59, 'Urinalysis & Others', 'Fecalysis', NULL),
(687, 59, 'Urinalysis & Others', 'Urinalysis', NULL),
(688, 59, 'Hematology', 'CBC', NULL),
(689, 59, 'Bacteriology', 'Others', 'HbsAg'),
(690, 60, 'Hematology', 'CBC', NULL),
(691, 60, 'Urinalysis & Others', 'Urinalysis', NULL),
(692, 62, 'Urinalysis & Others', 'Urinalysis', NULL),
(693, 62, 'Hematology', 'CBC', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `medical_certificates`
--

CREATE TABLE `medical_certificates` (
  `id` int(11) NOT NULL,
  `certificate_no` varchar(50) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `doctor_id` bigint(20) UNSIGNED NOT NULL,
  `impression` text NOT NULL,
  `remarks` text NOT NULL,
  `issued_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `medical_certificates`
--

INSERT INTO `medical_certificates` (`id`, `certificate_no`, `patient_id`, `doctor_id`, `impression`, `remarks`, `issued_at`) VALUES
(2, 'MC-2026-2091', 1, 24, 'Upper Respiratory Tract Infection', 'advised bedrest for 3 -5 days, for compliance with prescribed treatment regimen', '2026-03-16 08:21:20'),
(3, 'MC-2026-6396', 25, 24, 'Bronchial Asthma, controlled on Inhaler Therapy\nOtherwise, Physically fit and mentally stable', 'advised to continue the current controller inhaler as prescribed and avoid known asthma triggers.\nPhysically Fit to attend class', '2026-03-16 08:47:42'),
(4, 'MC-2026-9837', 30, 24, 'Chronic Kidney Disease secondary to Hyperuricemic Nephropathy; Hypertension Stage II', 'for compliance with prescribed treatment regimen', '2026-03-16 09:10:26'),
(5, 'MC-2026-1738', 39, 24, 'Mucus Retention Cyst, Left Maxillary Sinus', 'for compliance with prescribed treatment regimen', '2026-03-16 10:00:44'),
(6, 'MC-2026-3007', 50, 24, 'Amblyopia; VA 20/200 right eye, Light perception left eye;', 'Patient is legally blind and qualified for PWD\nVisual Disability secondary to Amblyopia', '2026-03-16 10:43:02'),
(10, 'MC-2026-9299', 83, 24, 'Varicella (Chickenpox), uncomplicated', 'Advised home isolation until lesions crusted. Supportive treatment given. Increase oral fluids. Avoid scratching. Follow-up if symptoms worsen.', '2026-03-16 16:25:12'),
(11, 'MC-2026-9771', 86, 24, 'PHYSICALLY FIT AND MENTALLY STABLE', 'MAY RESUME WORK,PHYSICALLY FIT TO WORK', '2026-03-16 16:58:11'),
(12, 'MC-2026-7380', 1, 20, 'essentially Normal at the time of Examination', 'physical fit', '2026-03-17 08:23:21'),
(13, 'MC-2026-4318', 127, 24, 'Physically fit and mentally stable', 'Free from communicable or contagious disease; may resume work, PHYSICALLY FIT TO WORK', '2026-03-19 10:51:34'),
(14, 'MC-2026-8947', 128, 12, 'Healty', 'Fit to Work', '2026-03-28 01:12:13'),
(16, 'MC-2026-7787', 188, 24, 'thyroglossal duct cyst', 'FOR NECK UTZ', '2026-03-31 09:36:34'),
(17, 'MC-2026-7326', 196, 24, 'Upper Respiratory Tract Infection', 'advised bedrest for 5 - 7 days, for compliance with prescribed treatment regimen, advised follow up after 1 week.', '2026-03-31 10:39:58'),
(19, 'MC-2026-5802', 198, 24, 'Physically fit and mentally stable', 'Essentially Normal Physical Examination; Physically fit to participate in marathon running', '2026-03-31 13:46:24'),
(20, 'MC-2026-4656', 201, 24, 'Physically fit and mentally stable', 'Physically fit to work (on-the-job- training)', '2026-03-31 13:59:05'),
(21, 'MC-2026-6832', 217, 24, 'Physically fit and mentally stable', 'physically fit to enroll', '2026-03-31 14:52:28'),
(22, 'MC-2026-6032', 231, 24, 'Autism Spectrum Disorder (ASD) with Attention-Deficit/Hyperactivity Disorder (ADHD)', 'continue occupational therapy, advised follow up consult to developmental & behavioral pediatrics', '2026-03-31 15:41:25'),
(23, 'MC-2026-5845', 233, 24, 'Non-union of complete fracture, left humerus, secondary to road crash injury', 'Physical disability secondary to Injury (non - union humerus left)', '2026-04-01 11:07:07'),
(24, 'MC-2026-4203', 233, 24, 'Non-union of complete fracture, left humerus, secondary to road crash injury (RCI)', 'for compliance with prescribed treatment regimen', '2026-04-01 11:09:13'),
(25, 'MC-2026-3597', 1, 12, 'Physically fit', 'NORMAL', '2026-04-09 23:56:03'),
(26, 'MC-2026-5102', 240, 12, 'Physically Fit', 'Fitness', '2026-04-14 22:19:23'),
(27, 'MC-2026-8833', 1, 12, 'PHYSICALLY', 'FIT', '2026-04-19 13:42:34'),
(28, 'MC-2026-9467', 247, 24, 'Acute Cystitis, T/C Urolithiasis', '-for compliance with prescribed treatment regimen, for UTZ KUB, advised consult to Nephrologist once with result.                                                                                      -At the time of examination, there are no signs of active bleeding.                                                                      -Clinically stable and may be allowed to resume work duties.  PHYSICALLY FIT TO WORK.                                        -For further evaluation by the company physician for continued assessment and clearance.', '2026-04-21 09:25:21'),
(29, 'MC-2026-9191', 1, 12, 'Physically Fit', 'For School use', '2026-04-24 08:41:40'),
(30, 'MC-2026-5431', 249, 12, 'Schizophrenia', 'for compliance with maintenance medication.\nFor AICS for Clozapine tab', '2026-04-27 09:52:30'),
(31, 'MC-2026-8161', 250, 12, 'Tuberculosis of Lungs, drug susceptible, completed treatment (April 27, 2026)', 'Physically fit and mentally stable.\nPatient is not communicable.', '2026-04-27 10:57:45'),
(32, 'MC-2026-8268', 251, 12, 'Schizophrenia', 'In remission\nfor complaince with maintenance medication intake\nfor AICS of medicine as it is out of stock at RHU', '2026-04-27 11:47:43'),
(34, 'MC-2026-7694', 252, 12, '1. Breast mass, right\n\n\n2. Seizure disorder (Parkinsonism)', 'For mammogram\nFor Breast Ultrasound\nFor AICS', '2026-04-27 12:14:27'),
(37, 'MC-2026-3050', 253, 12, 'Hypertensive Cardiovascular Disease', 'For compliance with maintenance medications', '2026-04-30 08:51:43'),
(38, 'MC-2026-3536', 254, 12, 'Schizophrenia', 'For compliance with maintenance medication', '2026-04-30 11:04:18'),
(39, 'MC-2026-8173', 255, 12, 'Physically fit and mentally stable', 'Medically fit to attend school', '2026-04-30 11:08:53'),
(40, 'MC-2026-5339', 256, 12, 'Physically fit and mentally stable', 'Medically fit to attend school activities.', '2026-04-30 11:18:53'),
(41, 'MC-2026-4422', 257, 12, 'Seizure disorder', 'For compliance with maintenance medications', '2026-04-30 11:55:31'),
(42, 'MC-2026-7883', 258, 12, 'Physically fit and mentally stable', 'Medically fit to attend school activities', '2026-04-30 12:03:17'),
(43, 'MC-2026-5173', 259, 12, 'Physically fit and mentally stable', 'Medically fit to attend school activities', '2026-04-30 12:07:35'),
(44, 'MC-2026-6392', 260, 12, 'Physically fit and mentally stable', 'Medically fit to work', '2026-04-30 12:13:42'),
(45, 'MC-2026-6602', 198, 12, 'Physically fit and mentally stable', 'Medically fit to participate in a marathon race', '2026-04-30 14:36:19'),
(46, 'MC-2026-2158', 262, 12, 'Physically fit and mentally stable', 'Medically fit to work as BHW.', '2026-04-30 14:44:12'),
(47, 'MC-2026-3472', 263, 12, 'Physically fit and mentally stable', 'Medically fit to work as BHW.', '2026-04-30 14:51:17'),
(48, 'MC-2026-3088', 264, 12, 'Type 2 Diabates Mellitus\n\nPhysically fit and mentally stable', 'Medically fit to work as BHW', '2026-04-30 14:56:53'),
(49, 'MC-2026-7882', 265, 12, 'Physically fit and mentally stable.', 'Medically fit to work as BHW.', '2026-04-30 15:03:41'),
(50, 'MC-2026-7766', 267, 12, 'Physically Fit and mentally stable', 'Medically fit to work as BHW', '2026-05-04 09:31:32'),
(51, 'MC-2026-3688', 268, 12, 'Physically fit and mentally stable', 'Medically fit to work as BHW.', '2026-05-04 09:55:34'),
(52, 'MC-2026-8233', 269, 12, 'Physical disability secondary to Seizure disorder', 'For compliance with maintenance medications\nFor issuance of PWD identification card', '2026-05-04 10:16:56'),
(53, 'MC-2026-8082', 270, 12, 'Physically fit and mentally stable', 'Medically fit to enroll', '2026-05-04 10:33:44'),
(56, 'MC-2026-9296', 273, 12, 'Physically fit and mentally stable', 'Medically fit to enroll', '2026-05-04 11:32:59'),
(57, 'MC-2026-7610', 274, 12, 'Physically fit and mentally stable', 'Medically fit to work as BHW', '2026-05-04 11:36:14'),
(58, 'MC-2026-3278', 275, 12, 'Physically fit and mentally stable', 'Medically fit to work as BHW', '2026-05-04 11:40:00'),
(59, 'MC-2026-8222', 277, 12, 'Physical disability secondary to congenital anomaly (club foot)', 'For issuance of PWD identification card', '2026-05-04 11:58:26'),
(60, 'MC-2026-9368', 278, 12, 'Physically fit and mentally stable', 'Medically fit to attend ROTC activities', '2026-05-04 12:01:44'),
(61, 'MC-2026-3567', 279, 12, 'Physically fit and mentally stable at the time of examination', 'With findings on ECG - for interpretation by a cardiologist', '2026-05-04 12:09:49'),
(62, 'MC-2026-2575', 280, 12, 'Physically fit and mentally stable', 'Medically fit to attend ROTC activities', '2026-05-04 12:13:26'),
(64, 'MC-2026-1991', 283, 12, 'Physically fit and mentally stable', 'Medically fit to work.', '2026-05-04 12:34:49'),
(65, 'MC-2026-9344', 284, 12, 'Physically fit and mentally stable', 'Medically fit to work as BHW', '2026-05-04 12:38:21'),
(66, 'MC-2026-3962', 285, 12, 'Physically fit and mentally stable', 'Medically fit to attend ROTC activities', '2026-05-04 12:43:02'),
(67, 'MC-2026-5842', 286, 12, 'Physically fit and mentally', 'Medically fit to work as BHW', '2026-05-04 12:46:58'),
(68, 'MC-2026-8499', 287, 12, 'Physically fit and mentally stable', 'Medically fit to work', '2026-05-04 12:50:16'),
(69, 'MC-2026-4708', 288, 12, 'Physically fit and mentally stable', 'Medically fit to work as BHW', '2026-05-04 12:52:23'),
(70, 'MC-2026-7732', 289, 12, 'Physically fit and mentally stable', 'Medically fit to work', '2026-05-04 12:54:20'),
(71, 'MC-2026-6525', 290, 12, 'Physically fit and mentally stable', 'Medically fit to work as BHW', '2026-05-04 12:57:51'),
(72, 'MC-2026-9115', 291, 12, 'Physically fit and mentally stable', 'Medically fit to work as BHW', '2026-05-04 12:59:59'),
(73, 'MC-2026-5733', 292, 12, 'Physically fit and mentally stable', 'Medically fit to work as BHW', '2026-05-04 13:03:59'),
(74, 'MC-2026-3314', 293, 12, 'Physically fit and mentally stable', 'Medically fit to enroll', '2026-05-04 13:06:05'),
(75, 'MC-2026-1346', 294, 12, 'Physically fit and mentally stable', 'Medically fit to work.', '2026-05-04 14:37:52'),
(76, 'MC-2026-9114', 296, 12, 'Physically fit and mentally stable', 'Medically fit to enroll', '2026-05-04 14:55:41'),
(77, 'MC-2026-8214', 297, 12, 'Physically fit and mentally stable', 'Medically fit to work', '2026-05-04 15:03:00'),
(78, 'MC-2026-5517', 298, 12, 'Physically fit and mentally stable', 'Medically fit to enroll', '2026-05-04 15:06:08'),
(79, 'MC-2026-7295', 299, 12, 'Autism Spectrum Disorder Level 1', 'For regular conduct of therapy sessions', '2026-05-04 15:16:08'),
(80, 'MC-2026-4609', 300, 12, 'Physically fit and mentally stable', 'Medically fit to enroll', '2026-05-04 15:20:02'),
(81, 'MC-2026-1308', 308, 12, 'Physically fit and mentally stable', 'Medically fit to enroll', '2026-05-06 12:01:45'),
(82, 'MC-2026-6932', 310, 12, 'Physically fit and mentally stable', 'Medically fit to enroll', '2026-05-06 12:22:59'),
(83, 'MC-2026-9113', 311, 12, 'Psychosocial disorder secondary to Developmental Growth Disorder', 'For issuance of PWD identification card', '2026-05-06 12:34:38'),
(84, 'MC-2026-8196', 254, 12, 'Schizophrenia', 'For compliance with maintenance medication', '2026-05-11 13:49:42');

-- --------------------------------------------------------

--
-- Table structure for table `panels`
--

CREATE TABLE `panels` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `panels`
--

INSERT INTO `panels` (`id`, `code`, `name`) VALUES
(1, 'patient', 'Patient'),
(2, 'queuegen', 'Queue Generator'),
(3, 'medical', 'Medical'),
(4, 'laboratory', 'Laboratory'),
(5, 'reports', 'Reports'),
(6, 'reassign', 'Reassign'),
(7, 'referral', 'Referral');

-- --------------------------------------------------------

--
-- Table structure for table `patients_db`
--

CREATE TABLE `patients_db` (
  `id` int(11) NOT NULL,
  `barangay_id` int(11) NOT NULL,
  `purok_id` int(11) DEFAULT NULL,
  `patient_code` varchar(64) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) NOT NULL,
  `suffix` varchar(10) DEFAULT NULL,
  `date_of_birth` date NOT NULL,
  `birthplace` varchar(255) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` varchar(20) NOT NULL,
  `marital_status` varchar(20) DEFAULT NULL,
  `blood_type` varchar(10) DEFAULT NULL,
  `mother_name` varchar(255) DEFAULT NULL,
  `spouse_name` varchar(255) DEFAULT NULL,
  `contact_number` varchar(30) DEFAULT NULL,
  `household_no` varchar(100) DEFAULT NULL,
  `facility_household_no` varchar(100) DEFAULT NULL,
  `education_level` enum('No Formal Education','Elementary','High School','Vocational','College','Post Graduate','Unknown') DEFAULT 'Unknown',
  `employment_status` enum('Employed','Unemployed','Retired','Others') DEFAULT NULL,
  `family_member_type` enum('Father','Mother','Daughter','Son','Others') DEFAULT NULL,
  `dswd_nhts` enum('Yes','No') DEFAULT 'No',
  `member_4ps` enum('Yes','No') DEFAULT 'No',
  `pcb_member` enum('Yes','No') DEFAULT 'No',
  `philhealth_member` enum('Yes','No') DEFAULT 'No',
  `philhealth_status_type` enum('Member','Dependent') DEFAULT NULL,
  `philhealth_no` varchar(100) DEFAULT NULL,
  `philhealth_category` enum('None','FE - Private','FE - Government','DIRECT CONTRIBUTOR - PROFESSIONAL PRACTITIONER','DIRECT CONTRIBUTOR - SELF-EARNING INDIVIDUAL - SOLE PROPRIETOR','FE - ENTERPRISE OWNER','FE - FAMILY DRIVER','FE - GOVT - CASUAL','FE - GOVT - CONTRACT/PROJECT BASED','FE - GOVT - PERMANENT REGULAR','FE - HOUSEHOLD HELP/KASAMBAHAY','FE - PRIVATE - CASUAL','FE - PRIVATE - CONTRACT/PROJECT BASED','FE - PRIVATE - PERMANENT REGULAR','IE - CITIZEN OF OTHER COUNTRIES WORKING/RESIDING/STUDYING IN THE PHILIPPINES','IE - FILIPINO WITH DUAL CITIZENSHIP','IE - INFORMAL SECTOR','IE - MIGRANT WORKER - LAND BASED','IE - MIGRANT WORKER - SEA BASED','IE - NATURALIZED FILIPINO CITIZEN','IE - ORGANIZED GROUP','IE - SELF EARNING INDIVIDUAL','INDIGENT - NHTS-PR','INDIRECT CONTRIBUTOR - 4PS/MCCT','INDIRECT CONTRIBUTOR - BANGSAMORO/NORMALIZATION','INDIRECT CONTRIBUTOR - FINANCIALLY INCAPABLE','INDIRECT CONTRIBUTOR - KIA/KIPO','INDIRECT CONTRIBUTOR - LISTAHANAN','INDIRECT CONTRIBUTOR - PAMANA','INDIRECT CONTRIBUTOR - PERSON WITH DISABILITY','INDIRECT CONTRIBUTOR - PRIVATE-SPONSORED','INDIRECT CONTRIBUTOR - SOLO PARENT','LIFETIME MEMBER - RETIREE/PENSIONER','LIFETIME MEMBER - WITH 120 MONTHS CONTRIBUTION AND HAS REACHED RETIREMENT AGE','SENIOR CITIZEN','SPONSORED - LGU','SPONSORED - NGA','SPONSORED - OTHERS','SPONSORED - POS - FINANCIALLY INCAPABLE') DEFAULT 'None',
  `profile_image` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive','deceased') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_household_move_at` datetime DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `city_municipality` varchar(255) DEFAULT NULL,
  `barangay_name` varchar(255) DEFAULT NULL,
  `street` text DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patients_db`
--

INSERT INTO `patients_db` (`id`, `barangay_id`, `purok_id`, `patient_code`, `first_name`, `middle_name`, `last_name`, `suffix`, `date_of_birth`, `birthplace`, `age`, `gender`, `marital_status`, `blood_type`, `mother_name`, `spouse_name`, `contact_number`, `household_no`, `facility_household_no`, `education_level`, `employment_status`, `family_member_type`, `dswd_nhts`, `member_4ps`, `pcb_member`, `philhealth_member`, `philhealth_status_type`, `philhealth_no`, `philhealth_category`, `profile_image`, `status`, `created_at`, `last_household_move_at`, `region`, `province`, `city_municipality`, `barangay_name`, `street`, `deleted_at`) VALUES
(1, 15, 82, 'manook_(poblacion)_001', 'John Rafael', '', 'Escanilla', '', '2002-10-25', 'Quezon City, Philippines', 23, 'Male', 'Single', 'A+', 'Daisy Escanilla', '', '09753896256', '2026-00001', 'RHU-M(-00001', 'College', 'Unemployed', 'Son', 'No', 'No', 'No', 'Yes', 'Member', '0912376123', 'DIRECT CONTRIBUTOR - SELF-EARNING INDIVIDUAL - SOLE PROPRIETOR', 'upload/patient_1_1775750313.jpg', 'active', '2026-03-09 03:44:48', '2026-03-09 11:45:08', '', '', '', NULL, '', NULL),
(2, 24, NULL, 'nazareno_001', 'ZENAIDA', 'HABITAN', 'ENCINARES', NULL, '1945-06-27', NULL, 80, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00002', 'RHU-N-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-09 05:20:11', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 27, NULL, 'panganiban_(poblacion)_001', 'YVONNE', 'ROCHA', 'MACARAEG', '', '1956-10-26', '', 69, 'Female', 'Widowed', '', '', '', '', '2026-00003', 'RHU-P(-00001', 'Unknown', 'Others', NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-09 05:24:39', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 3, NULL, 'balud_del_norte_(poblacion)_001', 'Luz', 'Flestado', 'Divina', NULL, '1968-03-01', NULL, 58, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00004', 'RHU-BD-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-09 05:31:28', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 15, NULL, 'cota_na_daco_(poblacion)_001', 'RUTH', 'SALVAN', 'HASOPARDO', NULL, '1963-08-01', NULL, 62, 'Female', 'Co-habitation', NULL, NULL, NULL, NULL, '2026-00005', 'RHU-CN-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-09 05:33:11', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 8, NULL, 'buenavista_001', 'ISIDRO', 'ESPENIDA', 'FERERRAS', NULL, '1954-08-06', NULL, 71, 'Male', 'Married', NULL, NULL, NULL, NULL, '2026-00006', 'RHU-B-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-09 05:38:02', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 14, NULL, 'cogon_001', 'ZAFRIAH MADISSON', 'ENANO', 'FEOLINO', NULL, '2025-09-20', NULL, 0, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00007', 'RHU-C-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-09 05:40:45', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 33, NULL, 'san_ignacio_001', 'DIOGENES', 'ESTREBILLO', 'DOGILLO', NULL, '1947-03-20', NULL, 78, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00008', 'RHU-SI-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-09 05:44:30', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 21, NULL, 'manook_(poblacion)_002', 'CYNTHIA', 'AGUSTIN', 'MARCIAL', NULL, '1952-08-20', NULL, 73, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00009', 'RHU-M(-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-09 06:19:53', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 26, NULL, 'paco_001', 'ANNIANA', 'ESPENILE', 'BRONOLA', NULL, '2026-01-20', NULL, 0, 'Female', NULL, NULL, NULL, NULL, NULL, '2026-00010', 'RHU-P-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-09 06:20:55', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 33, NULL, 'san_ignacio_002', 'ELENA', 'BALALA', 'ESTAYANE', NULL, '1961-05-20', NULL, 64, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00011', 'RHU-SI-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-09 06:26:44', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(12, 21, 1, 'manook_(poblacion)_003', 'JAMES ALDRIN', 'ESCANILLA', 'TIN', '', '2010-03-28', '', 15, 'Male', 'Single', '', '', '', '', '2026-00001', 'RHU-M(-00001', 'Unknown', NULL, 'Son', 'No', 'No', 'No', 'No', NULL, '', NULL, 'upload/patient_12_1775997455.jpg', 'active', '2026-03-09 07:03:32', '2026-03-16 14:18:41', NULL, NULL, NULL, NULL, NULL, NULL),
(13, 21, 1, 'manook_(poblacion)_004', 'DAISY', 'ENCONADO', 'ESCANILLA', '', '1988-02-28', '', 38, 'Female', 'Single', '', '', '', '', '2026-00001', 'RHU-M(-00001', 'Unknown', 'Others', 'Mother', 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-09 07:08:59', '2026-03-16 14:19:26', NULL, NULL, NULL, NULL, NULL, NULL),
(14, 43, NULL, 'outside_gubat_001', 'ELPIDIA', 'ENCONADO', 'ESCANILLA', '', '1950-01-28', '', 76, 'Female', 'Married', '', 'ELPIDIA ESCANILLA', 'JAVIER', '09876912456', '2026-00014', 'RHU-OG-00001', 'Unknown', 'Others', 'Father', 'Yes', 'Yes', 'Yes', 'Yes', 'Member', '12-345678901-2', 'DIRECT CONTRIBUTOR - SELF-EARNING INDIVIDUAL - SOLE PROPRIETOR', NULL, 'active', '2026-03-10 10:48:08', '2026-03-12 16:16:27', NULL, NULL, NULL, NULL, NULL, NULL),
(15, 43, NULL, 'outside_gubat_002', 'Jomar', '', 'Ariola', '', '2002-11-11', '', 23, 'Male', 'Single', '', '', '', '', '2026-00017', 'RHU-OG-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, '', NULL, 'upload/patient_15_1773421290.jpg', 'active', '2026-03-13 03:24:55', NULL, 'V', 'Quezon', 'Lucban', 'San Isidro', 'Purok 1', NULL),
(16, 43, NULL, 'outside_gubat_003', 'Jan Reys', '', 'Borlains', '', '2002-01-01', '', 24, 'Male', 'Single', '', '', '', '', '2026-00018', 'RHU-OG-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, '', NULL, 'upload/patient_16_1773501675.jpg', 'active', '2026-03-13 03:26:16', NULL, 'V', 'Quezon', 'Lucban', 'San Isidro', 'Purok 1', NULL),
(17, 1, NULL, 'ariman_001', 'BRIDGE', 'BRIDGE', 'BRIDGE', NULL, '2002-12-20', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-14 16:00:05', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(18, 1, NULL, 'ariman_002', 'ROT', NULL, 'ROT', NULL, '2002-12-22', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, '2Q==', 'active', '2026-03-14 16:25:24', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(19, 7, NULL, 'beriran_001', 'd', 'd', 'd', '', '1999-11-11', '', 26, 'Male', 'Single', '', '', '', '', NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, '', NULL, 'upload/patient_19_1773507458.jpg', 'active', '2026-03-14 16:34:39', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(20, 2, NULL, 'bagacay_001', 'g', 'g', 'g', '', '1999-12-31', '', 26, 'Male', 'Single', '', '', '', '', NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, '', NULL, 'upload/patient_20_1773508313.jpg', 'inactive', '2026-03-14 17:10:53', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-15 05:01:19'),
(21, 2, NULL, 'bagacay_002', 'l', 'l', 'l', '', '1999-11-11', '', 26, 'Male', 'Single', '', '', '', '', NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, '', NULL, 'upload/patient_21_1773508535.jpg', 'inactive', '2026-03-14 17:15:34', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-15 04:51:05'),
(22, 9, NULL, 'bulacao_001', 'z', 'z', 'z', '', '2002-12-22', '', 23, 'Male', 'Single', '', '', '', '', NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, '', NULL, 'upload/patient_22_1773508623.jpg', 'inactive', '2026-03-14 17:16:24', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-15 04:45:26'),
(23, 1, NULL, 'ariman_003', 'IAN', NULL, 'ZYRONE', NULL, '1999-11-11', NULL, 26, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00019', 'RHU-A-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-16 00:29:47', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(24, 14, NULL, 'cogon_002', 'Zosima', 'Garcia', 'Ramos', NULL, '1964-03-10', NULL, 62, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00020', 'RHU-C-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-16 00:35:52', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(25, 2, NULL, 'bagacay_003', 'Samantha Cristel', 'Joven', 'Lelis', NULL, '2007-07-27', NULL, 18, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00021', 'RHU-B-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-16 00:37:35', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(26, 34, NULL, 'sangat_001', 'Estela', 'Funtanares', 'Escobedo', NULL, '1950-10-17', NULL, 75, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00022', 'RHU-S-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-16 00:39:58', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(27, 27, NULL, 'panganiban_(poblacion)_002', 'Caridad', 'Erlano', 'Galang', NULL, '1945-12-02', NULL, 80, 'Female', NULL, NULL, NULL, NULL, NULL, '2026-00023', 'RHU-P(-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-16 00:40:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(28, 27, NULL, 'panganiban_(poblacion)_003', 'Vilma', 'Esperida', 'Galang', NULL, '1970-11-04', NULL, 55, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00024', 'RHU-P(-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-16 00:42:36', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(29, 27, NULL, 'panganiban_(poblacion)_004', 'Felipe', 'Erlano', 'Galang', NULL, '1970-09-11', NULL, 55, 'Male', 'Married', NULL, NULL, NULL, NULL, '2026-00025', 'RHU-P(-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-16 00:43:35', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(30, 42, NULL, 'villareal_001', 'Edgar', 'Esperida', 'Erlano', NULL, '1963-11-09', NULL, 62, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00026', 'RHU-V-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-16 00:44:31', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(31, 37, NULL, 'tagaytay_001', 'Dolores', 'Ofalsa', 'Eresmas', NULL, '1945-08-03', NULL, 80, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00027', 'RHU-T-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-16 01:11:43', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(32, 37, NULL, 'tagaytay_002', 'Milagros', 'Esquierra', 'Espedido', NULL, '1946-06-11', NULL, 79, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00028', 'RHU-T-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-16 01:12:55', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(33, 26, NULL, 'paco_002', 'Esperanza', 'Ermino', 'SURIAGA', NULL, '1971-11-21', NULL, 54, 'Female', NULL, NULL, NULL, NULL, NULL, '2026-00029', 'RHU-P-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-16 01:14:08', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(34, 32, NULL, 'rizal_001', 'Danilo', 'Enolva', 'Escobedo', 'Jr', '2022-09-20', NULL, 3, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00030', 'RHU-R-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-16 01:16:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(35, 20, NULL, 'manapao_001', 'Salvacion', 'Paniergo', 'Estolas', NULL, '1963-02-15', NULL, 63, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00031', 'RHU-M-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-16 01:17:13', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(36, 30, NULL, 'payawin_001', 'Analita', 'EreÑo', 'Joven', NULL, '1973-05-03', NULL, 52, 'Female', 'Married', NULL, NULL, NULL, NULL, '2026-00032', 'RHU-P-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-16 01:18:56', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(37, 21, NULL, 'manook_(poblacion)_005', 'Myrna', 'Escanan', 'Eugerio', NULL, '1968-08-14', NULL, 57, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00033', 'RHU-M(-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-16 01:30:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(38, 29, NULL, 'patag_001', 'Jed', 'Espinele', 'Divino', '', '2014-04-11', '', 11, 'Male', 'Single', '', '', '', '', '2026-00034', 'RHU-P-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, '', NULL, 'upload/patient_38_1773626139.jpg', 'active', '2026-03-16 01:31:35', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(39, 25, NULL, 'ogao_001', 'Sherly', 'Mellina', 'Argosino', '', '1991-08-29', '', 34, 'Female', 'Single', '', '', '', '', '2026-00035', 'RHU-O-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, '', NULL, 'upload/patient_39_1773626082.jpg', 'active', '2026-03-16 01:32:41', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(40, 19, NULL, 'luna-candol_(poblacion)_001', 'Deogenes', 'Florano', 'Buenaobra', '', '1954-06-14', '', 71, 'Male', 'Single', '', '', '', '', '2026-00036', 'RHU-L(-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, '', NULL, 'upload/patient_40_1773626036.jpg', 'active', '2026-03-16 01:36:15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(41, 3, NULL, 'balud_del_norte_(poblacion)_002', 'Ma. Angela', 'Macalla', 'Espiritu', '', '1984-12-03', '', 41, 'Female', 'Single', '', '', '', '', '2026-00037', 'RHU-BD-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, '', NULL, 'upload/patient_41_1773625915.jpg', 'active', '2026-03-16 01:37:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(42, 15, 8, 'cota_na_daco_(poblacion)_002', 'Lorena', 'Encinas', 'Nelayan', NULL, '1978-01-02', NULL, 48, 'Female', NULL, NULL, NULL, NULL, NULL, '2026-00038', 'RHU-CN-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_42_1773626711.jpg', 'active', '2026-03-16 02:05:11', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(43, 39, NULL, 'tiris_001', 'Rowena', 'Miniano', 'Esquierra', NULL, '1988-04-14', NULL, 37, 'Female', NULL, NULL, NULL, NULL, NULL, '2026-00039', 'RHU-T-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_43_1773626810.jpg', 'active', '2026-03-16 02:06:50', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(44, 39, NULL, 'tiris_002', 'Lilibeth', 'Locrida', 'Espinocilla', NULL, '1981-05-28', NULL, 44, 'Female', 'Married', NULL, NULL, NULL, NULL, '2026-00040', 'RHU-T-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_44_1773626927.jpg', 'active', '2026-03-16 02:08:47', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(45, 19, NULL, 'luna-candol_(poblacion)_002', 'Nelia', 'Lopez', 'David', NULL, '1956-10-25', NULL, 69, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00041', 'RHU-L(-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_45_1773627037.jpg', 'active', '2026-03-16 02:10:37', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(46, 31, NULL, 'pinontingan_(poblacion)_001', 'Carl Reuben', 'Pura', 'Ereno', NULL, '2014-05-13', NULL, 11, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00042', 'RHU-P(-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_46_1773627153.jpg', 'active', '2026-03-16 02:12:33', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(47, 19, 9, 'luna-candol_(poblacion)_003', 'Nelia', 'Erestain', 'Buenaobra', NULL, '1952-11-18', NULL, 73, 'Female', 'Married', NULL, NULL, NULL, NULL, '2026-00043', 'RHU-L(-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_47_1773627234.jpg', 'active', '2026-03-16 02:13:54', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(48, 20, NULL, 'manapao_002', 'Criselda', 'Enorme', 'Padrique', NULL, '1982-04-11', NULL, 43, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00044', 'RHU-M-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_48_1773627410.jpg', 'active', '2026-03-16 02:16:50', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(49, 19, 10, 'luna-candol_(poblacion)_004', 'Salvacion', 'Chaves', 'Regino', NULL, '1993-06-15', NULL, 32, 'Female', 'Married', NULL, NULL, NULL, NULL, '2026-00045', 'RHU-L(-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_49_1773627501.jpg', 'active', '2026-03-16 02:18:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(50, 14, NULL, 'cogon_003', 'Mary Grace', 'Caputol', 'Fortuno', NULL, '1994-07-02', NULL, 31, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00046', 'RHU-C-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_50_1773627576.jpg', 'active', '2026-03-16 02:19:36', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(51, 36, 11, 'tabi_001', 'Expectacion', 'Ferreras', 'Federeso', NULL, '1940-01-01', NULL, 86, 'Female', 'Widowed', NULL, NULL, NULL, NULL, '2026-00047', 'RHU-T-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_51_1773627702.jpg', 'active', '2026-03-16 02:21:42', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(52, 19, 9, 'luna-candol_(poblacion)_005', 'Jose', 'Halum', 'Hilis', NULL, '1961-01-05', NULL, 65, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00048', 'RHU-L(-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_52_1773627815.jpg', 'active', '2026-03-16 02:23:34', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(53, 26, NULL, 'paco_003', 'John Kiefer', 'Docot', 'Sawal', NULL, '2013-09-16', NULL, 12, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00049', 'RHU-P-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_53_1773628845.jpg', 'active', '2026-03-16 02:40:45', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(54, 32, NULL, 'rizal_002', 'Jayden Rose', 'Enolva', 'Buergo', NULL, '2025-01-15', NULL, 1, 'Female', 'Married', NULL, NULL, NULL, NULL, '2026-00050', 'RHU-R-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_54_1773628920.jpg', 'active', '2026-03-16 02:42:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(55, 9, NULL, 'bulacao_002', 'Ricky', 'Erlano', 'Jerusalem', NULL, '1989-09-16', NULL, 36, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00051', 'RHU-B-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_55_1773628992.jpg', 'active', '2026-03-16 02:43:12', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(56, 15, 12, 'cota_na_daco_(poblacion)_003', 'Ernesto', 'Escauriaga', 'Esteves', NULL, '1970-04-25', NULL, 55, 'Male', 'Married', NULL, NULL, NULL, NULL, '2026-00052', 'RHU-CN-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_56_1773631485.jpg', 'active', '2026-03-16 03:24:45', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(57, 34, NULL, 'sangat_002', 'Joy Mae', 'Haloc', 'Rovera', NULL, '1995-10-03', NULL, 30, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00053', 'RHU-S-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_57_1773632915.jpg', 'active', '2026-03-16 03:48:35', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(58, 35, NULL, 'santa_ana_001', 'Elena', 'Hidea', 'Escobedo', NULL, '1950-09-23', NULL, 75, 'Female', 'Widowed', NULL, NULL, NULL, NULL, '2026-00054', 'RHU-SA-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-16 03:49:44', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(59, 36, 14, 'tabi_002', 'Josie', 'OsmeÑa', 'Estrada', NULL, '1992-11-09', NULL, 33, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00055', 'RHU-T-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_59_1773633065.jpg', 'active', '2026-03-16 03:51:05', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(60, 19, 9, 'luna-candol_(poblacion)_006', 'Lilia', 'EspaÑo', 'Falcoto', NULL, '1942-11-24', NULL, 83, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00056', 'RHU-L(-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-16 03:52:58', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(61, 33, NULL, 'san_ignacio_003', 'Jaedan Matthew', 'Buenaobra', 'Odiame', NULL, '2023-02-16', NULL, 3, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_61_1773633241.jpg', 'active', '2026-03-16 03:54:01', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(62, 14, 15, 'cogon_004', 'Jocelyn', 'Escala', 'Odiame', NULL, '1975-01-24', NULL, 51, 'Female', 'Married', NULL, NULL, NULL, NULL, '2026-00057', 'RHU-C-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_62_1773633330.jpg', 'active', '2026-03-16 03:55:30', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(63, 14, NULL, 'cogon_005', 'Drei Rayden', 'Estrellado', 'Escartin', '', '2026-03-06', '', 0, 'Male', 'Single', '', '', '', '', '2026-00058', 'RHU-C-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, '', NULL, 'upload/patient_63_1773633543.jpg', 'active', '2026-03-16 03:56:29', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(64, 14, NULL, 'cogon_006', 'Annaly', 'Arrobang', 'Estonanto', NULL, '1970-09-23', NULL, 55, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00059', 'RHU-C-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_64_1773633496.jpg', 'active', '2026-03-16 03:58:16', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(65, 1, 17, 'ariman_004', 'Isabel', 'Escanilla', 'Ereno', NULL, '1949-07-08', NULL, 76, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00060', 'RHU-A-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-16 04:05:43', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(66, 13, NULL, 'casili_001', 'Joel', 'Escultura', 'Padrique', NULL, '1973-04-19', NULL, 52, 'Male', 'Co-habitation', NULL, NULL, NULL, NULL, '2026-00061', 'RHU-C-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_66_1773634054.jpg', 'active', '2026-03-16 04:07:34', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(67, 2, NULL, 'bagacay_004', 'Ma. Gracia', 'Engay', 'Em', NULL, '1956-04-22', NULL, 69, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00062', 'RHU-B-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_67_1773634212.jpg', 'active', '2026-03-16 04:10:12', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(68, 13, 18, 'casili_002', 'Elita', 'Liantos', 'Costambirenes', NULL, '1980-03-28', NULL, 45, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00063', 'RHU-C-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_68_1773634298.jpg', 'active', '2026-03-16 04:11:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(69, 7, NULL, 'beriran_002', 'Marivic', 'Frias', 'Entico', NULL, '1975-07-05', NULL, 50, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00064', 'RHU-B-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_69_1773634510.jpg', 'active', '2026-03-16 04:15:10', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(70, 1, NULL, 'ariman_005', 'Gina', 'Ofalsa', 'Eneria', NULL, '1974-04-07', NULL, 51, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00065', 'RHU-A-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_70_1773638196.jpg', 'active', '2026-03-16 05:16:36', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(71, 22, NULL, 'naagtan_001', 'Norvic', 'Escarda', 'Hamor', NULL, '1994-09-04', NULL, 31, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00066', 'RHU-N-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_71_1773638314.jpg', 'active', '2026-03-16 05:18:34', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(72, 3, 19, 'balud_del_norte_(poblacion)_003', 'Benjamin', 'Bolgasa', 'Embase', NULL, '2011-08-27', NULL, 14, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00067', 'RHU-BD-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-16 05:20:01', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(73, 27, NULL, 'panganiban_(poblacion)_005', 'Kian', 'Escobedo', 'Escolano', NULL, '2024-01-19', NULL, 2, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00068', 'RHU-P(-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_73_1773638475.jpg', 'active', '2026-03-16 05:21:15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(74, 39, 21, 'tiris_003', 'Nathalie', 'Pura', 'Esquierra', NULL, '2014-09-09', NULL, 11, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00069', 'RHU-T-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_74_1773642932.jpg', 'active', '2026-03-16 06:35:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(75, 43, NULL, 'outside_gubat_004', 'Rico', 'Borja', 'Basco', NULL, '1985-09-20', NULL, 40, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00070', 'RHU-OG-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_75_1773643894.jpg', 'active', '2026-03-16 06:51:34', NULL, 'V', 'Sorsogon', 'Casiguran', 'Casay', NULL, NULL),
(76, 25, NULL, 'ogao_002', 'Daisy', 'Federio', 'Villaroya', NULL, '1969-04-12', NULL, 56, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00071', 'RHU-O-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_76_1773643996.jpg', 'active', '2026-03-16 06:53:16', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(77, 41, 22, 'union_001', 'Napoleon', 'EreÑo', 'Escandor', NULL, '1967-08-08', NULL, 58, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00072', 'RHU-U-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_77_1773644783.jpg', 'active', '2026-03-16 07:06:22', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(78, 18, NULL, 'lapinig_001', 'Lida', 'Dig', 'Ducay', NULL, '1983-09-07', NULL, 42, 'Female', 'Married', NULL, NULL, NULL, NULL, '2026-00073', 'RHU-L-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_78_1773644857.jpg', 'active', '2026-03-16 07:07:37', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(79, 32, NULL, 'rizal_003', 'Bonnie Mae', 'Medina', 'Esller', NULL, '1996-05-31', NULL, 29, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00074', 'RHU-R-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_79_1773646429.jpg', 'active', '2026-03-16 07:33:49', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(80, 43, NULL, 'outside_gubat_005', 'Mary Ann', 'Evasco', 'Espinar', NULL, '1988-07-29', NULL, 37, 'Female', 'Married', NULL, NULL, NULL, NULL, '2026-00075', 'RHU-OG-00007', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_80_1773646539.jpg', 'active', '2026-03-16 07:35:39', NULL, 'V', 'Sorsogon', 'Barcelona', 'Luneta', NULL, NULL),
(81, 12, 24, 'carriedo_001', 'Lilia', 'Lotoc', 'Florendo', NULL, '1973-08-10', NULL, 52, 'Female', 'Married', NULL, NULL, NULL, NULL, '2026-00076', 'RHU-C-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_81_1773648734.jpg', 'active', '2026-03-16 08:12:14', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(82, 22, 25, 'naagtan_002', 'Josephine', 'Licmoan', 'Espaldon', NULL, '1982-01-13', NULL, 44, 'Female', 'Married', NULL, NULL, NULL, NULL, '2026-00077', 'RHU-N-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_82_1773649021.jpg', 'active', '2026-03-16 08:17:01', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(83, 38, NULL, 'tigkiw_001', 'John Angel', 'Salvoso', 'Estrelldo', NULL, '2007-07-30', NULL, 18, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00078', 'RHU-T-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_83_1773649297.jpg', 'active', '2026-03-16 08:21:37', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(84, 22, NULL, 'naagtan_003', 'Joebeth', 'San Juan', 'Fresnoza', NULL, '1991-11-24', NULL, 34, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00079', 'RHU-N-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-16 08:23:10', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(85, 26, NULL, 'paco_004', 'Angelina', 'Enaje', 'Ergina', NULL, '1969-04-12', NULL, 56, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00080', 'RHU-P-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-16 08:25:54', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(86, 21, NULL, 'manook_(poblacion)_006', 'Raymond', 'Felonia', 'Gubian', NULL, '1984-05-23', NULL, 41, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00081', 'RHU-M(-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_86_1773649651.jpg', 'active', '2026-03-16 08:27:31', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(87, 26, 28, 'paco_005', 'Sherly', 'Ferreras', 'Bosa', NULL, '1991-06-07', NULL, 34, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00082', 'RHU-P-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-16 08:29:27', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(88, 39, 29, 'tiris_004', 'Rose Andrea', 'Escober', 'Simbajon', NULL, '2005-06-07', NULL, 20, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_88_1773649843.jpg', 'active', '2026-03-16 08:30:43', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(89, 1, NULL, 'ariman_006', 'Milagros', 'Espineda', 'Caballero', NULL, '1980-03-02', NULL, 46, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00083', 'RHU-A-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_89_1773649933.jpg', 'active', '2026-03-16 08:32:13', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(90, 31, NULL, 'pinontingan_(poblacion)_002', 'Cyril', 'Ermino', 'Ercilla', NULL, '1989-09-13', NULL, 36, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00084', 'RHU-P(-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_90_1773650142.jpg', 'active', '2026-03-16 08:35:42', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(91, 9, NULL, 'bulacao_003', 'Leo', 'Escober', 'Galpo', NULL, '1966-10-06', NULL, 59, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00085', 'RHU-B-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_91_1773707530.jpg', 'active', '2026-03-17 00:32:10', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(92, 30, NULL, 'payawin_002', 'Cecile', 'Dulva', 'Robles', NULL, '1983-11-27', NULL, 42, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00086', 'RHU-P-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_92_1773708455.jpg', 'active', '2026-03-17 00:47:35', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(93, 28, NULL, 'paradijon_(poblacion)_001', 'Merly', 'Gabarda', 'Escandor', NULL, '1957-03-18', NULL, 68, 'Female', NULL, NULL, NULL, NULL, NULL, '2026-00087', 'RHU-P(-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_93_1773708528.jpg', 'active', '2026-03-17 00:48:48', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(94, 22, NULL, 'naagtan_004', 'Nicanor', 'Erepol', 'Funelas', NULL, '1969-08-08', NULL, 56, 'Male', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_94_1773709444.jpg', 'active', '2026-03-17 01:04:04', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(95, 38, NULL, 'tigkiw_002', 'Consorcia', 'Espenoi', 'Alopo-op', NULL, '1964-01-13', NULL, 62, 'Female', 'Married', NULL, NULL, NULL, NULL, '2026-00088', 'RHU-T-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-17 01:04:56', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(96, 28, NULL, 'paradijon_(poblacion)_002', 'Lance', 'E', 'Gamba', NULL, '2003-07-20', NULL, 22, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00089', 'RHU-P(-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_96_1773872941.jpg', 'active', '2026-03-18 22:29:01', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(97, 15, 8, 'cota_na_daco_(poblacion)_004', 'Lea', 'Encinas', 'Escoto', NULL, '1966-10-23', NULL, 59, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00090', 'RHU-CN-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_97_1773879420.jpg', 'active', '2026-03-19 00:17:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(98, 8, 31, 'buenavista_002', 'Estelita', 'Escarcha', 'Gratela', NULL, '1954-06-06', NULL, 71, 'Female', 'Married', NULL, NULL, NULL, NULL, '2026-00091', 'RHU-B-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_98_1773879744.jpg', 'active', '2026-03-19 00:22:24', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(99, 7, NULL, 'beriran_003', 'Agapito', 'Grajo', 'Escaros', NULL, '1974-12-21', NULL, 51, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00092', 'RHU-B-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_99_1773879847.jpg', 'active', '2026-03-19 00:24:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(100, 14, 32, 'cogon_007', 'Romeo', 'Estuye', 'Ferreras', NULL, '1964-01-01', NULL, 62, 'Male', 'Married', NULL, NULL, NULL, NULL, '2026-00093', 'RHU-C-00007', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_100_1773879933.jpg', 'active', '2026-03-19 00:25:33', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(101, 15, 33, 'cota_na_daco_(poblacion)_005', 'Estrella', 'Soria', 'Ferreras', NULL, '1948-05-11', NULL, 77, 'Female', 'Married', NULL, NULL, NULL, NULL, '2026-00094', 'RHU-CN-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_101_1773880028.jpg', 'active', '2026-03-19 00:27:08', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(102, 42, 34, 'villareal_002', 'Anastacio', 'Payos', 'Esperida', NULL, '1944-08-23', NULL, 81, 'Male', 'Married', NULL, NULL, NULL, NULL, '2026-00095', 'RHU-V-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_102_1773880155.jpg', 'active', '2026-03-19 00:29:15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(103, 42, 34, 'villareal_003', 'Elena', 'Ferreras', 'Esperida', NULL, '1948-08-13', NULL, 77, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00096', 'RHU-V-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_103_1773880445.jpg', 'active', '2026-03-19 00:34:05', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(104, 8, 31, 'buenavista_003', 'Geraldine', 'Linda', 'Bagacay', NULL, '1975-04-18', NULL, 50, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00097', 'RHU-B-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-19 00:38:01', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(105, 14, NULL, 'cogon_008', 'Kevin', 'Toledo', 'Corral', NULL, '1994-10-15', NULL, 31, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00098', 'RHU-C-00008', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-19 00:39:51', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(106, 8, NULL, 'buenavista_004', 'Mcrey', 'Linda', 'Bagacay', NULL, '1998-11-24', NULL, 27, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-19 00:40:47', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(107, 3, 35, 'balud_del_norte_(poblacion)_004', 'Antonio', 'Joven', 'JareÑo', NULL, '1952-05-16', NULL, 73, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00099', 'RHU-BD-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-19 00:42:04', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(108, 27, NULL, 'panganiban_(poblacion)_006', 'Ruben', 'DoniÑa', 'Guevarra', NULL, '1947-03-20', NULL, 78, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00100', 'RHU-P(-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-19 00:44:55', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(109, 31, NULL, 'pinontingan_(poblacion)_003', 'Dhylan Francis', 'Escote', 'Farenas', NULL, '2025-09-22', NULL, 0, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00101', 'RHU-P(-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-19 00:48:49', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(110, 14, NULL, 'cogon_009', 'Priscilla', 'Esteves', 'Sim', NULL, '1960-12-30', NULL, 65, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00102', 'RHU-C-00009', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-19 00:49:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(111, 15, 33, 'cota_na_daco_(poblacion)_006', 'Sean Uriel', 'Ferreras', 'Espaldon', NULL, '2010-04-29', NULL, 15, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00103', 'RHU-CN-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-19 00:50:59', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(112, 25, NULL, 'ogao_003', 'Jumer', 'Felicidario', 'Jerusalem', NULL, '1976-03-16', NULL, 50, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00104', 'RHU-O-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-19 00:51:59', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(113, 36, 11, 'tabi_003', 'Gina', 'De-ala', 'Erlano', NULL, '1976-05-26', NULL, 49, 'Female', 'Married', NULL, NULL, NULL, NULL, '2026-00105', 'RHU-T-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-19 00:53:02', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(114, 3, NULL, 'balud_del_norte_(poblacion)_005', 'Ma. Teresa', 'Gerona', 'Flores', NULL, '1963-06-16', NULL, 62, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00106', 'RHU-BD-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-19 00:54:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(115, 15, 12, 'cota_na_daco_(poblacion)_007', 'Kielzavier', 'D', 'Maiso', NULL, '2025-09-19', NULL, 0, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00107', 'RHU-CN-00007', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-19 00:58:40', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(116, 15, 12, 'cota_na_daco_(poblacion)_008', 'Merly', 'Buenaobra', 'Panuga', NULL, '1982-08-28', NULL, 43, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00108', 'RHU-CN-00008', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-19 01:00:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(117, 1, NULL, 'ariman_007', 'Justin', 'Alveza', 'Hila', NULL, '2008-07-11', NULL, 17, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00109', 'RHU-A-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-19 01:04:37', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(118, 12, 36, 'carriedo_002', 'Jamzel Anne', 'Ocampo', 'Mortel', NULL, '2022-06-24', NULL, 3, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00110', 'RHU-C-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-19 01:05:43', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(119, 28, 37, 'paradijon_(poblacion)_003', 'Ronalyn', 'Bandojo', 'Deocampo', NULL, '2000-02-15', NULL, 26, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00111', 'RHU-P(-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-19 01:08:06', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(120, 12, 38, 'carriedo_003', 'Micaella', 'Ocampo', 'Mortel', NULL, '2020-05-17', NULL, 5, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00112', 'RHU-C-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-19 01:09:26', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(121, 31, NULL, 'pinontingan_(poblacion)_004', 'Dhaveron', 'Escote', 'Farenas', NULL, '2018-07-20', NULL, 7, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00113', 'RHU-P(-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-19 01:10:40', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(122, 14, NULL, 'cogon_010', 'Junnel', 'Fercol', 'Felicia', NULL, '1991-12-07', NULL, 34, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00114', 'RHU-C-00010', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-19 01:12:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(123, 3, 39, 'balud_del_norte_(poblacion)_006', 'Domingo', 'Petallo', 'Estrella', NULL, '1982-05-09', NULL, 43, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00115', 'RHU-BD-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-19 01:23:10', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(124, 12, 38, 'carriedo_004', 'Merwina', 'Epino', 'Ervas', NULL, '2023-06-23', NULL, 2, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00116', 'RHU-C-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-19 01:35:02', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(125, 19, 10, 'luna-candol_(poblacion)_007', 'Delia', 'Escobedo', 'Galarosa', NULL, '1952-07-26', NULL, 73, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00117', 'RHU-L(-00007', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-19 02:06:10', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(126, 14, 40, 'cogon_011', 'Roland', NULL, 'Escurel', NULL, '1969-05-21', NULL, 56, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00118', 'RHU-C-00011', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'inactive', '2026-03-19 02:08:53', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-31 06:32:50'),
(127, 40, NULL, 'togawe_001', 'John Rey', 'Gading', 'EspeÑo', NULL, '1997-10-25', NULL, 28, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00119', 'RHU-T-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-19 02:10:15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(128, 8, 3, 'buenavista_005', 'Marky', 'E', 'Espera', NULL, '2000-12-22', NULL, 25, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00120', 'RHU-B-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-27 17:09:08', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(129, 43, NULL, 'outside_gubat_006', 'Niel', '', 'Zyril', '', '1999-12-31', '', 26, 'Male', 'Single', '', '', '', '', '2026-00122', 'RHU-OG-00009', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, '', NULL, 'upload/patient_129_1774688901.jpg', 'active', '2026-03-28 04:35:36', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(130, 4, NULL, 'balud_del_sur_(poblacion)_001', 'Christian Rey', 'Cabuguang', 'Fidelson', NULL, '1987-05-02', NULL, 38, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00123', 'RHU-BD-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 00:53:12', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(131, 4, NULL, 'balud_del_sur_(poblacion)_002', 'B jay', 'Mirafuentes', 'BelangelB Jay', NULL, '2015-07-14', NULL, 10, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00124', 'RHU-BD-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 00:54:56', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(132, 1, NULL, 'ariman_008', 'Jenica', 'Cao', 'Ebio', NULL, '2014-02-24', NULL, 12, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00125', 'RHU-A-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 00:56:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(133, 1, 41, 'ariman_009', 'Melody', 'Deuna', 'Ebio', NULL, '1992-06-04', NULL, 33, 'Female', 'Married', NULL, NULL, NULL, NULL, '2026-00126', 'RHU-A-00007', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 00:58:13', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(134, 19, NULL, 'luna-candol_(poblacion)_008', 'Markkeneth', 'Espenida', 'Himor', NULL, '2013-12-12', NULL, 12, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 00:59:26', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(135, 19, NULL, 'luna-candol_(poblacion)_009', 'Zaisean', 'Dionela', 'Espano', NULL, '2016-03-05', NULL, 10, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00127', 'RHU-L(-00008', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:02:10', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(136, 42, 42, 'villareal_004', 'Salvador', 'Estrada', 'Figueras', NULL, '1962-08-06', NULL, 63, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00128', 'RHU-V-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:05:20', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(137, 30, NULL, 'payawin_003', 'Rowena', 'Pura', 'Espenida', NULL, '2004-04-25', NULL, 21, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00129', 'RHU-P-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:08:47', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(138, 18, 23, 'lapinig_002', 'Jenelyn', 'Delima', 'Falcoto', NULL, '1992-12-31', NULL, 33, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00130', 'RHU-L-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:10:27', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(139, 27, 43, 'panganiban_(poblacion)_007', 'Ramon', 'Codon', 'EreÑo', NULL, '1970-01-22', NULL, 56, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00131', 'RHU-P(-00007', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:11:54', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(140, 9, 44, 'bulacao_004', 'Rosita', 'Hedia', 'Echano', NULL, '1953-08-15', NULL, 72, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00132', 'RHU-B-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:13:58', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(141, 32, NULL, 'rizal_004', 'Zaiden Nathan', 'Estavillo', 'Germidia', NULL, '2025-10-31', NULL, 0, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00133', 'RHU-R-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:15:13', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(142, 32, NULL, 'rizal_005', 'Aliexa', NULL, 'Estavillo', NULL, '2004-09-04', NULL, 21, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00134', 'RHU-R-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:17:13', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(143, 13, 46, 'casili_003', 'Rosalinda', 'Feratero', 'Evano', NULL, '1959-10-29', NULL, 66, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00135', 'RHU-C-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:18:42', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(144, 19, NULL, 'luna-candol_(poblacion)_010', 'Letecia', 'Enconado', 'Bersal', NULL, '1951-11-10', NULL, 74, 'Female', 'Widowed', NULL, NULL, NULL, NULL, '2026-00137', 'RHU-L(-00010', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:19:51', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(145, 3, NULL, 'balud_del_norte_(poblacion)_007', 'Lyle Luiz', 'Barnido', 'Arguelles', NULL, '2025-09-06', NULL, 0, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00139', 'RHU-BD-00008', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:21:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(146, 36, 11, 'tabi_004', 'Darlyn', 'Amador', 'Erlano', NULL, '1970-03-04', NULL, 56, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00140', 'RHU-T-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:26:51', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(147, 14, NULL, 'cogon_012', 'Letecia', 'Endaya', 'Enguerra', NULL, '1952-10-12', NULL, 73, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00141', 'RHU-C-00012', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:27:52', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(148, 14, NULL, 'cogon_013', 'Julse Joe', 'Mangubat', 'Alindogan', NULL, '2025-06-10', NULL, 0, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00142', 'RHU-C-00013', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:28:59', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(149, 37, NULL, 'tagaytay_003', 'Nikki', 'Joven', 'Panuga', NULL, '2000-10-04', NULL, 25, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00143', 'RHU-T-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:29:58', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(150, 37, NULL, 'tagaytay_004', 'Yolanda', 'Joven', 'Panuga', NULL, '1974-05-24', NULL, 51, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00144', 'RHU-T-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:32:11', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `patients_db` (`id`, `barangay_id`, `purok_id`, `patient_code`, `first_name`, `middle_name`, `last_name`, `suffix`, `date_of_birth`, `birthplace`, `age`, `gender`, `marital_status`, `blood_type`, `mother_name`, `spouse_name`, `contact_number`, `household_no`, `facility_household_no`, `education_level`, `employment_status`, `family_member_type`, `dswd_nhts`, `member_4ps`, `pcb_member`, `philhealth_member`, `philhealth_status_type`, `philhealth_no`, `philhealth_category`, `profile_image`, `status`, `created_at`, `last_household_move_at`, `region`, `province`, `city_municipality`, `barangay_name`, `street`, `deleted_at`) VALUES
(151, 19, NULL, 'luna-candol_(poblacion)_011', 'Sonia', 'Hamto', 'Dipasupil', NULL, '1959-02-19', NULL, 67, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00145', 'RHU-L(-00011', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:33:18', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(152, 9, NULL, 'bulacao_005', 'Grace Ann', 'Erlano', 'Esquejo', NULL, '1996-08-13', NULL, 29, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00146', 'RHU-B-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:34:15', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(153, 28, NULL, 'paradijon_(poblacion)_004', 'Jenica', 'Floresca', 'Enguerra', NULL, '2019-01-06', NULL, 7, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00148', 'RHU-P(-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:35:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(154, 28, NULL, 'paradijon_(poblacion)_005', 'Ryca Jean', 'Floresca', 'Enguerra', NULL, '2024-02-27', NULL, 2, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00149', 'RHU-P(-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:36:22', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(155, 2, NULL, 'bagacay_005', 'Gelli Ann', 'Belaro', 'Escote', NULL, '1992-01-26', NULL, 34, 'Female', 'Co-habitation', NULL, NULL, NULL, NULL, '2026-00150', 'RHU-B-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:42:11', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(156, 25, NULL, 'ogao_004', 'Randel', 'Estargo', 'Equiza', NULL, '2007-09-26', NULL, 18, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00151', 'RHU-O-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:43:26', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(157, 2, 47, 'bagacay_006', 'Andry', 'Gregorio', 'Escopete', NULL, '2025-10-28', NULL, 0, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00152', 'RHU-B-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:44:35', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(158, 19, 9, 'luna-candol_(poblacion)_012', 'Jay', 'Tarog', 'Bersal', NULL, '2010-02-28', NULL, 16, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00153', 'RHU-L(-00012', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:45:49', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(159, 14, 48, 'cogon_014', 'Alejandro', 'Ermino', 'Embile', NULL, '1958-08-26', NULL, 67, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00154', 'RHU-C-00014', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:48:50', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(160, 7, NULL, 'beriran_004', 'Bryan', 'Haz', 'Pura', NULL, '1989-11-29', NULL, 36, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00155', 'RHU-B-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 01:56:45', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(161, 34, NULL, 'sangat_003', 'Imelda', 'Aguilando', 'Unay', NULL, '1970-10-05', NULL, 55, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00156', 'RHU-S-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 02:00:09', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(162, 32, NULL, 'rizal_006', 'Rowena', 'Ermino', 'Dioneda', NULL, '1976-06-30', NULL, 49, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00157', 'RHU-R-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 02:06:06', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(163, 19, 9, 'luna-candol_(poblacion)_013', 'Troy Lee', 'Bersal', 'Gonzales', NULL, '2014-02-02', NULL, 12, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00158', 'RHU-L(-00013', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 02:07:19', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(164, 34, 50, 'sangat_004', 'Jelyn', 'Hamor', 'Asilo', NULL, '2020-06-28', NULL, 5, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00159', 'RHU-S-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 02:08:29', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(165, 4, NULL, 'balud_del_sur_(poblacion)_003', 'Gina', 'Demdam', 'Erlano', NULL, '1974-06-04', NULL, 51, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00160', 'RHU-BD-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 02:09:20', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(166, 12, 51, 'carriedo_005', 'Waylen Zyair', 'Baluyot', 'Escauriaga', NULL, '2024-05-08', NULL, 1, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00161', 'RHU-C-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 02:10:26', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(167, 12, 51, 'carriedo_006', 'Lorraine', 'Ervas', 'Baluyot', NULL, '1989-08-07', NULL, 36, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00162', 'RHU-C-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 02:11:26', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(168, 37, 52, 'tagaytay_005', 'Antonio', 'Gache', 'Estremera', NULL, '1977-07-30', NULL, 48, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00163', 'RHU-T-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 02:12:11', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(169, 35, NULL, 'santa_ana_002', 'Jonard', 'Ervas', 'Enorme', NULL, '1989-10-21', NULL, 36, 'Male', 'Married', NULL, NULL, NULL, NULL, '2026-00164', 'RHU-SA-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 02:24:30', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(170, 25, NULL, 'ogao_005', 'Joey', 'Pura', 'Fajardo', NULL, '1982-04-12', NULL, 43, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00165', 'RHU-O-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 02:25:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(171, 41, 54, 'union_002', 'Kimberly Joy', 'Din', 'Ocampo', NULL, '2002-02-14', NULL, 24, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00166', 'RHU-U-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 02:27:16', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(172, 26, NULL, 'paco_006', 'Diana Rose', 'Demonteverde', 'Desalisa', NULL, '1998-09-23', NULL, 27, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00167', 'RHU-P-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 02:28:54', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(173, 30, NULL, 'payawin_004', 'Lerma', 'Jarlego', 'Felicia', NULL, '1971-02-28', NULL, 55, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00168', 'RHU-P-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 02:29:44', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(174, 35, 55, 'santa_ana_003', 'Catherine', 'Espiel', 'Epino', NULL, '2001-12-09', NULL, 24, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00169', 'RHU-SA-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 02:30:41', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(175, 42, NULL, 'villareal_005', 'Ada Catherine', 'Gonzales', 'Ermino', NULL, '2003-08-05', NULL, 22, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00170', 'RHU-V-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 02:31:42', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(176, 40, 57, 'togawe_002', 'Alma', 'Dado', 'EspeÑa', NULL, '1982-06-26', NULL, 43, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00171', 'RHU-T-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 02:39:41', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(177, 40, 57, 'togawe_003', 'Bienvenido', 'Solis', 'EspeÑa', 'Jr', '1976-06-21', NULL, 49, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00172', 'RHU-T-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 02:40:46', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(178, 39, 58, 'tiris_005', 'Michelle', 'Escober', 'Dogillo', NULL, '1975-09-25', NULL, 50, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00173', 'RHU-T-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 02:41:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(179, 39, 58, 'tiris_006', 'Alexa Jane', 'Escober', 'Dogillo', NULL, '2017-02-11', NULL, 9, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00174', 'RHU-T-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 02:42:49', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(180, 9, NULL, 'bulacao_006', 'Junneil', 'Escurel', 'Espedido', NULL, '1993-01-04', NULL, 33, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00175', 'RHU-B-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 02:44:06', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(181, 32, 59, 'rizal_007', 'Marlon', 'Detera', 'Grajo', NULL, '2007-02-20', NULL, 19, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00176', 'RHU-R-00007', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 02:44:51', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(182, 32, NULL, 'rizal_008', 'Joel', 'Floranda', 'Encinares', NULL, '1999-07-17', NULL, 26, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00177', 'RHU-R-00008', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-30 02:45:35', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(183, 8, 60, 'buenavista_006', 'Nelia', 'Espedillon', 'Vale', NULL, '1954-12-17', NULL, 71, 'Female', 'Married', NULL, NULL, NULL, NULL, '2026-00178', 'RHU-B-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 00:42:19', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(184, 43, NULL, 'outside_gubat_007', 'Teresita', 'Dela Trinidad', 'Lacandula', NULL, '1956-11-11', NULL, 69, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00179', 'RHU-OG-00010', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 00:44:01', NULL, 'V', 'Camarines Sur', 'Naga', 'Balastas', 'ZONE 3', NULL),
(185, 2, NULL, 'bagacay_007', 'Zian', 'Espineda', 'Feolino', NULL, '2024-10-15', NULL, 1, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00181', 'RHU-B-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 00:45:36', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(186, 28, NULL, 'paradijon_(poblacion)_006', 'Ofelia', 'Eco', 'Esparas', NULL, '1954-03-30', NULL, 72, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00182', 'RHU-P(-00007', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 00:46:41', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(187, 37, NULL, 'tagaytay_006', 'Reyven', 'AstaÑo', 'GaballaReyven', NULL, '2025-10-10', NULL, 0, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00185', 'RHU-T-00008', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 01:10:53', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(188, 13, NULL, 'casili_004', 'Shirley', 'Chavez', 'Faune', NULL, '1977-11-21', NULL, 48, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00187', 'RHU-C-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 01:11:53', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(189, 11, NULL, 'cabiguhan_001', 'Alexander', 'Laguidao', 'Espinola', NULL, '1960-01-01', NULL, 66, 'Male', 'Married', NULL, NULL, NULL, NULL, '2026-00188', 'RHU-C-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 01:13:58', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(190, 6, 61, 'bentuco_001', 'Ruben', 'Enano', 'ErminoRuben', NULL, '1964-06-13', NULL, 61, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00189', 'RHU-B-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 01:15:24', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(191, 16, NULL, 'dita_001', 'Alma', 'Moris', 'Enaje', NULL, '1972-12-04', NULL, 53, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00190', 'RHU-D-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 01:17:49', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(192, 14, 62, 'cogon_015', 'Anthony', 'Tulagan', 'Jareno', NULL, '1976-02-25', NULL, 50, 'Male', 'Co-habitation', NULL, NULL, NULL, NULL, '2026-00191', 'RHU-C-00015', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 01:36:33', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(193, 1, NULL, 'ariman_010', 'Mary Joy', 'Concha', 'Escolano', NULL, '1995-09-08', NULL, 30, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00192', 'RHU-A-00008', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 02:08:52', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(194, 13, NULL, 'casili_005', 'Reyamie', 'Jestre', 'Datur', NULL, '2006-03-05', NULL, 20, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00193', 'RHU-C-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 02:10:35', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(195, 12, 36, 'carriedo_007', 'Kyla', 'Felismino', 'Enguerra', NULL, '2021-09-26', NULL, 4, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00194', 'RHU-C-00007', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 02:11:43', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(196, 14, 16, 'cogon_016', 'Aldrin', 'Hermogino', 'Ermino', NULL, '1999-11-18', NULL, 26, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00195', 'RHU-C-00016', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 02:12:55', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(197, 22, NULL, 'naagtan_005', 'Gennie', 'Erepol', 'Fresnoza', NULL, '1972-07-26', NULL, 53, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00197', 'RHU-N-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 02:20:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(198, 41, NULL, 'union_003', 'Kristian Carl', 'Mesolania', 'Escandor', NULL, '1993-07-25', NULL, 32, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00198', 'RHU-U-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 05:30:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(199, 35, NULL, 'santa_ana_004', 'Fe', 'Ereno', 'EnconadoFe', NULL, '1953-01-15', NULL, 73, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00199', 'RHU-SA-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 05:31:14', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(200, 17, 63, 'jupi_001', 'Gian Karl', 'Bea', 'Espedido', NULL, '2007-12-09', NULL, 18, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00200', 'RHU-J-00001', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 05:32:48', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(201, 3, 39, 'balud_del_norte_(poblacion)_008', 'Roan', 'Estur', 'Limbo', NULL, '2004-04-24', NULL, 21, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00201', 'RHU-BD-00009', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 05:34:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(202, 27, NULL, 'panganiban_(poblacion)_008', 'Klied Thaddeus', 'Escober', 'Esplana', NULL, '2025-12-02', NULL, 0, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00203', 'RHU-P(-00009', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 05:35:34', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(203, 35, NULL, 'santa_ana_005', 'Salvador', 'Encela', 'Ofalsa', NULL, '1967-02-19', NULL, 59, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00204', 'RHU-SA-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 05:44:28', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(204, 19, NULL, 'luna-candol_(poblacion)_014', 'Kenneth', 'Castillo', 'Regino', 'Jr', '2023-01-21', NULL, 3, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00205', 'RHU-L(-00014', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 05:45:35', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(205, 24, 64, 'nazareno_002', 'Nathaniel', 'Mijares', 'Saytono', NULL, '2021-12-06', NULL, 4, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00206', 'RHU-N-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 05:48:18', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(206, 24, NULL, 'nazareno_003', 'Cathlyn Anne', 'Fortades', 'Mijares', NULL, '2001-01-05', NULL, 25, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00208', 'RHU-N-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 05:49:22', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(207, 27, NULL, 'panganiban_(poblacion)_009', 'Salvador', 'EspeÑo', 'TotaÑes', NULL, '1944-05-08', NULL, 81, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00209', 'RHU-P(-00010', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 05:51:44', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(208, 31, NULL, 'pinontingan_(poblacion)_005', 'Cornacion', 'Escandor', 'Alcala', NULL, '1935-02-17', NULL, 91, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00210', 'RHU-P(-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 05:52:49', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(209, 3, 19, 'balud_del_norte_(poblacion)_009', 'James Kurt', 'Eva', 'Fortades', NULL, '2020-04-07', NULL, 5, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00211', 'RHU-BD-00010', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 06:19:51', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(210, 14, 62, 'cogon_017', 'Luisa', 'Eneria', 'Sio', NULL, '1976-03-15', NULL, 50, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00212', 'RHU-C-00017', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 06:20:51', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(211, 17, NULL, 'jupi_002', 'Anita', 'Sembrano', 'Dolendo', NULL, '1972-01-10', NULL, 54, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00213', 'RHU-J-00002', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 06:22:28', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(212, 20, 65, 'manapao_003', 'Jibriel', 'Germedia', 'Balibrea', NULL, '2025-02-05', NULL, 1, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00214', 'RHU-M-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 06:24:43', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(213, 24, 66, 'nazareno_004', 'Marichu', 'Duazo', 'Encinares', NULL, '1982-01-17', NULL, 44, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00215', 'RHU-N-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 06:25:34', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(214, 32, NULL, 'rizal_009', 'Angelyn', 'Esteves', 'Estera', NULL, '1997-05-31', NULL, 28, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00216', 'RHU-R-00009', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 06:26:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(215, 12, 36, 'carriedo_008', 'Maria Christina', 'Habon', 'Bangate', NULL, '1999-06-02', NULL, 26, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00217', 'RHU-C-00008', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 06:27:13', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(216, 24, 66, 'nazareno_005', 'Rolando', 'Escalante', 'Encinares', NULL, '1970-01-28', NULL, 56, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00218', 'RHU-N-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 06:28:43', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(217, 35, 67, 'santa_ana_006', 'Alex', 'Felices', 'Haloc', 'Jr', '2014-01-25', NULL, 12, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00219', 'RHU-SA-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 06:36:14', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(218, 12, 68, 'carriedo_009', 'Aileen Jane', 'Habon', 'Quizana', NULL, '2008-09-02', NULL, 17, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00220', 'RHU-C-00009', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 06:37:40', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(219, 4, NULL, 'balud_del_sur_(poblacion)_004', 'Lhorielyn', 'Bayumo', 'Bajamundi', NULL, '1998-09-14', NULL, 27, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00221', 'RHU-BD-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 06:38:51', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(220, 30, NULL, 'payawin_005', 'Yxia Rein', NULL, 'Balinget', NULL, '2025-01-23', NULL, 1, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00222', 'RHU-P-00005', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 06:40:05', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(221, 20, 69, 'manapao_004', 'Florida', 'Esperanzate', 'Codon', NULL, '1971-07-27', NULL, 54, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00223', 'RHU-M-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 06:41:28', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(222, 33, NULL, 'san_ignacio_004', 'Noemi', 'Dogillo', 'Oliva', NULL, '2008-03-05', NULL, 18, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00224', 'RHU-SI-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 06:43:49', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(223, 27, NULL, 'panganiban_(poblacion)_010', 'Marites', 'Escullar', 'Estolas', NULL, '1978-07-25', NULL, 47, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00225', 'RHU-P(-00011', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 06:55:08', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(224, 27, NULL, 'panganiban_(poblacion)_011', 'Mirasol', 'Ermino', 'Peralta', NULL, '1977-12-07', NULL, 48, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00226', 'RHU-P(-00012', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 06:56:02', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(225, 39, 70, 'tiris_007', 'Ana Teresa', 'Semilla', 'Esmena', NULL, '1969-05-25', NULL, 56, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00227', 'RHU-T-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 07:00:04', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(226, 14, NULL, 'cogon_018', 'Nimfa', 'Dreo', 'Geres', NULL, '1958-11-10', NULL, 67, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00228', 'RHU-C-00018', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 07:09:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(227, 12, 71, 'carriedo_010', 'Seand', 'Escanilla', 'Dolot', NULL, '1998-01-29', NULL, 28, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00229', 'RHU-C-00010', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 07:11:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(228, 39, NULL, 'tiris_008', 'Angeline', NULL, 'Miranda', NULL, '2002-01-24', NULL, 24, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00230', 'RHU-T-00007', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 07:23:58', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(229, 12, 71, 'carriedo_011', 'Vanessa Jane', 'Oscillada', 'Esparrago', NULL, '2002-04-23', NULL, 23, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00231', 'RHU-C-00011', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 07:24:41', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(230, 28, NULL, 'paradijon_(poblacion)_007', 'Carmen', 'Rocha', 'Eneria', NULL, '1964-07-16', NULL, 61, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00232', 'RHU-P(-00008', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 07:25:36', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(231, 31, NULL, 'pinontingan_(poblacion)_006', 'Lyam Bill', 'Funtanares', 'Joven', NULL, '2019-08-24', NULL, 6, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00233', 'RHU-P(-00006', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 07:37:06', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(232, 21, NULL, 'manook_(poblacion)_007', 'Mica Ella', 'Encinares', 'Escurel', NULL, '2020-04-19', NULL, 5, 'Female', 'Single', NULL, NULL, NULL, NULL, '2026-00234', 'RHU-M(-00007', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-03-31 07:59:54', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(233, 35, 67, 'santa_ana_007', 'JOHN', 'FELISMINO', 'ZAMORA', NULL, '2001-08-26', NULL, 24, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-04-01 03:03:39', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(234, 15, NULL, 'cota_na_daco_(poblacion)_009', 'Jhon Micheal', 'E', 'Estayane', NULL, '2011-02-08', NULL, 15, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00236', 'RHU-CN-00010', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-04-01 05:41:19', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(235, 22, NULL, 'naagtan_006', 'ANA', 'ESMERIA', 'EMBILE', NULL, '1958-12-01', NULL, 67, 'Female', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-04-13 02:58:24', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(236, 43, NULL, 'outside_gubat_008', 'Crislyn', 'Olase', 'Janoba', '', '2003-11-11', '', 22, 'Female', 'Single', 'O+', '', '', '0953157854', '2026-00238', 'RHU-OG-00011', 'Post Graduate', 'Unemployed', 'Daughter', 'No', 'No', 'No', 'No', NULL, '', NULL, 'upload/patient_236_1776601328.jpg', 'active', '2026-04-14 13:40:02', '2026-04-19 20:23:08', 'V', 'Sorsogon', 'Sorsogon', 'Barayong', 'Purok1', NULL),
(237, 43, NULL, 'outside_gubat_009', 'Angels', '', 'Lareza', '', '2004-11-11', '', 21, 'Female', 'Single', 'A+', '', '', '098457745', '2026-00238', 'RHU-OG-00011', 'College', 'Unemployed', 'Daughter', 'No', 'No', 'No', 'No', NULL, '', NULL, 'upload/patient_237_1776601456.jpg', 'active', '2026-04-14 13:50:24', '2026-04-19 20:24:39', 'V', 'Sorsogon', 'Sorsogon', 'Barayong', 'Purok4', NULL),
(238, 7, NULL, 'beriran_005', 'Gabi', NULL, 'Neutron', NULL, '2002-11-11', NULL, 23, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'inactive', '2026-04-14 14:05:52', NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-19 13:01:29'),
(239, 43, NULL, 'outside_gubat_010', 'Eren', NULL, 'Yeger', NULL, '1999-11-11', NULL, 26, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'inactive', '2026-04-14 14:12:46', NULL, 'V', 'Sorsogon', 'Sorsogon', 'Isidro', NULL, '2026-04-19 13:01:37'),
(240, 9, NULL, 'bulacao_007', 'forger', '', 'Forge', '', '2001-05-04', '', 24, 'Male', 'Single', '', '', '', '', NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, '', NULL, NULL, 'inactive', '2026-04-14 14:18:52', NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-19 13:01:15'),
(241, 1, NULL, 'ariman_011', 'Anya', '', 'Foger', '', '2009-12-12', '', 16, 'Female', 'Single', '', '', '', '', NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, '', NULL, NULL, 'inactive', '2026-04-14 14:23:55', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(242, 18, NULL, 'lapinig_003', 'Johan', NULL, 'Encinares', NULL, '2001-04-05', NULL, 25, 'Male', NULL, NULL, NULL, NULL, NULL, '2026-00237', 'RHU-L-00003', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-04-14 14:48:39', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(243, 7, 49, 'beriran_006', 'Johan', 'Dela', 'Encinares', NULL, '1966-05-26', NULL, 59, 'Male', 'Single', NULL, NULL, NULL, NULL, '2026-00239', 'RHU-B-00004', 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_243_1776669012.jpg', 'inactive', '2026-04-20 07:10:12', NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-20 07:10:40'),
(244, 43, NULL, 'outside_gubat_011', 'JULIE MAE M. PAREJA', 'MIRABUENOS', 'PAREJA', NULL, '2004-06-05', 'Castilla', 21, 'Female', 'Single', 'O+', 'LUDIVINA M. PAREJA', NULL, '09074229276', '2026-00240', 'RHU-OG-00012', 'Elementary', 'Employed', 'Mother', 'No', 'No', 'No', 'No', NULL, NULL, NULL, 'upload/patient_244_1776672875.jpg', 'active', '2026-04-20 08:14:35', NULL, 'V', 'SORSOGON', 'CASTILLA', 'BONGA', 'PUROK 4', NULL),
(245, 43, NULL, 'outside_gubat_012', 'MJ', 'M', 'PAREJA', NULL, '1998-07-28', 'Castilla', 27, 'Male', 'Single', 'O+', 'LUDIVINA M. PAREJA', NULL, '09073454237', '2026-00240', 'RHU-OG-00012', 'College', 'Employed', 'Son', 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-04-20 08:16:28', NULL, 'V', 'SORSOGON', 'CASTILLA', 'Outside Gubat', 'PUROK 4', NULL),
(246, 19, 72, 'luna-candol_(poblacion)_015', 'LAURO', 'ENORME', 'FEDERESO', NULL, '1975-11-24', NULL, 50, 'Male', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-04-21 00:29:47', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(247, 20, 65, 'manapao_005', 'pedro', 'colar', 'paniergo', '', '1977-03-10', '', 49, 'Male', 'Married', '', '', '', '', NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, '', NULL, NULL, 'active', '2026-04-21 01:20:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(248, 14, NULL, 'cogon_019', 'Juan', NULL, 'Dela Cruz', NULL, '2002-02-05', NULL, 24, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-04-24 00:43:08', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(249, 8, NULL, 'buenavista_007', 'RAMON', 'BRIONES', 'ERANDIO', NULL, '1977-11-15', NULL, 48, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-04-27 01:51:31', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(250, 19, NULL, 'luna-candol_(poblacion)_016', 'MARK NILO', 'MARTOS', 'DY', NULL, '1989-11-24', NULL, 36, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-04-27 02:55:36', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(251, 19, NULL, 'luna-candol_(poblacion)_017', 'JAMESON', 'ENANO', 'ESCOBEDO', NULL, '1991-08-02', NULL, 34, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-04-27 03:46:51', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(252, 2, NULL, 'bagacay_008', 'CHARLENE', 'EMATA', 'ESPINOLA', NULL, '1995-10-18', NULL, 30, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-04-27 04:13:09', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(253, 25, NULL, 'ogao_006', 'MATILDE', 'MIRANDA', 'LORICA', NULL, '1970-03-14', NULL, 56, 'Female', 'Widowed', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-04-30 00:51:10', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(254, 20, NULL, 'manapao_006', 'BUEN', 'ENDAYA', 'ESPENIDA', 'Jr', '1992-06-29', NULL, 33, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-04-30 03:03:46', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(255, 12, NULL, 'carriedo_012', 'RANILYN', 'ESPINOLA', 'ACUÑA', NULL, '2005-06-28', NULL, 20, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-04-30 03:07:35', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(256, 12, NULL, 'carriedo_013', 'JULIA KAYE', 'ARAOJO', 'DAYANDANTE', NULL, '2003-07-22', NULL, 22, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-04-30 03:18:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(257, 2, NULL, 'bagacay_009', 'AILYN', 'DORADO', 'CASTAÑEDA', NULL, '1989-04-19', NULL, 37, 'Female', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-04-30 03:55:05', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(258, 26, 28, 'paco_007', 'JEREMIA ROXANNE', 'ENAJE', 'EVA', NULL, '2006-02-23', NULL, 20, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-04-30 04:02:04', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(259, 38, NULL, 'tigkiw_003', 'JARREN KARL', 'ESPERIDA', 'CASIM', NULL, '2008-10-11', NULL, 17, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-04-30 04:06:42', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(260, 20, NULL, 'manapao_007', 'RICHELLE', 'ENORME', 'CODON', NULL, '1989-10-18', NULL, 36, 'Female', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-04-30 04:13:16', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(261, 42, NULL, 'villareal_006', 'RONALD JOHN', 'TANGAN', 'ESCANDOR', NULL, '2006-12-25', NULL, 19, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-04-30 04:49:19', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(262, 13, 74, 'casili_006', 'GINA', 'DIESTA', 'FALCOTELO', NULL, '1978-06-10', NULL, 47, 'Female', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-04-30 06:43:35', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(263, 13, 74, 'casili_007', 'JINKY', 'DIESTA', 'PLANA', NULL, '1991-12-23', NULL, 34, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-04-30 06:50:20', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(264, 13, 46, 'casili_008', 'ARLYN', 'GRATE', 'VALERA', NULL, '1979-06-28', NULL, 46, 'Female', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-04-30 06:55:27', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(265, 13, 75, 'casili_009', 'JANICE', 'DOMENS', 'CHAVEZ', NULL, '1988-05-05', NULL, 37, 'Female', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-04-30 07:03:01', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(266, 2, 47, 'bagacay_010', 'WALLY', 'FELISMINO', 'ESCOPETE', NULL, '1998-07-12', NULL, 27, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 01:14:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(267, 12, 38, 'carriedo_014', 'CHALLY ', 'HAPIN', 'FORCADILLA', NULL, '1992-05-25', NULL, 33, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 01:30:59', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(268, 12, 68, 'carriedo_015', 'IRA MARGARITA', 'PORLANTE', 'ESCARCHA', NULL, '1986-07-27', NULL, 39, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 01:55:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(269, 2, 76, 'bagacay_011', 'GERALD', 'GUMABAO', 'BAYOS', NULL, '1970-02-26', NULL, 56, 'Male', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 02:16:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(270, 14, 77, 'cogon_020', 'KATE ASHLY', 'ESPEÑA', 'FOMBUENA', NULL, '2008-03-07', NULL, 18, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 02:33:20', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(271, 19, NULL, 'tigkiw_004', 'NENA', 'PURA', 'GACOS', '', '1966-10-16', '', 59, 'Female', 'Married', '', '', '', '', NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, '', NULL, NULL, 'active', '2026-05-04 02:58:48', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(272, 19, 9, 'luna-candol_(poblacion)_018', 'ROSALIE', 'FAJARDO', 'POLASKY', NULL, '1976-09-04', NULL, 49, 'Female', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 03:21:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(273, 41, 80, 'union_004', 'JOVY MAE', 'ORIO', 'KIMPO', NULL, '2008-05-06', NULL, 17, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 03:32:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(274, 20, 81, 'manapao_008', 'CARLA JOY', 'ESTIDOLA', 'DONIÑA', NULL, '1996-01-18', NULL, 30, 'Female', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 03:35:46', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(275, 20, 65, 'manapao_009', 'MEZIEL', 'JESTRE', 'FUNTANAR', NULL, '1996-09-20', NULL, 29, 'Female', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 03:39:31', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(276, 15, 82, 'cota_na_daco_(poblacion)_010', 'SHAIRA MAE', 'DONGABAN', 'NORIEGA', NULL, '2003-06-15', NULL, 22, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 03:48:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(277, 12, 83, 'carriedo_016', 'PRINCESS CYBEL', 'ERVAS', 'PALLE', NULL, '2020-01-25', NULL, 6, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 03:57:09', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(278, 32, 59, 'rizal_010', 'KEN', 'MENDOZA', 'HABITAN', NULL, '2004-08-24', NULL, 21, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 04:01:05', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(279, 43, NULL, 'outside_gubat_013', 'JOSEPH', 'DEOCAREZA', 'DORINGO', 'Jr', '2007-04-29', NULL, 19, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 04:08:42', NULL, 'Region V (Bicol)', 'Sorsogon', 'Bacon', 'Buenavista', 'Purok 4', NULL),
(280, 43, NULL, 'outside_gubat_014', 'EMMANUEL', 'CAPISTRANO', 'ESPINOLA', '', '2004-02-02', '', 22, 'Male', 'Single', '', '', '', '', NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, '', NULL, NULL, 'active', '2026-05-04 04:12:59', NULL, '6', 'Sorsogon', 'Sorsogon', 'Buhatan', 'Purok Aguinaldoog', NULL),
(281, 8, 31, 'buenavista_008', 'KATE CRYSTAL', 'BAGASALA', 'ESTRELLADO', NULL, '2005-06-03', NULL, 20, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 04:20:23', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(282, 43, NULL, 'outside_gubat_015', 'MARK JECO', 'LERO', 'LADRA', NULL, '2004-08-04', NULL, 21, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 04:27:38', NULL, 'Region V (Bicol)', 'Sorsogon', 'Juban', 'Bacolod', 'Purok 3', NULL),
(283, 2, 84, 'bagacay_012', 'RHEAN MAE', 'DOMDOM', 'DIZON', NULL, '2003-02-17', NULL, 23, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 04:34:24', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(284, 12, 85, 'carriedo_017', 'GLORIA', 'MIRANDA', 'ESPEÑO', NULL, '1956-01-20', NULL, 70, 'Female', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 04:37:59', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(285, 43, NULL, 'outside_gubat_016', 'KYLE', 'LUMIGUID', 'JENIEBRE', NULL, '2007-10-08', NULL, 18, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 04:41:38', NULL, 'Region V (Bicol)', 'Sorsogon', 'Sorsogon City', 'Basud', 'Purok 3', NULL),
(286, 12, 36, 'carriedo_018', 'MARIA', 'BUENAVIDEZ', 'ENGUERRA', NULL, '1963-02-26', NULL, 63, 'Female', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 04:46:27', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(287, 12, 86, 'carriedo_019', 'EDNA', 'BUENAVIDEZ', 'ESCANILLA', NULL, '1965-09-16', NULL, 60, 'Female', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 04:49:37', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(288, 12, 51, 'carriedo_020', 'MARIA LIZA', 'DELMONTE', 'BUENAVIDEZ', NULL, '1983-11-24', NULL, 42, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 04:51:56', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(289, 12, 71, 'carriedo_021', 'ANITA LEONILA', 'ARAOJO', 'DAYANDANTE', NULL, '1966-01-17', NULL, 60, 'Female', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 04:53:53', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(290, 12, 38, 'carriedo_022', 'EMERITA', 'HAPIN', 'GARCIA', NULL, '1977-09-22', NULL, 48, 'Female', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 04:57:20', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(291, 12, 36, 'carriedo_023', 'HAIDE', 'ENANO', 'MAGBANUA', NULL, '1979-10-24', NULL, 46, 'Female', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 04:59:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(292, 20, 81, 'manapao_010', 'ROGENE', 'ESCARCHA', 'GERMIDIA', NULL, '1982-06-25', NULL, 43, 'Female', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 05:03:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(293, 37, 52, 'tagaytay_007', 'ABEGAIL', 'LUCRIDA', 'ESCASINAS', NULL, '2007-06-18', NULL, 18, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 05:05:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(294, 35, 87, 'santa_ana_008', 'NORNIEL', 'DOGILLO', 'ESCUETA', NULL, '1994-03-01', NULL, 32, 'Male', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 06:37:30', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(295, 1, 41, 'ariman_012', 'RUBY', 'FERATERO', 'HERMOGINO', NULL, '1985-05-27', NULL, 40, 'Female', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 06:44:23', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(296, 43, NULL, 'outside_gubat_017', 'JOMAR', 'GABAD', 'GAYTA', NULL, '2008-01-31', NULL, 18, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 06:55:01', NULL, 'Region V (Bicol)', 'Sorsogon', 'Barcelona', 'Layog', 'Purok 2', NULL),
(297, 43, NULL, 'outside_gubat_018', 'AUGUSTINE ', 'EBDANI', 'ELPOS', NULL, '2008-08-02', NULL, 17, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 07:02:06', NULL, 'Region V (Bicol)', 'Sorsogon', 'Barcelona', 'Macabari', 'Purok 5', NULL),
(298, 43, NULL, 'outside_gubat_019', 'JESSABEL', 'DEMDAM', 'ESTOCADO', NULL, '2007-09-09', NULL, 18, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 07:05:20', NULL, 'Region V (Bicol)', 'Sorsogon', 'Barcelona', 'Santa Cruz', 'Purok 4', NULL),
(299, 9, 44, 'bulacao_008', 'JAECE CYANN', 'ESTRELLADO', 'QUIÑONES', NULL, '2017-10-17', NULL, 8, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 07:14:08', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(300, 43, NULL, 'outside_gubat_020', 'ANGELINE', 'QUINTO', 'CHAVARIA', NULL, '2008-01-24', NULL, 18, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-04 07:19:36', NULL, 'Region V (Bicol)', 'Sorsogon', 'Barcelona', 'Santa Cruz', 'Purok 3b', NULL),
(301, 12, 36, 'carriedo_024', 'REA', 'FORCADILLA', 'EREVE', NULL, '1983-02-02', NULL, 43, 'Female', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-06 02:09:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(302, 4, NULL, 'balud_del_sur_(poblacion)_005', 'JUDITH', 'GALORA', 'LACPAPAN', NULL, '1951-12-16', NULL, 74, 'Female', 'Widowed', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-06 02:20:27', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(303, 27, 88, 'panganiban_(poblacion)_012', 'RUBEN', 'ENCELA', 'ESPIRITU', NULL, '1955-01-09', NULL, 71, 'Male', 'Widowed', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-06 02:39:44', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(304, 43, NULL, 'outside_gubat_021', 'TERESITA', 'FORTES', 'FREO', NULL, '1961-02-07', NULL, 65, 'Female', 'Married', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-06 02:59:04', NULL, 'Region V (Bicol)', 'Sorsogon', 'Bulusan', 'Porog', 'Purok 1', NULL),
(305, 38, 89, 'tigkiw_005', 'JHON AXEL', 'ESQUEJO', 'ESCULAR', NULL, '2005-07-11', NULL, 20, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-06 03:14:24', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(306, 14, 77, 'cogon_021', 'AIZEL', 'ERVAS', 'BRIÑOLA', NULL, '2004-07-06', NULL, 21, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-06 03:38:55', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(307, 16, 90, 'dita_002', 'SHAIRA BABE', 'EVARDO', 'ESLLERA', NULL, '2004-01-14', NULL, 22, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-06 03:44:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(308, 35, 91, 'santa_ana_009', 'HAROLD', 'EREÑO', 'OFALSA', NULL, '2006-10-11', NULL, 19, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-06 04:01:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(309, 43, NULL, 'outside_gubat_022', 'ARLENE', 'PERALTA', 'MONTEO', NULL, '2001-08-24', NULL, 24, 'Female', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-06 04:14:40', NULL, 'Region V (Bicol)', 'Sorsogon', 'Bulusan', 'San Bernardo', 'Purok 1', NULL);
INSERT INTO `patients_db` (`id`, `barangay_id`, `purok_id`, `patient_code`, `first_name`, `middle_name`, `last_name`, `suffix`, `date_of_birth`, `birthplace`, `age`, `gender`, `marital_status`, `blood_type`, `mother_name`, `spouse_name`, `contact_number`, `household_no`, `facility_household_no`, `education_level`, `employment_status`, `family_member_type`, `dswd_nhts`, `member_4ps`, `pcb_member`, `philhealth_member`, `philhealth_status_type`, `philhealth_no`, `philhealth_category`, `profile_image`, `status`, `created_at`, `last_household_move_at`, `region`, `province`, `city_municipality`, `barangay_name`, `street`, `deleted_at`) VALUES
(310, 28, 37, 'paradijon_(poblacion)_008', 'LAURENCE', 'BUENAVIDEZ', 'FLESTADO', NULL, '2004-05-30', NULL, 21, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-06 04:22:31', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(311, 35, 92, 'santa_ana_010', 'ARIES', 'CALAYO', 'ESPENOCILLA', NULL, '1989-10-01', NULL, 36, 'Male', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, 'No', 'No', 'No', 'No', NULL, NULL, NULL, NULL, 'active', '2026-05-06 04:33:42', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `patient_household_history`
--

CREATE TABLE `patient_household_history` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `old_barangay_id` int(11) NOT NULL,
  `old_household_no` varchar(100) DEFAULT NULL,
  `old_facility_household_no` varchar(100) DEFAULT NULL,
  `new_barangay_id` int(11) NOT NULL,
  `new_household_no` varchar(100) DEFAULT NULL,
  `new_facility_household_no` varchar(100) DEFAULT NULL,
  `move_reason` varchar(255) DEFAULT NULL,
  `moved_at` timestamp NULL DEFAULT current_timestamp(),
  `moved_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patient_household_history`
--

INSERT INTO `patient_household_history` (`id`, `patient_id`, `old_barangay_id`, `old_household_no`, `old_facility_household_no`, `new_barangay_id`, `new_household_no`, `new_facility_household_no`, `move_reason`, `moved_at`, `moved_by`) VALUES
(1, 1, 21, NULL, NULL, 21, '2026-00001', 'RHU-M(-00001', 'Patient transfer', '2026-03-09 03:45:08', 1),
(2, 14, 43, '2026-00014', 'RHU-OG-00001', 43, '2026-00014', 'RHU-OG-00001', 'Patient transfer', '2026-03-12 08:16:27', 1),
(3, 12, 21, '2026-00012', 'RHU-M(-00003', 21, '2026-00001', 'RHU-M(-00001', 'Patient transfer', '2026-03-16 06:18:41', 1),
(4, 13, 21, '2026-00013', 'RHU-M(-00004', 21, '2026-00001', 'RHU-M(-00001', 'Patient transfer', '2026-03-16 06:19:26', 1),
(5, 236, 43, NULL, NULL, 43, '2026-00238', 'RHU-OG-00011', 'Patient transfer', '2026-04-19 12:23:08', 1),
(6, 237, 43, NULL, NULL, 43, '2026-00238', 'RHU-OG-00011', 'Patient transfer', '2026-04-19 12:24:39', 1);

-- --------------------------------------------------------

--
-- Table structure for table `patient_queue`
--

CREATE TABLE `patient_queue` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `queue_date` date NOT NULL,
  `queue_type` enum('PRIORITY','REGULAR') NOT NULL,
  `queue_number` int(11) NOT NULL,
  `queue_code` varchar(20) NOT NULL,
  `status` enum('waiting','triage','serving','with_doctor','done','cancelled') DEFAULT 'waiting',
  `cancelled_by` enum('manual','system') DEFAULT NULL,
  `systolic_bp` int(11) DEFAULT NULL,
  `diastolic_bp` int(11) DEFAULT NULL,
  `heart_rate` int(11) DEFAULT NULL,
  `respiratory_rate` int(11) DEFAULT NULL,
  `temperature` decimal(4,1) DEFAULT NULL,
  `oxygen_saturation` int(11) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `administered_by` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patient_queue`
--

INSERT INTO `patient_queue` (`id`, `patient_id`, `queue_date`, `queue_type`, `queue_number`, `queue_code`, `status`, `cancelled_by`, `systolic_bp`, `diastolic_bp`, `heart_rate`, `respiratory_rate`, `temperature`, `oxygen_saturation`, `weight`, `height`, `created_at`, `administered_by`) VALUES
(128, 1, '2026-04-20', 'PRIORITY', 1, 'P-001', 'done', NULL, 120, 80, 90, 19, 36.0, 90, 45.00, 120.00, '2026-04-20 06:15:35', 13),
(129, 236, '2026-04-20', 'REGULAR', 1, 'R-001', 'done', NULL, 120, 80, 90, 19, 36.0, 90, 50.00, 100.00, '2026-04-20 08:18:58', 13),
(130, 1, '2026-04-20', 'PRIORITY', 2, 'P-002', 'done', NULL, 120, 80, 90, 19, 36.0, 90, 50.00, 120.00, '2026-04-20 08:20:08', 13),
(131, 1, '2026-04-24', 'REGULAR', 1, 'R-001', 'done', NULL, 120, 80, 80, 80, 36.0, 90, 120.00, 20.00, '2026-04-24 14:45:29', 13),
(132, 237, '2026-04-24', 'REGULAR', 2, 'R-002', 'serving', NULL, 110, 12, 90, 18, 36.0, 90, 52.00, 58.00, '2026-04-24 14:52:28', 13),
(133, 236, '2026-04-24', 'REGULAR', 3, 'R-003', 'serving', NULL, 50, 50, 50, 50, 36.0, 90, 120.00, 50.00, '2026-04-24 14:52:53', 13);

-- --------------------------------------------------------

--
-- Table structure for table `puroks`
--

CREATE TABLE `puroks` (
  `id` int(11) NOT NULL,
  `barangay_id` int(11) NOT NULL,
  `purok_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `puroks`
--

INSERT INTO `puroks` (`id`, `barangay_id`, `purok_name`) VALUES
(17, 1, 'P4'),
(41, 1, 'Purok 2'),
(84, 2, 'Purok 3'),
(47, 2, 'Purok 4'),
(76, 2, 'Purok 6'),
(35, 3, 'Purok 2'),
(39, 3, 'Purok 3'),
(19, 3, 'Purok 4'),
(61, 6, 'Mabini B Bentuco'),
(49, 7, 'Purok 3'),
(73, 7, 'Purok 5'),
(31, 8, 'Purok 1a'),
(3, 8, 'Purok 1b'),
(60, 8, 'Purok 2a'),
(44, 9, 'West'),
(24, 12, '4'),
(68, 12, 'Centro 1'),
(71, 12, 'Centro Ii'),
(36, 12, 'Purok 3'),
(38, 12, 'Purok 4'),
(86, 12, 'Purok 5'),
(51, 12, 'Purok 6'),
(85, 12, 'Purok 7 Natupasan'),
(83, 12, 'Sitio Ulag'),
(45, 13, '10/29/1959'),
(75, 13, 'Purok 1a'),
(74, 13, 'Purok 1b'),
(18, 13, 'Purok 2'),
(46, 13, 'Purok 5a'),
(4, 14, 'Avocado'),
(48, 14, 'Casitas B'),
(16, 14, 'Hfs'),
(62, 14, 'Ipilipil'),
(32, 14, 'Langka'),
(15, 14, 'Relocation'),
(40, 14, 'Sas'),
(77, 14, 'Sitio Casitas'),
(82, 15, 'Purok 1'),
(12, 15, 'Purok 1 B'),
(33, 15, 'Purok 1-a'),
(2, 15, 'Purok 1-d Gumang'),
(8, 15, 'Purok 4'),
(90, 16, 'Purok 1'),
(63, 17, 'Purok 1b'),
(23, 18, 'Purok 2'),
(79, 18, 'Purok 3'),
(72, 19, 'Purok 1'),
(9, 19, 'Purok 3'),
(10, 19, 'Purok 4'),
(78, 19, 'Purok 5'),
(69, 20, 'Purok 1'),
(81, 20, 'Purok 3'),
(65, 20, 'Purok2'),
(27, 21, 'Purok 1a'),
(7, 21, 'Purok 2'),
(1, 21, 'Purok 4'),
(26, 22, 'Purok 5'),
(25, 22, 'Purok 7'),
(66, 24, 'Purok 1'),
(64, 24, 'Purok 2'),
(28, 26, 'Purok 1'),
(88, 27, 'Purok 1'),
(43, 27, 'Purok 3'),
(20, 27, 'Purok 3a'),
(37, 28, 'Purok 2'),
(30, 28, 'Purok 6'),
(6, 32, 'Bagong Silang'),
(59, 32, 'Bongsaran'),
(13, 34, 'P2'),
(5, 34, 'P5a'),
(50, 34, 'Purok 4'),
(53, 35, '2'),
(87, 35, 'Purok 2'),
(67, 35, 'Purok 3'),
(92, 35, 'Purok 4'),
(91, 35, 'Purok 6'),
(55, 35, 'Purok 7'),
(14, 36, 'Purok 3'),
(11, 36, 'Purok 6'),
(52, 37, 'Purok 4'),
(89, 38, 'Purok 1'),
(29, 39, 'Purok 1-d'),
(58, 39, 'Purok 2'),
(70, 39, 'Purok 4'),
(21, 39, 'Purok 5-a'),
(57, 40, 'Centro I'),
(22, 41, 'Purok 2'),
(54, 41, 'Purok 4'),
(80, 41, 'Sitioio Obo'),
(42, 42, 'Purok 4'),
(56, 42, 'Purok 5'),
(34, 42, 'Purok 6');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

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

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT NULL,
  `status` enum('active','disabled','banned') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

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
(26, '3b2ca3f5-1b5f-11f1-bb49-34e6d71ed611', 'TV', 'TV@gmail.com', '$2y$10$Q5GsW4ddGH8ftEcZEwOnreRouTejiYZOhLoP3xdJZeJRyDHQSW.4y', 'tv', 'active', '2026-03-09 02:25:25', '2026-03-09 02:25:25'),
(27, '45190e56-3a27-11f1-be07-cc2f71d9468a', 'Cryslyn Hanoba', 'Cryslyn@gmail.com', '$2y$10$NJ.xfe1jf7hx.Q73yWfKA.u4GYX7qlrUfXOIMIrde3iG/WPByO6EO', 'triage', 'active', '2026-04-17 06:32:56', '2026-04-17 06:32:56');

-- --------------------------------------------------------

--
-- Table structure for table `user_panel_access`
--

CREATE TABLE `user_panel_access` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `panel_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_panel_access`
--

INSERT INTO `user_panel_access` (`user_id`, `panel_id`) VALUES
(5, 2),
(12, 1),
(12, 3),
(12, 4),
(13, 1),
(13, 2),
(13, 5),
(15, 2),
(18, 1),
(19, 1),
(19, 2),
(20, 3),
(20, 4),
(23, 1),
(24, 1),
(24, 3),
(24, 4),
(24, 5),
(25, 3),
(25, 4),
(27, 1),
(27, 2);

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` mediumtext DEFAULT NULL,
  `license_no` varchar(50) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_profiles`
--

INSERT INTO `user_profiles` (`user_id`, `avatar`, `phone`, `address`, `license_no`, `title`) VALUES
(12, NULL, '', '', '0120227', 'RM, RN, MD, MPM-HSD, CPC-FP '),
(20, NULL, '', '', '0121966', 'MD, CPC-FP '),
(24, NULL, '', '', '0169123', 'MD'),
(27, NULL, '2121', 'Gqgw', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `token` char(64) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_sessions`
--

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
(395, 26, 'd6b5fb774db0d0ca6756bd1b5c4d3645f6538e2f11602c744a901451189c6213', '2026-03-11 10:54:08', '2026-03-10 10:54:08'),
(398, 20, '6bcf1a0fa7132bb227b1b7b0b3962476c98c436ad5a5d8f724f314c914b0f73d', '2026-03-11 10:58:45', '2026-03-10 10:58:45'),
(400, 13, '307568a566e96c69eddb11d420592bae63738693bbc480ababf919c8a7368fb0', '2026-03-11 11:00:27', '2026-03-10 11:00:27'),
(401, 13, 'dcae0faed00632d95661b64d8053dd5802ea0a73176a1c18b444dd3deb5e31e6', '2026-03-11 11:01:01', '2026-03-10 11:01:01'),
(406, 13, '04e539882b7c6d9b334bbd9b0548a40118956d873d5315198ea189fb9141ef06', '2026-03-11 15:50:38', '2026-03-10 15:50:38'),
(407, 13, '8ea2cdd2ad7aebec2c9b2bf7004412bbf951958e79cbb187c5ea5a55b5463567', '2026-03-12 00:26:26', '2026-03-11 00:26:26'),
(408, 13, 'b6dbe992f1408ec7cd96b55259bb5e386798f698c9a806e85201c23aa14fec90', '2026-03-12 00:26:26', '2026-03-11 00:26:26'),
(409, 13, '5ede808263257d5096b138dd7a63290ee55c592cd2e7ee79171011d79f98e59f', '2026-03-12 11:54:11', '2026-03-11 11:54:11'),
(412, 13, '0517a898c2fd9b718e1bc33d2456eb7dd1d22991fd32bb8fdfe40947eca8a841', '2026-03-13 00:57:21', '2026-03-12 00:57:21'),
(413, 13, '2b2834665724ebc3e0c1c8c77193e2cee3d65a9af25d846c45733bcf02a986e7', '2026-03-13 02:36:37', '2026-03-12 02:36:37'),
(417, 13, '52f1ed34d5d1926c22adc2ace800fd978051e8ca5c16c50605ad028c649f4a45', '2026-03-13 03:08:46', '2026-03-12 03:08:46'),
(419, 23, '5a11f7a46963743beac350d6d5bb89a11412333e7545e10089840a3e9ed93f17', '2026-03-13 05:20:26', '2026-03-12 05:20:26'),
(420, 13, '7a2c57b0ea0df03f6a2e237d241f74840261b73ed9a558b6e80707b9d352111c', '2026-03-14 00:53:50', '2026-03-13 00:53:50'),
(421, 13, '7375f9c44ceb5a11fe70f94e97d6c27886052e3c09299179f3513f06baa3cc79', '2026-03-14 00:55:09', '2026-03-13 00:55:09'),
(422, 13, 'db93537ea08669dd978506a5b6c50b0e0c9b05eb4fb3fe8a65462c23c529c155', '2026-03-14 13:57:17', '2026-03-13 13:57:17'),
(423, 13, 'cbe62b2315d4030fd5a4137ef20a1c80150f3239dafa7594645f6db24bf2fe83', '2026-03-14 15:26:36', '2026-03-13 15:26:36'),
(424, 13, '103d831f9bdcfe1f78fc6e2261357bfcad364db02b451277b57cc6b8120dcc51', '2026-03-15 14:21:28', '2026-03-14 14:21:28'),
(425, 24, '69a1e73093ed9648717cde4a513d73068f8d6b02f0f15fbf007ed278a703513f', '2026-03-17 00:19:28', '2026-03-16 00:19:28'),
(427, 13, '44b1b13a62a58423dcdec0767de53bceddd155360bf64617c3495b74652f7842', '2026-03-17 00:28:45', '2026-03-16 00:28:45'),
(429, 13, '3b1e6489651f339d74476371cc75fce0d8e13082e54033a48db6a679e8003486', '2026-03-17 08:52:18', '2026-03-16 08:52:18'),
(431, 20, '5eb91958e52f8545de6cf9b3175137be9d7e87a8c7b89977e5a62934f9e0b277', '2026-03-18 00:22:25', '2026-03-17 00:22:25'),
(434, 12, '5d6d30a931bbd09cf8da7990cd6cfc4732235ba21cee70ee1509176354898fe8', '2026-03-18 08:15:31', '2026-03-17 08:15:31'),
(440, 12, 'accfc66e6f81c9b19bb7a826e0280143e74633af2a92aa6857de745cc57b6cc5', '2026-03-19 02:38:07', '2026-03-18 02:38:07'),
(442, 13, '5ff8a874db39d921de21777297a8f89a64e888f754fec14757609658fa4842fe', '2026-03-19 03:00:32', '2026-03-18 03:00:32'),
(443, 12, '563690c83fccb63c4dcb060ef2128f10d98bffd2ca2688b5993d5bea4372b317', '2026-03-19 06:38:53', '2026-03-18 06:38:53'),
(444, 13, 'b6b1944f90739e8e00fd9e513246dceb66deb0673ac675b6cbe6b399da5c2fc1', '2026-03-19 22:27:22', '2026-03-18 22:27:22'),
(445, 12, '1acf7450aff00c78babd6013ecdfb1e13779760a81354ca52ce07d96efe6877d', '2026-03-19 22:27:43', '2026-03-18 22:27:43'),
(446, 12, '790ef19bd809781157e4487762c8e40889e2273b85bc4eebe45d6653c0c5ad82', '2026-03-19 22:37:08', '2026-03-18 22:37:08'),
(447, 13, '3897452678ab45ca8d47d9193e94e110edc6f05c651835112d9ca9ad26e9ec42', '2026-03-20 00:06:41', '2026-03-19 00:06:41'),
(448, 24, '29dab1bd7a91c3f1612a787e7d3da91725be648d3c0f8040f3e0b3d0aaf6fb5e', '2026-03-20 00:14:53', '2026-03-19 00:14:53'),
(450, 12, '4ba795ae60858d4b5ef29ea254a00dec170a846e525fb2a5972e1a45432a2f94', '2026-03-20 01:58:17', '2026-03-19 01:58:17'),
(451, 13, '500f3b9d41faf6f46f3c362dad255da2ea139d39218deeb633c01c1f7d8715f3', '2026-03-20 02:13:27', '2026-03-19 02:13:27'),
(454, 26, 'fa0a793adc9d46b5d71b25f1c4a2e62f243a68748da2feb7941a9d21f886b1fc', '2026-03-23 10:19:07', '2026-03-22 10:19:07'),
(456, 24, 'dffad69b0a0a92a44ed7ce0991aba4ded72917cfd04003bd8b2f61100701cee9', '2026-03-23 10:21:51', '2026-03-22 10:21:51'),
(457, 20, '2205b6cea0cb4c1d4f7a6846bd104d0a096d6dfb92758b3ebd1226ef35f27a1e', '2026-03-23 10:22:11', '2026-03-22 10:22:11'),
(461, 12, 'c4b2f0499293737f33b64249e4f4ca7613ebd2c8f7e5f54832cf615447a9bdc3', '2026-03-23 10:50:22', '2026-03-22 10:50:22'),
(462, 26, '9f4079f9b6c29fbef5ae64cd48780c4cf18ab928774143a1fd71d5430cf55d99', '2026-03-23 10:52:04', '2026-03-22 10:52:04'),
(463, 20, '0b1f06403aec364619a7bc6cf272a86ad7874e70371b53e7c63c9a9ba75cad1e', '2026-03-23 10:52:51', '2026-03-22 10:52:51'),
(464, 13, '8b09ae4b5050df30d7173d178972452d297af26b872269b086a36bcf5fb70520', '2026-03-23 10:53:46', '2026-03-22 10:53:46'),
(465, 26, '276a031bac780a7d45779ce4010973d04b4ef233fdf4ebc572e3933e4f531da8', '2026-03-26 05:15:37', '2026-03-25 05:15:37'),
(466, 13, '733e360e8c90ff9936b3089909fd7fdc41ca96dfa2d4079eb98ccc7ebdbd57c1', '2026-03-26 05:16:44', '2026-03-25 05:16:44'),
(467, 12, 'e61864db9a3528a98f5f6525480d8f01bcf3166d106a15d4304335e256fa5d47', '2026-03-26 05:17:42', '2026-03-25 05:17:42'),
(468, 24, '6391816ab1c1ab5ef8b9bda4cc5c8287ec730ba56e5243d12cacc56509e35891', '2026-03-26 05:21:50', '2026-03-25 05:21:50'),
(470, 12, '2b4a62b0448c318d6ced35344dd6b583176c3d8d490ff2142c96c71de3c5dff7', '2026-03-28 18:01:51', '2026-03-27 17:01:51'),
(471, 26, 'b7c7b22bb50d262746b30b728a36f0d2df26ac8115e63fa4d749616ddbc042d0', '2026-03-28 18:02:46', '2026-03-27 17:02:46'),
(472, 12, '5a8f2bfa35e77d1d1cd85b43e3d71291367ed997436f3f09c6011ab996cee574', '2026-03-28 18:06:19', '2026-03-27 17:06:19'),
(473, 12, 'aab9fb610204fbfa2a0c9a0de1095c091021ab441dc878e87f3718480eb5d623', '2026-03-28 18:07:20', '2026-03-27 17:07:20'),
(474, 12, '3ad8c93932ecc44d9f40545ba8930ecc8b79cac2443229c65bca80dfc0cafe53', '2026-03-28 18:10:41', '2026-03-27 17:10:41'),
(475, 12, '64436382d22863e7ce374691c7746e7195bc7d9e0bf0a2c5fc6b1df1ef3a13d6', '2026-03-29 05:33:10', '2026-03-28 03:33:10'),
(477, 26, '88b5b5a3b910ccf7e43a74f3950fa85fb0465d6a11f283b47000c86a3d7bdf3f', '2026-03-29 05:36:04', '2026-03-28 03:36:04'),
(478, 26, '62204ed089ad4153960c158c736a9047da542a912ee791b0338b1b7b3661e910', '2026-03-29 05:37:05', '2026-03-28 03:37:05'),
(480, 26, 'c19b612c776acd25c57e34dadd3a688a1e9847a0d4aa7bc58e2114a4a430982a', '2026-03-29 05:46:16', '2026-03-28 03:46:16'),
(481, 26, '5fcfa2677dcc30151f290df7f3a825ff3128400ea0a7d613b4b6f29e0e6fd7cf', '2026-03-29 05:48:15', '2026-03-28 03:48:15'),
(483, 13, 'c476d2fe6a36537378c9f3ccba893a149d84cbadbed19fb74d56d3312a7e361d', '2026-03-29 06:22:41', '2026-03-28 04:22:41'),
(484, 13, 'd9db6d6f2edbce9989a5e25a97d0b59196de9b219a33368f5c39d231f8932a8c', '2026-03-29 06:25:25', '2026-03-28 04:25:25'),
(486, 20, '6eeab759969a56315816dcffc5e2e8138c97c69971f432e2f339a8d01f90f293', '2026-03-29 06:30:46', '2026-03-28 04:30:46'),
(487, 13, 'e73d591ec2524fc5c46e2da36d730c9c059adf5e30970c441bff1cc471274176', '2026-03-29 06:33:27', '2026-03-28 04:33:27'),
(488, 13, 'f1fd4cf3fa953c6aef79320d2a2b9571a091c0d017d18c68bf8d5d76dd518a06', '2026-03-29 06:58:39', '2026-03-28 04:58:39'),
(489, 13, '9c200ccad4317db528eef9410097fcf76ffd2d0de1ce670b7238e447bc5e5bc3', '2026-03-29 10:55:47', '2026-03-28 08:55:47'),
(490, 13, '4bade90a4f11abb04c0acb656479f591edc911d5e4c8420f066ce425d1f9cb04', '2026-03-29 11:02:02', '2026-03-28 09:02:02'),
(491, 26, '296368e2489ea2679ab9faf0694275b6612ef1dae8ee556b5357f32448236088', '2026-03-29 11:03:37', '2026-03-28 09:03:37'),
(492, 20, '1bd5ab4277ceada3874d584189e14c7b3c4df7fd09b4732625cf53039a380810', '2026-03-29 11:05:22', '2026-03-28 09:05:22'),
(493, 13, '7902a5b8774c87928622362fceb2641ed4b7e02deb546739a5b72809fc1c40bd', '2026-03-29 11:36:25', '2026-03-28 09:36:25'),
(494, 13, '3cfab8d5d07eb03d33eb5b8d1fb64519bc6cea1ed00d56e419c6dfc617b187ea', '2026-03-29 11:41:24', '2026-03-28 09:41:24'),
(495, 13, '0f783442c94649a557baf8f4c2e7c8a6550a3c3c03d6347100c7bf98d5b8a102', '2026-03-29 11:52:26', '2026-03-28 09:52:26'),
(496, 13, 'c382909b102676039e7c512c3ffa42bad4d21f2d5e2186cb894a3d1902518e6f', '2026-03-29 12:08:29', '2026-03-28 10:08:29'),
(497, 13, 'b229696c4f597e5530adc71a1d4067322fb2e631dfd3c3bccc987759c7714f38', '2026-03-29 12:19:06', '2026-03-28 10:19:06'),
(498, 13, '785b14851c159179c6132eec0c68c05465762cd7f0fa38b43e5bc5aa315a094a', '2026-03-29 12:28:23', '2026-03-28 10:28:23'),
(499, 13, 'f15bdee4ab9f735a9956418cba3e5fcd22fd4231be3890e9ea2642f05763660f', '2026-03-30 12:23:19', '2026-03-29 10:23:19'),
(500, 13, '8dd3237e623a0dea94b1d4c7a54c90cd3d27ccbfae07b2ea3627b20e1d6b25f9', '2026-03-31 02:45:33', '2026-03-30 00:45:33'),
(501, 24, '744d597c1c70bfb46bbb7c0e1823262df3532200b8dbf11ee26f1efbd29e5af2', '2026-03-31 02:46:47', '2026-03-30 00:46:47'),
(502, 13, 'c0b7ff708be2ad743c9435a808aa002fd68da61eccc8054fd2f86172dc10a1a0', '2026-03-31 03:24:22', '2026-03-30 01:24:22'),
(503, 12, '4ee5ce93d58da1ebbc6ba741229d133496397d6e8a520c4eefdd09dc9dbc031c', '2026-03-31 03:53:08', '2026-03-30 01:53:08'),
(504, 13, '184a0c2ee1a70b6d75d1335bc4c4b5b8dda38e652e407d8fd542db80ff6f486d', '2026-03-31 08:56:24', '2026-03-30 06:56:24'),
(506, 23, '6c84157c3b06dc5d61648a9bac8d48f339c16a0f4030624c61f1f560b5f33ef4', '2026-03-31 09:08:59', '2026-03-30 07:08:59'),
(518, 13, '6b99e480ec599debd913337476f50ce126d72134afe969ca5ac582d824a67bb4', '2026-03-31 12:47:17', '2026-03-30 10:47:17'),
(519, 24, '274d16febb81f494db3155048e0ee0257becad22c3ebc987c94281a6414e05e7', '2026-04-01 02:32:20', '2026-03-31 00:32:20'),
(520, 13, '8204d3b54d1df5f4ffc818f2c782a2fc97daeac4763f8994f764140570526ca5', '2026-04-01 02:33:59', '2026-03-31 00:33:59'),
(521, 13, '3ac99d99cce69773beb0c5551358b9aac024a7d4f5f881fa55dc0ed0e8c0ac1d', '2026-04-01 02:48:41', '2026-03-31 00:48:41'),
(523, 26, 'cd4f81225da468da2702571410f7942bc57d3842c406f5aad4e460d9cf99afb7', '2026-04-01 18:35:56', '2026-03-31 16:35:56'),
(524, 12, 'ff545fb9a018aa26573f69ba7679c260fea94065b90e9dbc80d390a7e7403106', '2026-04-01 18:36:55', '2026-03-31 16:36:55'),
(525, 13, '985e7abe54a7c7d64835110707104dfac08bc5ac3a4d46cac82e21bc7b436932', '2026-04-01 18:38:46', '2026-03-31 16:38:46'),
(526, 13, 'f9c57de454676851f848082511a743c31f06f3c57806acc182f702ccea54c7ac', '2026-04-01 18:45:35', '2026-03-31 16:45:35'),
(527, 13, 'f7fba6f52f3ae324527079f51f3a7d5051269286efe53a9c1e37e8305fb64c29', '2026-04-02 02:32:46', '2026-04-01 00:32:46'),
(528, 13, 'b9d7fe85be0abe149224016700014386db9e39d052c06277cead889b42cdd43a', '2026-04-02 02:35:13', '2026-04-01 00:35:13'),
(529, 12, '82b54b852c50a25d110ba2fe1eb34ef6c19eee39deea2a7c5bff4aa1b17bed11', '2026-04-02 03:06:40', '2026-04-01 01:06:40'),
(530, 24, '7056660151c7e64cbadcc4f7fd26a7b0627057d03a43fb6f5c040bc6eb683766', '2026-04-02 04:55:19', '2026-04-01 02:55:19'),
(531, 12, 'c62b703bd6dac5711bbe3e32cbd6ee4cc82add3498a394026595115707b2f8ca', '2026-04-02 07:41:48', '2026-04-01 05:41:48'),
(532, 13, '69a98a0865fde4f6e51b9a3bc7066ba5a9b17f6b9e175f9f89f00073c1c75d50', '2026-04-03 16:06:39', '2026-04-02 14:06:39'),
(533, 12, '142b1807a1f417600d0d2140c5aa70e7e21638012bccce2038a2a19d80296522', '2026-04-03 16:31:09', '2026-04-02 14:31:09'),
(534, 26, '2983fb7c6e388e4b1679480c5f86f658d1a0e824dd585fbbddeb868a632e0ec5', '2026-04-03 16:34:22', '2026-04-02 14:34:22'),
(535, 13, '57c7ff6ee4d30c4d34dad09c79b1e3381eed69b9464f88b9a283b79e81caee66', '2026-04-03 16:55:39', '2026-04-02 14:55:39'),
(536, 13, '37a3c9e36e54a9008c6912f32f9a45e3b7875a9ed0c704335027124b737c7514', '2026-04-03 16:58:18', '2026-04-02 14:58:18'),
(539, 26, 'd24b5cc8757ef6bd5a2bb0ac2ed0f2773988cf67d796250dd0e6b5eacd8de3e5', '2026-04-05 14:09:56', '2026-04-04 12:09:56'),
(540, 26, 'd2a8353b295d4cd602bc52d5d5c8d8d8db5962c6c50f3b6f3710f3fd26885b4f', '2026-04-05 14:12:13', '2026-04-04 12:12:13'),
(541, 13, '42c26fedd79c371b1eb75ace4720cbfab04a747007e4d040064d89b27582586f', '2026-04-05 14:23:33', '2026-04-04 12:23:33'),
(543, 13, '4e0f380b9592bd6793e919c3689896c8a55ad3faac20a4e740600ae2da714cc7', '2026-04-07 02:20:51', '2026-04-06 00:20:51'),
(545, 12, '2997a9e55ae334ee94a301145d6a7ada0ebc58fa5c3bad1fc662d6d6c15b67d0', '2026-04-07 05:16:20', '2026-04-06 03:16:20'),
(548, 13, '76853070d49d53420255a8a26bd9bd7e7ebb189111974e90afbea4cb4d33fc5d', '2026-04-07 05:39:54', '2026-04-06 03:39:54'),
(549, 13, 'b7120df65d6069e9a425acee548bcf4e3b34c7bc6243ddfab0c6f9d4cbe5b67e', '2026-04-08 04:58:57', '2026-04-07 02:58:57'),
(550, 13, '4f0e63d59ac63c4db3c4bb19de6efc32607f9327bc468698533856cd668e51fa', '2026-04-10 16:50:25', '2026-04-09 14:50:25'),
(551, 13, '9257efc2a8ed7608e6821a3baf6c2e9bcca5f7fa64d5f7f75b51018762d609e9', '2026-04-10 16:51:05', '2026-04-09 14:51:05'),
(553, 12, 'b2522cffde0d3f0c07b013a6b28b3b8d5a13a3d743fb6cfd9c1f2108c0a4bced', '2026-04-10 17:55:15', '2026-04-09 15:55:15'),
(555, 13, '3f43c539ce316ca53f6568212dbca40d3c1bb46ad23b725b1a2161bff2174086', '2026-04-13 14:36:27', '2026-04-12 12:36:27'),
(557, 26, 'a1b1e04b66d5314029647e94bcbcbaee76efa5bd9091cd5aaa2bac338ee2f03f', '2026-04-13 15:49:19', '2026-04-12 13:49:19'),
(559, 23, '0199fdec21a0d8e8eb8413711c2368d37dbd44a2c865373ac6e870566c72e140', '2026-04-13 16:21:11', '2026-04-12 14:21:11'),
(560, 12, '0e10349f88bc1321cef3f9137995d098a461bbcece234eef29ae227fa527738f', '2026-04-14 04:57:14', '2026-04-13 02:57:14'),
(561, 12, 'e81e9bedc69fac2c614bcf8a4a386c36323a3a64ec9fa0bdda1ef35554d5ca02', '2026-04-14 05:04:16', '2026-04-13 03:04:16'),
(562, 12, 'dd136c1017c7294f346f42a67580e0f3937e979885efa9a9d81dc47292997d74', '2026-04-14 05:08:07', '2026-04-13 03:08:07'),
(564, 12, '3baad76abf4f0ef6ac4da1f1c88ee2e04a0f7bb520a0da089c125357233dcfe7', '2026-04-14 08:33:19', '2026-04-13 06:33:19'),
(565, 12, '0d6b5a13d92f31884ec756cb974698245f6822741ab285e836eb782a373cd0c2', '2026-04-14 08:37:03', '2026-04-13 06:37:03'),
(566, 12, '24e7c4e6b7334013ad16e4a2ac425c7f6fbd776d5246361bd9549fc3d5d276c1', '2026-04-14 08:45:02', '2026-04-13 06:45:02'),
(567, 12, '89d82cf088d30f6e92d11b622ffe4fa07f00b1466a43c2e11c23a491e4feee92', '2026-04-14 09:08:54', '2026-04-13 07:08:54'),
(569, 13, '677cc7bb3dbde3f7130b006f005acd31f7552eb7dab68890e54766f62be0924b', '2026-04-15 15:27:35', '2026-04-14 13:27:35'),
(570, 13, 'e7752bcaada33112a927bf63a18f0a08792a17f5f56ce994646053bb1b76623f', '2026-04-15 16:22:21', '2026-04-14 14:22:21'),
(571, 13, '2fcf4db1f435a9338b86be0ed48b3850232f4af454fcc2662a924bc73377eae0', '2026-04-15 16:37:39', '2026-04-14 14:37:39'),
(572, 13, '619725826dbcf597785977c86f933c06a4db46b967afbf9d4cb51c31cca2cd06', '2026-04-15 16:47:35', '2026-04-14 14:47:35'),
(573, 13, '8f93ca00c08ad3dd97c21593b6edb7878f489fd6ee54af0cbd21f73372180ab2', '2026-04-15 18:45:19', '2026-04-14 16:45:19'),
(574, 13, '4c628ef858ace16f69ef597988cc5c24f1e9da9a3cf30027663dd9f88d9fd50a', '2026-04-15 18:52:25', '2026-04-14 16:52:25'),
(575, 13, 'df57866da1486a22bb470e255c70a04b8d14485a91a870a7eb975818663b22ae', '2026-04-15 19:32:12', '2026-04-14 17:32:12'),
(580, 12, '768ca2ad05bf8c5db27148d042009e7f6ba5f665108f37b584d9642a11765528', '2026-04-15 19:55:58', '2026-04-14 17:55:58'),
(581, 13, '7577628783521421f8a6865404c7b8680190210d14dfcddb91f7d232f63a49e6', '2026-04-15 20:19:17', '2026-04-14 18:19:17'),
(583, 23, 'b1c8112ae9c1a8536a5e57910f884c3b0d6751348fb213857171d2749d82235d', '2026-04-15 20:21:11', '2026-04-14 18:21:11'),
(591, 27, '0262c85a8892353d71ee3ec2def6c74201bf2a6a045e16513b7832c18df09756', '2026-04-18 08:36:45', '2026-04-17 06:36:45'),
(602, 23, '42adcbedd5fc320803c3480e8f15bd47f3cbd560a0b264b512d126c06493e4d0', '2026-04-18 16:37:34', '2026-04-17 14:37:34'),
(628, 26, '27856453ff6562cdfab400e7f80f67b7ea5b19543cfe2d97351262a5eb78c582', '2026-04-19 05:21:00', '2026-04-18 03:21:00'),
(629, 12, '125410f5215d7a40b0ff4c59ab77044c103179cc974524d85e6cbe7560ab68cd', '2026-04-19 05:25:59', '2026-04-18 03:25:59'),
(630, 23, '606aa635b2dbfe251cf0c76a3609cd80cc2f9c7fbdd2b168bdbc225eb9be5cb2', '2026-04-19 05:38:42', '2026-04-18 03:38:42'),
(638, 12, '8266e56a3b91c1625e54c09851a237c2d12f25324962a9fbad2b1b4c7d04042e', '2026-04-19 07:27:37', '2026-04-18 05:27:37'),
(639, 13, '8f968c289e6a2c6db47beb30f2f9e222bb2fa2aa7eecedf8394b7f8d2ff716c2', '2026-04-19 07:39:07', '2026-04-18 05:39:07'),
(641, 27, 'e33bc4360c3f553e5b667ed2b7d33cdceb896e24080961a822d3f24266ae240f', '2026-04-19 13:10:08', '2026-04-18 11:10:08'),
(644, 26, '127ec5da911e58dff822880ca3471ae65f1c3886b6375ae208e224ecc7620cae', '2026-04-19 15:13:11', '2026-04-18 13:13:11'),
(645, 26, '003bc4ca9b4d842b99ff2e65f3d6b9fc35e6969f0c4c1f0bc02f9e13a2ec990e', '2026-04-19 15:15:23', '2026-04-18 13:15:23'),
(647, 13, '77b399a384ee51a397935cbdf18de7f40298d11a05bc3f1c2de3ccb4e95f9a4a', '2026-04-19 16:18:56', '2026-04-18 14:18:56'),
(648, 24, '83d7a8ba029f19d26b3843ae62a71c389d1731ba720830678c6c8a8787ce7d14', '2026-04-19 16:27:00', '2026-04-18 14:27:00'),
(649, 26, 'a41196e3634ba72e2022f9baac076fc10e12b83cc9ad95e57f1c661b8c81a922', '2026-04-19 18:16:46', '2026-04-18 16:16:46'),
(650, 26, 'dd51d0929e9b8bca791fc2b06371142d2a0cb0aeafbfb45d8b6e58ffb75dc5a1', '2026-04-19 18:17:42', '2026-04-18 16:17:42'),
(653, 13, 'f87b9fd9108fbb3d9a280f9d75fa9331f9daf5e25004a0427164d5fff43c04f7', '2026-04-19 19:10:28', '2026-04-18 17:10:28'),
(656, 26, 'db32abde616e56a3c8dbc43bb080aa728a92dd8d4a4c84b4ef541ac96712db74', '2026-04-20 05:47:23', '2026-04-19 03:47:23'),
(658, 13, '9fe8e2c9301fabe396db4ec29865478f9a2d38844d343a4aa82657a635ab00be', '2026-04-20 06:14:02', '2026-04-19 04:14:02'),
(662, 23, '3fba50cd29a7692cc4fa23f06516d0738cab0c21c698d517e417515ad45a0b64', '2026-04-20 09:26:44', '2026-04-19 07:26:44'),
(666, 13, '31065d59003d14928c42d43178495bddba2ceceff95eea70e5bbf0d834fe98da', '2026-04-20 10:51:09', '2026-04-19 08:51:09'),
(667, 12, '1c7124b33e8572a32e6bdb48de0abc1b33fcb8def800a2f5cf6237c3068fe54a', '2026-04-20 10:51:24', '2026-04-19 08:51:24'),
(682, 24, '1ffabdf3c67077905d25d1ef918c2d3abe4490b076ed940b56289cbe66a36109', '2026-04-20 17:49:27', '2026-04-19 15:49:27'),
(683, 26, '022472b20d848aa435fb6de9623b9c38cc1b1e827bd2e7cd32acfed256ce3cac', '2026-04-20 17:51:23', '2026-04-19 15:51:23'),
(684, 12, '6fe64c88e6a26ca46aca197208d0b15ff6429dc6b5c7a1a9a308bdb0d62d0394', '2026-04-20 18:35:33', '2026-04-19 16:35:33'),
(685, 13, '4b458cc01c006f649a29c1036148313bf0e41c9d106b0d5f35f0bf2536c8581f', '2026-04-20 18:38:39', '2026-04-19 16:38:39'),
(692, 12, '44ff901f9c6695cc16fca00137fda257e6300b853712f5c2a51a47f0b13d7c81', '2026-04-20 19:03:53', '2026-04-19 17:03:53'),
(699, 23, '4780c5ad4adbbed735e847e7481f84068ecb6942518676fc956e325ce85d714c', '2026-04-20 19:21:56', '2026-04-19 17:21:56'),
(701, 13, '72d9b67b30f91658f2692ca3fd6af0e493290a496e1d5b3234de5e8146b46a59', '2026-04-21 08:02:04', '2026-04-20 06:02:04'),
(702, 26, '1ecb5362e997c43cbe49fe23ec470017e38c517331e09e1747aba31c343f3d7b', '2026-04-21 08:03:18', '2026-04-20 06:03:18'),
(703, 12, 'ed9aeaa9dd6fd18dde4131fbaafa2623f8af6cf3fcb39296492ee14e6754bebb', '2026-04-21 08:10:02', '2026-04-20 06:10:02'),
(706, 27, 'b0d5401aefcca293e6833a9a26835ebdbf6966281d1dbeb7f1fa22723ed99156', '2026-04-21 09:27:32', '2026-04-20 07:27:32'),
(707, 24, 'e07d0b364694cc237c97052972a395af413a5beff3e546d923a42d016622fab2', '2026-04-22 02:19:25', '2026-04-21 00:19:25'),
(708, 12, 'd2d2b9a014faa50628173d4e5e3b6feecb3d8bd7264fe6fcc53b54b6dd7053bf', '2026-04-22 05:19:19', '2026-04-21 03:19:19'),
(714, 24, 'cc3b4dc711c34d92f77f4738440972ed592342abddaffabb85e44077c966265f', '2026-04-25 07:28:38', '2026-04-24 05:28:38'),
(715, 13, 'a9debd37c04000d9a9ad5e8fc14e36bd84ecb27fd76ae54c2eb8667228f2f5fc', '2026-04-25 08:52:05', '2026-04-24 06:52:05'),
(718, 26, 'e1b43e90714baddd125a33ed79cf0242d2ead79b4164055e0090b9cd14a7af4b', '2026-04-25 16:50:55', '2026-04-24 14:50:55'),
(721, 12, '2c00e31efca21d05b535eba1ba80da63c7e0ddfb4c1f9f2543da5c677a038357', '2026-04-25 17:13:42', '2026-04-24 15:13:42'),
(722, 12, '81a5078bbd0614fc65fdfa81a8bda84efe2541f9009d5e745eac3172c2ca4d37', '2026-04-28 03:19:33', '2026-04-27 01:19:33'),
(724, 12, 'c83df8a3f5f4c8c4d1f2ccbca934ae421373bf3992c8a76779478ff0c4b55d39', '2026-04-28 07:39:16', '2026-04-27 05:39:16'),
(725, 24, 'f40597421a5552a5701e17f5207295381b401c397f959baea7ff1baccf5f514d', '2026-04-29 03:38:37', '2026-04-28 01:38:37'),
(726, 12, '67c05cc1cd0a79dec6426596a97e64d0ae805dbc83e0ecc4d01d8b180d0d846f', '2026-05-01 02:50:08', '2026-04-30 00:50:08'),
(727, 12, 'c15d93fed9dfab3d0f9cb748883a75ebebf6363e6af5d339f72de386df2d1e5e', '2026-05-01 02:54:00', '2026-04-30 00:54:00'),
(728, 13, 'cf556776d86c161c1da9ef6c9073e8bb475450cc59b3be7d3d0ce49001b2403d', '2026-05-01 05:15:24', '2026-04-30 03:15:24'),
(729, 13, '7fc6e6e88aecb71ae4d3d244517bb9a8fa621ba32c911f54dbbf14d5521824a3', '2026-05-01 05:15:24', '2026-04-30 03:15:24'),
(730, 13, '56f9f812228fea45505ba670e5a7a5e9abac0ccf4cbf38078875e0caf5acfb68', '2026-05-01 05:15:24', '2026-04-30 03:15:24'),
(731, 12, 'e68d555fb929112d44b387d016a5a7fd49a0fa48d96a55f6c9fe938663a07483', '2026-05-05 03:12:49', '2026-05-04 01:12:49'),
(737, 12, 'b8c977eb9d5c554e7b73e7089a703564595406bb7df11d987b499cfebac9f398', '2026-05-07 03:25:13', '2026-05-06 01:25:13'),
(738, 13, 'ad689f66ff94ae223b453ce5b851904f81af31849641c2156f425be713facdce', '2026-05-07 04:11:52', '2026-05-06 02:11:52'),
(739, 13, 'd426789ff31d52f7444e11901a00a4e1b1e94a82d07dd35ad6a02e5084717059', '2026-05-12 05:02:33', '2026-05-11 03:02:33'),
(741, 13, 'd8640690f5bb19b8db4060f47b61c94a6602e5f5c4f701590f51752f39acf112', '2026-05-14 04:05:43', '2026-05-13 02:05:43'),
(742, 12, '1a9be2bd42fe21930f203838406583dc54117be1cbe2b63484c1b77001a8365a', '2026-05-14 04:06:12', '2026-05-13 02:06:12'),
(743, 23, '36bfc9de6b1e67b9886c6628c0632409f67d5df6f53629ba51925f5b0dc7a194', '2026-05-14 04:06:59', '2026-05-13 02:06:59'),
(746, 23, '627fb642c0a1fece00c88589ff07378d9244da5add70803b26792c4c4729d0e0', '2026-05-20 07:24:09', '2026-05-19 05:24:09');

-- --------------------------------------------------------

--
-- Table structure for table `user_widget_access`
--

CREATE TABLE `user_widget_access` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `widget_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_widget_access`
--

INSERT INTO `user_widget_access` (`id`, `user_id`, `widget_id`) VALUES
(88, 12, 1),
(112, 13, 2),
(81, 15, 2),
(76, 19, 2),
(70, 20, 1),
(103, 23, 5),
(97, 24, 1),
(98, 24, 2),
(99, 24, 4),
(100, 24, 5),
(89, 25, 1),
(91, 26, 4),
(107, 27, 2);

-- --------------------------------------------------------

--
-- Table structure for table `widgets`
--

CREATE TABLE `widgets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `widgets`
--

INSERT INTO `widgets` (`id`, `code`, `name`, `description`) VALUES
(1, 'doctor', 'Doctor Panel', 'Displays patient consultations, prescriptions, and lab results'),
(2, 'triage', 'Triage Panel', 'Displays patient queue, vital signs, and triage statistics'),
(4, 'tv', 'TV Display', 'Displays live queue numbers on TV screen'),
(5, 'encoder', 'Encoder Panel', 'Displays patient name, consultation description, and list of visits');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `barangays`
--
ALTER TABLE `barangays`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_barangay_name` (`name`);

--
-- Indexes for table `consultations`
--
ALTER TABLE `consultations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_queue` (`queue_id`),
  ADD KEY `fk_consult_queue` (`queue_id`),
  ADD KEY `fk_consult_patient` (`patient_id`),
  ADD KEY `fk_consult_doctor` (`doctor_id`),
  ADD KEY `idx_encoded_by` (`encoded_by`),
  ADD KEY `idx_encoded_at` (`encoded_at`);

--
-- Indexes for table `doctor_patient_queue`
--
ALTER TABLE `doctor_patient_queue`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_doctor_queue` (`doctor_id`,`queue_number`,`queue_date`),
  ADD KEY `idx_patient` (`patient_id`),
  ADD KEY `idx_doctor` (`doctor_id`),
  ADD KEY `idx_patient_queue` (`patient_queue_id`);

--
-- Indexes for table `household_sequence`
--
ALTER TABLE `household_sequence`
  ADD PRIMARY KEY (`year`);

--
-- Indexes for table `lab_requests`
--
ALTER TABLE `lab_requests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `request_no` (`request_no`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `doctor_id` (`doctor_id`);

--
-- Indexes for table `lab_request_tests`
--
ALTER TABLE `lab_request_tests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lab_request_id` (`lab_request_id`);

--
-- Indexes for table `medical_certificates`
--
ALTER TABLE `medical_certificates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `certificate_no` (`certificate_no`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `doctor_id` (`doctor_id`);

--
-- Indexes for table `panels`
--
ALTER TABLE `panels`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `patients_db`
--
ALTER TABLE `patients_db`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_patient_code` (`patient_code`),
  ADD UNIQUE KEY `uq_barangay_patient` (`barangay_id`,`patient_code`),
  ADD KEY `idx_identity` (`first_name`,`last_name`,`date_of_birth`,`gender`),
  ADD KEY `fk_barangay_id` (`barangay_id`),
  ADD KEY `fk_purok_id` (`purok_id`);

--
-- Indexes for table `patient_household_history`
--
ALTER TABLE `patient_household_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_phh_patient` (`patient_id`);

--
-- Indexes for table `patient_queue`
--
ALTER TABLE `patient_queue`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_daily_queue` (`queue_date`,`queue_type`,`queue_number`),
  ADD KEY `idx_queue_lookup` (`queue_date`,`queue_type`,`status`),
  ADD KEY `fk_patient_queue` (`patient_id`),
  ADD KEY `fk_administered_by` (`administered_by`);

--
-- Indexes for table `puroks`
--
ALTER TABLE `puroks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_purok` (`barangay_id`,`purok_name`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uuid` (`uuid`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_user_role` (`role`);

--
-- Indexes for table `user_panel_access`
--
ALTER TABLE `user_panel_access`
  ADD PRIMARY KEY (`user_id`,`panel_id`),
  ADD KEY `panel_id` (`panel_id`);

--
-- Indexes for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user_widget_access`
--
ALTER TABLE `user_widget_access`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_widget` (`user_id`,`widget_id`),
  ADD KEY `fk_uw_widget` (`widget_id`);

--
-- Indexes for table `widgets`
--
ALTER TABLE `widgets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `barangays`
--
ALTER TABLE `barangays`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `consultations`
--
ALTER TABLE `consultations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `doctor_patient_queue`
--
ALTER TABLE `doctor_patient_queue`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=127;

--
-- AUTO_INCREMENT for table `lab_requests`
--
ALTER TABLE `lab_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `lab_request_tests`
--
ALTER TABLE `lab_request_tests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=694;

--
-- AUTO_INCREMENT for table `medical_certificates`
--
ALTER TABLE `medical_certificates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT for table `panels`
--
ALTER TABLE `panels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `patients_db`
--
ALTER TABLE `patients_db`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=312;

--
-- AUTO_INCREMENT for table `patient_household_history`
--
ALTER TABLE `patient_household_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `patient_queue`
--
ALTER TABLE `patient_queue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=134;

--
-- AUTO_INCREMENT for table `puroks`
--
ALTER TABLE `puroks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=747;

--
-- AUTO_INCREMENT for table `user_widget_access`
--
ALTER TABLE `user_widget_access`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT for table `widgets`
--
ALTER TABLE `widgets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `consultations`
--
ALTER TABLE `consultations`
  ADD CONSTRAINT `fk_consult_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients_db` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_consult_queue` FOREIGN KEY (`queue_id`) REFERENCES `patient_queue` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `doctor_patient_queue`
--
ALTER TABLE `doctor_patient_queue`
  ADD CONSTRAINT `fk_dpq_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_dpq_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients_db` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_dpq_patient_queue` FOREIGN KEY (`patient_queue_id`) REFERENCES `patient_queue` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `lab_requests`
--
ALTER TABLE `lab_requests`
  ADD CONSTRAINT `lab_requests_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients_db` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lab_requests_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `lab_request_tests`
--
ALTER TABLE `lab_request_tests`
  ADD CONSTRAINT `lab_request_tests_ibfk_1` FOREIGN KEY (`lab_request_id`) REFERENCES `lab_requests` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `medical_certificates`
--
ALTER TABLE `medical_certificates`
  ADD CONSTRAINT `medical_certificates_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients_db` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `medical_certificates_ibfk_3` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `patients_db`
--
ALTER TABLE `patients_db`
  ADD CONSTRAINT `fk_patient_barangay` FOREIGN KEY (`barangay_id`) REFERENCES `barangays` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_patient_purok` FOREIGN KEY (`purok_id`) REFERENCES `puroks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `patient_household_history`
--
ALTER TABLE `patient_household_history`
  ADD CONSTRAINT `fk_phh_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients_db` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `patient_queue`
--
ALTER TABLE `patient_queue`
  ADD CONSTRAINT `fk_administered_by` FOREIGN KEY (`administered_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_queue_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients_db` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `puroks`
--
ALTER TABLE `puroks`
  ADD CONSTRAINT `fk_purok_barangay` FOREIGN KEY (`barangay_id`) REFERENCES `barangays` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_user_role` FOREIGN KEY (`role`) REFERENCES `roles` (`code`);

--
-- Constraints for table `user_panel_access`
--
ALTER TABLE `user_panel_access`
  ADD CONSTRAINT `user_panel_access_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_panel_access_ibfk_2` FOREIGN KEY (`panel_id`) REFERENCES `panels` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_widget_access`
--
ALTER TABLE `user_widget_access`
  ADD CONSTRAINT `fk_uw_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_uw_widget` FOREIGN KEY (`widget_id`) REFERENCES `widgets` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
