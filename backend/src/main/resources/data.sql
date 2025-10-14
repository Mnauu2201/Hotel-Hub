-- ================================================
-- Seed data cho hệ thống HotelHub
-- ================================================

-- -------------------------
-- Roles mặc định
-- -------------------------
INSERT INTO roles (name, description) VALUES
('ROLE_CUSTOMER', 'Khách hàng mặc định'),
('ROLE_STAFF', 'Nhân viên quản lý'),
('ROLE_ADMIN', 'Quản trị hệ thống')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- -------------------------
-- User admin mặc định
-- Password: admin123 (đã hash bằng BCrypt)
-- -------------------------
INSERT INTO users (name, email, password, phone, enabled, email_verified)
VALUES ('Admin', 'admin@hotelhub.com', '$2a$10$N.zmdr9k7uOCQb97AnInuO2rQjU5S5K5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y', '0123456789', 1, 1)
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- -------------------------
-- User test mặc định
-- Password: test123 (đã hash bằng BCrypt)
-- -------------------------
INSERT INTO users (name, email, password, phone, enabled, email_verified)
VALUES ('Test User', 'test@hotelhub.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0987654321', 1, 1)
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- -------------------------
-- User staff mặc định
-- Password: staff123 (đã hash bằng BCrypt)
-- -------------------------
INSERT INTO users (name, email, password, phone, enabled, email_verified)
VALUES ('Staff User', 'staff@hotelhub.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0987654321', 1, 1)
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- -------------------------
-- Gán ROLE_ADMIN cho user admin
-- -------------------------
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.user_id, r.role_id
FROM users u, roles r
WHERE u.email = 'admin@hotelhub.com' AND r.name = 'ROLE_ADMIN';

-- -------------------------
-- Gán ROLE_CUSTOMER cho user test
-- -------------------------
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.user_id, r.role_id
FROM users u, roles r
WHERE u.email = 'test@hotelhub.com' AND r.name = 'ROLE_CUSTOMER';

-- -------------------------
-- Gán ROLE_STAFF cho user staff
-- -------------------------
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.user_id, r.role_id
FROM users u, roles r
WHERE u.email = 'staff@hotelhub.com' AND r.name = 'ROLE_STAFF';

-- -------------------------
-- Loại phòng mặc định
-- -------------------------
INSERT INTO room_types (name, description) VALUES
('Single', 'Phòng đơn cho 1 người'),
('Double', 'Phòng đôi cho 2 người'),
('Suite', 'Phòng cao cấp')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- -------------------------
-- Tiện ích mặc định
-- -------------------------
INSERT INTO amenities (name, description) VALUES
('WiFi', 'Kết nối Internet tốc độ cao'),
('Air Conditioning', 'Máy lạnh'),
('TV', 'Truyền hình cáp'),
('Mini Bar', 'Quầy bar mini')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- -------------------------
-- Phòng mẫu để test
-- -------------------------
INSERT INTO rooms (room_number, type_id, price, status, capacity, description)
VALUES
('101', (SELECT type_id FROM room_types WHERE name = 'Single'), 500000, 'available', 1, 'Phòng đơn tiện nghi cơ bản'),
('102', (SELECT type_id FROM room_types WHERE name = 'Double'), 800000, 'available', 2, 'Phòng đôi view thành phố'),
('201', (SELECT type_id FROM room_types WHERE name = 'Suite'), 1500000, 'available', 4, 'Suite cao cấp với ban công riêng')
ON DUPLICATE KEY UPDATE room_number = VALUES(room_number);

-- -------------------------
-- Mapping phòng - tiện ích (ví dụ)
-- -------------------------
INSERT IGNORE INTO room_amenities (room_id, amenity_id)
SELECT r.room_id, a.amenity_id
FROM rooms r, amenities a
WHERE r.room_number = '101' AND a.name = 'WiFi';

INSERT IGNORE INTO room_amenities (room_id, amenity_id)
SELECT r.room_id, a.amenity_id
FROM rooms r, amenities a
WHERE r.room_number = '102' AND a.name IN ('WiFi', 'TV');

INSERT IGNORE INTO room_amenities (room_id, amenity_id)
SELECT r.room_id, a.amenity_id
FROM rooms r, amenities a
WHERE r.room_number = '201' AND a.name IN ('WiFi', 'Air Conditioning', 'Mini Bar', 'TV');

-- -------------------------
-- Dữ liệu booking test để hiển thị doanh thu
-- -------------------------

-- Booking 1: Tháng 9/2025 - Đã xác nhận
INSERT INTO bookings (user_id, room_id, check_in, check_out, total_price, status, guest_name, guest_email, guest_phone, created_at, updated_at)
SELECT 
    u.user_id,
    r.room_id,
    '2025-09-15',
    '2025-09-17',
    1000000,
    'confirmed',
    'Nguyễn Văn A',
    'nguyenvana@email.com',
    '0123456789',
    '2025-09-10 10:00:00',
    '2025-09-10 10:00:00'
FROM users u, rooms r
WHERE u.email = 'test@hotelhub.com' AND r.room_number = '101';

-- Booking 2: Tháng 9/2025 - Đã thanh toán
INSERT INTO bookings (user_id, room_id, check_in, check_out, total_price, status, guest_name, guest_email, guest_phone, created_at, updated_at)
SELECT 
    u.user_id,
    r.room_id,
    '2025-09-20',
    '2025-09-22',
    1600000,
    'paid',
    'Trần Thị B',
    'tranthib@email.com',
    '0987654321',
    '2025-09-15 14:30:00',
    '2025-09-15 14:30:00'
FROM users u, rooms r
WHERE u.email = 'test@hotelhub.com' AND r.room_number = '102';

