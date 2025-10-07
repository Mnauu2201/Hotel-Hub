# 🏨 RoomType CRUD API Test Guide

## 📋 **Danh sách APIs RoomType:**

### **1. Lấy tất cả loại phòng**
```bash
GET http://localhost:8080/api/room-types
```
**Expected:** Danh sách loại phòng hiện có

### **2. Lấy loại phòng theo ID**
```bash
GET http://localhost:8080/api/room-types/1
```
**Expected:** Chi tiết loại phòng ID 1

### **3. Tạo loại phòng mới (Cần Admin token)**
```bash
POST http://localhost:8080/api/room-types
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN

{
    "name": "Deluxe",
    "description": "Phòng cao cấp với đầy đủ tiện nghi"
}
```

### **4. Cập nhật loại phòng (Cần Admin token)**
```bash
PUT http://localhost:8080/api/room-types/1
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN

{
    "name": "Standard",
    "description": "Phòng tiêu chuẩn đã cập nhật"
}
```

### **5. Xóa loại phòng (Cần Admin token)**
```bash
DELETE http://localhost:8080/api/room-types/1
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
- **Status 404:** Không tìm thấy loại phòng

## 🚨 **Lưu ý:**
- **Không thể xóa** loại phòng nếu đang có phòng sử dụng
- **Tên loại phòng** phải unique
- **Validation** cho tên và mô tả
