-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 16, 2025 lúc 07:22 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `hotel_booking`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `activity_logs`
--

CREATE TABLE `activity_logs` (
  `log_id` bigint(20) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `detail` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `activity_logs`
--

INSERT INTO `activity_logs` (`log_id`, `user_id`, `action`, `detail`, `created_at`) VALUES
(1, 10, 'ADMIN_UPDATE_BOOKING_STATUS', 'Admin updated booking BK1759075796835A08174 from cancelled to confirmed', '2025-10-06 22:59:59'),
(2, 10, 'ADMIN_CANCEL_BOOKING', 'Admin cancelled booking BK1759075796835A08174. Reason: Customer request', '2025-10-06 23:00:07'),
(3, 10, 'ADD_ROLE_TO_USER', 'Thêm role ROLE_STAFF cho user teststaff@hotelhub.com (User ID: 14)', '2025-10-07 23:08:45'),
(4, 10, 'REMOVE_ROLE_FROM_USER', 'Xóa role ROLE_CUSTOMER khỏi user teststaff@hotelhub.com (User ID: 14)', '2025-10-07 23:09:01'),
(5, 10, 'UPDATE_USER_ROLES', 'Cập nhật roles cho user teststaff@hotelhub.com (User ID: 14, Old: ROLE_STAFF, New: ROLE_STAFF, ROLE_CUSTOMER)', '2025-10-07 23:09:13'),
(6, 10, 'UPDATE_USER_ROLES', 'Cập nhật roles cho user teststaff@hotelhub.com (User ID: 14, Old: ROLE_STAFF, ROLE_CUSTOMER, New: ROLE_STAFF)', '2025-10-07 23:09:23'),
(7, 14, 'ADMIN_UPDATE_BOOKING_STATUS', 'Admin updated booking BK1759075796835A08174 from cancelled to confirmed', '2025-10-07 23:15:05'),
(8, NULL, 'CREATE_GUEST_BOOKING', 'Guest booking created: BK1759905224514FF8E23 for room 4 from 2025-10-10 to 2025-10-13', '2025-10-07 23:33:44'),
(9, NULL, 'CREATE_GUEST_PAYMENT', 'Guest payment created for booking BK1759075796835A08174 with amount 1000000.00 using method CREDIT_CARD', '2025-10-09 19:54:30'),
(10, NULL, 'CREATE_GUEST_PAYMENT', 'Guest payment created for booking BK1760065159493E7A57A with amount 1800000 using method CREDIT_CARD', '2025-10-09 20:00:45'),
(11, NULL, 'PROCESS_GUEST_PAYMENT', 'Guest payment 2 processed with result: success', '2025-10-09 20:14:34'),
(12, NULL, 'CREATE_GUEST_PAYMENT', 'Guest payment created for booking BK17600766466513719EB with amount 4500000 using method momo', '2025-10-09 23:13:06'),
(13, NULL, 'CREATE_GUEST_BOOKING', 'Guest booking created: BK176007718412846F044 for room 4 from 2025-10-11 to 2025-10-13', '2025-10-09 23:19:44'),
(14, NULL, 'CREATE_GUEST_BOOKING', 'Guest booking created: BK1760077546309D9FEFC for room 4 from 2025-10-11 to 2025-10-13', '2025-10-09 23:25:46'),
(15, 15, 'CREATE_PAYMENT', 'Payment created for booking BK1760077546309D9FEFC with amount 1000000 using method momo', '2025-10-09 23:25:55'),
(16, 10, 'PROCESS_PAYMENT', 'Payment 4 processed with result: success', '2025-10-09 23:27:25'),
(17, NULL, 'CREATE_GUEST_PAYMENT', 'Guest payment created for booking BK1760077864887511B79 with amount 4500000 using method cash', '2025-10-09 23:32:10'),
(18, NULL, 'PROCESS_GUEST_PAYMENT', 'Guest payment 5 processed with result: success', '2025-10-09 23:36:25'),
(19, NULL, 'CREATE_GUEST_PAYMENT', 'Guest payment created for booking BK1760078783091D1506C with amount 4500000 using method credit_card', '2025-10-09 23:47:38'),
(20, NULL, 'PROCESS_GUEST_PAYMENT', 'Guest payment 6 processed with result: success', '2025-10-09 23:48:26'),
(21, NULL, 'CREATE_GUEST_BOOKING', 'Guest booking created: BK1760079000169F2510F for room 4 from 2025-12-28 to 2025-12-31', '2025-10-09 23:50:00'),
(22, NULL, 'CREATE_GUEST_BOOKING', 'Guest booking created: BK176007933482160A076 for room 4 from 2025-12-28 to 2025-12-31', '2025-10-09 23:55:34'),
(23, NULL, 'CREATE_GUEST_BOOKING', 'Guest booking created: BK1760079503061329779 for room 6 from 2025-12-28 to 2025-12-31', '2025-10-09 23:58:23'),
(24, 10, 'CREATE_PAYMENT', 'Payment created for booking BK1760079503061329779 with amount 4500000 using method momo', '2025-10-09 23:58:55'),
(25, 10, 'PROCESS_PAYMENT', 'Payment 7 processed with result: success', '2025-10-10 00:00:44'),
(26, NULL, 'CREATE_GUEST_PAYMENT', 'Guest payment created for booking BK17600917811862C5F50 with amount 1200000 using method momo', '2025-10-10 03:26:33'),
(27, NULL, 'PROCESS_GUEST_PAYMENT', 'Guest payment 8 processed with result: success', '2025-10-10 03:27:38'),
(28, NULL, 'CREATE_GUEST_BOOKING', 'Guest booking created: BK176016287290262537D for room 1 from 2025-10-15 to 2025-10-18', '2025-10-10 23:07:52'),
(29, 15, 'CREATE_USER_BOOKING', 'User booking created: BK17601628998369D9F44 for room 6 from 2025-12-28 to 2025-12-31', '2025-10-10 23:08:19'),
(30, NULL, 'CREATE_GUEST_PAYMENT', 'Guest payment created for booking BK176016287290262537D with amount 1800000 using method momo', '2025-10-10 23:10:08'),
(31, NULL, 'CREATE_PAYMENT', 'Payment created for booking BK17601628998369D9F44 with amount 4500000 using method momo by user: admin2@hotelhub.com', '2025-10-10 23:10:14'),
(32, 10, 'PAYMENT_FAILED', 'Payment 10: PAYMENT_FAILED - Amount: 4500000.00, Method: momo', '2025-10-10 23:11:19'),
(33, NULL, 'PROCESS_GUEST_PAYMENT', 'Guest payment 9 processed with result: success', '2025-10-10 23:11:30'),
(34, 18, 'CREATE_USER_BOOKING', 'User booking created: BK176016749415790DEE4 for room 1 from 2025-10-12 to 2025-10-15', '2025-10-11 00:24:54'),
(35, 14, 'CREATE_USER_BOOKING', 'User booking created: BK1760167770626978FB8 for room 1 from 2025-10-15 to 2025-10-16', '2025-10-11 00:29:30'),
(36, NULL, 'CREATE_GUEST_BOOKING', 'Guest booking created: BK1760169729140BC96F3 for room 9 from 2025-10-12 to 2025-10-15', '2025-10-11 01:02:09'),
(37, NULL, 'ADMIN_UPDATE_BOOKING_STATUS', 'Admin updated booking BK1760169729140BC96F3 from confirmed to cancelled by admin: admin2@hotelhub.com', '2025-10-13 00:29:36'),
(38, NULL, 'ADMIN_UPDATE_BOOKING_STATUS', 'Admin updated booking BK1760169729140BC96F3 from cancelled to cancelled by admin: admin2@hotelhub.com', '2025-10-13 00:36:16'),
(39, NULL, 'ADMIN_UPDATE_BOOKING_STATUS', 'Admin updated booking BK1760169729140BC96F3 from cancelled to cancelled by admin: admin2@hotelhub.com', '2025-10-13 00:36:57'),
(40, NULL, 'ADMIN_UPDATE_BOOKING_STATUS', 'Admin updated booking BK1760169729140BC96F3 from cancelled to confirmed by admin: admin2@hotelhub.com', '2025-10-13 00:37:02'),
(41, NULL, 'ADMIN_UPDATE_BOOKING_STATUS', 'Admin updated booking BK1760169729140BC96F3 from confirmed to pending by admin: admin2@hotelhub.com', '2025-10-13 00:37:06'),
(42, NULL, 'ADMIN_UPDATE_BOOKING_STATUS', 'Admin updated booking BK1760169729140BC96F3 from pending to refunded by admin: admin2@hotelhub.com', '2025-10-13 00:38:20'),
(43, NULL, 'ADMIN_UPDATE_BOOKING_STATUS', 'Admin updated booking BK1760169729140BC96F3 from refunded to pending by admin: admin2@hotelhub.com', '2025-10-13 00:38:43'),
(44, NULL, 'ADMIN_UPDATE_BOOKING_STATUS', 'Admin updated booking BK1760169729140BC96F3 from pending to refunded by admin: admin2@hotelhub.com', '2025-10-13 00:38:58'),
(45, NULL, 'ADMIN_UPDATE_BOOKING_STATUS', 'Admin updated booking BK1760169729140BC96F3 from refunded to refunded by admin: admin2@hotelhub.com', '2025-10-13 01:40:04'),
(46, NULL, 'VIEW_USERS', 'Admin đã xem danh sách tất cả người dùng', '2025-10-13 09:43:01'),
(47, NULL, 'VIEW_USERS', 'Admin đã xem danh sách tất cả người dùng', '2025-10-13 09:43:37'),
(48, NULL, 'VIEW_USERS', 'Admin đã xem danh sách tất cả người dùng', '2025-10-13 09:43:37'),
(49, NULL, 'TOGGLE_USER_STATUS', 'Admin đã khóa user: teststaff@hotelhub.com', '2025-10-13 09:44:10'),
(50, NULL, 'TOGGLE_USER_STATUS', 'Admin đã mở khóa user: teststaff@hotelhub.com', '2025-10-13 09:44:20'),
(51, NULL, 'TOGGLE_USER_STATUS', 'Admin đã khóa user: testphone@hotelhub.com', '2025-10-13 09:44:27'),
(52, NULL, 'TOGGLE_USER_STATUS', 'Admin đã mở khóa user: testphone@hotelhub.com', '2025-10-13 09:44:36'),
(53, NULL, 'DELETE_USER', 'Admin đã xóa user: admin@hotelhub.com', '2025-10-13 09:44:53'),
(54, NULL, 'VIEW_USERS', 'Admin đã xem danh sách tất cả người dùng', '2025-10-13 09:46:38'),
(55, NULL, 'CREATE_GUEST_BOOKING', 'Guest booking created: BK17604599919049365 for room 1 from 2025-10-15 to 2025-10-16', '2025-10-14 09:39:51'),
(56, NULL, 'CREATE_GUEST_BOOKING', 'Guest booking created: BK17604987635765127 for room 1 from 2025-10-16 to 2025-10-17', '2025-10-14 20:26:03'),
(59, NULL, 'CREATE_GUEST_BOOKING', 'Guest booking created: BK17605160096022491 for room 1 from 2025-10-16 to 2025-10-17', '2025-10-15 01:13:29'),
(60, NULL, 'CREATE_GUEST_BOOKING', 'Guest booking created: BK17605178083722255 for room 1 from 2025-10-16 to 2025-10-17', '2025-10-15 01:43:28'),
(61, NULL, 'ADMIN_UPDATE_BOOKING_STATUS', 'Admin updated booking BK17605178083722255 from completed to confirmed by admin: admin2@hotelhub.com', '2025-10-15 01:44:56'),
(62, NULL, 'CREATE_GUEST_BOOKING', 'Guest booking created: BK17605181136654433 for room 1 from 2025-10-16 to 2025-10-17', '2025-10-15 01:48:33'),
(63, NULL, 'CREATE_GUEST_BOOKING', 'Guest booking created: BK176059082737783BAF0 for room 1 from 2025-10-17 to 2025-10-20', '2025-10-15 22:00:27'),
(64, NULL, 'CREATE_GUEST_BOOKING', 'Guest booking created: BK1760591763512E56F51 for room 1 from 2025-10-17 to 2025-10-20', '2025-10-15 22:16:03');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `amenities`
--

CREATE TABLE `amenities` (
  `amenity_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `amenities`
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
(9, 'Safe', 'Két sắt an toàn', 'safe');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bookings`
--

CREATE TABLE `bookings` (
  `booking_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `room_id` int(11) NOT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `guests` int(11) DEFAULT 1,
  `notes` text DEFAULT NULL,
  `total_price` decimal(12,2) DEFAULT NULL,
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
-- Đang đổ dữ liệu cho bảng `bookings`
--

INSERT INTO `bookings` (`booking_id`, `user_id`, `room_id`, `check_in`, `check_out`, `guests`, `notes`, `total_price`, `status`, `created_at`, `updated_at`, `guest_email`, `guest_name`, `guest_phone`, `hold_until`, `booking_reference`) VALUES
(1, NULL, 1, '2025-12-01', '2025-12-03', 2, 'Yêu cầu phòng tầng cao siêu cao', 1000000.00, 'confirmed', '2025-09-28 09:09:56', '2025-10-07 23:15:05', 'guest@example.com', 'Nguyễn Văn A', '0123456789', NULL, 'BK1759075796835A08174'),
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
(14, 11, 4, '2025-10-10', '2025-10-13', 2, NULL, 1500000.00, 'cancelled', '2025-10-04 09:00:29', '2025-10-04 16:05:35', NULL, NULL, NULL, '2025-10-04 16:05:29.000000', 'BK17595936295077261AC'),
(15, NULL, 1, '2025-10-10', '2025-10-12', 2, 'Test booking pending', 1000000.00, 'cancelled', '2025-10-08 06:19:29', '2025-10-09 03:06:21', 'test@example.com', 'Nguyễn Văn Test', '0123456789', '2025-10-08 13:24:29.000000', 'BK_TEST_PENDING_001'),
(16, NULL, 2, '2025-10-15', '2025-10-17', 1, 'Test booking confirmed', 800000.00, 'confirmed', '2025-10-08 06:19:40', '2025-10-08 06:19:40', 'test2@example.com', 'Trần Thị Test', '0987654321', NULL, 'BK_TEST_CONFIRMED_001'),
(17, NULL, 3, '2025-10-20', '2025-10-22', 3, 'Test booking cancelled', 1200000.00, 'cancelled', '2025-10-08 06:19:50', '2025-10-08 06:19:50', 'test3@example.com', 'Lê Văn Test', '0369852147', NULL, 'BK_TEST_CANCELLED_001'),
(18, 14, 4, '2025-10-10', '2025-10-13', 2, NULL, 1500000.00, 'cancelled', '2025-10-07 23:33:44', '2025-10-08 06:39:06', NULL, NULL, NULL, '2025-10-08 06:38:44.000000', 'BK1759905224514FF8E23'),
(19, NULL, 1, '2025-10-08', '2025-10-10', 2, 'Test booking hôm nay', 1000000.00, 'confirmed', '2025-10-08 06:40:34', '2025-10-08 06:40:34', 'today@example.com', 'Nguyễn Văn Hôm Nay', '0123456789', NULL, 'BK_TODAY_TEST_001'),
(20, NULL, 1, '2025-12-17', '2025-12-20', 2, 'Test booking for debug 10/10/25', 1800000.00, 'paid', '2025-10-09 19:59:19', '2025-10-09 20:14:34', 'testpayment@example.com', 'Debug Guest', '0123456789', '2025-10-10 03:04:19.000000', 'BK1760065159493E7A57A'),
(21, NULL, 6, '2025-12-25', '2025-12-28', 2, 'Đặt phòng cho kỳ nghỉ lễ', 4500000.00, 'cancelled', '2025-10-09 23:10:46', '2025-10-10 06:16:11', '10.10@hotelhub.com', 'Nguyen Van A', '0123456789', '2025-10-10 06:15:46.000000', 'BK17600766466513719EB'),
(22, 15, 4, '2025-10-11', '2025-10-13', 2, NULL, 1000000.00, 'cancelled', '2025-10-09 23:19:44', '2025-10-10 06:24:59', NULL, NULL, NULL, '2025-10-10 06:24:44.000000', 'BK176007718412846F044'),
(23, 15, 4, '2025-10-11', '2025-10-13', 2, NULL, 1000000.00, 'paid', '2025-10-09 23:25:46', '2025-10-09 23:27:25', NULL, NULL, NULL, '2025-10-10 06:30:46.000000', 'BK1760077546309D9FEFC'),
(24, NULL, 6, '2025-12-25', '2025-12-28', 2, 'Đặt phòng cho kỳ nghỉ lễ', 4500000.00, 'paid', '2025-10-09 23:31:04', '2025-10-09 23:36:25', '110.10@hotelhub.com', 'Nguyen Van A', '0123456789', '2025-10-10 06:36:04.000000', 'BK1760077864887511B79'),
(25, NULL, 6, '2025-12-28', '2025-12-31', 2, 'Đặt phòng cho kỳ nghỉ lễ', 4500000.00, 'paid', '2025-10-09 23:46:23', '2025-10-09 23:48:26', '210.10@hotelhub.com', 'Nguyen Van A', '0123456789', '2025-10-10 06:51:23.000000', 'BK1760078783091D1506C'),
(26, 15, 4, '2025-12-28', '2025-12-31', 2, NULL, 1500000.00, 'cancelled', '2025-10-09 23:50:00', '2025-10-10 06:55:28', NULL, NULL, NULL, '2025-10-10 06:55:00.000000', 'BK1760079000169F2510F'),
(27, 15, 4, '2025-12-28', '2025-12-31', 10, NULL, 1500000.00, 'cancelled', '2025-10-09 23:55:34', '2025-10-10 07:00:53', NULL, NULL, NULL, '2025-10-10 07:00:34.000000', 'BK176007933482160A076'),
(28, 15, 6, '2025-10-12', '2025-10-13', 10, NULL, 4500000.00, 'paid', '2025-10-09 23:58:23', '2025-10-14 05:41:28', NULL, NULL, NULL, '2025-10-10 07:03:23.000000', 'BK1760079503061329779'),
(29, NULL, 1, '2025-10-11', '2025-10-13', 2, NULL, 1200000.00, 'cancelled', '2025-10-10 01:04:51', '2025-10-10 08:09:58', 'test@hotelhub.com', 'Test booking', '0123456789', '2025-10-10 08:09:51.000000', 'BK1760083491375D0E7E8'),
(30, NULL, 1, '2025-10-11', '2025-10-13', 2, NULL, 1200000.00, 'cancelled', '2025-10-10 01:20:59', '2025-10-10 08:26:16', 'test@hotelhub.com', 'Test booking', '0123456789', '2025-10-10 08:25:58.000000', 'BK176008445899705AD16'),
(31, NULL, 1, '2025-10-11', '2025-10-13', 2, NULL, 1200000.00, 'cancelled', '2025-10-10 01:28:42', '2025-10-10 08:33:49', 'test@hotelhub.com', 'Test booking', '0123456789', '2025-10-10 08:33:42.000000', 'BK17600849222278BEA30'),
(32, NULL, 1, '2025-10-11', '2025-10-13', 2, NULL, 1200000.00, 'paid', '2025-10-10 03:23:01', '2025-10-10 03:27:38', 'test@hotelhub.com', 'Test booking', '0123456789', '2025-10-10 10:28:01.000000', 'BK17600917811862C5F50'),
(33, NULL, 1, '2025-10-15', '2025-10-18', 2, NULL, 1800000.00, 'paid', '2025-10-10 23:07:52', '2025-10-10 23:11:30', 'test@hotelhub.com', 'Test booking', '0123456789', '2025-10-11 06:12:52.000000', 'BK176016287290262537D'),
(34, 15, 6, '2025-12-28', '2025-12-31', 10, NULL, 4500000.00, 'cancelled', '2025-10-10 23:08:19', '2025-10-11 06:13:21', NULL, NULL, NULL, '2025-10-11 06:13:19.000000', 'BK17601628998369D9F44'),
(35, 18, 1, '2025-10-12', '2025-10-15', 2, 'cho bố cái địa chỉ', 1800000.00, 'cancelled', '2025-10-11 00:24:54', '2025-10-11 07:30:03', NULL, NULL, NULL, '2025-10-11 07:29:54.000000', 'BK176016749415790DEE4'),
(36, 14, 1, '2025-10-15', '2025-10-16', 2, 'cho bố mày cái địa chỉ 2', 600000.00, 'cancelled', '2025-10-11 00:29:30', '2025-10-11 07:34:39', NULL, NULL, NULL, '2025-10-11 07:34:30.000000', 'BK1760167770626978FB8'),
(37, NULL, 9, '2025-10-12', '2025-10-12', 2, '11/10/2025', 3000000.00, 'refunded', '2025-10-11 01:02:09', '2025-10-13 00:38:58', 'quangt2234@gmail.com', 'Quang ANh', '01122334455', NULL, 'BK1760169729140BC96F3'),
(38, NULL, 1, '2025-10-15', '2025-10-16', 2, 'aloaloaloaloaloaloaloaloalo', 600000.00, 'cancelled', '2025-10-14 09:39:51', '2025-10-14 09:43:17', 'quan1234@hotelhub.com', 'Nguyễn 14/10', '0011223344', '2025-10-15 16:39:51.000000', 'BK17604599919049365'),
(39, NULL, 1, '2025-10-16', '2025-10-17', 2, 'không có gì', 600000.00, 'cancelled', '2025-10-14 20:26:03', '2025-10-15 03:36:28', 'quangt2234@gmail.com', 'Ngyn Qu A', '0123456789', '2025-10-15 03:36:03.000000', 'BK17604987635765127'),
(42, NULL, 1, '2025-10-16', '2025-10-15', 1, 'ỵtỵtỵ', 600000.00, 'completed', '2025-10-15 01:13:29', '2025-10-15 01:42:40', 'quangt2234@gmail.com', 'Nguyn Quan Ah', '0112233400', '2025-10-15 08:23:29.000000', 'BK17605160096022491'),
(43, NULL, 1, '2025-10-16', '2025-10-17', 1, 'dsa', 600000.00, 'completed', '2025-10-15 01:43:28', '2025-10-15 01:45:09', 'asdf@gmail.com', 'Nguyn Quan Ah', '0123456789', NULL, 'BK17605178083722255'),
(44, NULL, 1, '2025-10-16', '2025-10-17', 1, 'ád', 600000.00, 'cancelled', '2025-10-15 01:48:33', '2025-10-15 08:58:34', 'asdf@gmail.com', 'Nguyn Quan Ah', '0123456789', '2025-10-15 08:58:33.000000', 'BK17605181136654433'),
(45, NULL, 1, '2025-10-17', '2025-10-20', 2, NULL, 1800000.00, 'cancelled', '2025-10-15 22:00:27', '2025-10-16 05:05:57', 'test16/10@hotelhub.com', 'Test booking', '0123456789', '2025-10-16 05:05:27.000000', 'BK176059082737783BAF0'),
(46, NULL, 1, '2025-10-17', '2025-10-20', 3, NULL, 1800000.00, 'pending', '2025-10-15 22:16:03', '2025-10-15 22:16:03', 'test16/10@hotelhub.com', 'Test booking', '0123456789', '2025-10-16 05:21:03.000000', 'BK1760591763512E56F51');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
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

--
-- Đang đổ dữ liệu cho bảng `notifications`
--

INSERT INTO `notifications` (`notification_id`, `recipient_id`, `actor_id`, `action`, `message`, `url`, `is_read`, `created_at`) VALUES
(2, 10, NULL, 'PAYMENT_FAILED', 'Payment 10: PAYMENT_FAILED - Amount: 4500000.00, Method: momo', '/payments/10', 0, '2025-10-10 23:11:19'),
(3, 18, NULL, 'BOOKING_CREATED', 'Booking BK176016749415790DEE4: BOOKING_CREATED for room 101 (2025-10-12 to 2025-10-15)', '/bookings/BK176016749415790DEE4', 1, '2025-10-11 00:24:54'),
(4, 14, NULL, 'BOOKING_CREATED', 'Booking BK1760167770626978FB8: BOOKING_CREATED for room 101 (2025-10-15 to 2025-10-16)', '/bookings/BK1760167770626978FB8', 1, '2025-10-11 00:29:30');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(255) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `used` bit(1) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payments`
--

CREATE TABLE `payments` (
  `payment_id` bigint(20) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `method` enum('credit_card','paypal','momo','cash') NOT NULL,
  `status` enum('pending','success','failed') DEFAULT 'pending',
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `notes` text DEFAULT NULL,
  `payment_method` enum('BANK_TRANSFER','CASH','CREDIT_CARD','DEBIT_CARD','E_WALLET') NOT NULL,
  `processed_at` datetime(6) DEFAULT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `processed_by` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `payments`
--

INSERT INTO `payments` (`payment_id`, `booking_id`, `amount`, `method`, `status`, `paid_at`, `created_at`, `notes`, `payment_method`, `processed_at`, `transaction_id`, `updated_at`, `processed_by`) VALUES
(1, 1, 1000000.00, 'credit_card', 'pending', NULL, '2025-10-09 19:54:30', NULL, 'BANK_TRANSFER', NULL, NULL, NULL, NULL),
(2, 20, 1800000.00, 'credit_card', 'success', '2025-10-09 20:14:34', '2025-10-09 20:00:45', NULL, 'BANK_TRANSFER', NULL, NULL, NULL, NULL),
(3, 21, 4500000.00, 'momo', 'pending', NULL, '2025-10-09 23:13:06', NULL, 'BANK_TRANSFER', NULL, NULL, NULL, NULL),
(4, 23, 1000000.00, 'momo', 'success', '2025-10-09 23:27:25', '2025-10-09 23:25:55', NULL, 'BANK_TRANSFER', NULL, NULL, NULL, NULL),
(5, 24, 4500000.00, 'cash', 'success', '2025-10-09 23:36:25', '2025-10-09 23:32:10', NULL, 'BANK_TRANSFER', NULL, NULL, NULL, NULL),
(6, 25, 4500000.00, 'credit_card', 'success', '2025-10-09 23:48:26', '2025-10-09 23:47:38', NULL, 'BANK_TRANSFER', NULL, NULL, NULL, NULL),
(7, 28, 4500000.00, 'momo', 'success', '2025-10-10 00:00:44', '2025-10-09 23:58:55', NULL, 'BANK_TRANSFER', NULL, NULL, NULL, NULL),
(8, 32, 1200000.00, 'momo', 'success', '2025-10-10 03:27:38', '2025-10-10 03:26:33', NULL, 'BANK_TRANSFER', NULL, NULL, NULL, NULL),
(9, 33, 1800000.00, 'momo', 'success', '2025-10-10 23:11:30', '2025-10-10 23:10:08', NULL, 'BANK_TRANSFER', NULL, NULL, NULL, NULL),
(10, 34, 4500000.00, 'momo', 'failed', NULL, '2025-10-10 23:10:14', NULL, 'BANK_TRANSFER', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `refresh_tokens`
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
-- Đang đổ dữ liệu cho bảng `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`token_id`, `user_id`, `token`, `issued_at`, `expires_at`, `revoked`, `ip_address`, `user_agent`) VALUES
(2, 8, 'afcd0c60-ef6b-4908-a368-212ee01f1188', '2025-09-30 08:22:47', '2025-10-07 08:22:47', 1, NULL, NULL),
(6, 7, '0c8f30aa-c98b-4e6a-a8a8-282e0efaf6df', '2025-10-01 10:32:18', '2025-10-08 10:32:18', 0, NULL, NULL),
(23, 12, 'a6f32ceb-c488-456e-bcac-1c96363056d8', '2025-10-04 13:41:30', '2025-10-11 13:41:30', 0, NULL, NULL),
(25, 11, '4d3d4db1-2354-479a-97a1-d81e5c23fea0', '2025-10-04 15:59:03', '2025-10-11 15:59:03', 1, NULL, NULL),
(45, 17, '319964bc-1908-4ea2-af5e-b6274267404c', '2025-10-09 10:37:57', '2025-10-16 10:37:57', 0, NULL, NULL),
(65, 18, '0e2f8431-9e3b-4c3d-837f-4f81d59864a2', '2025-10-11 07:13:32', '2025-10-18 07:13:32', 1, NULL, NULL),
(68, 19, '558f1533-4333-4a8e-84d1-73b8f854e68a', '2025-10-11 08:09:15', '2025-10-18 08:09:15', 0, NULL, NULL),
(106, 15, '78e640c2-bd5c-4392-b3c6-7949fead35d1', '2025-10-15 03:24:41', '2025-10-22 03:24:41', 0, NULL, NULL),
(111, 14, '230283b1-e974-479f-ad15-8eaa11af21c0', '2025-10-16 03:47:58', '2025-10-23 03:47:58', 0, NULL, NULL),
(114, 10, 'e29d111c-d1a7-458c-8000-9f67f940dac1', '2025-10-16 04:44:49', '2025-10-23 04:44:49', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `roles`
--

INSERT INTO `roles` (`role_id`, `name`, `description`, `created_at`) VALUES
(1, 'ROLE_CUSTOMER', 'Khách hàng mặc định', '2025-09-27 14:28:20'),
(2, 'ROLE_STAFF', 'Nhân viên quản lý', '2025-09-27 14:28:20'),
(3, 'ROLE_ADMIN', 'Quản trị hệ thống', '2025-09-27 14:28:20');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_id` bigint(20) NOT NULL,
  `permission` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rooms`
--

CREATE TABLE `rooms` (
  `room_id` int(11) NOT NULL,
  `room_number` varchar(20) NOT NULL,
  `type_id` int(11) NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `capacity` int(11) DEFAULT 1,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `available` bit(1) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `rooms`
--

INSERT INTO `rooms` (`room_id`, `room_number`, `type_id`, `price`, `status`, `capacity`, `description`, `created_at`, `updated_at`, `available`, `type`) VALUES
(1, '101', 1, 600000.00, 'AVAILABLE', 2, NULL, '2025-09-28 15:46:47', '2025-10-15 01:58:34', b'1', NULL),
(2, '102', 1, 800000.00, 'AVAILABLE', 2, NULL, '2025-09-28 15:46:47', '2025-10-13 04:26:12', b'1', NULL),
(3, '201', 1, 1200000.00, 'AVAILABLE', 4, NULL, '2025-09-28 15:46:47', '2025-10-13 04:26:15', b'1', NULL),
(4, '103', 1, 500000.00, 'AVAILABLE', 1, 'Phòng đơn tiện nghi cơ bản', '2025-10-01 11:30:55', '2025-10-01 11:30:55', NULL, NULL),
(5, '104', 2, 800000.00, 'AVAILABLE', 2, 'Phòng đôi view thành phố', '2025-10-01 11:30:55', '2025-10-01 11:30:55', NULL, NULL),
(6, '202', 1, 1500000.00, 'LOCKED', 4, NULL, '2025-10-01 11:30:55', '2025-10-13 04:40:54', NULL, NULL),
(9, '501', 1, 1000000.00, 'LOCKED', 2, 'Phòng test mới 11/10', '2025-10-11 00:34:26', '2025-10-11 01:02:09', NULL, NULL),
(10, '502', 1, 800000.00, 'AVAILABLE', 4, NULL, '2025-10-13 04:31:48', '2025-10-13 04:31:48', NULL, NULL),
(13, '503', 1, 10000000000.00, 'AVAILABLE', 5, NULL, '2025-10-15 21:54:21', '2025-10-15 21:54:21', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `room_amenities`
--

CREATE TABLE `room_amenities` (
  `room_id` int(11) NOT NULL,
  `amenity_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `room_amenities`
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
(6, 1),
(6, 2),
(6, 3),
(6, 4),
(6, 5),
(6, 6),
(6, 7),
(6, 8),
(6, 9),
(9, 1),
(9, 2),
(9, 3),
(10, 1),
(10, 2),
(10, 3),
(10, 4),
(13, 1),
(13, 2),
(13, 3),
(13, 4),
(13, 8),
(13, 9);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `room_details`
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
-- Đang đổ dữ liệu cho bảng `room_details`
--

INSERT INTO `room_details` (`detail_id`, `room_id`, `size`, `bed_count`, `bed_type`, `view_direction`, `floor`, `extra_info`, `air_conditioning`, `balcony`, `minibar`, `ocean_view`, `pet_friendly`, `room_size`, `smoking_allowed`, `view_type`, `wifi_speed`) VALUES
(1, 1, NULL, 1, NULL, NULL, NULL, NULL, b'1', b'0', b'0', b'0', b'0', NULL, b'0', NULL, NULL),
(2, 2, NULL, 1, NULL, NULL, NULL, NULL, b'1', b'0', b'0', b'0', b'0', NULL, b'0', NULL, NULL),
(3, 3, NULL, 1, NULL, NULL, NULL, NULL, b'1', b'0', b'0', b'0', b'0', NULL, b'0', NULL, NULL),
(6, 9, NULL, 1, NULL, NULL, NULL, NULL, b'1', b'0', b'0', b'0', b'0', NULL, b'0', NULL, NULL),
(7, 10, NULL, 1, NULL, NULL, NULL, NULL, b'1', b'0', b'0', b'0', b'0', NULL, b'0', NULL, NULL),
(8, 6, NULL, 1, NULL, NULL, NULL, NULL, b'1', b'0', b'0', b'0', b'0', NULL, b'0', NULL, NULL),
(11, 13, NULL, 1, NULL, NULL, NULL, NULL, b'1', b'0', b'0', b'0', b'0', NULL, b'0', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `room_images`
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
-- Đang đổ dữ liệu cho bảng `room_images`
--

INSERT INTO `room_images` (`image_id`, `room_id`, `image_url`, `is_primary`, `uploaded_at`, `alt_text`, `display_order`, `file_size`, `mime_type`) VALUES
(2, 1, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800', 1, '2025-10-06 06:47:05', 'Bathroom phòng khách sạn', 2, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `room_types`
--

CREATE TABLE `room_types` (
  `type_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `room_types`
--

INSERT INTO `room_types` (`type_id`, `name`, `description`, `created_at`) VALUES
(1, 'Single', 'Phòng đơn cho 1 người (Cập nhật 6/10)', '2025-09-27 14:28:20'),
(2, 'Double', 'Phòng đôi cho 2 người', '2025-09-27 14:28:20'),
(3, 'Suite', 'Phòng cao cấp', '2025-09-27 14:28:20'),
(6, 'Deluxe', 'Phòng cao cấp với đầy đủ tiện nghi', '2025-10-11 00:33:24');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
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
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `phone`, `enabled`, `email_verified`, `created_at`, `updated_at`) VALUES
(3, 'Test User', 'test@hotelhub.com', '$2a$10$ZVmXm8AMeYb/1QfKp9nDT.LDAMyiUqxLxHSzZ.Znor7gSjuTomc32', '0987654321', 1, 1, '2025-09-28 13:06:57', '2025-09-28 13:17:52'),
(5, 'Nguyễn Văn A', 'user@example.com', '$2a$10$Umf/lkpK2KKZ/ZJ9XrEG5uKVIwHCuzTzvs7Z42ZIN9q9p0n3EW55O', NULL, 1, 0, '2025-09-28 06:08:09', '2025-09-28 06:08:09'),
(7, 'Test User 2', 'test2@hotelhub.com', '$2a$10$taMrTMYljXwcXD.RVtUFwONzLbqjlfLWf5rOeszQmv1EEDrdCsmfG', NULL, 1, 0, '2025-09-28 06:20:04', '2025-09-28 06:20:04'),
(8, 'Quang Anh', 'admin1@hotelhub.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0123456789', 1, 1, '2025-09-30 01:22:16', '2025-09-30 08:28:04'),
(10, 'Quang Anh 2', 'admin2@hotelhub.com', '$2a$10$7HaTktCxZCi80D/lVJCfseGp.oHrYOV70NCvS1K9LeRLGUKfq2hDa', NULL, 1, 0, '2025-09-30 04:59:13', '2025-09-30 04:59:13'),
(11, 'Test User 2', 'test3@hotelhub.com', '$2a$10$Sot3hprf09SD6G45cSncEeGcGcsO/dUR.5efAT0gbiz/vtAb1uZya', NULL, 1, 0, '2025-10-01 03:43:54', '2025-10-01 03:43:54'),
(12, 'User ngay 10.1', 'user1@hotelhub.com', '$2a$10$4nup.XrRktNjshcJ6LJ9IeJA9L3sdzFVAK7lW2pIkujQEFymS5LGW', NULL, 1, 0, '2025-10-01 08:12:28', '2025-10-01 08:12:28'),
(13, 'User ngay 10.4', 'user2@hotelhub.com', '$2a$10$XcIXoyPoVaepbIgx7iZQje1oEsu/X9jS3dlP2C7yfoswpdHOK5/Pa', NULL, 1, 0, '2025-10-04 08:58:40', '2025-10-04 08:58:40'),
(14, 'aloalo', 'teststaff@hotelhub.com', '$2a$10$7jEqzX6YZSsmlA.O9vNYVuYbe57JkUiErWX40NZ1x7qNNfWpNAApm', '0123456788', 1, 0, '2025-10-07 23:05:46', '2025-10-15 20:48:32'),
(15, 'test dữ liệu phone 8/10', 'testphone@hotelhub.com', '$2a$10$jyZ5rrqIjJ6LZM0bgMci5OVLBCfWKe3LpMe4cdec2veTwa.AWp1W2', '0987654322', 1, 0, '2025-10-07 23:35:53', '2025-10-13 21:30:58'),
(17, 'test dữ liệu 9/10', 'ngaychinthangmuoi@hotelhub.com', '$2a$10$pXEwWOlxYaYQPlKtUgntnuEMb59.idLY/38KOKDU8ZOynWb8j2Cfe', '0987654321', 1, 0, '2025-10-08 19:52:11', '2025-10-08 19:52:11'),
(18, 'Nguyên Quang Anh', 'quangt2234@gmail.com', '$2a$10$cALpn7wgGJvXvjtLQOUWcuTAfOiTbLOsyaEO7ut.0QogvWKxEYo0e', '0123456789', 1, 0, '2025-10-11 00:12:01', '2025-10-11 00:12:01'),
(19, 'QA', 'anhtrinhciutb2@gmail.com', '$2a$10$zI1e3HzuW6tXDo7nOD8PZOY5VsapfIZwr127npV7Bs2wSS5im3Hq.', '0123456789', 1, 0, '2025-10-11 01:08:41', '2025-10-13 05:52:40'),
(20, 'Quang Anh', 'nibicob928@gta5hx.com', '$2a$10$ITKP.ad2W8YAlbXPFZx2guQClZ9yuBiGwgqK3HGC4ZaHXbBlZ.ihe', '0987654322', 1, 0, '2025-10-15 20:50:34', '2025-10-15 20:50:34');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `user_roles`
--

INSERT INTO `user_roles` (`user_id`, `role_id`, `assigned_at`) VALUES
(3, 1, '2025-09-28 13:07:03'),
(5, 1, '2025-09-28 13:08:09'),
(7, 1, '2025-09-28 13:20:04'),
(8, 3, '2025-09-30 08:28:11'),
(10, 1, '2025-09-30 11:59:13'),
(10, 3, '2025-09-30 12:01:35'),
(11, 1, '2025-10-01 10:43:54'),
(12, 1, '2025-10-01 15:12:28'),
(13, 1, '2025-10-04 15:58:40'),
(14, 2, '2025-10-08 06:08:45'),
(15, 1, '2025-10-08 06:35:53'),
(17, 1, '2025-10-08 19:52:11'),
(18, 1, '2025-10-11 07:12:01'),
(19, 1, '2025-10-11 08:08:41'),
(20, 1, '2025-10-16 03:50:34');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `amenities`
--
ALTER TABLE `amenities`
  ADD PRIMARY KEY (`amenity_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Chỉ mục cho bảng `bookings`
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
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `actor_id` (`actor_id`),
  ADD KEY `idx_notifications_recipient` (`recipient_id`),
  ADD KEY `idx_notifications_action` (`action`);

--
-- Chỉ mục cho bảng `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `idx_payments_booking` (`booking_id`);

--
-- Chỉ mục cho bảng `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`token_id`),
  ADD KEY `idx_refresh_user` (`user_id`);

--
-- Chỉ mục cho bảng `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Chỉ mục cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`room_id`),
  ADD UNIQUE KEY `room_number` (`room_number`),
  ADD KEY `type_id` (`type_id`),
  ADD KEY `idx_rooms_status` (`status`);

--
-- Chỉ mục cho bảng `room_amenities`
--
ALTER TABLE `room_amenities`
  ADD PRIMARY KEY (`room_id`,`amenity_id`),
  ADD KEY `amenity_id` (`amenity_id`);

--
-- Chỉ mục cho bảng `room_details`
--
ALTER TABLE `room_details`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Chỉ mục cho bảng `room_images`
--
ALTER TABLE `room_images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Chỉ mục cho bảng `room_types`
--
ALTER TABLE `room_types`
  ADD PRIMARY KEY (`type_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`);

--
-- Chỉ mục cho bảng `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `log_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT cho bảng `amenities`
--
ALTER TABLE `amenities`
  MODIFY `amenity_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `bookings`
--
ALTER TABLE `bookings`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `token_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

--
-- AUTO_INCREMENT cho bảng `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `rooms`
--
ALTER TABLE `rooms`
  MODIFY `room_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `room_details`
--
ALTER TABLE `room_details`
  MODIFY `detail_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `room_images`
--
ALTER TABLE `room_images`
  MODIFY `image_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `room_types`
--
ALTER TABLE `room_types`
  MODIFY `type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`);

--
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`actor_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `room_types` (`type_id`);

--
-- Các ràng buộc cho bảng `room_amenities`
--
ALTER TABLE `room_amenities`
  ADD CONSTRAINT `room_amenities_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `room_amenities_ibfk_2` FOREIGN KEY (`amenity_id`) REFERENCES `amenities` (`amenity_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `room_details`
--
ALTER TABLE `room_details`
  ADD CONSTRAINT `room_details_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `room_images`
--
ALTER TABLE `room_images`
  ADD CONSTRAINT `room_images_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- Loại bỏ các trường dư thừa không sử dụng tới
-- Trong bảng rooms:
ALTER TABLE rooms DROP COLUMN available;
ALTER TABLE rooms DROP COLUMN type;

-- Trong bảng room_details:
ALTER TABLE room_details DROP COLUMN size;
ALTER TABLE room_details DROP COLUMN view_direction;
ALTER TABLE room_details DROP COLUMN bed_type;
ALTER TABLE room_details DROP COLUMN floor;
ALTER TABLE room_details DROP COLUMN extra_info;
ALTER TABLE room_details DROP COLUMN wifi_speed;