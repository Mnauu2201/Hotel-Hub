-- CHỈ CẦN THÊM những cột thiếu - Rất ít thay đổi

-- 1. Thêm cột icon vào amenities (cho UI)
ALTER TABLE amenities 
ADD COLUMN IF NOT EXISTS icon VARCHAR(50);

-- 2. Thêm cột vào room_images (cho UI tốt hơn)
ALTER TABLE room_images 
ADD COLUMN IF NOT EXISTS alt_text VARCHAR(200),
ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;

-- 3. Thêm cột vào room_details (cho Room CRUD đầy đủ)
ALTER TABLE room_details 
ADD COLUMN IF NOT EXISTS smoking_allowed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS pet_friendly BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS wifi_speed VARCHAR(50),
ADD COLUMN IF NOT EXISTS air_conditioning BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS minibar BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS balcony BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ocean_view BOOLEAN DEFAULT FALSE;

-- 4. Cập nhật status enum (từ lowercase sang UPPERCASE)
ALTER TABLE rooms MODIFY COLUMN status ENUM('AVAILABLE', 'BOOKED', 'MAINTENANCE') DEFAULT 'AVAILABLE';
