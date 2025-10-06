# 🚀 Complete API Test Guide - HotelHub Booking System

## 📋 **Tổng quan hệ thống**
- **Backend:** Spring Boot + JWT Authentication
- **Database:** MySQL với các bảng users, roles, rooms, bookings
- **Frontend:** React với booking form và user management
- **Features:** Guest booking, User booking, Admin panel, Auto-cancel expired bookings

---

## 🔐 **1. AUTHENTICATION APIs**

### **1.1 User Registration**
```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "password": "password123",
    "phone": "0123456789"
}
```

**Kết quả mong đợi:**
```json
{
    "message": "Đăng ký thành công",
    "name": "Nguyễn Văn A",
    "email": "user@example.com"
}
```

### **1.2 User Login**
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

**Kết quả mong đợi:**
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "43dd26e6-104a-43b2-a627-eeba421e3df6",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "email": "user@example.com",
    "name": "Nguyễn Văn A",
    "roles": ["ROLE_CUSTOMER"]
}
```

### **1.3 Admin Login**
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
    "email": "admin1@hotelhub.com",
    "password": "admin123"
}
```

**Kết quả mong đợi:**
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "afcd0c60-ef6b-4908-a368-212ee01f1188",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "email": "admin1@hotelhub.com",
    "name": "Quang Anh",
    "roles": ["ROLE_ADMIN"]
}
```

### **1.4 Refresh Token**
```bash
POST http://localhost:8080/api/auth/refresh
Content-Type: application/json

{
    "refreshToken": "43dd26e6-104a-43b2-a627-eeba421e3df6"
}
```

**Kết quả mong đợi:**
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "43dd26e6-104a-43b2-a627-eeba421e3df6",
    "tokenType": "Bearer",
    "expiresIn": 3600
}
```

### **1.5 Logout**
```bash
POST http://localhost:8080/api/auth/logout
Content-Type: application/json

{
    "refreshToken": "43dd26e6-104a-43b2-a627-eeba421e3df6"
}
```

**Kết quả mong đợi:**
```json
{
    "message": "Đăng xuất thành công"
}
```

---

## 🏨 **2. ROOM APIs**

### **2.1 Get Available Rooms**
```bash
GET http://localhost:8080/api/bookings/rooms/available?checkIn=2025-12-01&checkOut=2025-12-03
```

**Kết quả mong đợi:**
```json
{
    "count": 3,
    "rooms": [
        {
            "roomId": 1,
            "roomNumber": "101",
            "roomType": "Single",
            "price": 500000,
            "capacity": 1,
            "description": "Phòng đơn tiện nghi cơ bản",
            "amenities": ["WiFi", "TV", "Air Conditioning"]
        }
    ],
    "checkIn": "2025-12-01",
    "checkOut": "2025-12-03"
}
```

### **2.2 Get Room Details**
```bash
GET http://localhost:8080/api/bookings/rooms/1
```

**Kết quả mong đợi:**
```json
{
    "roomId": 1,
    "roomNumber": "101",
    "roomType": "Single",
    "price": 500000,
    "capacity": 1,
    "description": "Phòng đơn tiện nghi cơ bản",
    "amenities": ["WiFi", "TV", "Air Conditioning"],
    "status": "available"
}
```

---

## 📝 **3. BOOKING APIs**

### **3.1 Guest Booking (Không cần login)**
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
        "createdAt": "2025-09-28T22:47:20.5073524",
        "holdUntil": "2025-09-28T23:17:20.4985379",
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

### **3.2 User Booking (Cần login)**
```bash
POST http://localhost:8080/api/bookings
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN

{
    "roomId": 1,
    "checkIn": "2025-12-01",
    "checkOut": "2025-12-03",
    "guests": 2,
    "notes": "Yêu cầu phòng tầng cao"
}
```

**Kết quả mong đợi:**
```json
{
    "message": "Tạo booking thành công",
    "booking": {
        "bookingId": 2,
        "bookingReference": "BK175907444049831A677",
        "roomId": 1,
        "roomNumber": "101",
        "roomType": "Single",
        "checkIn": "2025-12-01",
        "checkOut": "2025-12-03",
        "guests": 2,
        "notes": "Yêu cầu phòng tầng cao",
        "totalPrice": 1000000.0,
        "status": "pending",
        "createdAt": "2025-09-28T22:47:20.5073524",
        "holdUntil": "2025-09-28T23:17:20.4985379",
        "guestName": null,
        "guestEmail": null,
        "guestPhone": null,
        "userName": "Nguyễn Văn A",
        "userEmail": "user@example.com",
        "roomDescription": "Phòng đơn tiện nghi cơ bản",
        "roomCapacity": 1,
        "amenities": []
    }
}
```

