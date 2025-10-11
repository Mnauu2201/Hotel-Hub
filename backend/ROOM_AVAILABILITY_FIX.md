# 🔧 Room Availability Fix

## 🚨 **Vấn đề đã xác định:**

### **Query overlap không trả về dữ liệu nào có nghĩa là:**
1. **Booking không tồn tại** trong database
2. **Booking có status khác** 'pending' hoặc 'confirmed'
3. **Logic query có vấn đề**
4. **Date format không đúng**

---

## 🔍 **Debug Steps:**

### **Step 1: Kiểm tra booking có tồn tại không**
```sql
-- Kiểm tra booking theo reference
SELECT * FROM bookings WHERE booking_reference = 'BK1760083491375D0E7E8';

-- Kiểm tra tất cả booking gần đây
SELECT booking_id, room_id, check_in, check_out, status, created_at 
FROM bookings 
ORDER BY created_at DESC 
LIMIT 10;
```

### **Step 2: Kiểm tra booking theo room_id**
```sql
-- Kiểm tra booking của room 1
SELECT booking_id, room_id, check_in, check_out, status, hold_until, created_at
FROM bookings 
WHERE room_id = 1 
ORDER BY created_at DESC;
```

### **Step 3: Kiểm tra booking với status pending**
```sql
-- Kiểm tra booking pending
SELECT booking_id, room_id, check_in, check_out, status, hold_until
FROM bookings 
WHERE status = 'pending';
```

### **Step 4: Test query đơn giản**
```sql
-- Test query đơn giản
SELECT b.room_id, b.check_in, b.check_out, b.status
FROM bookings b 
WHERE b.room_id = 1;
```

---

## 🔧 **Cách sửa:**

### **Option 1: Kiểm tra booking có được lưu không**
- Booking có thể không được lưu vào database
- Có thể có lỗi transaction
- Có thể có lỗi validation

### **Option 2: Kiểm tra status booking**
- Booking có thể có status khác 'pending'
- Có thể bị auto-cancel
- Có thể có lỗi trong logic tạo booking

### **Option 3: Sửa query logic**
```sql
-- Sửa query để debug
SELECT r.room_id, r.room_number, r.status 
FROM rooms r 
WHERE r.status = 'available' 
AND r.room_id NOT IN (
    SELECT b.room_id FROM bookings b 
    WHERE b.status IN ('pending', 'confirmed') 
    AND b.room_id = r.room_id
    AND ((b.check_in < '2025-10-13' AND b.check_out > '2025-10-11') 
    OR (b.hold_until IS NOT NULL AND b.hold_until > NOW()))
);
```

---

## 🎯 **Expected Results:**

### **Nếu booking tồn tại:**
- Query overlap sẽ trả về 1 record
- Room 1 sẽ bị block

### **Nếu booking không tồn tại:**
- Query overlap trả về 0 record
- Room 1 vẫn available (như hiện tại)

---

## 🚨 **Cần kiểm tra ngay:**

1. **Booking có được lưu vào database không?**
2. **Booking có status gì?**
3. **Có lỗi gì trong quá trình tạo booking không?**
4. **Transaction có được commit không?**

**Hãy chạy các query debug để tìm nguyên nhân!** 🔍
