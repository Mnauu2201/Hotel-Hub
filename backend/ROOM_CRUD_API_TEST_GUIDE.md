# 🏨 Room CRUD API Test Guide - HotelHub

## 📋 **Tổng quan**
- **Backend URL:** `http://localhost:8080`
- **Room CRUD APIs:** `/api/rooms/**`
- **Authentication:** JWT + Role-based access
- **Status:** ✅ Tất cả Room CRUD APIs đã sẵn sàng test

---

## 🔐 **1. AUTHENTICATION (Cần thiết cho Admin APIs)**

### **1.1 Admin Login**
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
    "email": "admin1@hotelhub.com",
    "password": "admin123"
}
```

**Lưu access token để sử dụng cho Admin APIs**

---

## 🏨 **2. ROOM CRUD APIs**

### **2.1 Create Room (Admin only)**
```bash
POST http://localhost:8080/api/rooms
Content-Type: application/json
Authorization: Bearer ADMIN_ACCESS_TOKEN

{
    "roomNumber": "103",
    "roomTypeId": 1,
    "price": 600000,
    "status": "AVAILABLE",
    "capacity": 2,
    "description": "Phòng đôi mới với view đẹp",
    "bedType": "Double Bed",
    "roomSize": 30.0,
    "floor": 2,
    "viewType": "Garden View",
    "smokingAllowed": false,
    "petFriendly": true,
    "wifiSpeed": "200Mbps",
    "airConditioning": true,
    "minibar": true,
    "balcony": true,
    "oceanView": false,
    "amenityIds": [1, 2, 3, 4, 5],
    "imageUrls": [
        "https://example.com/room103-1.jpg",
        "https://example.com/room103-2.jpg"
    ]
}
```

**Kết quả mong đợi:**
```json
{
    "message": "Tạo phòng thành công",
    "room": {
        "roomId": 4,
        "roomNumber": "103",
        "roomTypeId": 1,
        "roomTypeName": "Single",
        "price": 600000,
        "status": "AVAILABLE",
        "capacity": 2,
        "description": "Phòng đôi mới với view đẹp",
        "createdAt": "2025-10-02T20:00:00",
        "updatedAt": "2025-10-02T20:00:00",
        "roomDetail": {
            "bedType": "Double Bed",
            "roomSize": 30.0,
            "floor": 2,
            "viewType": "Garden View",
            "smokingAllowed": false,
            "petFriendly": true,
            "wifiSpeed": "200Mbps",
            "airConditioning": true,
            "minibar": true,
            "balcony": true,
            "oceanView": false
        },
        "images": [
            {
                "imageId": 1,
                "imageUrl": "https://example.com/room103-1.jpg",
                "altText": null,
                "isPrimary": true,
                "displayOrder": 0
            },
            {
                "imageId": 2,
                "imageUrl": "https://example.com/room103-2.jpg",
                "altText": null,
                "isPrimary": false,
                "displayOrder": 1
            }
        ],
        "amenities": [
            {
                "amenityId": 1,
                "name": "WiFi",
                "description": "Miễn phí WiFi tốc độ cao",
                "icon": "wifi"
            },
            {
                "amenityId": 2,
                "name": "TV",
                "description": "TV màn hình phẳng 55 inch",
                "icon": "tv"
            }
        ]
    }
}
```

### **2.2 Get All Rooms (Public)**
```bash
GET http://localhost:8080/api/rooms
```

**Kết quả mong đợi:**
```json
{
    "rooms": [
        {
            "roomId": 1,
            "roomNumber": "101",
            "roomTypeId": 1,
            "roomTypeName": "Single",
            "price": 500000,
            "status": "AVAILABLE",
            "capacity": 1,
            "description": "Phòng đơn tiện nghi cơ bản với đầy đủ tiện nghi",
            "createdAt": "2025-10-02T20:00:00",
            "updatedAt": "2025-10-02T20:00:00",
            "roomDetail": { ... },
            "images": [ ... ],
            "amenities": [ ... ]
        }
    ],
    "count": 3
}
```

### **2.3 Get Room by ID (Public)**
```bash
GET http://localhost:8080/api/rooms/1
```

**Kết quả mong đợi:**
```json
{
    "roomId": 1,
    "roomNumber": "101",
    "roomTypeId": 1,
    "roomTypeName": "Single",
    "price": 500000,
    "status": "AVAILABLE",
    "capacity": 1,
    "description": "Phòng đơn tiện nghi cơ bản với đầy đủ tiện nghi",
    "createdAt": "2025-10-02T20:00:00",
    "updatedAt": "2025-10-02T20:00:00",
    "roomDetail": { ... },
    "images": [ ... ],
    "amenities": [ ... ]
}
```

### **2.4 Get Rooms by Status (Public)**
```bash
GET http://localhost:8080/api/rooms/status/AVAILABLE
```

**Kết quả mong đợi:**
```json
{
    "rooms": [ ... ],
    "count": 3,
    "status": "AVAILABLE"
}
```

### **2.5 Get Rooms by Type (Public)**
```bash
GET http://localhost:8080/api/rooms/type/1
```

**Kết quả mong đợi:**
```json
{
    "rooms": [ ... ],
    "count": 2,
    "roomTypeId": 1
}
```

### **2.6 Get Available Rooms (Public)**
```bash
GET http://localhost:8080/api/rooms/available
```

**Kết quả mong đợi:**
```json
{
    "rooms": [ ... ],
    "count": 3,
    "status": "available"
}
```

### **2.7 Update Room (Admin only)**
```bash
PUT http://localhost:8080/api/rooms/1
Content-Type: application/json
Authorization: Bearer ADMIN_ACCESS_TOKEN

