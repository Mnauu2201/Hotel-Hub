# 🏨 Amenity CRUD API Test Guide

## 📋 **Danh sách APIs Amenity:**

### **1. Lấy tất cả tiện ích**
```bash
GET http://localhost:8080/api/amenities
```
**Expected:** Danh sách tiện ích hiện có

### **2. Lấy tiện ích theo ID**
```bash
GET http://localhost:8080/api/amenities/1
```
**Expected:** Chi tiết tiện ích ID 1

### **3. Tìm kiếm tiện ích theo tên**
```bash
GET http://localhost:8080/api/amenities/search?name=WiFi
```
**Expected:** Danh sách tiện ích có tên chứa "WiFi"

### **4. Tạo tiện ích mới (Cần Admin token)**
```bash
POST http://localhost:8080/api/amenities
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN

{
    "name": "Swimming Pool",
    "description": "Hồ bơi ngoài trời",
    "icon": "pool"
}
```

### **5. Cập nhật tiện ích (Cần Admin token)**
```bash
PUT http://localhost:8080/api/amenities/1
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN

{
    "name": "Free WiFi",
    "description": "WiFi miễn phí tốc độ cao",
    "icon": "wifi"
}
```

### **6. Xóa tiện ích (Cần Admin token)**
```bash
DELETE http://localhost:8080/api/amenities/1
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
- **Status 404:** Không tìm thấy tiện ích

## 🚨 **Lưu ý:**
- **Không thể xóa** tiện ích nếu đang có phòng sử dụng
- **Tên tiện ích** phải unique
- **Validation** cho tên, mô tả và icon
- **Tìm kiếm** không phân biệt hoa thường
