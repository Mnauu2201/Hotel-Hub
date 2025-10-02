-- Script tạo dữ liệu rooms và test APIs

-- 1. Tạo room_types nếu chưa có
INSERT IGNORE INTO room_types (name, description) VALUES
('Single', 'Phòng đơn cho 1 người'),
('Double', 'Phòng đôi cho 2 người'),
('Suite', 'Phòng cao cấp');

-- 2. Tạo rooms nếu chưa có
INSERT IGNORE INTO rooms (room_number, type_id, price, status, capacity, description)
VALUES
('101', 1, 500000, 'available', 1, 'Phòng đơn tiện nghi cơ bản'),
('102', 2, 800000, 'available', 2, 'Phòng đôi view thành phố'),
('201', 3, 1500000, 'available', 4, 'Suite cao cấp với ban công riêng');

-- 3. Kiểm tra dữ liệu đã tạo
SELECT 
    r.room_id,
    r.room_number,
    rt.name as room_type,
    r.price,
    r.status,
    r.capacity,
    r.description
FROM rooms r
LEFT JOIN room_types rt ON r.type_id = rt.type_id
ORDER BY r.room_id;

-- 4. Kiểm tra bookings hiện tại
SELECT 
    booking_id,
    status,
    room_id,
    guest_name,
    user_id
FROM bookings 
ORDER BY booking_id DESC;
