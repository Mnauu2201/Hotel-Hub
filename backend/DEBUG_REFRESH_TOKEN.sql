-- Script debug refresh token

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

-- 5. Tạo refresh token mới nếu cần
-- (Chỉ chạy nếu cần thiết)
-- INSERT INTO refresh_tokens (token, user_id, expires_at, revoked) 
-- VALUES ('new-token-here', 1, DATE_ADD(NOW(), INTERVAL 7 DAY), false);
