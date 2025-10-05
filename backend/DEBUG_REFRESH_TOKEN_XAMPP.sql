-- Script debug refresh token cho XAMPP phpMyAdmin

-- 1. Kiểm tra tất cả refresh token
SELECT 
    token_id,
    token,
    user_id,
    expires_at,
    revoked,
    created_at
FROM refresh_tokens 
ORDER BY created_at DESC;

-- 2. Kiểm tra refresh token cụ thể
SELECT 
    token_id,
    token,
    user_id,
    expires_at,
    revoked,
    created_at
FROM refresh_tokens 
WHERE token = 'ee40a727-418a-453e-9e90-90f2f2a06220';

-- 3. Kiểm tra refresh token có hết hạn không
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

-- 4. Kiểm tra refresh token có bị revoke không
SELECT 
    token,
    revoked,
    CASE 
        WHEN revoked = true THEN 'REVOKED'
        ELSE 'ACTIVE'
    END as status
FROM refresh_tokens 
WHERE token = 'ee40a727-418a-453e-9e90-90f2f2a06220';

-- 5. Kiểm tra tất cả refresh token với trạng thái
SELECT 
    token_id,
    token,
    user_id,
    expires_at,
    revoked,
    created_at,
    CASE 
        WHEN expires_at < NOW() THEN 'EXPIRED'
        WHEN revoked = true THEN 'REVOKED'
        ELSE 'VALID'
    END as status
FROM refresh_tokens 
ORDER BY created_at DESC;

-- 6. Kiểm tra refresh token của user cụ thể
SELECT 
    rt.token_id,
    rt.token,
    rt.user_id,
    rt.expires_at,
    rt.revoked,
    rt.created_at,
    u.email,
    u.name
FROM refresh_tokens rt
JOIN users u ON rt.user_id = u.user_id
WHERE u.email = 'test@hotelhub.com'
ORDER BY rt.created_at DESC;

-- 7. Xóa refresh token cũ (nếu cần)
-- DELETE FROM refresh_tokens WHERE token = 'ee40a727-418a-453e-9e90-90f2f2a06220';

-- 8. Kiểm tra cấu trúc bảng refresh_tokens
DESCRIBE refresh_tokens;

-- 9. Kiểm tra số lượng refresh token
SELECT COUNT(*) as total_tokens FROM refresh_tokens;

-- 10. Kiểm tra refresh token hết hạn
SELECT COUNT(*) as expired_tokens 
FROM refresh_tokens 
WHERE expires_at < NOW();
