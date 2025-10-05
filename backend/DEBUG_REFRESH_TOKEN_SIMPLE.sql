-- Script debug refresh token đơn giản cho XAMPP phpMyAdmin

-- 1. Kiểm tra cấu trúc bảng refresh_tokens
DESCRIBE refresh_tokens;

-- 2. Kiểm tra tất cả refresh token
SELECT 
    token_id,
    token,
    user_id,
    expires_at,
    revoked
FROM refresh_tokens 
ORDER BY token_id DESC;

-- 3. Kiểm tra refresh token cụ thể (token của bạn)
SELECT 
    token_id,
    token,
    user_id,
    expires_at,
    revoked
FROM refresh_tokens 
WHERE token = 'afcd0c60-ef6b-4908-a368-212ee01f1188';

-- 4. Kiểm tra refresh token có hết hạn không (đơn giản)
SELECT 
    token,
    expires_at,
    NOW() as current_time
FROM refresh_tokens 
WHERE token = 'afcd0c60-ef6b-4908-a368-212ee01f1188';

-- 5. Kiểm tra refresh token có bị revoke không
SELECT 
    token,
    revoked
FROM refresh_tokens 
WHERE token = 'afcd0c60-ef6b-4908-a368-212ee01f1188';

-- 6. Kiểm tra tất cả refresh token với thông tin user
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
ORDER BY rt.token_id DESC;

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
WHERE expires_at > NOW() AND revoked = 0;
