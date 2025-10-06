-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 06, 2025 at 07:41 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hotel_booking`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `log_id` bigint(20) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `detail` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `amenities`
--

CREATE TABLE `amenities` (
  `amenity_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `amenities`
--

INSERT INTO `amenities` (`amenity_id`, `name`, `description`, `icon`) VALUES
(1, 'WiFi', 'Miễn phí WiFi tốc độ cao', 'wifi'),
(2, 'TV', 'TV màn hình phẳng 55 inch', 'tv'),
(3, 'Air Conditioning', 'Điều hòa không khí', 'ac'),
(4, 'Minibar', 'Tủ lạnh mini', 'minibar'),
(5, 'Balcony', 'Ban công riêng', 'balcony'),
(6, 'Ocean View', 'View biển', 'ocean'),
(7, 'Pet Friendly', 'Cho phép thú cưng', 'pet'),
(8, 'Room Service', 'Dịch vụ phòng 24/7', 'service'),
(9, 'Safe', 'Két sắt an toàn', 'safe'),
(11, 'Mini Bar', 'Quầy bar mini', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `booking_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `room_id` int(11) NOT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `guests` int(11) DEFAULT 1,
  `notes` text DEFAULT NULL,
  `total_price` decimal(12,2) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `guest_email` varchar(255) DEFAULT NULL,
  `guest_name` varchar(255) DEFAULT NULL,
  `guest_phone` varchar(255) DEFAULT NULL,
  `hold_until` datetime(6) DEFAULT NULL,
  `booking_reference` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`booking_id`, `user_id`, `room_id`, `check_in`, `check_out`, `guests`, `notes`, `total_price`, `status`, `created_at`, `updated_at`, `guest_email`, `guest_name`, `guest_phone`, `hold_until`, `booking_reference`) VALUES
(1, NULL, 1, '2025-12-01', '2025-12-03', 2, 'Yêu cầu phòng tầng cao siêu cao', 1000000.00, 'cancelled', '2025-09-28 09:09:56', '2025-09-30 08:11:34', 'guest@example.com', 'Nguyễn Văn A', '0123456789', '2025-09-30 14:49:09.000000', 'BK1759075796835A08174'),
(2, NULL, 2, '2025-12-01', '2025-12-03', 10, 'test', 1600000.00, 'cancelled', '2025-09-30 01:08:09', '2025-09-30 08:13:11', 'guest@example.com', 'Nguyen Van A', '0123456789', '2025-09-30 08:13:09.000000', 'BK17592196898964AD307'),
(3, NULL, 1, '2025-12-10', '2025-12-13', 2, 'Test booking for auto-cancel', 1500000.00, 'cancelled', '2025-09-30 05:12:24', '2025-09-30 12:24:36', 'testguest30/9@example.com', 'Test Guest 30/9', '0000000000', '2025-09-30 19:22:09.000000', 'BK1759234344743F37BAD'),
(4, 7, 1, '2025-10-05', '2025-10-08', 2, NULL, 1500000.00, 'cancelled', '2025-10-01 03:46:43', '2025-10-01 10:52:10', NULL, NULL, NULL, '2025-10-01 10:51:43.000000', 'BK17593156034801E92A4'),
(5, NULL, 1, '2025-12-10', '2025-12-13', 2, 'Test booking for auto-cancel', 1500000.00, 'cancelled', '2025-10-01 03:55:17', '2025-10-01 11:00:40', 'testguest30/9@example.com', 'Test Guest 30/9', '0000000000', '2025-10-01 11:00:17.000000', 'BK17593161178541471EB'),
(6, 7, 1, '2025-10-05', '2025-10-08', 2, NULL, 1500000.00, 'cancelled', '2025-10-01 03:58:43', '2025-10-01 11:04:10', NULL, NULL, NULL, '2025-10-01 11:03:43.000000', 'BK1759316323437CE513C'),
(7, 12, 4, '2025-10-10', '2025-10-13', 2, NULL, 1500000.00, 'cancelled', '2025-10-01 08:18:12', '2025-10-01 15:23:39', NULL, NULL, NULL, '2025-10-01 15:23:12.000000', 'BK17593318926822B57BB'),
(8, NULL, 1, '2025-12-01', '2025-12-03', 2, 'Test booking for debug', 1000000.00, 'cancelled', '2025-10-02 04:16:27', '2025-10-02 11:21:47', 'debug@example.com', 'Debug Guest', '0123456789', '2025-10-02 11:21:27.000000', 'BK1759403787086564C5E'),
(9, NULL, 1, '2025-10-10', '2025-12-10', 1, 'phòng càng rẻ càng tốt nhưng phải đẹp', 0.00, 'cancelled', '2025-10-03 08:22:01', '2025-10-03 15:27:19', 'quangt2234@gmail.com', 'Nguyn Quan Ah', '01122334455', '2025-10-03 15:27:01.000000', 'BK1759504921028AC2136'),
(10, NULL, 1, '2025-12-17', '2025-12-20', 2, 'Test booking for debug 4/10/25', 1500000.00, 'cancelled', '2025-10-03 22:07:54', '2025-10-04 05:12:58', 'debug@example.com', 'Debug Guest', '0123456789', '2025-10-04 05:12:54.000000', 'BK175955447444399F96F'),
(11, NULL, 1, '2025-12-17', '2025-12-20', 2, 'Test booking for debug 4/10/25', 1500000.00, 'cancelled', '2025-10-04 06:32:57', '2025-10-04 13:38:05', 'debug@example.com', 'Debug Guest', '0123456789', '2025-10-04 13:37:57.000000', 'BK175958477773381A773'),
(12, 12, 4, '2025-10-10', '2025-10-13', 2, NULL, 1500000.00, 'cancelled', '2025-10-04 06:35:57', '2025-10-04 13:41:05', NULL, NULL, NULL, '2025-10-04 13:40:57.000000', 'BK17595849570770788AC'),
(13, NULL, 1, '2025-12-17', '2025-12-20', 2, 'Test booking for debug 5/10/25', 1500000.00, 'cancelled', '2025-10-04 09:00:11', '2025-10-04 09:03:54', 'debug@example.com', 'Debug Guest', '0123456789', '2025-10-04 16:05:11.000000', 'BK17595936110791B2CAA'),
(14, 11, 4, '2025-10-10', '2025-10-13', 2, NULL, 1500000.00, 'cancelled', '2025-10-04 09:00:29', '2025-10-04 16:05:35', NULL, NULL, NULL, '2025-10-04 16:05:29.000000', 'BK17595936295077261AC');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` bigint(20) NOT NULL,
  `recipient_id` int(11) NOT NULL,
  `actor_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(255) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `used` bit(1) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `method` enum('credit_card','paypal','momo','cash') NOT NULL,
  `status` enum('pending','success','failed') DEFAULT 'pending',
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `token_id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(512) NOT NULL,
  `issued_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` datetime NOT NULL,
  `revoked` tinyint(1) DEFAULT 0,
  `ip_address` varchar(255) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`token_id`, `user_id`, `token`, `issued_at`, `expires_at`, `revoked`, `ip_address`, `user_agent`) VALUES
