# 🐛 Room Availability Debug

## 🔍 **Vấn đề đã phát hiện:**

### **Booking vừa tạo:**
- **Booking ID:** BK1760083491375D0E7E8
- **Room ID:** 1
- **Check In:** 2025-10-11
- **Check Out:** 2025-10-13
- **Status:** "pending"
- **Hold Until:** 2025-10-10T15:09:51 (5 phút từ khi tạo)

### **Query hiện tại có vấn đề:**
```sql
-- RoomRepository.java - Query hiện tại
SELECT r FROM Room r WHERE r.status = 'AVAILABLE' 
AND r.roomId NOT IN (
    SELECT b.roomId FROM Booking b WHERE 
    b.status IN ('pending', 'confirmed') 
    AND ((b.checkIn <= :checkOut AND b.checkOut >= :checkIn) 
    OR (b.holdUntil IS NOT NULL AND b.holdUntil > CURRENT_TIMESTAMP))
)
```

### **Vấn đề với query:**
1. **Logic date overlap sai:** `b.checkIn <= :checkOut AND b.checkOut >= :checkIn`
2. **Hold time logic có thể gây conflict**
3. **Cần debug để xem query thực tế**

---

## 🧪 **Debug Steps:**

### **Step 1: Kiểm tra booking trong database**
```sql
SELECT * FROM bookings WHERE booking_reference = 'BK1760083491375D0E7E8';
```

### **Step 2: Test query thủ công**
```sql
-- Test query availability
SELECT r.room_id, r.room_number, r.status 
FROM rooms r 
WHERE r.status = 'available' 
AND r.room_id NOT IN (
    SELECT b.room_id FROM bookings b 
    WHERE b.status IN ('pending', 'confirmed') 
    AND ((b.check_in <= '2025-10-13' AND b.check_out >= '2025-10-11') 
    OR (b.hold_until IS NOT NULL AND b.hold_until > NOW()))
);
```

### **Step 3: Kiểm tra booking overlap**
```sql
-- Kiểm tra booking có overlap không
SELECT b.room_id, b.check_in, b.check_out, b.status, b.hold_until
FROM bookings b 
WHERE b.room_id = 1 
AND b.status IN ('pending', 'confirmed')
AND ((b.check_in <= '2025-10-13' AND b.check_out >= '2025-10-11') 
OR (b.hold_until IS NOT NULL AND b.hold_until > NOW()));
```

---

## 🔧 **Cách sửa:**

### **Option 1: Sửa query logic**
```sql
-- Sửa logic date overlap
AND ((b.check_in < :checkOut AND b.check_out > :checkIn) 
OR (b.hold_until IS NOT NULL AND b.hold_until > CURRENT_TIMESTAMP))
```

### **Option 2: Debug query thực tế**
Thêm logging để xem query được execute như thế nào

### **Option 3: Test với booking khác**
Tạo booking với thời gian khác để test

---

## 🎯 **Expected Result:**

**Nếu query hoạt động đúng:**
- Room 1 (room_id = 1) KHÔNG xuất hiện trong danh sách available
- Chỉ có Room 4, 5, 6 xuất hiện

**Nếu query có lỗi:**
- Room 1 vẫn xuất hiện trong danh sách (như hiện tại)

---

## 🚨 **Cần kiểm tra ngay:**

1. **Booking có được lưu đúng không?**
2. **Query có được execute đúng không?**
3. **Date logic có đúng không?**
4. **Hold time có ảnh hưởng không?**

**Hãy debug từng bước để tìm nguyên nhân!** 🔍
