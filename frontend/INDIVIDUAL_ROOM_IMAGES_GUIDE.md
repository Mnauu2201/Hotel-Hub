# 🏨 Hướng dẫn tạo hình ảnh riêng cho từng phòng

## 🎯 **Cách hoạt động hiện tại:**

Hệ thống sẽ **tự động chọn hình ảnh khác nhau** cho mỗi phòng dựa trên:

1. **Số phòng** (ưu tiên cao nhất)
   - Phòng 101 → `room-img01.png`
   - Phòng 102 → `room-img02.png`
   - Phòng 103 → `room-img03.png`
   - Phòng 105 → `room-img05.png`
   - Phòng 106 → `room-img06.png`
   - Phòng 203 → `room-img03.png`
   - Phòng 204 → `room-img04.png`
   - v.v...

2. **ID phòng** (nếu không có số phòng)
3. **Loại phòng** (fallback cuối cùng)

## 📁 **Cấu trúc thư mục hình ảnh:**

```
frontend/src/assets/img/gallery/
├── room-img01.png  ← Phòng có số cuối là 1
├── room-img02.png  ← Phòng có số cuối là 2
├── room-img03.png  ← Phòng có số cuối là 3
├── room-img04.png  ← Phòng có số cuối là 4
├── room-img05.png  ← Phòng có số cuối là 5
└── room-img06.png  ← Phòng có số cuối là 6
```

## 🔄 **Cách thay đổi hình ảnh cho từng phòng:**

### **Phương pháp 1: Thay thế file hiện có**
1. Thay thế file `room-img01.png` đến `room-img06.png` bằng hình ảnh mới
2. Giữ nguyên tên file
3. Hệ thống sẽ tự động áp dụng

### **Phương pháp 2: Thêm nhiều hình ảnh hơn**
1. Thêm file mới: `room-img07.png`, `room-img08.png`, v.v...
2. Cập nhật import trong các file:
   - `RoomCard.jsx`
   - `room-area/index.tsx`
   - `room-area/index2.tsx`

```javascript
// Thêm import mới
import roomImg07 from '../assets/img/gallery/room-img07.png';
import roomImg08 from '../assets/img/gallery/room-img08.png';

// Cập nhật mảng roomImages
const roomImages = [
  roomImg01, roomImg02, roomImg03, roomImg04, roomImg05, roomImg06,
  roomImg07, roomImg08  // Thêm mới
];
```

### **Phương pháp 3: Mapping cụ thể cho từng phòng**
Nếu muốn mapping cụ thể cho từng phòng, có thể sửa function `getFallbackImage()`:

```javascript
const getFallbackImage = (room) => {
  const roomNumber = room.roomNumber || room.room_number;
  
  // Mapping cụ thể cho từng phòng
  const roomImageMap = {
    '101': roomImg01,
    '102': roomImg02,
    '103': roomImg03,
    '105': roomImg05,
    '106': roomImg06,
    '203': roomImg03,
    '204': roomImg04,
    // Thêm mapping cho các phòng khác
  };
  
  if (roomNumber && roomImageMap[roomNumber]) {
    return roomImageMap[roomNumber];
  }
  
  // Fallback logic cũ...
};
```

## 🎨 **Gợi ý thiết kế hình ảnh:**

### **Theo số phòng:**
- **Phòng 101, 201, 301...** → Hình ảnh phòng đơn, thiết kế đơn giản
- **Phòng 102, 202, 302...** → Hình ảnh phòng đôi, thiết kế ấm cúng
- **Phòng 103, 203, 303...** → Hình ảnh phòng suite, thiết kế sang trọng
- **Phòng 105, 205, 305...** → Hình ảnh phòng có view đặc biệt
- **Phòng 106, 206, 306...** → Hình ảnh phòng có ban công

### **Theo tầng:**
- **Tầng 1 (101-109)** → Hình ảnh phòng tầng trệt
- **Tầng 2 (201-209)** → Hình ảnh phòng tầng 2
- **Tầng 3 (301-309)** → Hình ảnh phòng tầng 3

## 📋 **Checklist khi thêm hình ảnh:**

- [ ] **Tên file:** `room-imgXX.png` (XX = 01-06, có thể thêm 07+)
- [ ] **Định dạng:** PNG hoặc JPG
- [ ] **Kích thước:** 800x600px (tỷ lệ 4:3)
- [ ] **Chất lượng:** < 500KB mỗi file
- [ ] **Nội dung:** Phù hợp với loại phòng
- [ ] **Import:** Cập nhật import trong các component
- [ ] **Test:** Kiểm tra hiển thị trên trình duyệt

## 🚀 **Ví dụ thực tế:**

### **Phòng 105 (Single):**
- File: `room-img05.png`
- Nội dung: Phòng đơn, giường single, thiết kế hiện đại
- Màu sắc: Xanh nhạt, trắng

### **Phòng 106 (Double):**
- File: `room-img06.png`
- Nội dung: Phòng đôi, giường double, thiết kế ấm cúng
- Màu sắc: Be, nâu nhạt

### **Phòng 203 (Suite):**
- File: `room-img03.png`
- Nội dung: Suite sang trọng, giường king, view đẹp
- Màu sắc: Vàng gold, trắng kem

## ⚠️ **Lưu ý quan trọng:**

1. **Backup:** Luôn backup hình ảnh cũ trước khi thay thế
2. **Consistent:** Giữ nhất quán về style và chất lượng
3. **Optimize:** Tối ưu hóa kích thước file để tải nhanh
4. **Test:** Test trên nhiều thiết bị khác nhau
5. **Fallback:** Luôn có hình ảnh fallback cho trường hợp lỗi

## 🔧 **Các file cần cập nhật:**

1. `frontend/src/components/RoomCard.jsx`
2. `frontend/src/components/room-area/index.tsx`
3. `frontend/src/components/room-area/index2.tsx`
4. `frontend/src/pages/BookingPage.jsx`
5. `frontend/src/pages/BookingConfirmation.jsx`
