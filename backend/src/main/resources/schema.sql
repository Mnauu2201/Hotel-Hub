-- Tạo database
CREATE DATABASE IF NOT EXISTS hotel_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hotel_booking;

-- -------------------------
-- Bảng roles (quyền)
-- -------------------------
CREATE TABLE IF NOT EXISTS roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE, -- e.g. ROLE_CUSTOMER, ROLE_STAFF, ROLE_ADMIN
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------
-- Bảng users (người dùng & nhân viên)
-- -------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- lưu bcrypt hash
    phone VARCHAR(30),
    enabled TINYINT(1) DEFAULT 1, -- account active?
    email_verified TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
);

-- -------------------------
-- Mapping user <-> roles (N:M)
-- -------------------------
CREATE TABLE IF NOT EXISTS user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
);

-- -------------------------
-- Refresh tokens (JWT refresh)
-- -------------------------
CREATE TABLE IF NOT EXISTS refresh_tokens (
    token_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(512) NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    revoked TINYINT(1) DEFAULT 0,
    ip_address VARCHAR(45),
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_refresh_user (user_id)
);


-- -------------------------
-- Bảng room_types (loại phòng) → tách riêng để dễ mở rộng
-- -------------------------
CREATE TABLE IF NOT EXISTS room_types (
    type_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,  -- e.g. Single, Double, Suite
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------
-- Bảng rooms (phòng khách sạn)
-- -------------------------
CREATE TABLE IF NOT EXISTS rooms (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(20) UNIQUE NOT NULL,
    type_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status ENUM('available','booked','maintenance') DEFAULT 'available',
    capacity INT DEFAULT 1, -- số người tối đa
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (type_id) REFERENCES room_types(type_id),
    INDEX idx_rooms_status (status)
);

-- -------------------------
-- Bảng bookings (đơn đặt phòng)
-- -------------------------
CREATE TABLE IF NOT EXISTS bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INT DEFAULT 1,
    notes TEXT,
    total_price DECIMAL(12,2) NOT NULL,
    status ENUM('pending','confirmed','cancelled','paid') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE RESTRICT,
    INDEX idx_bookings_user (user_id),
    INDEX idx_bookings_room (room_id),
    INDEX idx_bookings_dates (check_in, check_out)
);

-- -------------------------
-- Bảng payments (thanh toán)
-- -------------------------
CREATE TABLE IF NOT EXISTS payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    method ENUM('credit_card','paypal','momo','cash') NOT NULL,
    status ENUM('pending','success','failed') DEFAULT 'pending',
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    INDEX idx_payments_booking (booking_id)
);

-- -------------------------
-- Activity log (ghi lại thao tác admin/staff)
-- -------------------------
CREATE TABLE IF NOT EXISTS activity_logs (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL, -- ai thao tác (null nếu system)
    action VARCHAR(100) NOT NULL, -- e.g. "CREATE_ROOM", "CANCEL_BOOKING"
    detail TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Bảng amenities (danh mục tiện ích)
-- -------------------------
CREATE TABLE IF NOT EXISTS amenities (
    amenity_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,  -- e.g. Wifi, Air Conditioning, TV
    description TEXT
);

-- -------------------------
-- Mapping room <-> amenities (N:M)
-- -------------------------
CREATE TABLE IF NOT EXISTS room_amenities (
    room_id INT NOT NULL,
    amenity_id INT NOT NULL,
    PRIMARY KEY (room_id, amenity_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(amenity_id) ON DELETE CASCADE
);

-- -------------------------
-- Bảng room_images (ảnh phòng)
-- -------------------------
CREATE TABLE IF NOT EXISTS room_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary TINYINT(1) DEFAULT 0, -- 1 = ảnh chính
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
);

-- -------------------------
-- Bảng room_details (chi tiết phòng)
-- -------------------------
CREATE TABLE IF NOT EXISTS room_details (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    size DOUBLE,                  -- diện tích phòng (m2)
    bed_count INT DEFAULT 1,      -- số giường
    bed_type VARCHAR(50),         -- loại giường (Queen, King, Twin)
    view_direction VARCHAR(50),   -- hướng phòng (sea view, city view…)
    floor INT,                    -- tầng
    extra_info TEXT,              -- thông tin thêm
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipient_id INT NOT NULL,                  -- ai nhận thông báo (user, staff, admin)
    actor_id INT NULL,                          -- ai thực hiện hành động (người gây ra thông báo)
    action VARCHAR(100) NOT NULL,               -- loại hành động: CREATE_BOOKING, PAYMENT_SUCCESS...
    message TEXT NOT NULL,                      -- nội dung hiển thị
    url VARCHAR(255) NULL,                      -- link để redirect (vd: /bookings/123)
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_notifications_recipient (recipient_id),
    INDEX idx_notifications_action (action)
);

-- Thêm bảng lưu token xác thực email
CREATE TABLE IF NOT EXISTS email_verification_tokens (
    token_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    verified_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id)
);

-- -------------------------
-- Seed: thêm vài role mặc định
-- -------------------------
INSERT IGNORE INTO roles (name, description)
VALUES
('ROLE_CUSTOMER', 'Khách hàng mặc định'),
('ROLE_STAFF', 'Nhân viên quản lý'),
('ROLE_ADMIN', 'Quản trị hệ thống');

-- Seed: thêm loại phòng cơ bản
INSERT IGNORE INTO room_types (name, description)
VALUES
('Single', 'Phòng đơn cho 1 người'),
('Double', 'Phòng đôi cho 2 người'),
('Suite', 'Phòng cao cấp');