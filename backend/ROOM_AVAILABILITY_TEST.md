# 🧪 Room Availability Test Guide

## 🔍 **Vấn đề đã phát hiện:**

### **Tất cả booking trong database đều có status = "cancelled":**
```sql
-- Từ hotel_booking (2).sql
INSERT INTO `bookings` VALUES
(1, NULL, 1, '2025-12-01', '2025-12-03', 2, 'Yêu cầu phòng tầng cao siêu cao', 1000000.00, 'cancelled', ...),
(2, NULL, 2, '2025-12-01', '2025-12-03', 10, 'test', 1600000.00, 'cancelled', ...),
(3, NULL, 1, '2025-12-10', '2025-12-13', 2, 'Test booking for auto-cancel', 1500000.00, 'cancelled', ...),
(4, 7, 1, '2025-10-05', '2025-10-08', 2, NULL, 1500000.00, 'cancelled', ...)
```

### **Room availability logic chỉ check booking có status = 'pending' hoặc 'confirmed':**
```sql
-- Trong RoomRepository.java
SELECT r FROM Room r WHERE r.status = 'AVAILABLE' 
AND r.roomId NOT IN (
    SELECT b.roomId FROM Booking b WHERE 
    b.status IN ('pending', 'confirmed')  -- <-- Chỉ check pending/confirmed
    AND ((b.checkIn <= :checkOut AND b.checkOut >= :checkIn) 
    OR (b.holdUntil IS NOT NULL AND b.holdUntil > CURRENT_TIMESTAMP))
)
```

---

## 🧪 **Test để xác nhận:**

### **Step 1: Tạo booking active**
```http
POST http://localhost:8080/api/bookings/guest
Content-Type: application/json

{
    "roomId": 1,
    "checkIn": "2025-10-11",
    "checkOut": "2025-10-13",
    "guests": 2,
    "guestName": "Test Guest",
    "guestEmail": "test@example.com",
    "guestPhone": "0123456789"
}
```

**Expected Result:**
- ✅ Booking được tạo với status = "pending"
- ✅ Room 1 sẽ bị block từ 11/10 đến 13/10

### **Step 2: Test room availability**
```http
GET http://localhost:8080/api/rooms/available?checkIn=2025-10-11&checkOut=2025-10-13
```

**Expected Result:**
- ❌ Room 1 KHÔNG xuất hiện trong danh sách
- ✅ Chỉ có Room 4, 5, 6 (không bị book)

### **Step 3: Test room availability khác thời gian**
```http
GET http://localhost:8080/api/rooms/available?checkIn=2025-10-14&checkOut=2025-10-16
```

**Expected Result:**
- ✅ Room 1 xuất hiện trong danh sách (vì booking đã kết thúc 13/10)

---

## 🔧 **Cách sửa lỗi:**

### **Option 1: Tạo booking test**
Tạo booking với status = "pending" hoặc "confirmed" để test

### **Option 2: Sửa query để include "paid" status**
```sql
-- Sửa RoomRepository.java
b.status IN ('pending', 'confirmed', 'paid')  -- Thêm 'paid'
```

### **Option 3: Kiểm tra database**
Kiểm tra xem có booking nào active không

---

## 🎯 **Kết luận:**

**Room availability logic hoạt động đúng, nhưng:**
- ❌ Không có booking active nào trong database
- ✅ Tất cả booking đều bị cancelled
- ✅ Logic query chỉ check pending/confirmed booking
- ✅ Cần tạo booking test để verify

**Hãy tạo booking test để kiểm tra room availability!** 🏨✨
