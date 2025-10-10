# 🔧 Payment Admin Fix

## ✅ **Đã sửa lỗi authorization!**

### **Vấn đề đã sửa:**
- ❌ Admin không thể tạo payment cho booking của user khác
- ✅ Đã sửa logic authorization để cho phép Admin tạo payment cho bất kỳ ai
- ✅ User vẫn chỉ có thể tạo payment cho chính mình

---

## 🎯 **Test với Admin:**

### **URL:**
```http
POST http://localhost:8080/api/payments
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json

{
    "bookingId": 27,
    "amount": 1500000,
    "method": "momo"
}
```

### **Expected Response:**
```json
{
    "message": "Tạo payment thành công",
    "payment": {
        "paymentId": 1,
        "bookingId": 27,
        "amount": 1500000,
        "method": "momo",
        "status": "pending"
    }
}
```

---

## 🔍 **Kiểm tra booking trước:**

### **Kiểm tra booking có tồn tại không:**
```http
GET http://localhost:8080/api/admin/bookings/27
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

### **Kiểm tra booking có thể thanh toán không:**
- Status phải là `"pending"` hoặc `"confirmed"`
- Không phải `"paid"` hoặc `"cancelled"`

---

## 🚨 **Các lỗi có thể gặp:**

### **1. Booking không tồn tại:**
```json
{
    "error": "Tạo payment thất bại",
    "message": "Booking không tồn tại"
}
```

### **2. Booking đã thanh toán:**
```json
{
    "error": "Tạo payment thất bại",
    "message": "Booking không thể thanh toán. Trạng thái hiện tại: paid"
}
```

### **3. Booking đã có payment:**
```json
{
    "error": "Tạo payment thất bại",
    "message": "Booking này đã có payment"
}
```

### **4. Số tiền không khớp:**
```json
{
    "error": "Tạo payment thất bại",
    "message": "Số tiền thanh toán không khớp với tổng tiền booking"
}
```

---

## 🎯 **Test Flow hoàn chỉnh:**

### **Step 1: Login Admin**
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
    "email": "admin@example.com",
    "password": "password123"
}
```

### **Step 2: Kiểm tra booking**
```http
GET http://localhost:8080/api/admin/bookings/27
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

### **Step 3: Tạo payment (nếu booking hợp lệ)**
```http
POST http://localhost:8080/api/payments
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json

{
    "bookingId": 27,
    "amount": 1500000,
    "method": "momo"
}
```

### **Step 4: Xử lý thanh toán**
```http
POST http://localhost:8080/api/payments/1/process
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

---

## 🎉 **Kết quả:**

**Admin bây giờ có thể tạo payment cho bất kỳ user nào!**
- ✅ User tạo payment cho chính mình
- ✅ Admin tạo payment cho bất kỳ ai
- ✅ Authorization hoạt động đúng
- ✅ Business logic được bảo vệ

**Hãy test lại với Admin token!** 🚀