{
    "roomNumber": "101",
    "roomTypeId": 1,
    "price": 550000,
    "status": "AVAILABLE",
    "capacity": 1,
    "description": "Phòng đơn tiện nghi cơ bản - đã cập nhật",
    "bedType": "Single Bed",
    "roomSize": 25.0,
    "floor": 1,
    "viewType": "City View",
    "smokingAllowed": false,
    "petFriendly": false,
    "wifiSpeed": "100Mbps",
    "airConditioning": true,
    "minibar": false,
    "balcony": false,
    "oceanView": false,
    "amenityIds": [1, 2, 3, 9],
    "imageUrls": [
        "https://example.com/room101-updated-1.jpg",
        "https://example.com/room101-updated-2.jpg"
    ]
}
```

**Kết quả mong đợi:**
```json
{
    "message": "Cập nhật phòng thành công",
    "room": {
        "roomId": 1,
        "roomNumber": "101",
        "roomTypeId": 1,
        "roomTypeName": "Single",
        "price": 550000,
        "status": "AVAILABLE",
        "capacity": 1,
        "description": "Phòng đơn tiện nghi cơ bản - đã cập nhật",
        "createdAt": "2025-10-02T20:00:00",
        "updatedAt": "2025-10-02T20:05:00",
        "roomDetail": { ... },
        "images": [ ... ],
        "amenities": [ ... ]
    }
}
```

### **2.8 Delete Room (Admin only)**
```bash
DELETE http://localhost:8080/api/rooms/4
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

**Kết quả mong đợi:**
```json
{
    "message": "Xóa phòng thành công"
}
```

---

## 🧪 **3. TESTING WORKFLOW**

### **3.1 Complete Admin Flow**
1. **Admin Login** → Get access token
2. **Create Room** → Test tạo phòng mới
3. **Get All Rooms** → Kiểm tra phòng vừa tạo
4. **Update Room** → Test cập nhật phòng
5. **Get Room by ID** → Kiểm tra phòng đã cập nhật
6. **Delete Room** → Test xóa phòng

### **3.2 Complete Public Flow**
1. **Get All Rooms** → Xem tất cả phòng
2. **Get Room by ID** → Xem chi tiết phòng
3. **Get Rooms by Status** → Lọc phòng theo trạng thái
4. **Get Rooms by Type** → Lọc phòng theo loại
5. **Get Available Rooms** → Xem phòng trống

---

## 🔍 **4. DEBUG APIs**

### **4.1 Debug Room Data**
```sql
-- Kiểm tra dữ liệu phòng
SELECT 
    r.room_id,
    r.room_number,
    r.price,
    r.status,
    r.capacity,
    r.description,
    rt.name as room_type
FROM rooms r
LEFT JOIN room_types rt ON r.type_id = rt.type_id
ORDER BY r.room_id;
```

### **4.2 Debug Room Details**
```sql
-- Kiểm tra room details
SELECT 
    rd.detail_id,
    rd.room_id,
    rd.bed_type,
    rd.room_size,
    rd.floor,
    rd.view_type
FROM room_details rd
ORDER BY rd.room_id;
```

### **4.3 Debug Room Amenities**
```sql
-- Kiểm tra amenities
SELECT 
    ra.room_id,
    ra.amenity_id,
    a.name as amenity_name
FROM room_amenities ra
JOIN amenities a ON ra.amenity_id = a.amenity_id
ORDER BY ra.room_id;
```

---

## ✅ **5. SUCCESS CRITERIA**

### **5.1 Room CRUD**
- ✅ Create room with all details
- ✅ Read all rooms and single room
- ✅ Update room information
- ✅ Delete room
- ✅ Filter rooms by status/type

### **5.2 Room Details**
- ✅ Room detail information
- ✅ Room images management
- ✅ Room amenities management
- ✅ Backward compatibility

### **5.3 Security**
- ✅ Public read access
- ✅ Admin-only write access
- ✅ Role-based authorization

---

## 🚨 **6. COMMON ISSUES & SOLUTIONS**

### **6.1 403 Forbidden**
- **Cause:** Missing or invalid admin access token
- **Solution:** Include `Authorization: Bearer ADMIN_ACCESS_TOKEN` header

### **6.2 400 Bad Request**
- **Cause:** Invalid request body or missing required fields
- **Solution:** Check JSON format and required fields

### **6.3 500 Internal Server Error**
- **Cause:** Database connection or entity relationship issues
- **Solution:** Check database connection and entity mappings

### **6.4 Room Number Duplicate**
- **Cause:** Room number already exists
- **Solution:** Use unique room number

---

## 🎉 **CONCLUSION**

Room CRUD system đã hoàn thiện với:
- **Full CRUD operations** cho Room
- **Room details, images, amenities** management
- **Role-based access control**
- **Backward compatibility** với APIs hiện tại
- **Public read access** và **Admin write access**

**Tất cả Room CRUD APIs đã sẵn sàng test!** 🚀

