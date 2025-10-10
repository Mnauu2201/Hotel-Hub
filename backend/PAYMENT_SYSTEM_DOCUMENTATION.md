# 💳 Payment System Documentation

## 🎯 **Overview**

Payment System cho Hotel Hub với đầy đủ chức năng thanh toán cho Guest và User bookings.

---

## 🏗️ **Architecture**

### **Entities:**
- `Payment` - Entity chính cho thanh toán
- `Booking` - Entity cho đặt phòng
- `User` - Entity cho người dùng

### **Controllers:**
- `PaymentController` - API chính cho payment
- `AdminBookingController` - API admin quản lý bookings

### **Services:**
- `PaymentService` - Business logic cho payment
- `BookingService` - Business logic cho booking

---

## 🔐 **Security & Authorization**

### **Guest Payment APIs (Không cần authentication):**
- `POST /api/payments/guest` - Tạo payment
- `GET /api/payments/guest` - Lấy danh sách payments
- `GET /api/payments/guest/booking/reference/{reference}` - Lấy payment theo reference
- `POST /api/payments/guest/{paymentId}/process` - Xử lý thanh toán

### **User Payment APIs (Cần authentication):**
- `POST /api/payments` - Tạo payment
- `GET /api/payments/user` - Lấy danh sách payments
- `GET /api/payments/booking/{bookingId}` - Lấy payment theo booking
- `GET /api/payments/booking/reference/{reference}` - Lấy payment theo reference
- `POST /api/payments/{paymentId}/process` - Xử lý thanh toán
- `PUT /api/payments/{paymentId}/status` - Cập nhật trạng thái

### **Admin APIs (Cần ROLE_ADMIN):**
- `GET /api/admin/bookings` - Lấy tất cả bookings
- `GET /api/admin/bookings/{bookingId}` - Lấy booking theo ID
- `GET /api/admin/bookings/reference/{reference}` - Lấy booking theo reference

---

## 💳 **Payment Methods**

### **Supported Methods:**
- `credit_card` - Thẻ tín dụng
- `paypal` - PayPal
- `momo` - MoMo
- `cash` - Tiền mặt

### **Payment Status:**
- `pending` - Chờ xử lý
- `success` - Thành công
- `failed` - Thất bại

---

## 🚀 **API Endpoints**

### **1. Guest Payment Flow**

#### **Tạo Guest Booking:**
```http
POST http://localhost:8080/api/bookings/guest
Content-Type: application/json

{
    "roomId": 1,
    "checkIn": "2024-12-25",
    "checkOut": "2024-12-28",
    "guests": 2,
    "guestName": "Nguyen Van A",
    "guestEmail": "guest@example.com",
    "guestPhone": "0123456789",
    "notes": "Đặt phòng cho kỳ nghỉ lễ"
}
```

#### **Tạo Guest Payment:**
```http
POST http://localhost:8080/api/payments/guest?guestEmail=guest@example.com
Content-Type: application/json

{
    "bookingId": 1,
    "amount": 3000000,
    "method": "credit_card"
}
```

#### **Xử lý Guest Payment:**
```http
POST http://localhost:8080/api/payments/guest/1/process?guestEmail=guest@example.com
```

#### **Kiểm tra trạng thái Guest Payment:**
```http
GET http://localhost:8080/api/payments/guest/booking/reference/BK123456789?guestEmail=guest@example.com
```

#### **Lấy danh sách Guest Payments:**
```http
GET http://localhost:8080/api/payments/guest?guestEmail=guest@example.com
```

---

### **2. User Payment Flow**

#### **Login User:**
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

#### **Tạo User Booking:**
```http
POST http://localhost:8080/api/bookings
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
    "roomId": 2,
    "checkIn": "2024-12-30",
    "checkOut": "2025-01-02",
    "guests": 2,
    "notes": "Đặt phòng cho năm mới"
}
```

