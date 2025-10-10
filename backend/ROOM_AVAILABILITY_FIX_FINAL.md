# 🔧 Room Availability Fix - Final

## 🚨 **Vấn đề đã xác định:**

### **Booking pending nhưng room vẫn AVAILABLE:**
- **Booking status:** "pending" ✅
- **Room status:** "AVAILABLE" ❌ (sai)
- **Expected:** Room should be blocked

### **Query hiện tại có lỗi:**
```sql
-- RoomRepository.java - Query có vấn đề
SELECT r FROM Room r WHERE r.status = 'AVAILABLE' 
AND r.roomId NOT IN (
    SELECT b.roomId FROM Booking b WHERE 
    b.status IN ('pending', 'confirmed') 
    AND ((b.checkIn <= :checkOut AND b.checkOut >= :checkIn) 
    OR (b.holdUntil IS NOT NULL AND b.holdUntil > CURRENT_TIMESTAMP))
)
```

### **Vấn đề với query:**
1. **Date overlap logic sai:** `b.checkIn <= :checkOut AND b.checkOut >= :checkIn`
2. **Hold time logic có thể gây conflict**
3. **Query có thể không được execute đúng**

---

## 🔧 **Cách sửa:**

### **Option 1: Sửa date overlap logic**
```sql
-- Sửa logic date overlap
AND ((b.checkIn < :checkOut AND b.checkOut > :checkIn) 
OR (b.holdUntil IS NOT NULL AND b.holdUntil > CURRENT_TIMESTAMP))
```

### **Option 2: Debug query thực tế**
```sql
-- Test query thủ công
SELECT r.room_id, r.room_number, r.status 
FROM rooms r 
WHERE r.status = 'available' 
AND r.room_id NOT IN (
    SELECT b.room_id FROM bookings b 
    WHERE b.status IN ('pending', 'confirmed') 
    AND ((b.check_in < '2025-10-13' AND b.check_out > '2025-10-11') 
    OR (b.hold_until IS NOT NULL AND b.hold_until > NOW()))
);
```

### **Option 3: Kiểm tra booking overlap**
```sql
-- Kiểm tra booking có overlap không
SELECT b.room_id, b.check_in, b.check_out, b.status, b.hold_until
FROM bookings b 
WHERE b.room_id = 1 
AND b.status IN ('pending', 'confirmed')
AND ((b.check_in < '2025-10-13' AND b.check_out > '2025-10-11') 
OR (b.hold_until IS NOT NULL AND b.hold_until > NOW()));
```

---

## 🧪 **Test để xác nhận:**

### **Step 1: Kiểm tra booking pending**
```sql
SELECT booking_id, room_id, check_in, check_out, status, hold_until
FROM bookings 
WHERE status = 'pending' 
AND room_id = 1;
```

### **Step 2: Test query overlap**
```sql
-- Test query overlap với logic mới
SELECT b.room_id, b.check_in, b.check_out, b.status
FROM bookings b 
WHERE b.room_id = 1 
AND b.status IN ('pending', 'confirmed')
AND b.check_in < '2025-10-13' 
AND b.check_out > '2025-10-11';
```

### **Step 3: Test room availability**
```http
GET http://localhost:8080/api/rooms/available?checkIn=2025-10-11&checkOut=2025-10-13
```

---

## 🎯 **Expected Results:**

### **Nếu query hoạt động đúng:**
- Room 1 KHÔNG xuất hiện trong danh sách available
- Chỉ có Room 4, 5, 6 xuất hiện

### **Nếu query có lỗi:**
- Room 1 vẫn xuất hiện trong danh sách (như hiện tại)

---

## 🚨 **Cần sửa ngay:**

1. **Sửa date overlap logic** trong RoomRepository.java
2. **Test query thủ công** để verify
3. **Kiểm tra booking overlap** có trả về dữ liệu không
4. **Verify room availability** hoạt động đúng

**Hãy sửa query logic để room availability hoạt động đúng!** 🔧
