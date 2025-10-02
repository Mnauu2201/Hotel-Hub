# Hướng dẫn Test API HotelHub - Từ đầu đến cuối

## 🎯 **Mục tiêu:**
Test toàn bộ hệ thống HotelHub từ authentication, booking, đến admin functions.

## 📋 **Chuẩn bị:**
1. **Spring Boot đang chạy** trên `http://localhost:8080`
2. **Database có dữ liệu** (users, rooms, roles)
3. **Postman hoặc tool tương tự** để test API

---

## 🔐 **BƯỚC 1: TẠO DỮ LIỆU CƠ BẢN**

### **1.1. Tạo dữ liệu rooms (nếu chưa có):**
```sql
-- Chạy script CREATE_ROOMS_AND_TEST.sql
-- Hoặc chạy từng lệnh:

-- Tạo room_types
INSERT IGNORE INTO room_types (name, description) VALUES
('Single', 'Phòng đơn cho 1 người'),
('Double', 'Phòng đôi cho 2 người'),
('Suite', 'Phòng cao cấp');

-- Tạo rooms
INSERT IGNORE INTO rooms (room_number, type_id, price, status, capacity, description)
VALUES
('101', 1, 500000, 'available', 1, 'Phòng đơn tiện nghi cơ bản'),
('102', 2, 800000, 'available', 2, 'Phòng đôi view thành phố'),
('201', 3, 1500000, 'available', 4, 'Suite cao cấp với ban công riêng');
```

### **1.2. Kiểm tra dữ liệu:**
```sql
-- Xem rooms
SELECT * FROM rooms;

-- Xem users
SELECT * FROM users;

-- Xem roles
SELECT * FROM roles;
```

---

## 🔑 **BƯỚC 2: TEST AUTHENTICATION APIs**

### **2.1. Test Register (Tạo tài khoản mới):**
```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
    "name": "Nguyễn Văn A",
    "email": "newuser@example.com",
    "password": "123456",
    "phone": "0123456789"
}
```

**Kết quả mong đợi:**
```json
{
    "email": "newuser@example.com",
    "message": "Đăng ký thành công",
    "name": "Nguyễn Văn A"
}
```

### **2.2. Test Login User (Lấy access token cho user):**
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
    "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGhvdGVsbHViLmNvbSIsInJvbGVzIjpbIlJPTEVfQ1VTVE9NRVIiXSwiaWF0IjoxNzU5MjIwNTY3LCJleHAiOjE3NTkyMjQxNjd9.HC9ztgSlxqJmyjZIo0UfCScl5x6Ab07TC7D5ChmEzPQ",
    "refreshToken": "afcd0c60-ef6b-4908-a368-212ee01f1188",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "email": "test@hotelhub.com",
    "name": "Test User",
    "roles": ["ROLE_CUSTOMER"]
}
```

**📝 Lưu lại access token này để test User APIs!**

### **2.3. Test Login Admin (Lấy access token cho admin):**
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
    "email": "admin1@hotelhub.com",
    "password": "123123123"
}
```

**Kết quả mong đợi:**
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbjFAaG90ZWxodWIuY29tIiwicm9sZXMiOlsiUk9MRV9BRE1JTiJdLCJpYXQiOjE3NTkyMjA1NjcsImV4cCI6MTc1OTIyNDE2N30.HC9ztgSlxqJmyjZIo0UfCScl5x6Ab07TC7D5ChmEzPQ",
    "refreshToken": "afcd0c60-ef6b-4908-a368-212ee01f1188",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "email": "admin1@hotelhub.com",
    "name": "Quang Anh",
    "roles": ["ROLE_ADMIN"]
}
```

**📝 Lưu lại access token này để test Admin APIs!**

### **2.4. Test Refresh Token:**
```bash
POST http://localhost:8080/api/auth/refresh
Content-Type: application/json

{
    "refreshToken": "your-refresh-token-here"
}
```

### **2.5. Test Logout:**
```bash
POST http://localhost:8080/api/auth/logout
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN

