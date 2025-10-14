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