-- Booking 3: Tháng 10/2025 - Đã xác nhận
INSERT INTO bookings (user_id, room_id, check_in, check_out, total_price, status, guest_name, guest_email, guest_phone, created_at, updated_at)
SELECT 
    u.user_id,
    r.room_id,
    '2025-10-05',
    '2025-10-07',
    3000000,
    'confirmed',
    'Lê Văn C',
    'levanc@email.com',
    '0369852147',
    '2025-10-01 09:15:00',
    '2025-10-01 09:15:00'
FROM users u, rooms r
WHERE u.email = 'test@hotelhub.com' AND r.room_number = '201';

-- Booking 4: Tháng 10/2025 - Đã thanh toán
INSERT INTO bookings (user_id, room_id, check_in, check_out, total_price, status, guest_name, guest_email, guest_phone, created_at, updated_at)
SELECT 
    u.user_id,
    r.room_id,
    '2025-10-12',
    '2025-10-15',
    4500000,
    'paid',
    'Phạm Thị D',
    'phamthid@email.com',
    '0741258963',
    '2025-10-08 16:45:00',
    '2025-10-08 16:45:00'
FROM users u, rooms r
WHERE u.email = 'test@hotelhub.com' AND r.room_number = '201';

-- Booking 5: Tháng 10/2025 - Đã xác nhận (thêm doanh thu)
INSERT INTO bookings (user_id, room_id, check_in, check_out, total_price, status, guest_name, guest_email, guest_phone, created_at, updated_at)
SELECT 
    u.user_id,
    r.room_id,
    '2025-10-20',
    '2025-10-22',
    1000000,
    'confirmed',
    'Hoàng Văn E',
    'hoangvane@email.com',
    '0521478963',
    '2025-10-18 11:20:00',
    '2025-10-18 11:20:00'
FROM users u, rooms r
WHERE u.email = 'test@hotelhub.com' AND r.room_number = '101';

-- Booking 6: Tháng 10/2025 - Đã thanh toán (thêm doanh thu)
INSERT INTO bookings (user_id, room_id, check_in, check_out, total_price, status, guest_name, guest_email, guest_phone, created_at, updated_at)
SELECT 
    u.user_id,
    r.room_id,
    '2025-10-25',
    '2025-10-28',
    2400000,
    'paid',
    'Vũ Thị F',
    'vuthif@email.com',
    '0852369741',
    '2025-10-22 13:30:00',
    '2025-10-22 13:30:00'
FROM users u, rooms r
WHERE u.email = 'test@hotelhub.com' AND r.room_number = '102';

-- Booking 7: Tháng 11/2025 - Đã xác nhận (dữ liệu tương lai)
INSERT INTO bookings (user_id, room_id, check_in, check_out, total_price, status, guest_name, guest_email, guest_phone, created_at, updated_at)
SELECT 
    u.user_id,
    r.room_id,
    '2025-11-10',
    '2025-11-12',
    3000000,
    'confirmed',
    'Đặng Văn G',
    'dangvang@email.com',
    '0963258741',
    '2025-11-05 08:45:00',
    '2025-11-05 08:45:00'
FROM users u, rooms r
WHERE u.email = 'test@hotelhub.com' AND r.room_number = '201';

-- Booking 8: Tháng 12/2025 - Đã thanh toán (dữ liệu tương lai)
INSERT INTO bookings (user_id, room_id, check_in, check_out, total_price, status, guest_name, guest_email, guest_phone, created_at, updated_at)
SELECT 
    u.user_id,
    r.room_id,
    '2025-12-15',
    '2025-12-18',
    4500000,
    'paid',
    'Bùi Thị H',
    'buithih@email.com',
    '0147852963',
    '2025-12-10 15:20:00',
    '2025-12-10 15:20:00'
FROM users u, rooms r
WHERE u.email = 'test@hotelhub.com' AND r.room_number = '201';

-- -------------------------
-- Thêm booking đã hoàn thành để test doanh thu
-- -------------------------

-- Booking 9: Tháng 9/2025 - Đã hoàn thành
INSERT INTO bookings (user_id, room_id, check_in, check_out, total_price, status, guest_name, guest_email, guest_phone, created_at, updated_at)
SELECT 
    u.user_id,
    r.room_id,
    '2025-09-10',
    '2025-09-12',
    2000000,
    'completed',
    'Nguyễn Văn I',
    'nguyenvani@email.com',
    '0123456789',
    '2025-09-05 10:00:00',
    '2025-09-05 10:00:00'
FROM users u, rooms r
WHERE u.email = 'test@hotelhub.com' AND r.room_number = '101';

-- Booking 10: Tháng 10/2025 - Đã hoàn thành
INSERT INTO bookings (user_id, room_id, check_in, check_out, total_price, status, guest_name, guest_email, guest_phone, created_at, updated_at)
SELECT 
    u.user_id,
    r.room_id,
    '2025-10-01',
    '2025-10-03',
    3500000,
    'completed',
    'Trần Thị J',
    'tranthij@email.com',
    '0987654321',
    '2025-09-25 14:30:00',
    '2025-09-25 14:30:00'
FROM users u, rooms r
WHERE u.email = 'test@hotelhub.com' AND r.room_number = '102';

-- Booking 11: Tháng 10/2025 - Đã hoàn thành
INSERT INTO bookings (user_id, room_id, check_in, check_out, total_price, status, guest_name, guest_email, guest_phone, created_at, updated_at)
SELECT 
    u.user_id,
    r.room_id,
    '2025-10-08',
    '2025-10-10',
    5000000,
    'completed',
    'Lê Văn K',
    'levank@email.com',
    '0369852147',
    '2025-10-01 09:15:00',
    '2025-10-01 09:15:00'
FROM users u, rooms r
WHERE u.email = 'test@hotelhub.com' AND r.room_number = '201';