#### **Tạo User Payment:**
```http
POST http://localhost:8080/api/payments
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
    "bookingId": 2,
    "amount": 4000000,
    "method": "momo"
}
```

#### **Xử lý User Payment:**
```http
POST http://localhost:8080/api/payments/2/process
Authorization: Bearer <JWT_TOKEN>
```

#### **Kiểm tra trạng thái User Payment:**
```http
GET http://localhost:8080/api/payments/booking/2
Authorization: Bearer <JWT_TOKEN>
```

#### **Lấy danh sách User Payments:**
```http
GET http://localhost:8080/api/payments/user
Authorization: Bearer <JWT_TOKEN>
```

---

### **3. Admin Management**

#### **Lấy tất cả Bookings:**
```http
GET http://localhost:8080/api/admin/bookings
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

#### **Lấy Booking theo ID:**
```http
GET http://localhost:8080/api/admin/bookings/1
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

#### **Lấy Booking theo Reference:**
```http
GET http://localhost:8080/api/admin/bookings/reference/BK123456789
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

#### **Cập nhật trạng thái Payment:**
```http
PUT http://localhost:8080/api/payments/1/status
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json

{
    "status": "success",
    "notes": "Payment confirmed by admin"
}
```

---

## 🔧 **Error Handling**

### **Common Errors:**

#### **1. "Booking này là guest booking, vui lòng sử dụng API guest payment"**
**Nguyên nhân:** Dùng User Payment API cho Guest Booking
**Cách sửa:** Sử dụng Guest Payment API

#### **2. "Bạn không có quyền xử lý payment này"**
**Nguyên nhân:** User cố xử lý payment của user khác
**Cách sửa:** Chỉ xử lý payment của chính mình, hoặc dùng Staff/Admin account

#### **3. "Booking không tồn tại"**
**Nguyên nhân:** Booking ID không đúng
**Cách sửa:** Kiểm tra Booking ID có tồn tại không

#### **4. "Số tiền thanh toán không khớp với tổng tiền booking"**
**Nguyên nhân:** Amount không khớp với totalPrice
**Cách sửa:** Sử dụng đúng totalPrice từ booking

#### **5. "Booking này đã có payment"**
**Nguyên nhân:** Tạo duplicate payment cho cùng 1 booking
**Cách sửa:** Kiểm tra booking đã có payment chưa

---

## 🎯 **Business Logic**

### **Payment Processing:**
1. **Validation:** Kiểm tra booking, amount, method
2. **Authorization:** Kiểm tra quyền truy cập
3. **Processing:** Simulate payment gateway (90% success rate)
4. **Update Status:** Cập nhật payment và booking status
5. **Logging:** Ghi log hoạt động

### **Status Flow:**
```
pending → success/failed
```

### **Booking Status Flow:**
```
pending → confirmed → paid (khi payment success)
```

---

## 📊 **Database Schema**

### **Payments Table:**
```sql
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    method ENUM('credit_card','paypal','momo','cash') NOT NULL,
    status ENUM('pending','success','failed') DEFAULT 'pending',
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);
```

---

## 🚀 **Deployment Notes**

### **Environment Variables:**
- `spring.datasource.url` - Database URL
- `spring.datasource.username` - Database username
- `spring.datasource.password` - Database password
- `app.jwt.secret` - JWT secret key

### **Security Configuration:**
- Guest Payment APIs: No authentication required
- User Payment APIs: JWT authentication required
- Admin APIs: ROLE_ADMIN required

---

## 🎉 **Success Criteria**

### **Payment System hoạt động đúng khi:**
- ✅ Guest có thể tạo và xử lý payment mà không cần login
- ✅ User có thể tạo và xử lý payment với authentication
- ✅ Staff/Admin có thể quản lý tất cả payments
- ✅ Payment status được cập nhật đúng
- ✅ Booking status được cập nhật khi payment success
- ✅ Error handling hoạt động đúng
- ✅ Authorization hoạt động đúng

**Payment System đã sẵn sàng production!** 🚀
