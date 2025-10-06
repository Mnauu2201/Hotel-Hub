# Test API Step by Step - Debug Issues

## 🎯 **Mục tiêu:**
Debug và sửa tất cả lỗi API đã báo cáo.

---

## 🔑 **BƯỚC 1: TEST AUTHENTICATION**

### **1.1. Login User:**
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
    "email": "test@hotelhub.com",
    "password": "test123"
}
```

**Kết quả mong đợi:**
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "...",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "email": "test@hotelhub.com",
    "name": "Test User",
    "roles": ["ROLE_CUSTOMER"]
}
```

**📝 Lưu lại access token này!**

### **1.2. Login Admin:**
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
    "email": "admin1@hotelhub.com",
    "password": "123123123"
}
```

**📝 Lưu lại admin access token này!**

---

## 🏠 **BƯỚC 2: TEST GUEST BOOKING (Sửa lỗi Request Body)**

### **2.1. Test Guest Booking:**
```bash
POST http://localhost:8080/api/bookings/guest
Content-Type: application/json

{
    "roomId": 1,
    "checkIn": "2025-12-01",
    "checkOut": "2025-12-03",
    "guests": 2,
    "notes": "Test booking for debug",
    "guestName": "Debug Guest",
    "guestEmail": "debug@example.com",
    "guestPhone": "0123456789"
}
```

**Kết quả mong đợi:**
```json
{
    "message": "Tạo booking thành công",
    "booking": {
        "bookingId": 1,
        "bookingReference": "BK...",
        "status": "pending",
        ...
    }
}
```

**Nếu lỗi "Required request body is missing":**
- Kiểm tra Content-Type: application/json
- Kiểm tra JSON format
- Kiểm tra tất cả required fields

---

## 👤 **BƯỚC 3: TEST USER BOOKING APIs (Sửa lỗi 403)**

**Sử dụng access token từ BƯỚC 1.1**

### **3.1. Test xem tất cả booking của user:**
```bash
GET http://localhost:8080/api/bookings
Authorization: Bearer YOUR_USER_ACCESS_TOKEN
```

**Kết quả mong đợi:**
```json
{
    "bookings": [...],
    "count": 0
}
```

**Nếu lỗi 403:**
- Kiểm tra access token có đúng không
- Kiểm tra token chưa hết hạn
- Kiểm tra user có role ROLE_CUSTOMER không

### **3.2. Test xem chi tiết booking:**
```bash
GET http://localhost:8080/api/bookings/user/7
Authorization: Bearer YOUR_USER_ACCESS_TOKEN
```

**Kết quả mong đợi:**
```json
{
    "bookingId": 7,
    "status": "pending",
    ...
}
```

**Nếu lỗi 403:**
- Kiểm tra booking ID 7 có tồn tại không
- Kiểm tra booking có thuộc về user không
- Kiểm tra access token

### **3.3. Test hủy booking:**
```bash
PUT http://localhost:8080/api/bookings/user/7/cancel
Authorization: Bearer YOUR_USER_ACCESS_TOKEN
```

**Kết quả mong đợi:**
```json
{
    "message": "Hủy booking thành công",
    "booking": {
        "bookingId": 7,
        "status": "cancelled",
        ...
    }
}
```

---

## 👨‍💼 **BƯỚC 4: TEST ADMIN APIs (Sửa lỗi 403)**

**Sử dụng admin access token từ BƯỚC 1.2**

### **4.1. Test hủy booking hết hạn:**
```bash
POST http://localhost:8080/api/admin/cancel-expired-bookings
Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN
```

**Kết quả mong đợi:**
```json
{
    "message": "Đã chạy scheduled job để hủy booking hết hạn"
}
```

**Nếu lỗi 403:**
- Kiểm tra admin access token
- Kiểm tra user có role ROLE_ADMIN không
- Kiểm tra SecurityConfig cho phép /api/admin/**

---

## 🔍 **BƯỚC 5: DEBUG CHI TIẾT**

### **5.1. Kiểm tra Console Log:**
- Tìm lỗi authentication
- Tìm lỗi authorization
- Tìm lỗi request parsing

### **5.2. Kiểm tra Database:**
```sql
-- Kiểm tra user
SELECT u.user_id, u.email, r.name as role_name
FROM users u
LEFT JOIN user_roles ur ON u.user_id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.role_id
WHERE u.email = 'test@hotelhub.com';

-- Kiểm tra admin
SELECT u.user_id, u.email, r.name as role_name
FROM users u
LEFT JOIN user_roles ur ON u.user_id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.role_id
WHERE u.email = 'admin1@hotelhub.com';

-- Kiểm tra bookings
SELECT booking_id, status, user_id, guest_name
FROM bookings 
ORDER BY booking_id DESC;
```

### **5.3. Kiểm tra SecurityConfig:**
- URL patterns có đúng không
- Role requirements có đúng không
- CORS configuration có đúng không

### **5.4. Kiểm tra JwtAuthenticationFilter:**
- Bypass URLs có đúng không
- Token validation có hoạt động không
- UserDetails loading có đúng không

---

## 🚨 **TROUBLESHOOTING**

### **Lỗi 403 Forbidden:**
1. **Kiểm tra access token:**
   - Token có đúng format không
   - Token chưa hết hạn chưa
   - Token có đúng user không

2. **Kiểm tra role:**
   - User có role đúng không
   - Database có đúng không
   - SecurityConfig có cho phép không

3. **Kiểm tra URL:**
   - URL path có đúng không
   - HTTP method có đúng không
   - Parameters có đúng không

### **Lỗi Request Body Missing:**
1. **Kiểm tra Content-Type:**
   - Có "Content-Type: application/json" không
   - Header có đúng format không

2. **Kiểm tra JSON:**
   - JSON syntax có đúng không
   - Required fields có đầy đủ không
   - Data types có đúng không

3. **Kiểm tra Request:**
   - HTTP method có đúng không
   - URL path có đúng không
   - Body có được gửi không

---

## ✅ **KẾT QUẢ MONG ĐỢI:**

### **Authentication:**
- ✅ Login user thành công
- ✅ Login admin thành công
- ✅ Access token được tạo đúng

### **Guest Booking:**
- ✅ Tạo booking thành công
- ✅ Request body được parse đúng
- ✅ Response trả về booking info

### **User Booking:**
- ✅ Xem tất cả booking thành công
- ✅ Xem chi tiết booking thành công
- ✅ Hủy booking thành công

### **Admin APIs:**
- ✅ Hủy booking hết hạn thành công
- ✅ Admin có quyền truy cập

---

## 📝 **GHI CHÚ:**

1. **Access Token có thời hạn 1 giờ** - cần login lại khi hết hạn
2. **User chỉ xem được booking của mình** - không thể xem booking của user khác
3. **Admin có thể truy cập tất cả API** - nhưng vẫn cần access token
4. **Guest booking không cần access token** - nhưng cần request body đúng format
5. **Kiểm tra console log** để debug lỗi chi tiết
6. **Kiểm tra database** để đảm bảo dữ liệu đúng

**Hãy test từng bước và báo cáo kết quả!**