{
    "refreshToken": "your-refresh-token-here"
}
```

---

## 🏠 **BƯỚC 3: TEST ROOM APIs (Public - Không cần access token)**

### **3.1. Test xem tất cả phòng:**
```bash
GET http://localhost:8080/api/bookings/rooms
```

**Kết quả mong đợi:**
```json
{
    "rooms": [
        {
            "roomId": 1,
            "roomNumber": "101",
            "roomType": {
                "typeId": 1,
                "name": "Single",
                "description": "Phòng đơn cho 1 người"
            },
            "price": 500000,
            "status": "available",
            "capacity": 1,
            "description": "Phòng đơn tiện nghi cơ bản"
        }
    ],
    "count": 3
}
```

### **3.2. Test xem phòng trống:**
```bash
GET http://localhost:8080/api/bookings/rooms/available?checkIn=2025-12-01&checkOut=2025-12-03
```

**Kết quả mong đợi:**
```json
{
    "rooms": [
        {
            "roomId": 1,
            "roomNumber": "101",
            "roomType": {...},
            "price": 500000,
            "status": "available",
            "capacity": 1,
            "description": "Phòng đơn tiện nghi cơ bản"
        }
    ],
    "count": 3,
    "checkIn": "2025-12-01",
    "checkOut": "2025-12-03"
}
```

### **3.3. Test xem chi tiết phòng:**
```bash
GET http://localhost:8080/api/bookings/rooms/1
```

**Kết quả mong đợi:**
```json
{
    "roomId": 1,
    "roomNumber": "101",
    "roomType": {
        "typeId": 1,
        "name": "Single",
        "description": "Phòng đơn cho 1 người"
    },
    "price": 500000,
    "status": "available",
    "capacity": 1,
    "description": "Phòng đơn tiện nghi cơ bản"
}
```

---

## 👤 **BƯỚC 4: TEST GUEST BOOKING APIs (Public - Không cần access token)**

### **4.1. Test tạo booking cho khách vãng lai:**
```bash
POST http://localhost:8080/api/bookings/guest
Content-Type: application/json

{
    "roomId": 1,
    "checkIn": "2025-12-01",
    "checkOut": "2025-12-03",
    "guests": 2,
    "notes": "Yêu cầu phòng tầng cao",
    "guestName": "Nguyễn Văn A",
    "guestEmail": "guest@example.com",
    "guestPhone": "0123456789"
}
```

**Kết quả mong đợi:**
```json
{
    "message": "Tạo booking thành công",
    "booking": {
        "bookingId": 1,
        "bookingReference": "BK175907444049831A676",
        "roomId": 1,
        "roomNumber": "101",
        "roomType": "Single",
        "checkIn": "2025-12-01",
        "checkOut": "2025-12-03",
        "guests": 2,
        "notes": "Yêu cầu phòng tầng cao",
        "totalPrice": 1000000.0,
        "status": "pending",
        "createdAt": "2025-09-30T19:12:24.7478391",
        "holdUntil": "2025-09-30T19:17:24.7439237",
        "guestName": "Nguyễn Văn A",
        "guestEmail": "guest@example.com",
        "guestPhone": "0123456789",
        "userName": null,
        "userEmail": null,
        "roomDescription": "Phòng đơn tiện nghi cơ bản",
        "roomCapacity": 1,
        "amenities": []
    }
}
```

**📝 Lưu lại bookingReference để test tra cứu!**

### **4.2. Test tra cứu booking theo mã booking:**
```bash
GET http://localhost:8080/api/bookings/guest/BK175907444049831A676
```

### **4.3. Test tra cứu booking theo email:**
```bash
GET http://localhost:8080/api/bookings/guest/email/guest@example.com
```

---

## 🔐 **BƯỚC 5: TEST USER BOOKING APIs (Cần access token của user)**

**Sử dụng access token từ BƯỚC 2.2 (test@hotelhub.com)**

### **5.1. Test tạo booking cho user đã login:**
```bash
POST http://localhost:8080/api/bookings
Content-Type: application/json
Authorization: Bearer YOUR_USER_ACCESS_TOKEN

