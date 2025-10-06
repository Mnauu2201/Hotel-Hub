# 🏨 Room Image CRUD API Test Guide

## 📋 **Danh sách APIs Room Image:**

### **1. Lấy tất cả ảnh của phòng**
```bash
GET http://localhost:8080/api/rooms/1/images
```
**Expected:** Danh sách ảnh của phòng ID 1

### **2. Lấy ảnh chính của phòng**
```bash
GET http://localhost:8080/api/rooms/1/images/primary
```
**Expected:** Ảnh chính của phòng ID 1

### **3. Lấy ảnh theo ID**
```bash
GET http://localhost:8080/api/rooms/1/images/1
```
**Expected:** Chi tiết ảnh ID 1 của phòng ID 1

### **4. Thêm ảnh cho phòng (Cần Admin token)**
```bash
POST http://localhost:8080/api/rooms/1/images
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN

{
    "imageUrl": "https://example.com/room1-new.jpg",
    "altText": "Ảnh phòng mới",
    "isPrimary": false,
    "displayOrder": 2
}
```

### **5. Cập nhật ảnh phòng (Cần Admin token)**
```bash
PUT http://localhost:8080/api/rooms/1/images/1
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN

{
    "imageUrl": "https://example.com/room1-updated.jpg",
    "altText": "Ảnh phòng đã cập nhật",
    "isPrimary": true,
    "displayOrder": 1
}
```

### **6. Đặt ảnh làm ảnh chính (Cần Admin token)**
```bash
PUT http://localhost:8080/api/rooms/1/images/1/set-primary
Authorization: Bearer YOUR_ADMIN_TOKEN
```

### **7. Xóa ảnh phòng (Cần Admin token)**
```bash
DELETE http://localhost:8080/api/rooms/1/images/1
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
- **Status 404:** Không tìm thấy ảnh/phòng

## 🚨 **Lưu ý:**
- **Chỉ có 1 ảnh chính** cho mỗi phòng
- **Thứ tự hiển thị** theo displayOrder
- **Validation** cho URL ảnh và alt text
- **Admin only** cho CUD operations
- **Public** cho xem ảnh