(2, 8, 'afcd0c60-ef6b-4908-a368-212ee01f1188', '2025-09-30 08:22:47', '2025-10-07 08:22:47', 1, NULL, NULL),
(6, 7, '0c8f30aa-c98b-4e6a-a8a8-282e0efaf6df', '2025-10-01 10:32:18', '2025-10-08 10:32:18', 0, NULL, NULL),
(23, 12, 'a6f32ceb-c488-456e-bcac-1c96363056d8', '2025-10-04 13:41:30', '2025-10-11 13:41:30', 0, NULL, NULL),
(25, 11, '4d3d4db1-2354-479a-97a1-d81e5c23fea0', '2025-10-04 15:59:03', '2025-10-11 15:59:03', 1, NULL, NULL),
(30, 10, 'e4e538d8-efa2-494b-a873-c66577911f4f', '2025-10-06 06:13:34', '2025-10-13 06:13:34', 0, NULL, NULL),
(32, 16, '7c8d8578-6539-4942-8446-b8641b2a8cfd', '2025-10-06 17:29:43', '2025-10-13 17:29:43', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `name`, `description`, `created_at`) VALUES
(1, 'ROLE_CUSTOMER', 'Khách hàng mặc định', '2025-09-27 14:28:20'),
(2, 'ROLE_STAFF', 'Nhân viên quản lý', '2025-09-27 14:28:20'),
(3, 'ROLE_ADMIN', 'Quản trị hệ thống', '2025-09-27 14:28:20');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `room_id` int(11) NOT NULL,
  `room_number` varchar(20) NOT NULL,
  `type_id` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `status` enum('AVAILABLE','BOOKED','MAINTENANCE') DEFAULT 'AVAILABLE',
  `capacity` int(11) DEFAULT 1,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `available` bit(1) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`room_id`, `room_number`, `type_id`, `price`, `status`, `capacity`, `description`, `created_at`, `updated_at`, `available`, `type`) VALUES
