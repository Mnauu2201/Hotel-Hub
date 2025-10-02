# API Test Guide - Fixed Issues

## 🔧 **Các vấn đề đã sửa:**

### 1. **API GET /api/bookings/user/{bookingId}** - "API đang được phát triển"
- **Nguyên nhân**: Method chưa được implement
- **Đã sửa**: Implement `getUserBookingById` trong BookingService
- **Cách test**:
```bash
GET http://localhost:8080/api/bookings/user/1
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 2. **API GET /api/bookings/user** - Lỗi 403
- **Nguyên nhân**: Access token không đúng hoặc hết hạn
- **Cách sửa**: 
  - Login lại để lấy access token mới
  - Đảm bảo user có booking trong database

### 3. **API GET /api/bookings/rooms/available** - Trả về empty
- **Nguyên nhân**: Không có dữ liệu rooms
- **Cách sửa**: Chạy script `CREATE_ROOMS_AND_TEST.sql`

### 4. **API GET /api/bookings/rooms/{roomId}** - Hibernate proxy error
- **Nguyên nhân**: `@ManyToOne(fetch = FetchType.LAZY)` gây lỗi proxy
- **Đã sửa**: Đổi thành `FetchType.EAGER`

## 🧪 **Test từng API:**

### **1. Tạo dữ liệu rooms:**
```sql
-- Chạy script CREATE_ROOMS_AND_TEST.sql
```

### **2. Test API xem phòng trống:**
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

### **3. Test API xem chi tiết phòng:**
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

### **4. Test API user booking:**

#### **Login để lấy access token:**
```bash
POST http://localhost:8080/api/auth/login
{
    "email": "test@hotelhub.com",
    "password": "test123"
}
```

#### **Tạo booking cho user:**
```bash
POST http://localhost:8080/api/bookings
Authorization: Bearer YOUR_ACCESS_TOKEN
{
    "roomId": 1,
    "checkIn": "2025-12-01",
    "checkOut": "2025-12-03",
    "guests": 2,
    "notes": "User booking test"
}
```

#### **Xem tất cả booking của user:**
```bash
GET http://localhost:8080/api/bookings
Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### **Xem chi tiết booking của user:**
```bash
GET http://localhost:8080/api/bookings/user/1
Authorization: Bearer YOUR_ACCESS_TOKEN
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
    "notes": "User booking test",
    "totalPrice": 1000000.0,
    "status": "pending",
    "createdAt": "2025-09-30T19:12:24.7478391",
    "holdUntil": "2025-09-30T19:17:24.7439237",
    "userName": "Test User",
    "userEmail": "test@hotelhub.com",
    "roomDescription": "Phòng đơn tiện nghi cơ bản",
    "roomCapacity": 1,
    "amenities": []
}
```

## 🔍 **Debug nếu vẫn có lỗi:**

### **1. Kiểm tra dữ liệu:**
```sql
-- Xem rooms
SELECT * FROM rooms;

-- Xem bookings
SELECT * FROM bookings;

-- Xem users
SELECT * FROM users;
```

### **2. Kiểm tra access token:**
```bash
# Test protected API
GET http://localhost:8080/api/test/protected
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### **3. Kiểm tra console log:**
- Xem có lỗi gì trong Spring Boot console
- Kiểm tra scheduled job có chạy không

## ✅ **Kết quả mong đợi sau khi sửa:**

1. **API xem phòng trống**: Trả về danh sách phòng available
2. **API xem chi tiết phòng**: Trả về thông tin phòng đầy đủ
3. **API xem booking user**: Trả về danh sách booking của user
4. **API xem chi tiết booking user**: Trả về thông tin booking chi tiết
5. **API tạo booking user**: Tạo booking thành công cho user đã login

## 🚀 **Bước tiếp theo:**

1. **Chạy script SQL** để tạo dữ liệu rooms
2. **Restart Spring Boot** để load lại code
3. **Test từng API** theo hướng dẫn
4. **Kiểm tra kết quả** và báo cáo lỗi nếu có
