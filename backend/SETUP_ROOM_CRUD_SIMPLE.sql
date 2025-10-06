-- Script setup Room CRUD - Chạy từng phần một

-- 1. Tạo bảng amenities
CREATE TABLE IF NOT EXISTS amenities (
    amenity_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50)
);

-- 2. Tạo bảng room_details
CREATE TABLE IF NOT EXISTS room_details (
    detail_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    bed_type VARCHAR(50),
    room_size DOUBLE,
    floor INT,
    view_type VARCHAR(50),
    smoking_allowed BOOLEAN DEFAULT FALSE,
    pet_friendly BOOLEAN DEFAULT FALSE,
    wifi_speed VARCHAR(50),
    air_conditioning BOOLEAN DEFAULT TRUE,
    minibar BOOLEAN DEFAULT FALSE,
    balcony BOOLEAN DEFAULT FALSE,
    ocean_view BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
);

-- 3. Tạo bảng room_images
CREATE TABLE IF NOT EXISTS room_images (
    image_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(200),
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    file_size BIGINT,
    mime_type VARCHAR(100),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
);

-- 4. Tạo bảng room_amenities (N:M relationship)
CREATE TABLE IF NOT EXISTS room_amenities (
    room_id BIGINT NOT NULL,
    amenity_id BIGINT NOT NULL,
    PRIMARY KEY (room_id, amenity_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(amenity_id) ON DELETE CASCADE
);

