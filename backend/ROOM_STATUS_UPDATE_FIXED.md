# ✅ Room Status Update Fixed

## 🔧 **Đã sửa xong Room Status Updates!**

### **Thay đổi đã thực hiện:**

#### **1. Cập nhật room status khi tạo booking:**
```java
// BookingService.java - createGuestBooking()
booking = bookingRepository.save(booking);

// Cập nhật room status thành BOOKED
room.setStatus(RoomStatus.BOOKED);
roomRepository.save(room);
```

#### **2. Cập nhật room status khi tạo user booking:**
```java
// BookingService.java - createUserBooking()
booking = bookingRepository.save(booking);

// Cập nhật room status thành BOOKED
room.setStatus(RoomStatus.BOOKED);
roomRepository.save(room);
```

#### **3. Cập nhật room status khi hủy booking:**
```java
// BookingService.java - updateBookingStatus()
// Nếu booking bị hủy, cập nhật room status về AVAILABLE
if ("cancelled".equals(newStatus)) {
    Room room = roomRepository.findById(booking.getRoomId()).orElse(null);
    if (room != null) {
        room.setStatus(RoomStatus.AVAILABLE);
        roomRepository.save(room);
    }
}
```

---

## 🎯 **Room Status Flow hoàn chỉnh:**

### **1. Tạo Booking:**
```
Room Status: AVAILABLE → BOOKED
Booking Status: pending
```

### **2. Booking Confirmed:**
```
Room Status: BOOKED (giữ nguyên)
Booking Status: pending → confirmed
```

### **3. Booking Cancelled:**
```
Room Status: BOOKED → AVAILABLE
Booking Status: pending/confirmed → cancelled
```

### **4. Booking Paid:**
```
Room Status: BOOKED (giữ nguyên)
Booking Status: pending/confirmed → paid
```

---

## 🧪 **Test để verify:**

### **Step 1: Tạo booking mới**
```http
POST http://localhost:8080/api/bookings/guest
Content-Type: application/json

{
    "roomId": 1,
    "checkIn": "2025-10-15",
    "checkOut": "2025-10-17",
    "guests": 2,
    "guestName": "Test Guest",
    "guestEmail": "test@example.com",
    "guestPhone": "0123456789"
}
```

**Expected Result:**
- ✅ Booking được tạo với status = "pending"
- ✅ Room 1 status = "BOOKED" (thay vì AVAILABLE)

### **Step 2: Kiểm tra room status**
```http
GET http://localhost:8080/api/rooms/1
```

**Expected Result:**
```json
{
    "roomId": 1,
    "roomNumber": "101",
    "status": "BOOKED",  // <-- Đã được cập nhật
    "price": 600000.00,
    "capacity": 2
}
```

### **Step 3: Hủy booking**
```http
PUT http://localhost:8080/api/admin/bookings/{bookingId}/status
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json

{
    "status": "cancelled"
}
```

**Expected Result:**
- ✅ Booking status = "cancelled"
- ✅ Room 1 status = "AVAILABLE" (được giải phóng)

---

## 🎊 **Kết quả:**

**Room status bây giờ được cập nhật đúng:**
- ✅ **Tạo booking** → Room status = BOOKED
- ✅ **Hủy booking** → Room status = AVAILABLE
- ✅ **Room availability logic** hoạt động đúng
- ✅ **Room status** đồng bộ với booking status

**Hãy test lại để verify room status updates!** 🚀
