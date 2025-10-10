# 💳 Payment API Reference

## 🔐 **Authentication**

### **Headers:**
```http
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>  # Chỉ cho User/Admin APIs
```

---

## 📝 **API Endpoints**

### **1. Guest Payment APIs (No Authentication Required)**

#### **Create Guest Payment**
```http
POST /api/payments/guest?guestEmail={email}
Content-Type: application/json

{
    "bookingId": 1,
    "amount": 3000000,
    "method": "credit_card"
}
```

**Response:**
```json
{
    "message": "Tạo payment thành công",
    "payment": {
        "paymentId": 1,
        "bookingId": 1,
        "bookingReference": "BK123456789",
        "amount": 3000000,
        "method": "credit_card",
        "status": "pending",
        "paidAt": null,
        "createdAt": "2024-12-25T10:00:00",
        "guestName": "Nguyen Van A",
        "guestEmail": "guest@example.com",
        "roomNumber": "101",
        "roomType": "Single",
        "checkIn": "2024-12-25T00:00:00",
        "checkOut": "2024-12-28T00:00:00",
        "guests": 2
    }
}
```

#### **Process Guest Payment**
```http
POST /api/payments/guest/{paymentId}/process?guestEmail={email}
```

**Response:**
```json
{
    "message": "Xử lý thanh toán thành công",
    "payment": {
        "paymentId": 1,
        "status": "success",
        "paidAt": "2024-12-25T10:05:00"
    }
}
```

#### **Get Guest Payment by Reference**
```http
GET /api/payments/guest/booking/reference/{bookingReference}?guestEmail={email}
```

#### **Get Guest Payments**
```http
GET /api/payments/guest?guestEmail={email}
```

**Response:**
```json
{
    "payments": [...],
    "count": 1
}
```

---

### **2. User Payment APIs (Authentication Required)**

#### **Create User Payment**
```http
POST /api/payments
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
    "bookingId": 2,
    "amount": 4000000,
    "method": "momo"
}
```

#### **Process User Payment**
```http
POST /api/payments/{paymentId}/process
Authorization: Bearer <JWT_TOKEN>
```

#### **Get User Payment by Booking ID**
```http
GET /api/payments/booking/{bookingId}
Authorization: Bearer <JWT_TOKEN>
```

#### **Get User Payment by Reference**
```http
GET /api/payments/booking/reference/{bookingReference}
Authorization: Bearer <JWT_TOKEN>
```

#### **Get User Payments**
```http
GET /api/payments/user
Authorization: Bearer <JWT_TOKEN>
```

#### **Update Payment Status**
```http
PUT /api/payments/{paymentId}/status
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
    "status": "success",
    "notes": "Payment confirmed manually"
}
```

---

### **3. Admin APIs (ROLE_ADMIN Required)**

#### **Get All Bookings**
```http
GET /api/admin/bookings
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

#### **Get Booking by ID**
```http
GET /api/admin/bookings/{bookingId}
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

#### **Get Booking by Reference**
```http
GET /api/admin/bookings/reference/{bookingReference}
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

---

## 💳 **Payment Methods**

### **Supported Methods:**
- `credit_card` - Thẻ tín dụng
- `paypal` - PayPal
- `momo` - MoMo
- `cash` - Tiền mặt

---

## 📊 **Payment Status**

### **Status Values:**
- `pending` - Chờ xử lý
- `success` - Thành công
- `failed` - Thất bại

---

## 🚨 **Error Responses**

### **Common Error Codes:**

#### **400 Bad Request**
```json
{
    "error": "Tạo payment thất bại",
    "message": "Booking không tồn tại"
}
```

#### **401 Unauthorized**
```json
{
    "error": "Unauthorized",
    "message": "JWT token không hợp lệ"
}
```

#### **403 Forbidden**
```json
{
    "error": "Forbidden",
    "message": "Bạn không có quyền truy cập"
}
```

#### **404 Not Found**
```json
{
    "error": "Not Found",
    "message": "Payment không tồn tại"
}
```

---

## 🎯 **Request/Response Examples**

### **Guest Payment Flow:**

#### **1. Create Guest Booking**
```http
POST /api/bookings/guest
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

#### **2. Create Guest Payment**
```http
POST /api/payments/guest?guestEmail=guest@example.com
Content-Type: application/json

{
    "bookingId": 1,
    "amount": 3000000,
    "method": "credit_card"
}
```

#### **3. Process Guest Payment**
```http
POST /api/payments/guest/1/process?guestEmail=guest@example.com
```

#### **4. Check Payment Status**
```http
GET /api/payments/guest/booking/reference/BK123456789?guestEmail=guest@example.com
```

---

### **User Payment Flow:**

#### **1. Login User**
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

#### **2. Create User Booking**
```http
POST /api/bookings
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

#### **3. Create User Payment**
```http
POST /api/payments
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
    "bookingId": 2,
    "amount": 4000000,
    "method": "momo"
}
```

#### **4. Process User Payment**
```http
POST /api/payments/2/process
Authorization: Bearer <JWT_TOKEN>
```

#### **5. Check Payment Status**
```http
GET /api/payments/booking/2
Authorization: Bearer <JWT_TOKEN>
```

---

## 🔧 **Testing**

### **Test Data:**
```json
{
    "roomId": 1,
    "checkIn": "2024-12-25",
    "checkOut": "2024-12-28",
    "guests": 2,
    "guestName": "Test Guest",
    "guestEmail": "test@example.com",
    "guestPhone": "0123456789"
}
```

### **Test Payment Methods:**
- `credit_card` - Test credit card payment
- `momo` - Test MoMo payment
- `paypal` - Test PayPal payment
- `cash` - Test cash payment

### **Test Scenarios:**
1. **Valid Payment** - Normal flow
2. **Invalid Booking ID** - Error handling
3. **Wrong Amount** - Validation
4. **Duplicate Payment** - Business logic
5. **Unauthorized Access** - Security

---

## 🚀 **Production Notes**

### **Environment Setup:**
- Database: MySQL 8.0+
- Java: 17+
- Spring Boot: 3.5.6+

### **Security:**
- JWT authentication for User/Admin APIs
- No authentication for Guest APIs
- Role-based authorization (ROLE_ADMIN)

### **Monitoring:**
- Payment processing logs
- Error tracking
- Performance metrics

**Payment API đã sẵn sàng production!** 🎉
