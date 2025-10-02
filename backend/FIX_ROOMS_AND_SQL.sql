-- Script sửa lỗi rooms và SQL syntax

-- 1. Kiểm tra dữ liệu rooms hiện tại
SELECT * FROM rooms;

-- 2. Nếu không có dữ liệu, tạo rooms mẫu
INSERT INTO rooms (room_number, type_id, price, status, capacity, description)
VALUES
('101', 1, 500000, 'available', 1, 'Phòng đơn tiện nghi cơ bản'),
('102', 2, 800000, 'available', 2, 'Phòng đôi view thành phố'),
('201', 3, 1500000, 'available', 4, 'Suite cao cấp với ban công riêng')
ON DUPLICATE KEY UPDATE room_number = VALUES(room_number);

-- 3. Kiểm tra room_types
SELECT * FROM room_types;

-- 4. Nếu không có room_types, tạo mẫu
INSERT INTO room_types (name, description) VALUES
('Single', 'Phòng đơn cho 1 người'),
('Double', 'Phòng đôi cho 2 người'),
('Suite', 'Phòng cao cấp')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 5. Xem phòng available (không dùng alias)
SELECT 
    room_id,
    room_number,
    status,
    price,
    capacity
FROM rooms 
WHERE status = 'available'
ORDER BY room_id;

-- 6. Xem booking hiện tại (không dùng alias)
SELECT 
    booking_id,
    status,
    hold_until,
    created_at
FROM bookings 
ORDER BY booking_id DESC;

-- 7. Ép booking hết hạn (sửa syntax)
UPDATE bookings 
SET hold_until = DATE_SUB(NOW(), INTERVAL 1 MINUTE)
WHERE booking_id = 3 AND status = 'pending';

-- 8. Kiểm tra booking sau khi ép (không dùng alias)
SELECT 
    booking_id,
    status,
    hold_until,
    NOW()
FROM bookings 
WHERE booking_id = 3;

-- 9. Test cancel trực tiếp
UPDATE bookings 
SET status = 'cancelled' 
WHERE status = 'pending' 
AND hold_until IS NOT NULL 
AND hold_until < NOW();

-- 10. Kiểm tra kết quả
SELECT booking_id, status, hold_until FROM bookings WHERE booking_id = 3;