(1, '101', 1, 600000.00, 'AVAILABLE', 2, 'Phòng đã cập nhật', '2025-09-28 15:46:47', '2025-10-05 22:47:44', b'1', NULL),
(2, '102', 2, 800000.00, NULL, 2, 'Phòng đôi view thành phố', '2025-09-28 15:46:47', '2025-09-28 15:46:47', b'1', NULL),
(3, '201', 3, 1200000.00, NULL, 4, 'Suite cao cấp với ban công riêng', '2025-09-28 15:46:47', '2025-10-03 16:02:35', b'1', NULL),
(4, '103', 1, 500000.00, 'AVAILABLE', 1, 'Phòng đơn tiện nghi cơ bản', '2025-10-01 11:30:55', '2025-10-01 11:30:55', NULL, NULL),
(5, '104', 2, 800000.00, 'AVAILABLE', 2, 'Phòng đôi view thành phố', '2025-10-01 11:30:55', '2025-10-01 11:30:55', NULL, NULL),
(6, '202', 3, 1500000.00, 'AVAILABLE', 4, 'Suite cao cấp với ban công riêng', '2025-10-01 11:30:55', '2025-10-01 11:30:55', NULL, NULL),
(9, '105', 1, 550000.00, 'AVAILABLE', 1, 'Phòng đơn tiêu chuẩn - thoáng, yên tĩnh', '2025-10-05 17:00:00', '2025-10-05 17:00:00', b'1', 'Single'),
(10, '106', 2, 850000.00, 'AVAILABLE', 2, 'Phòng đôi thiết kế hiện đại, cửa sổ lớn', '2025-10-05 17:00:00', '2025-10-05 17:00:00', b'1', 'Double'),
(11, '203', 3, 1600000.00, 'AVAILABLE', 4, 'Suite góc cao cấp với ban công và view thành phố', '2025-10-05 17:00:00', '2025-10-05 17:00:00', b'1', 'Suite'),
(12, '204', 2, 900000.00, 'AVAILABLE', 3, 'Phòng gia đình / triple, thoải mái cho 3 khách', '2025-10-05 17:00:00', '2025-10-05 17:00:00', b'1', 'Double'),
(13, '301', 3, 1850000.00, 'AVAILABLE', 4, 'Presidential suite: không gian rộng, nội thất cao cấp', '2025-10-05 17:00:00', '2025-10-05 17:00:00', b'1', 'Suite'),
(14, '302', 1, 620000.00, 'AVAILABLE', 2, 'Phòng single cao cấp có giường lớn (Queen)', '2025-10-05 17:00:00', '2025-10-05 17:00:00', b'1', 'Single');

-- --------------------------------------------------------

--
-- Table structure for table `room_amenities`
--

