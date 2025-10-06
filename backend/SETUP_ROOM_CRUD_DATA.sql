-- Script setup dữ liệu Room CRUD - Chạy từng phần một

-- 1. Thêm cột mới vào bảng rooms (nếu chưa có)
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- 2. Cập nhật cột price từ DOUBLE sang DECIMAL
ALTER TABLE rooms MODIFY COLUMN price DECIMAL(10,2);

-- 3. Cập nhật cột status từ VARCHAR sang ENUM
ALTER TABLE rooms MODIFY COLUMN status ENUM('AVAILABLE', 'BOOKED', 'MAINTENANCE') DEFAULT 'AVAILABLE';

-- 4. Thêm dữ liệu amenities
INSERT INTO amenities (name, description, icon) VALUES
('WiFi', 'Miễn phí WiFi tốc độ cao', 'wifi'),
('TV', 'TV màn hình phẳng 55 inch', 'tv'),
('Air Conditioning', 'Điều hòa không khí', 'ac'),
('Minibar', 'Tủ lạnh mini', 'minibar'),
('Balcony', 'Ban công riêng', 'balcony'),
('Ocean View', 'View biển', 'ocean'),
('Pet Friendly', 'Cho phép thú cưng', 'pet'),
('Smoking Allowed', 'Cho phép hút thuốc', 'smoking'),
('Room Service', 'Dịch vụ phòng 24/7', 'service'),
('Safe', 'Két sắt an toàn', 'safe');

-- 5. Cập nhật dữ liệu rooms hiện tại
UPDATE rooms SET 
    price = 500000,
    status = 'AVAILABLE',
    capacity = 1,
    description = 'Phòng đơn tiện nghi cơ bản với đầy đủ tiện nghi'
WHERE room_id = 1;

UPDATE rooms SET 
    price = 800000,
    status = 'AVAILABLE',
    capacity = 2,
    description = 'Phòng đôi tiện nghi cao cấp với view đẹp'
WHERE room_id = 2;

UPDATE rooms SET 
    price = 1200000,
    status = 'AVAILABLE',
    capacity = 4,
    description = 'Phòng suite sang trọng với đầy đủ tiện nghi cao cấp'
WHERE room_id = 3;