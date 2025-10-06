-- Script SQL sửa lỗi syntax cho phpMyAdmin

-- 1. Xem tất cả booking hiện tại (không dùng alias)
SELECT 
    booking_id,
    status,
    hold_until,
    created_at,
    room_id,
    guest_name,
    guest_email
FROM bookings 
ORDER BY booking_id DESC;

-- 2. Xem phòng available
SELECT 
    room_id,
    room_number,
    status,
    price,
    capacity
FROM rooms 
WHERE status = 'available'
ORDER BY room_id;

-- 3. Xem thời gian hiện tại (không dùng alias)
    SELECT NOW();
    SELECT UTC_TIMESTAMP();

-- 4. Kiểm tra booking có thể bị cancel
SELECT 
    booking_id,
    status,
    hold_until,
    CASE 
        WHEN status = 'pending' 
        AND hold_until IS NOT NULL 
        AND hold_until < NOW() 
        THEN 'SHOULD BE CANCELLED'
        ELSE 'OK'
    END as should_cancel
FROM bookings 
WHERE status = 'pending';

-- 5. Ép booking hết hạn ngay (sửa syntax)
UPDATE bookings 
SET hold_until = DATE_SUB(NOW(), INTERVAL 1 MINUTE)
WHERE booking_id = 3 AND status = 'pending';

-- 6. Kiểm tra booking sau khi ép hết hạn
SELECT 
    booking_id,
    status,
    hold_until,
    NOW() as current_time,
    CASE 
        WHEN hold_until < NOW() THEN 'EXPIRED'
        ELSE 'VALID'
    END as status_check
FROM bookings 
WHERE booking_id = 3;


