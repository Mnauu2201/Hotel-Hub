-- Script cập nhật schema hiện tại - Chỉ cần chạy những phần này

-- 1. Cập nhật bảng amenities (thêm cột icon)
ALTER TABLE amenities 
ADD COLUMN IF NOT EXISTS icon VARCHAR(50);

-- 2. Cập nhật bảng room_images (thêm các cột mới)
ALTER TABLE room_images 
ADD COLUMN IF NOT EXISTS alt_text VARCHAR(200),
ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS file_size BIGINT,
ADD COLUMN IF NOT EXISTS mime_type VARCHAR(100);

-- 3. Cập nhật bảng room_details (thêm các cột mới)
ALTER TABLE room_details 
ADD COLUMN IF NOT EXISTS smoking_allowed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS pet_friendly BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS wifi_speed VARCHAR(50),
ADD COLUMN IF NOT EXISTS air_conditioning BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS minibar BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS balcony BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ocean_view BOOLEAN DEFAULT FALSE;

-- 4. Cập nhật bảng rooms (thêm các cột mới)
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- 5. Cập nhật cột price từ DECIMAL sang DECIMAL(10,2) (nếu cần)
ALTER TABLE rooms MODIFY COLUMN price DECIMAL(10,2);

-- 6. Cập nhật cột status từ ENUM sang ENUM mới
ALTER TABLE rooms MODIFY COLUMN status ENUM('AVAILABLE', 'BOOKED', 'MAINTENANCE') DEFAULT 'AVAILABLE';

