# 🏨 Room CRUD API Test Guide

## 📋 **Danh sách APIs cần test:**

### **1. Lấy tất cả phòng**
```bash
GET http://localhost:8080/api/rooms
```
**Expected:** Danh sách phòng hiện có

### **2. Lấy phòng theo ID**
```bash
GET http://localhost:8080/api/rooms/1
```
**Expected:** Chi tiết phòng ID 1

### **3. Lấy phòng theo trạng thái**
```bash
GET http://localhost:8080/api/rooms/status/AVAILABLE
```
**Expected:** Danh sách phòng available

### **4. Lấy phòng theo loại**
```bash
GET http://localhost:8080/api/rooms/type/1
```
**Expected:** Danh sách phòng loại 1

### **5. Tạo phòng mới (Cần Admin token)**
```bash
POST http://localhost:8080/api/rooms
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN

{
    "roomNumber": "201",
    "roomTypeId": 1,
    "price": 1000000,
    "status": "AVAILABLE",
    "capacity": 2,
    "description": "Phòng test mới",
    "bedType": "Double Bed",
    "roomSize": 30.0,
    "floor": 2,
    "viewType": "City View",
    "smokingAllowed": false,
    "petFriendly": true,
    "wifiSpeed": "100Mbps",
    "airConditioning": true,
    "minibar": true,
    "balcony": true,
    "oceanView": false,
    "amenityIds": [1, 2, 3],
    "imageUrls": ["https://example.com/room201-1.jpg"]
}
```

### **6. Cập nhật phòng (Cần Admin token)**
```bash
PUT http://localhost:8080/api/rooms/1
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN

{
    "roomNumber": "101",
    "roomTypeId": 1,
    "price": 600000,
    "status": "AVAILABLE",
    "capacity": 2,
    "description": "Phòng đã cập nhật"
}
```

### **7. Xóa phòng (Cần Admin token)**
```bash
DELETE http://localhost:8080/api/rooms/1
Authorization: Bearer YOUR_ADMIN_TOKEN
```

## 🔧 **Lấy Admin Token:**
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
    "email": "admin1@hotelhub.com",
    "password": "admin123"
}
```

## ✅ **Kiểm tra kết quả:**
- **Status 200:** API hoạt động
- **Status 403:** Cần đăng nhập admin
- **Status 500:** Có lỗi server
- **Status 404:** Không tìm thấy phòng