### **3.3 Get User Bookings**
```bash
GET http://localhost:8080/api/bookings
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Kết quả mong đợi:**
```json
[
    {
        "bookingId": 2,
        "bookingReference": "BK175907444049831A677",
        "roomId": 1,
        "roomNumber": "101",
        "roomType": "Single",
        "checkIn": "2025-12-01",
        "checkOut": "2025-12-03",
        "guests": 2,
        "notes": "Yêu cầu phòng tầng cao",
        "totalPrice": 1000000.0,
        "status": "pending",
        "createdAt": "2025-09-28T22:47:20.5073524",
        "holdUntil": "2025-09-28T23:17:20.4985379",
        "userName": "Nguyễn Văn A",
        "userEmail": "user@example.com",
        "roomDescription": "Phòng đơn tiện nghi cơ bản",
        "roomCapacity": 1,
        "amenities": []
    }
]
```

### **3.4 Get User Booking by ID**
```bash
GET http://localhost:8080/api/bookings/user/2
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Kết quả mong đợi:**
```json
{
    "bookingId": 2,
    "bookingReference": "BK175907444049831A677",
    "roomId": 1,
    "roomNumber": "101",
    "roomType": "Single",
    "checkIn": "2025-12-01",
    "checkOut": "2025-12-03",
    "guests": 2,
    "notes": "Yêu cầu phòng tầng cao",
    "totalPrice": 1000000.0,
    "status": "pending",
    "createdAt": "2025-09-28T22:47:20.5073524",
    "holdUntil": "2025-09-28T23:17:20.4985379",
    "userName": "Nguyễn Văn A",
    "userEmail": "user@example.com",
    "roomDescription": "Phòng đơn tiện nghi cơ bản",
    "roomCapacity": 1,
    "amenities": []
}
```

### **3.5 Cancel User Booking**
```bash
PUT http://localhost:8080/api/bookings/user/2/cancel
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Kết quả mong đợi:**
```json
{
    "message": "Hủy booking thành công",
    "booking": {
        "bookingId": 2,
        "bookingReference": "BK175907444049831A677",
        "roomId": 1,
        "roomNumber": "101",
        "roomType": "Single",
        "checkIn": "2025-12-01",
        "checkOut": "2025-12-03",
        "guests": 2,
        "notes": "Yêu cầu phòng tầng cao",
        "totalPrice": 1000000.0,
        "status": "cancelled",
        "createdAt": "2025-09-28T22:47:20.5073524",
        "holdUntil": "2025-09-28T23:17:20.4985379",
        "userName": "Nguyễn Văn A",
        "userEmail": "user@example.com",
        "roomDescription": "Phòng đơn tiện nghi cơ bản",
        "roomCapacity": 1,
        "amenities": []
    }
}
```

### **3.6 Get Guest Booking by Reference**
```bash
GET http://localhost:8080/api/bookings/guest/BK175907444049831A676
```

**Kết quả mong đợi:**
```json
{
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
    "createdAt": "2025-09-28T22:47:20.5073524",
    "holdUntil": "2025-09-28T23:17:20.4985379",
    "guestName": "Nguyễn Văn A",
    "guestEmail": "guest@example.com",
    "guestPhone": "0123456789",
    "userName": null,
    "userEmail": null,
    "roomDescription": "Phòng đơn tiện nghi cơ bản",
    "roomCapacity": 1,
    "amenities": []
}
```

### **3.7 Get Guest Bookings by Email**
```bash
GET http://localhost:8080/api/bookings/guest/email/guest@example.com
```

**Kết quả mong đợi:**
```json
[
    {
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
        "createdAt": "2025-09-28T22:47:20.5073524",
        "holdUntil": "2025-09-28T23:17:20.4985379",
        "guestName": "Nguyễn Văn A",
        "guestEmail": "guest@example.com",
        "guestPhone": "0123456789",
        "userName": null,
        "userEmail": null,
        "roomDescription": "Phòng đơn tiện nghi cơ bản",
        "roomCapacity": 1,
        "amenities": []
    }
]
```

---

## 🔧 **4. ADMIN APIs**

### **4.1 Test Scheduled Job (Public)**
```bash
GET http://localhost:8080/api/admin/test-scheduled
```

**Kết quả mong đợi:**
```json
{
    "message": "Test scheduled job thành công"
}
```

### **4.2 Cancel Expired Bookings (Admin only)**
```bash
POST http://localhost:8080/api/admin/cancel-expired-bookings
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

**Kết quả mong đợi:**
```json
{
    "message": "Đã chạy scheduled job để hủy booking hết hạn"
}
```

---

## 🧪 **5. TEST APIs**

### **5.1 Public Test**
```bash
GET http://localhost:8080/api/test/public
```

**Kết quả mong đợi:**
```json
{
    "message": "Public endpoint - không cần authentication"
}
```

