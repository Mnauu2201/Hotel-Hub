# 🔍 Debug Logout và RefreshToken - 403 Error

## Vấn đề hiện tại
- API logout và refresh token trả về 403 Forbidden
- Có thể do: API endpoint sai, refresh token hết hạn, hoặc bị revoke

## Bước 1: Kiểm tra API Endpoints

### 1.1 API Refresh Token (đã sửa)
```bash
POST http://localhost:8080/api/auth/refresh
Content-Type: application/json

{
    "refreshToken": "ee40a727-418a-453e-9e90-90f2f2a06220"
}
```

### 1.2 API Logout (đã sửa)
```bash
POST http://localhost:8080/api/auth/logout
Content-Type: application/json

{
    "refreshToken": "ee40a727-418a-453e-9e90-90f2f2a06220"
}
```

## Bước 2: Kiểm tra Refresh Token trong Database

### 2.1 Chạy script SQL:
```sql
-- Kiểm tra refresh token
SELECT 
    token_id,
    token,
    user_id,
    expires_at,
    revoked,
    created_at
FROM refresh_tokens 
WHERE token = 'ee40a727-418a-453e-9e90-90f2f2a06220';
```

### 2.2 Kiểm tra trạng thái:
```sql
-- Kiểm tra hết hạn
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

-- Kiểm tra revoke
SELECT 
    token,
    revoked,
    CASE 
        WHEN revoked = true THEN 'REVOKED'
        ELSE 'ACTIVE'
    END as status
FROM refresh_tokens 
WHERE token = 'ee40a727-418a-453e-9e90-90f2f2a06220';
```

## Bước 3: Test với Refresh Token Mới

### 3.1 Login để lấy refresh token mới:
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
    "email": "test@hotelhub.com",
    "password": "test123"
}
```

### 3.2 Copy refresh token mới từ response
### 3.3 Test refresh token:
```bash
POST http://localhost:8080/api/auth/refresh
Content-Type: application/json

{
    "refreshToken": "NEW_REFRESH_TOKEN_HERE"
}
```

### 3.4 Test logout:
```bash
POST http://localhost:8080/api/auth/logout
Content-Type: application/json

{
    "refreshToken": "NEW_REFRESH_TOKEN_HERE"
}
```

## Bước 4: Debug Common Issues

### 4.1 Nếu refresh token hết hạn:
```sql
-- Kiểm tra thời gian hết hạn
SELECT 
    token,
    expires_at,
    NOW() as current_time,
    TIMESTAMPDIFF(MINUTE, NOW(), expires_at) as minutes_remaining
FROM refresh_tokens 
WHERE token = 'ee40a727-418a-453e-9e90-90f2f2a06220';
```

### 4.2 Nếu refresh token bị revoke:
```sql
-- Kiểm tra trạng thái revoke
SELECT 
    token,
    revoked,
    created_at
FROM refresh_tokens 
WHERE token = 'ee40a727-418a-453e-9e90-90f2f2a06220';
```

### 4.3 Nếu refresh token không tồn tại:
```sql
-- Kiểm tra tất cả refresh token
SELECT 
    token_id,
    token,
    user_id,
    expires_at,
    revoked
FROM refresh_tokens 
ORDER BY created_at DESC;
```

## Bước 5: Sửa lỗi nếu cần

### 5.1 Nếu refresh token hết hạn:
- Login lại để lấy refresh token mới
- Hoặc tạo refresh token mới trong database

### 5.2 Nếu refresh token bị revoke:
- Login lại để lấy refresh token mới
- Hoặc unrevoke token trong database

### 5.3 Nếu refresh token không tồn tại:
- Login lại để tạo refresh token mới
- Kiểm tra user có tồn tại không

## Bước 6: Test lại

### 6.1 Login để lấy tokens mới
### 6.2 Test refresh token
### 6.3 Test logout
### 6.4 Kiểm tra kết quả

## Kết quả mong đợi

### Refresh Token:
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "ee40a727-418a-453e-9e90-90f2f2a06220",
    "tokenType": "Bearer",
    "expiresIn": 3600
}
```

### Logout:
```json
{
    "message": "Đăng xuất thành công"
}
```

## Lưu ý quan trọng

1. **Refresh token có thời hạn** (thường 7 ngày)
2. **Refresh token bị revoke** sau khi logout
3. **Cần login lại** để lấy refresh token mới
4. **Kiểm tra database** để debug vấn đề
5. **API đã được sửa** để nhận JSON body thay vì request param
