# 🚀 Complete API List - HotelHub Booking System (FIXED)

## 📋 **Tổng quan**
- **Backend URL:** `http://localhost:8080`
- **Database:** MySQL (XAMPP)
- **Authentication:** JWT + Refresh Token
- **Status:** ✅ Tất cả APIs đã sẵn sàng test

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

### **1.2 User Login**
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
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

### **1.4 Refresh Token** ✅ (Đã sửa)
```bash
POST http://localhost:8080/api/auth/refresh
Content-Type: application/json

{
    "refreshToken": "afcd0c60-ef6b-4908-a368-212ee01f1188"
}
```

### **1.5 Logout** ✅ (Đã sửa)
```bash
POST http://localhost:8080/api/auth/logout
Content-Type: application/json

{
    "refreshToken": "afcd0c60-ef6b-4908-a368-212ee01f1188"
}
```

---

## 🏨 **2. ROOM APIs**

### **2.1 Get Available Rooms**
```bash
GET http://localhost:8080/api/bookings/rooms/available?checkIn=2025-12-01&checkOut=2025-12-03
```

### **2.2 Get Room Details**
```bash
GET http://localhost:8080/api/bookings/rooms/1
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

### **3.3 Get User Bookings** ✅ (Có sẵn)
```bash
GET http://localhost:8080/api/bookings
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### **3.4 Get User Booking by ID** ✅ (Có sẵn)
```bash
GET http://localhost:8080/api/bookings/user/1
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### **3.5 Cancel User Booking** ✅ (Có sẵn)
```bash
PUT http://localhost:8080/api/bookings/user/1/cancel
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### **3.6 Get Guest Booking by Reference** ✅ (Có sẵn)
```bash
GET http://localhost:8080/api/bookings/guest/BK175907444049831A676
```

### **3.7 Get Guest Bookings by Email** ✅ (Có sẵn)
```bash
GET http://localhost:8080/api/bookings/guest/email/guest@example.com
```

---

## 🔧 **4. ADMIN APIs**

### **4.1 Test Scheduled Job (Public)**
```bash
GET http://localhost:8080/api/admin/test-scheduled
```

### **4.2 Cancel Expired Bookings (Admin only)**
```bash
POST http://localhost:8080/api/admin/cancel-expired-bookings
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

---

## 🧪 **5. TEST APIs**

### **5.1 Public Test**
```bash
GET http://localhost:8080/api/test/public
```

### **5.2 Protected Test**
```bash
GET http://localhost:8080/api/test/protected
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### **5.3 Debug Price** ✅ (Đã sửa)
```bash
GET http://localhost:8080/api/test/debug-price/1
```

---

## 🎯 **6. TESTING WORKFLOW**

### **6.1 Complete User Flow**
1. **Register** → Get access token
2. **Login** → Get access token
3. **Get available rooms** → Select room
4. **Create booking** → Get booking reference
5. **Get user bookings** → View all bookings
6. **Get booking details** → View specific booking
7. **Cancel booking** → Cancel if needed

### **6.2 Complete Guest Flow**
1. **Get available rooms** → Select room
2. **Create guest booking** → Get booking reference
3. **Get booking by reference** → View booking details
4. **Get bookings by email** → View all guest bookings

### **6.3 Complete Admin Flow**
1. **Admin login** → Get admin access token
2. **Test scheduled job** → Check auto-cancel
3. **Cancel expired bookings** → Manual cancel
4. **Monitor system** → Check logs

---

## 🔍 **7. DEBUG APIs**

### **7.1 Debug Refresh Token**
```sql
-- Kiểm tra refresh token
SELECT 
    token_id,
    token,
    user_id,
    expires_at,
    revoked
FROM refresh_tokens 
WHERE token = 'afcd0c60-ef6b-4908-a368-212ee01f1188';
```

### **7.2 Debug Room Prices**
```sql
-- Kiểm tra giá phòng
SELECT room_id, room_number, price, status FROM rooms ORDER BY room_id;
```

### **7.3 Debug Bookings**
```sql
-- Kiểm tra booking
SELECT booking_id, room_id, total_price, check_in, check_out, status 
FROM bookings 
ORDER BY booking_id DESC 
LIMIT 5;
```

---

## ✅ **8. SUCCESS CRITERIA**

### **8.1 Authentication**
- ✅ User can register and login
- ✅ JWT tokens work correctly
- ✅ Refresh tokens work
- ✅ Logout works

### **8.2 Booking System**
- ✅ Guest can book without login
- ✅ User can book with login
- ✅ Price calculation works
- ✅ Booking reference generation works
- ✅ Auto-cancel expired bookings works

### **8.3 Admin Functions**
- ✅ Admin can access admin APIs
- ✅ Scheduled job works
- ✅ Manual cancel expired bookings works

### **8.4 Frontend Integration**
- ✅ React app can call all APIs
- ✅ Forms work correctly
- ✅ Price display works
- ✅ Booking tracking works

---

## 🚨 **9. COMMON ISSUES & SOLUTIONS**

### **9.1 403 Forbidden**
- **Cause:** Missing or invalid access token
- **Solution:** Include `Authorization: Bearer YOUR_ACCESS_TOKEN` header

### **9.2 400 Bad Request**
- **Cause:** Invalid request body or missing required fields
- **Solution:** Check JSON format and required fields

### **9.3 500 Internal Server Error**
- **Cause:** Database connection or logic error
- **Solution:** Check database connection and server logs

### **9.4 Price = 0**
- **Cause:** Room price not set in database
- **Solution:** Update room prices in database

---

## 🎉 **CONCLUSION**

Hệ thống HotelHub đã hoàn thiện với:
- **Authentication system** với JWT
- **Booking system** cho guest và user
- **Admin panel** với role-based access
- **Auto-cancel** expired bookings
- **Price calculation** logic
- **Frontend integration** với React

**Tất cả APIs đã được test và hoạt động chính xác!** 🚀
