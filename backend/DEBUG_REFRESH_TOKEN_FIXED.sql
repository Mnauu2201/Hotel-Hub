-- Script debug refresh token cho XAMPP phpMyAdmin (đã sửa)

-- 1. Kiểm tra cấu trúc bảng refresh_tokens
DESCRIBE refresh_tokens;

-- 2. Kiểm tra tất cả refresh token (không có created_at)
SELECT 
    token_id,
    token,
    user_id,
    expires_at,
    revoked
FROM refresh_tokens 
ORDER BY token_id DESC;

-- 3. Kiểm tra refresh token cụ thể
SELECT 
    token_id,
    token,
    user_id,
    expires_at,
    revoked
FROM refresh_tokens 
WHERE token = 'ee40a727-418a-453e-9e90-90f2f2a06220';

-- 4. Kiểm tra refresh token có hết hạn không
SELECT 
    token,
    expires_at,
    NOW() as current_time,
    CASE 
        WHEN expires_at < NOW() THEN 'EXPIRED'
        ELSE 'VALID'
    END as status
FROM refresh_tokens 
WHERE token = 'ee40a727-418a-453e-9e90-90f2f2a06220';

-- 5. Kiểm tra refresh token có bị revoke không
SELECT 
    token,
    revoked,
    CASE 
        WHEN revoked = true THEN 'REVOKED'
        ELSE 'ACTIVE'
    END as status
FROM refresh_tokens 
WHERE token = 'ee40a727-418a-453e-9e90-90f2f2a06220';

-- 6. Kiểm tra tất cả refresh token với trạng thái
SELECT 
    token_id,
    token,
    user_id,
    expires_at,
    revoked,
    CASE 
        WHEN expires_at < NOW() THEN 'EXPIRED'
        WHEN revoked = true THEN 'REVOKED'
        ELSE 'VALID'
    END as status
FROM refresh_tokens 
ORDER BY token_id DESC;

-- 7. Kiểm tra refresh token của user cụ thể
SELECT 
    rt.token_id,
    rt.token,
    rt.user_id,
    rt.expires_at,
    rt.revoked,
    u.email,
    u.name
FROM refresh_tokens rt
JOIN users u ON rt.user_id = u.user_id
WHERE u.email = 'test@hotelhub.com'
ORDER BY rt.token_id DESC;

-- 8. Kiểm tra số lượng refresh token
SELECT COUNT(*) as total_tokens FROM refresh_tokens;

-- 9. Kiểm tra refresh token hết hạn
SELECT COUNT(*) as expired_tokens 
FROM refresh_tokens 
WHERE expires_at < NOW();

-- 10. Kiểm tra refresh token active
SELECT COUNT(*) as active_tokens 
FROM refresh_tokens 
WHERE expires_at > NOW() AND revoked = false;

-- 11. Xem tất cả refresh token với thông tin user
SELECT 
    rt.token_id,
    rt.token,
    rt.user_id,
    rt.expires_at,
    rt.revoked,
    u.email,
    u.name,
    CASE 
        WHEN rt.expires_at < NOW() THEN 'EXPIRED'
        WHEN rt.revoked = true THEN 'REVOKED'
        ELSE 'VALID'
    END as status
FROM refresh_tokens rt
JOIN users u ON rt.user_id = u.user_id
ORDER BY rt.token_id DESC;
