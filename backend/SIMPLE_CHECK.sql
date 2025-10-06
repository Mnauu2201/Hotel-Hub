-- Script đơn giản để kiểm tra dữ liệu

-- 1. Kiểm tra rooms
SELECT * FROM rooms;

-- 2. Kiểm tra room_types
SELECT * FROM room_types;

-- 3. Kiểm tra bookings
SELECT * FROM bookings;

-- 4. Xem phòng available (không dùng alias)
SELECT 
    room_id,
    room_number,
    status,
    price,
    capacity
FROM rooms 
WHERE status = 'available';

-- 5. Xem booking pending
SELECT 
    booking_id,
    status,
    hold_until,
    created_at
FROM bookings 
WHERE status = 'pending';

-- 6. Ép booking hết hạn
UPDATE bookings 
SET hold_until = DATE_SUB(NOW(), INTERVAL 1 MINUTE)
WHERE booking_id = 3 AND status = 'pending';

-- 7. Kiểm tra sau khi ép
SELECT 
    booking_id,
    status,
    hold_until,
    NOW()
FROM bookings 
WHERE booking_id = 3;

-- 8. Cancel booking trực tiếp
UPDATE bookings 
SET status = 'cancelled' 
WHERE booking_id = 3 AND status = 'pending';

-- 9. Kiểm tra kết quả
SELECT booking_id, status FROM bookings WHERE booking_id = 3;



