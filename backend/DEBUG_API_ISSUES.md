# Debug API Issues

## 🔍 **Các vấn đề hiện tại:**

### **1. Lỗi 403 Forbidden:**
- `GET /api/bookings` - Xem tất cả booking của user
- `GET /api/bookings/user/7` - Xem chi tiết booking của user  
- `PUT /api/bookings/user/{bookingId}/cancel` - Hủy booking của user
- `POST /api/admin/cancel-expired-bookings` - Hủy booking hết hạn

### **2. Lỗi Request Body:**
- `POST /api/bookings/guest` - "Required request body is missing"

## 🛠️ **Giải pháp:**

### **Bước 1: Kiểm tra Access Token**

#### **1.1. Login để lấy access token:**
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
    "email": "test@hotelhub.com",
    "password": "test123"
}
```

#### **1.2. Kiểm tra response có đúng format không:**
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "...",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "email": "test@hotelhub.com",
    "name": "Test User",
    "roles": ["ROLE_CUSTOMER"]
}
```

#### **1.3. Sử dụng access token đúng cách:**
```bash
GET http://localhost:8080/api/bookings
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

### **Bước 2: Test Guest Booking (Sửa lỗi Request Body)**

#### **2.1. Test với Postman:**
```bash
POST http://localhost:8080/api/bookings/guest
Content-Type: application/json

{
    "roomId": 1,
    "checkIn": "2025-12-01",
    "checkOut": "2025-12-03",
    "guests": 2,
    "notes": "Test booking",
    "guestName": "Test Guest",
    "guestEmail": "test@example.com",
    "guestPhone": "0123456789"
}
```

#### **2.2. Kiểm tra request body:**
- Đảm bảo có `Content-Type: application/json`
- Đảm bảo JSON format đúng
- Đảm bảo tất cả fields required có giá trị

### **Bước 3: Test User Booking APIs**

#### **3.1. Test xem tất cả booking:**
```bash
GET http://localhost:8080/api/bookings
Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### **3.2. Test xem chi tiết booking:**
```bash
GET http://localhost:8080/api/bookings/user/7
Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### **3.3. Test hủy booking:**
```bash
PUT http://localhost:8080/api/bookings/user/7/cancel
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### **Bước 4: Test Admin APIs**

#### **4.1. Login admin:**
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
    "email": "admin1@hotelhub.com",
    "password": "123123123"
}
```

#### **4.2. Test admin API:**
```bash
POST http://localhost:8080/api/admin/cancel-expired-bookings
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

## 🔧 **Debug chi tiết:**

### **1. Kiểm tra SecurityConfig:**
- URL patterns có đúng không
- Role requirements có đúng không
- CORS configuration có đúng không

### **2. Kiểm tra JwtAuthenticationFilter:**
- Bypass URLs có đúng không
- Token validation có hoạt động không
- UserDetails loading có đúng không

### **3. Kiểm tra Console Log:**
- Có lỗi authentication không
- Có lỗi authorization không
- Có lỗi request parsing không

### **4. Kiểm tra Database:**
- User có tồn tại không
- User có role đúng không
- Booking có tồn tại không

## 📋 **Checklist Debug:**

### **Authentication:**
- [ ] Login thành công
- [ ] Access token được tạo
- [ ] Token format đúng
- [ ] Token chưa hết hạn

### **Authorization:**
- [ ] User có role đúng
- [ ] SecurityConfig cho phép URL
- [ ] JwtAuthenticationFilter bypass đúng
- [ ] UserDetails loading thành công

### **Request:**
- [ ] Content-Type đúng
- [ ] JSON format đúng
- [ ] Required fields có giá trị
- [ ] URL path đúng

### **Response:**
- [ ] Status code đúng
- [ ] Response body có dữ liệu
- [ ] Không có lỗi server

## 🚨 **Common Issues:**

### **1. Access Token Issues:**
- Token hết hạn → Login lại
- Token format sai → Kiểm tra "Bearer " prefix
- Token không đúng user → Login với user đúng

### **2. Role Issues:**
- User không có role → Kiểm tra database
- Role không đúng → Cập nhật user_roles table
- SecurityConfig không cho phép → Cập nhật SecurityConfig

### **3. Request Body Issues:**
- Content-Type missing → Thêm "Content-Type: application/json"
- JSON format sai → Kiểm tra syntax
- Required fields missing → Thêm tất cả fields

### **4. URL Issues:**
- URL path sai → Kiểm tra endpoint
- HTTP method sai → Kiểm tra method (GET, POST, PUT)
- Parameters sai → Kiểm tra path variables

## 🎯 **Expected Results:**

### **User APIs:**
```json
// GET /api/bookings
{
    "bookings": [...],
    "count": 1
}

// GET /api/bookings/user/7
{
    "bookingId": 7,
    "status": "pending",
    ...
}
```

### **Admin APIs:**
```json
// POST /api/admin/cancel-expired-bookings
{
    "message": "Đã chạy scheduled job để hủy booking hết hạn"
}
```

### **Guest Booking:**
```json
// POST /api/bookings/guest
{
    "message": "Tạo booking thành công",
    "booking": {
        "bookingId": 1,
        "bookingReference": "BK...",
        ...
    }
}
```