CREATE TABLE `room_amenities` (
  `room_id` int(11) NOT NULL,
  `amenity_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `room_amenities`
--

INSERT INTO `room_amenities` (`room_id`, `amenity_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 9),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(2, 5),
(2, 7),
(2, 9),
(3, 1),
(3, 2),
(3, 3),
(3, 4),
(3, 5),
(3, 6),
(3, 7),
(3, 9),
(3, 11),
(9, 1),
(9, 3),
(9, 9),
(10, 1),
(10, 2),
(10, 3),
(10, 4),
(10, 9),
(11, 1),
(11, 2),
(11, 3),
(11, 4),
(11, 5),
(11, 6),
(11, 9),
(12, 1),
(12, 2),
(12, 3),
(12, 5),
(13, 1),
(13, 2),
(13, 3),
(13, 4),
(13, 5),
(13, 6),
(13, 9),
(14, 1),
(14, 3),
(14, 9);

-- --------------------------------------------------------

--
-- Table structure for table `room_details`
--

CREATE TABLE `room_details` (
  `detail_id` bigint(20) NOT NULL,
  `room_id` int(11) NOT NULL,
  `size` double DEFAULT NULL,
  `bed_count` int(11) DEFAULT 1,
  `bed_type` varchar(50) DEFAULT NULL,
  `view_direction` varchar(50) DEFAULT NULL,
  `floor` int(11) DEFAULT NULL,
  `extra_info` text DEFAULT NULL,
  `air_conditioning` bit(1) DEFAULT NULL,
  `balcony` bit(1) DEFAULT NULL,
  `minibar` bit(1) DEFAULT NULL,
  `ocean_view` bit(1) DEFAULT NULL,
  `pet_friendly` bit(1) DEFAULT NULL,
  `room_size` double DEFAULT NULL,
  `smoking_allowed` bit(1) DEFAULT NULL,
  `view_type` varchar(50) DEFAULT NULL,
  `wifi_speed` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `room_details`
--

INSERT INTO `room_details` (`detail_id`, `room_id`, `size`, `bed_count`, `bed_type`, `view_direction`, `floor`, `extra_info`, `air_conditioning`, `balcony`, `minibar`, `ocean_view`, `pet_friendly`, `room_size`, `smoking_allowed`, `view_type`, `wifi_speed`) VALUES
(1, 1, NULL, 1, NULL, NULL, NULL, NULL, b'1', b'0', b'0', b'0', b'0', NULL, b'0', NULL, NULL),
(2, 2, NULL, 1, 'Double Bed', NULL, 2, NULL, b'1', b'1', b'1', b'0', b'1', 35, b'0', 'Garden View', '200Mbps'),
(3, 3, NULL, 1, 'King Bed', NULL, 3, NULL, b'1', b'1', b'1', b'1', b'1', 50, b'0', 'Ocean View', '500Mbps'),
(6, 9, 18, 1, 'Single Bed', 'North', 1, 'Tối ưu cho khách công tác', b'1', b'0', b'0', b'0', b'0', 18, b'0', 'City View', '150Mbps'),
(7, 10, 28, 1, 'Double Bed', 'East', 1, 'Phòng đôi với không gian rộng', b'1', b'1', b'1', b'0', b'0', 28, b'0', 'City View', '200Mbps'),
(8, 11, 55, 2, 'King Bed', 'South', 2, 'Suite có ban công, phòng khách riêng', b'1', b'1', b'1', b'0', b'1', 55, b'0', 'Panoramic View', '500Mbps'),
(9, 12, 35, 3, 'Twin/Triple', 'West', 2, 'Phòng gia đình tiện nghi', b'1', b'1', b'1', b'0', b'0', 35, b'0', 'Garden View', '200Mbps'),
(10, 13, 70, 2, 'King Bed', 'Ocean', 3, 'Presidential suite với phòng ăn và bếp nhỏ', b'1', b'1', b'1', b'1', b'1', 70, b'0', 'Ocean View', '800Mbps'),
(11, 14, 20, 1, 'Queen Bed', 'North-East', 3, 'Phòng single cao cấp, yên tĩnh', b'1', b'0', b'0', b'0', b'0', 20, b'0', 'City View', '150Mbps');

-- --------------------------------------------------------

--
-- Table structure for table `room_images`
--

CREATE TABLE `room_images` (
  `image_id` bigint(20) NOT NULL,
  `room_id` int(11) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `alt_text` varchar(200) DEFAULT NULL,
  `display_order` int(11) DEFAULT NULL,
  `file_size` bigint(20) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `room_images`
--

INSERT INTO `room_images` (`image_id`, `room_id`, `image_url`, `is_primary`, `uploaded_at`, `alt_text`, `display_order`, `file_size`, `mime_type`) VALUES
(2, 1, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800', 1, '2025-10-06 06:47:05', 'Bathroom phòng khách sạn', 2, NULL, NULL),
(3, 9, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 1, '2025-10-05 17:10:00', 'Phòng đơn 105 - nội thất', 1, NULL, NULL),
(4, 10, 'https://images.unsplash.com/photo-1505691723518-36a1b0b0e4c6?w=800', 1, '2025-10-05 17:10:00', 'Phòng đôi 106 - giường đôi', 1, NULL, NULL),
(5, 11, 'https://images.unsplash.com/photo-1582719478177-2a6d0d0a5f4b?w=800', 1, '2025-10-05 17:10:00', 'Suite 203 - phòng khách', 1, NULL, NULL),
(6, 12, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', 1, '2025-10-05 17:10:00', 'Phòng gia đình 204', 1, NULL, NULL),
(7, 13, 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?w=800', 1, '2025-10-05 17:10:00', 'Presidential suite 301', 1, NULL, NULL),
(8, 14, 'https://images.unsplash.com/photo-1560448077-1d8e0f6f0f9f?w=800', 1, '2025-10-05 17:10:00', 'Phòng single cao cấp 302', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `room_types`
--

CREATE TABLE `room_types` (
  `type_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `room_types`
--

INSERT INTO `room_types` (`type_id`, `name`, `description`, `created_at`) VALUES
(1, 'Single', 'Phòng đơn cho 1 người (Cập nhật 6/10)', '2025-09-27 14:28:20'),
(2, 'Double', 'Phòng đôi cho 2 người', '2025-09-27 14:28:20'),
(3, 'Suite', 'Phòng cao cấp', '2025-09-27 14:28:20');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT 1,
  `email_verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `phone`, `enabled`, `email_verified`, `created_at`, `updated_at`) VALUES
(3, 'Test User', 'test@hotelhub.com', '$2a$10$ZVmXm8AMeYb/1QfKp9nDT.LDAMyiUqxLxHSzZ.Znor7gSjuTomc32', '0987654321', 1, 1, '2025-09-28 13:06:57', '2025-09-28 13:17:52'),
(4, 'Admin', 'admin@hotelhub.com', '$2a$10$N.zmdr9k7uOCQb97AnInuO2rQjU5S5K5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y', '0123456789', 1, 1, '2025-09-28 13:07:09', '2025-09-28 13:07:09'),
(5, 'Nguyễn Văn A', 'user@example.com', '$2a$10$Umf/lkpK2KKZ/ZJ9XrEG5uKVIwHCuzTzvs7Z42ZIN9q9p0n3EW55O', NULL, 1, 0, '2025-09-28 06:08:09', '2025-09-28 06:08:09'),
(7, 'Test User 2', 'test2@hotelhub.com', '$2a$10$taMrTMYljXwcXD.RVtUFwONzLbqjlfLWf5rOeszQmv1EEDrdCsmfG', NULL, 1, 0, '2025-09-28 06:20:04', '2025-09-28 06:20:04'),
(8, 'Quang Anh', 'admin1@hotelhub.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0123456789', 1, 1, '2025-09-30 01:22:16', '2025-09-30 08:28:04'),
(10, 'Quang Anh 2', 'admin2@hotelhub.com', '$2a$10$7HaTktCxZCi80D/lVJCfseGp.oHrYOV70NCvS1K9LeRLGUKfq2hDa', NULL, 1, 0, '2025-09-30 04:59:13', '2025-09-30 04:59:13'),
(11, 'Test User 2', 'test3@hotelhub.com', '$2a$10$Sot3hprf09SD6G45cSncEeGcGcsO/dUR.5efAT0gbiz/vtAb1uZya', NULL, 1, 0, '2025-10-01 03:43:54', '2025-10-01 03:43:54'),
(12, 'User ngay 10.1', 'user1@hotelhub.com', '$2a$10$4nup.XrRktNjshcJ6LJ9IeJA9L3sdzFVAK7lW2pIkujQEFymS5LGW', NULL, 1, 0, '2025-10-01 08:12:28', '2025-10-01 08:12:28'),
(13, 'User ngay 10.4', 'user2@hotelhub.com', '$2a$10$XcIXoyPoVaepbIgx7iZQje1oEsu/X9jS3dlP2C7yfoswpdHOK5/Pa', NULL, 1, 0, '2025-10-04 08:58:40', '2025-10-04 08:58:40'),
(16, 'Phạm Chí Dũng', 'phamchidung3@gmail.com', '$2a$10$BSilLffcf.m33owQONGVeOUeOjgzj4xr/sCURTPGAQDTZ88CJSJEK', NULL, 1, 0, '2025-10-06 10:22:17', '2025-10-06 10:22:17');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`user_id`, `role_id`, `assigned_at`) VALUES
(3, 1, '2025-09-28 13:07:03'),
(4, 3, '2025-09-28 13:07:14'),
(5, 1, '2025-09-28 13:08:09'),
(7, 1, '2025-09-28 13:20:04'),
(8, 3, '2025-09-30 08:28:11'),
(10, 1, '2025-09-30 11:59:13'),
(10, 3, '2025-09-30 12:01:35'),
(11, 1, '2025-10-01 10:43:54'),
(12, 1, '2025-10-01 15:12:28'),
(13, 1, '2025-10-04 15:58:40'),
(16, 1, '2025-10-06 17:22:17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `amenities`
--
ALTER TABLE `amenities`
  ADD PRIMARY KEY (`amenity_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`booking_id`),
  ADD UNIQUE KEY `booking_reference` (`booking_reference`),
  ADD KEY `idx_bookings_user` (`user_id`),
  ADD KEY `idx_bookings_room` (`room_id`),
  ADD KEY `idx_bookings_dates` (`check_in`,`check_out`),
  ADD KEY `idx_bookings_reference` (`booking_reference`),
  ADD KEY `idx_bookings_guest_email` (`guest_email`),
  ADD KEY `idx_bookings_hold_until` (`hold_until`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `actor_id` (`actor_id`),
  ADD KEY `idx_notifications_recipient` (`recipient_id`),
  ADD KEY `idx_notifications_action` (`action`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `idx_payments_booking` (`booking_id`);

--
-- Indexes for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`token_id`),
  ADD KEY `idx_refresh_user` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`room_id`),
  ADD UNIQUE KEY `room_number` (`room_number`),
  ADD KEY `type_id` (`type_id`),
  ADD KEY `idx_rooms_status` (`status`);

--
-- Indexes for table `room_amenities`
--
ALTER TABLE `room_amenities`
  ADD PRIMARY KEY (`room_id`,`amenity_id`),
  ADD KEY `amenity_id` (`amenity_id`);

--
-- Indexes for table `room_details`
--
ALTER TABLE `room_details`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `room_images`
--
ALTER TABLE `room_images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `room_types`
--
ALTER TABLE `room_types`
  ADD PRIMARY KEY (`type_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `log_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `amenities`
--
ALTER TABLE `amenities`
  MODIFY `amenity_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `token_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `room_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `room_details`
--
ALTER TABLE `room_details`
  MODIFY `detail_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `room_images`
--
ALTER TABLE `room_images`
  MODIFY `image_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `room_types`
--
ALTER TABLE `room_types`
  MODIFY `type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`actor_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE;

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `room_types` (`type_id`);

--
-- Constraints for table `room_amenities`
--
ALTER TABLE `room_amenities`
  ADD CONSTRAINT `room_amenities_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `room_amenities_ibfk_2` FOREIGN KEY (`amenity_id`) REFERENCES `amenities` (`amenity_id`) ON DELETE CASCADE;

--
-- Constraints for table `room_details`
--
ALTER TABLE `room_details`
  ADD CONSTRAINT `room_details_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE CASCADE;

--
-- Constraints for table `room_images`
--
ALTER TABLE `room_images`
  ADD CONSTRAINT `room_images_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE CASCADE;

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
