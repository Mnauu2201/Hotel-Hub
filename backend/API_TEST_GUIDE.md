

## 1. Test API Register

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "password": "password123",
    "phone": "0123456789"
}
```

**Response thành công:**
```json
{
    "message": "Đăng ký thành công",
    "email": "user@example.com",
    "name": "Nguyễn Văn A"
}
```

**Response lỗi validation:**
```json
{
    "error": "Tên không được để trống"
}
```

## 2. Test API Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
    "email": "test@hotelhub.com",
    "password": "test123"
}
```

**Response thành công:**
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "uuid-refresh-token",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "email": "test@hotelhub.com",
    "name": "Test User",
    "roles": ["ROLE_CUSTOMER"]
}
```

**Response lỗi:**
```json
{
    "error": "Đăng nhập thất bại",
    "message": "Email hoặc mật khẩu không đúng"
}
```

## 3. Test API Refresh Token

**Endpoint:** `POST /api/auth/refresh`

**Request:**
```
POST /api/auth/refresh?refreshToken=your-refresh-token
```

## 4. Test API Logout

**Endpoint:** `POST /api/auth/logout`

**Request:**
```
POST /api/auth/logout?refreshToken=your-refresh-token
```

## 5. Test Protected Endpoint

**Endpoint:** `GET /api/test/protected`

**Headers:**
```
Authorization: Bearer your-access-token
```

## 6. Test Public Endpoint

**Endpoint:** `GET /api/test/public`

**Không cần authentication**

## Users mẫu để test:

1. **Admin:**
   - Email: `admin@hotelhub.com`
   - Password: `admin123`
   - Role: `ROLE_ADMIN`

2. **Customer:**
   - Email: `test@hotelhub.com`
   - Password: `test123`
   - Role: `ROLE_CUSTOMER`

## Cách test với Postman/Insomnia:

1. **Register:** POST `/api/auth/register` với body JSON
2. **Login:** POST `/api/auth/login` với body JSON
3. **Copy accessToken từ response**
4. **Test protected endpoint:** GET `/api/test/protected` với header `Authorization: Bearer {accessToken}`