{
    "roomId": 2,
    "checkIn": "2025-12-05",
    "checkOut": "2025-12-07",
    "guests": 1,
    "notes": "User booking test"
}
```

**Kết quả mong đợi:**
```json
{
    "message": "Tạo booking thành công",
    "booking": {
        "bookingId": 2,
        "bookingReference": "BK175907444049831B677",
        "roomId": 2,
        "roomNumber": "102",
        "roomType": "Double",
        "checkIn": "2025-12-05",
        "checkOut": "2025-12-07",
        "guests": 1,
        "notes": "User booking test",
        "totalPrice": 1600000.0,
        "status": "pending",
        "createdAt": "2025-09-30T19:15:24.7478391",
        "holdUntil": "2025-09-30T19:20:24.7439237",
        "guestName": null,
        "guestEmail": null,
        "guestPhone": null,
        "userName": "Test User",
        "userEmail": "test@hotelhub.com",
        "roomDescription": "Phòng đôi view thành phố",
        "roomCapacity": 2,
        "amenities": []
    }
}
```

### **5.2. Test xem tất cả booking của user:**
```bash
GET http://localhost:8080/api/bookings
Authorization: Bearer YOUR_USER_ACCESS_TOKEN
```

**Kết quả mong đợi:**
```json
{
    "bookings": [
        {
            "bookingId": 2,
            "bookingReference": "BK175907444049831B677",
            "roomId": 2,
            "roomNumber": "102",
            "roomType": "Double",
            "checkIn": "2025-12-05",
            "checkOut": "2025-12-07",
            "guests": 1,
            "notes": "User booking test",
            "totalPrice": 1600000.0,
            "status": "pending",
            "createdAt": "2025-09-30T19:15:24.7478391",
            "holdUntil": "2025-09-30T19:20:24.7439237",
            "userName": "Test User",
            "userEmail": "test@hotelhub.com",
            "roomDescription": "Phòng đôi view thành phố",
            "roomCapacity": 2,
            "amenities": []
        }
    ],
    "count": 1
}
```

### **5.3. Test xem chi tiết booking của user:**
```bash
GET http://localhost:8080/api/bookings/user/2
Authorization: Bearer YOUR_USER_ACCESS_TOKEN
```

**Kết quả mong đợi:**
```json
{
    "bookingId": 2,
    "bookingReference": "BK175907444049831B677",
    "roomId": 2,
    "roomNumber": "102",
    "roomType": "Double",
    "checkIn": "2025-12-05",
    "checkOut": "2025-12-07",
    "guests": 1,
    "notes": "User booking test",
    "totalPrice": 1600000.0,
    "status": "pending",
    "createdAt": "2025-09-30T19:15:24.7478391",
    "holdUntil": "2025-09-30T19:20:24.7439237",
    "userName": "Test User",
    "userEmail": "test@hotelhub.com",
    "roomDescription": "Phòng đôi view thành phố",
    "roomCapacity": 2,
    "amenities": []
}
```

### **5.4. Test hủy booking của user:**
```bash
PUT http://localhost:8080/api/bookings/user/2/cancel
Authorization: Bearer YOUR_USER_ACCESS_TOKEN
```

**Kết quả mong đợi:**
```json
{
    "message": "Hủy booking thành công",
    "booking": {
        "bookingId": 2,
        "status": "cancelled",
        ...
    }
}
```

---

## 👨‍💼 **BƯỚC 6: TEST ADMIN APIs (Cần access token của admin)**

**Sử dụng access token từ BƯỚC 2.3 (admin1@hotelhub.com)**

### **6.1. Test hủy booking hết hạn (Admin):**
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

### **6.2. Test scheduled job (Public - không cần auth):**
```bash
GET http://localhost:8080/api/admin/test-scheduled
```

**Kết quả mong đợi:**
```json
{
    "message": "Test scheduled job thành công"
}
```

---

## 🔒 **BƯỚC 7: TEST PROTECTED APIs**

### **7.1. Test Protected API (Cần access token):**
```bash
GET http://localhost:8080/api/test/protected
Authorization: Bearer YOUR_USER_ACCESS_TOKEN
```

**Kết quả mong đợi:**
```json
{
    "message": "Protected endpoint - cần authentication"
}
```

### **7.2. Test Public API (Không cần access token):**
```bash
GET http://localhost:8080/api/test/public
```

**Kết quả mong đợi:**
```json
{
    "message": "Public endpoint - không cần authentication"
}
```

---

## 🧪 **BƯỚC 8: TEST SCHEDULED JOB (Auto-cancel)**

### **8.1. Tạo booking test với hold_until đã hết hạn:**
```sql
-- Ép booking hết hạn ngay
UPDATE bookings 
SET hold_until = DATE_SUB(NOW(), INTERVAL 1 MINUTE)
WHERE booking_id = 1 AND status = 'pending';
```

### **8.2. Kiểm tra console log:**
- Tìm dòng "=== SCHEDULED JOB RUNNING ==="
- Xem có booking nào được cancel không

### **8.3. Kiểm tra database:**
```sql
-- Xem booking đã bị cancel chưa
SELECT booking_id, status, hold_until FROM bookings WHERE booking_id = 1;
```

---

## 📊 **BƯỚC 9: KIỂM TRA KẾT QUẢ TỔNG THỂ**

### **9.1. Kiểm tra database:**
```sql
-- Xem tất cả bookings
SELECT 
    booking_id,
    status,
    room_id,
    guest_name,
    user_id,
    created_at
