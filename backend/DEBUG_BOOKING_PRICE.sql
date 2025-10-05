-- Script debug vấn đề giá tiền booking

-- 1. Kiểm tra dữ liệu phòng
SELECT 
    room_id,
    room_number,
    price,
    status,
    capacity,
    description
FROM rooms 
ORDER BY room_id;

-- 2. Kiểm tra booking mới nhất
SELECT 
    booking_id,
    booking_reference,
    room_id,
    check_in,
    check_out,
    total_price,
    status,
    created_at
FROM bookings 
ORDER BY booking_id DESC 
LIMIT 5;

-- 3. Kiểm tra giá phòng cụ thể
SELECT 
    r.room_id,
    r.room_number,
    r.price,
    r.status,
    rt.name as room_type
FROM rooms r
LEFT JOIN room_types rt ON r.type_id = rt.type_id
WHERE r.room_id = 1;

-- 4. Tính toán thủ công
-- Nếu check_in = '2025-10-10' và check_out = '2025-12-10'
-- Số đêm = 61 ngày
-- Giá = price * 61

-- 5. Cập nhật giá phòng nếu cần
UPDATE rooms 
SET price = 500000 
WHERE room_id = 1;

-- 6. Kiểm tra lại
SELECT room_id, room_number, price FROM rooms WHERE room_id = 1;

-- 7. Kiểm tra booking có total_price = 0
SELECT 
    booking_id,
    room_id,
    total_price,
    check_in,
    check_out,
    status
FROM bookings 
WHERE total_price = 0 OR total_price IS NULL
ORDER BY booking_id DESC;