### **5.2 Protected Test**
```bash
GET http://localhost:8080/api/test/protected
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Kết quả mong đợi:**
```json
{
    "message": "Protected endpoint - cần authentication"
}
```

### **5.3 Debug Price**
```bash
GET http://localhost:8080/api/test/debug-price/1
```

**Kết quả mong đợi:**
```json
{
    "roomId": 1,
    "roomNumber": "101",
    "price": 500000,
    "checkIn": "2025-10-10",
    "checkOut": "2025-12-10",
    "nights": 61,
    "calculatedPrice": "30500000",
    "status": "available"
}
```

---

## 📊 **6. DATABASE SETUP**

### **6.1 Setup Users**
```sql
-- Test user
INSERT INTO users (name, email, password, phone, enabled, email_verified) 
VALUES ('Test User', 'test@hotelhub.com', '$2a$10$ZVmXm8AMeYb/1QfKp9nDT.LDAMyiUqxLxHSzZ.Znor7gSjuTomc32', '0123456789', true, true);

-- Admin user
INSERT INTO users (name, email, password, phone, enabled, email_verified) 
VALUES ('Admin User', 'admin1@hotelhub.com', '$2a$10$ZVmXm8AMeYb/1QfKp9nDT.LDAMyiUqxLxHSzZ.Znor7gSjuTomc32', '0987654321', true, true);

-- Assign roles
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1); -- ROLE_CUSTOMER
INSERT INTO user_roles (user_id, role_id) VALUES (2, 3); -- ROLE_ADMIN
```

### **6.2 Setup Rooms**
```sql
-- Room types
INSERT INTO room_types (name, description) VALUES ('Single', 'Phòng đơn');
INSERT INTO room_types (name, description) VALUES ('Double', 'Phòng đôi');
INSERT INTO room_types (name, description) VALUES ('Suite', 'Phòng suite');

-- Rooms
INSERT INTO rooms (room_number, type_id, price, status, capacity, description) 
VALUES ('101', 1, 500000, 'available', 1, 'Phòng đơn tiện nghi cơ bản');

INSERT INTO rooms (room_number, type_id, price, status, capacity, description) 
VALUES ('102', 2, 800000, 'available', 2, 'Phòng đôi tiện nghi cao cấp');

INSERT INTO rooms (room_number, type_id, price, status, capacity, description) 
VALUES ('201', 3, 1200000, 'available', 4, 'Phòng suite sang trọng');
```

---

## 🎯 **7. TESTING WORKFLOW**

### **7.1 Complete User Flow**
1. **Register** → Get access token
2. **Login** → Get access token
3. **Get available rooms** → Select room
4. **Create booking** → Get booking reference
5. **Get user bookings** → View all bookings
6. **Get booking details** → View specific booking
7. **Cancel booking** → Cancel if needed

### **7.2 Complete Guest Flow**
1. **Get available rooms** → Select room
2. **Create guest booking** → Get booking reference
3. **Get booking by reference** → View booking details
4. **Get bookings by email** → View all guest bookings

### **7.3 Complete Admin Flow**
1. **Admin login** → Get admin access token
2. **Test scheduled job** → Check auto-cancel
3. **Cancel expired bookings** → Manual cancel
4. **Monitor system** → Check logs

---

## 🚨 **8. COMMON ISSUES & SOLUTIONS**

### **8.1 403 Forbidden**
- **Cause:** Missing or invalid access token
- **Solution:** Include `Authorization: Bearer YOUR_ACCESS_TOKEN` header

### **8.2 400 Bad Request**
- **Cause:** Invalid request body or missing required fields
- **Solution:** Check JSON format and required fields

### **8.3 500 Internal Server Error**
- **Cause:** Database connection or logic error
- **Solution:** Check database connection and server logs

### **8.4 Price = 0**
- **Cause:** Room price not set in database
- **Solution:** Update room prices in database

---

## ✅ **9. SUCCESS CRITERIA**

### **9.1 Authentication**
- ✅ User can register and login
- ✅ JWT tokens work correctly
- ✅ Refresh tokens work
- ✅ Logout works

### **9.2 Booking System**
- ✅ Guest can book without login
- ✅ User can book with login
- ✅ Price calculation works
- ✅ Booking reference generation works
- ✅ Auto-cancel expired bookings works

### **9.3 Admin Functions**
- ✅ Admin can access admin APIs
- ✅ Scheduled job works
- ✅ Manual cancel expired bookings works

### **9.4 Frontend Integration**
- ✅ React app can call all APIs
- ✅ Forms work correctly
- ✅ Price display works
- ✅ Booking tracking works

---

## 🎉 **CONCLUSION**

Hệ thống HotelHub đã hoàn thiện với:
- **Authentication system** với JWT
- **Booking system** cho guest và user
- **Admin panel** với role-based access
- **Auto-cancel** expired bookings
- **Price calculation** logic
- **Frontend integration** với React

Tất cả APIs đã được test và hoạt động chính xác! 🚀