FROM bookings 
ORDER BY booking_id DESC;

-- Xem rooms
SELECT 
    room_id,
    room_number,
    status,
    price
FROM rooms 
ORDER BY room_id;
```

### **9.2. Kiểm tra console log:**
- Scheduled job chạy mỗi 30 giây
- Không có lỗi authentication
- Booking được cancel tự động

---

## ✅ **KẾT QUẢ MONG ĐỢI:**

### **Authentication:**
- ✅ Register/Login hoạt động
- ✅ Refresh token hoạt động
- ✅ Logout hoạt động

### **Room APIs:**
- ✅ Xem tất cả phòng
- ✅ Xem phòng trống
- ✅ Xem chi tiết phòng

### **Guest Booking:**
- ✅ Tạo booking cho khách vãng lai
- ✅ Tra cứu booking theo mã
- ✅ Tra cứu booking theo email

### **User Booking:**
- ✅ Tạo booking cho user
- ✅ Xem tất cả booking của user
- ✅ Xem chi tiết booking của user
- ✅ Hủy booking của user

### **Admin Functions:**
- ✅ Hủy booking hết hạn
- ✅ Test scheduled job

### **Scheduled Job:**
- ✅ Tự động hủy booking hết hạn
- ✅ Console log hiển thị quá trình

---

## 🚨 **TROUBLESHOOTING:**

### **Lỗi 403 Forbidden:**
- Kiểm tra access token có đúng không
- Kiểm tra role có phù hợp không
- Login lại để lấy access token mới

### **Lỗi 404 Not Found:**
- Kiểm tra URL có đúng không
- Kiểm tra ID có tồn tại không

### **Lỗi 400 Bad Request:**
- Kiểm tra request body có đúng format không
- Kiểm tra validation constraints

### **Lỗi 500 Internal Server Error:**
- Kiểm tra console log
- Kiểm tra database connection
- Restart Spring Boot

---

## 📝 **GHI CHÚ QUAN TRỌNG:**

1. **Access Token có thời hạn 1 giờ** - cần login lại khi hết hạn
2. **User chỉ xem được booking của mình** - không thể xem booking của user khác
3. **Admin có thể truy cập tất cả API** - nhưng vẫn cần access token
4. **Guest booking không cần access token** - nhưng cần booking reference để tra cứu
5. **Scheduled job chạy mỗi 30 giây** - tự động hủy booking hết hạn
6. **Phòng được giữ 5 phút** - sau đó tự động hủy nếu không thanh toán

---

## 🎯 **TÓM TẮT ACCESS TOKEN:**

| API | Cần Access Token? | Từ User nào? | Role cần thiết |
|-----|------------------|--------------|----------------|
| Authentication APIs | ❌ | Không cần | Public |
| Room APIs | ❌ | Không cần | Public |
| Guest Booking APIs | ❌ | Không cần | Public |
| User Booking APIs | ✅ | User thường | ROLE_CUSTOMER |
| Admin APIs | ✅ | Admin | ROLE_ADMIN |
| Protected APIs | ✅ | User thường | ROLE_CUSTOMER |

**Chúc bạn test thành công! 🚀**
