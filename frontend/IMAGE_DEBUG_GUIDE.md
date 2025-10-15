# 🔍 Hướng dẫn kiểm tra lỗi ảnh phòng

## Các bước kiểm tra:

### 1. **Kiểm tra tất cả ảnh có load được không**
- Truy cập: `http://localhost:3002/debug-images`
- Xem tất cả 16 ảnh phòng có hiển thị đúng không
- Nếu ảnh nào hiển thị "Lỗi load ảnh" = có vấn đề

### 2. **Kiểm tra trang booking**
- Truy cập: `http://localhost:3002/booking`
- Chọn phòng từ danh sách
- Kiểm tra:
  - ✅ Ảnh chính hiển thị đúng
  - ✅ 4 thumbnail hiển thị khác nhau
  - ✅ Click thumbnail thay đổi ảnh chính
  - ✅ Hover effects hoạt động

### 3. **Kiểm tra showcase ảnh phòng**
- Truy cập: `http://localhost:3002/room-showcase`
- Xem tất cả 16 ảnh phòng được hiển thị đẹp mắt
- Test navigation và category tabs

### 3. **Kiểm tra trang phòng**
- Truy cập: `http://localhost:3002/rooms`
- Kiểm tra ảnh phòng trong danh sách

### 4. **Kiểm tra console log**
- Mở Developer Tools (F12)
- Xem tab Console
- Tìm các log:
  - `✅ Load thành công: room-imgXX.png`
  - `❌ Lỗi load ảnh: room-imgXX.png`

## Các lỗi thường gặp:

### ❌ **Lỗi 1: Ảnh không hiển thị**
- **Nguyên nhân**: Đường dẫn ảnh sai hoặc file không tồn tại
- **Sửa**: Kiểm tra file có trong `frontend/src/assets/img/gallery/` không

### ❌ **Lỗi 2: Ảnh hiển thị nhưng bị lỗi**
- **Nguyên nhân**: Format ảnh không đúng hoặc file bị hỏng
- **Sửa**: Thay thế file ảnh bằng file mới

### ❌ **Lỗi 3: Thumbnail không click được**
- **Nguyên nhân**: Logic onClick bị lỗi
- **Sửa**: Kiểm tra state `selectedImageIndex`

### ❌ **Lỗi 4: Ảnh chính không thay đổi khi click thumbnail**
- **Nguyên nhân**: Logic hiển thị ảnh chính bị lỗi
- **Sửa**: Kiểm tra logic `room.images?.[selectedImageIndex]?.imageUrl`

## Các file cần kiểm tra:

1. **`frontend/src/pages/BookingPage.jsx`** - Logic hiển thị ảnh chính
2. **`frontend/src/components/RoomFeatureImage.jsx`** - Component thumbnail
3. **`frontend/src/assets/img/gallery/`** - Thư mục chứa ảnh
4. **`frontend/src/components/ImageDebug.jsx`** - Component debug

## Cách sửa lỗi:

### Sửa lỗi ảnh không load:
```jsx
// Thêm onError handler
<img 
  src={imageUrl} 
  alt="Room"
  onError={(e) => {
    e.target.src = fallbackImage;
  }}
/>
```

### Sửa lỗi thumbnail không click:
```jsx
// Đảm bảo onClick được gọi đúng
<div onClick={() => setSelectedImageIndex(index)}>
  <img src={imageUrl} alt="Thumbnail" />
</div>
```

### Sửa lỗi ảnh chính không thay đổi:
```jsx
// Đảm bảo src sử dụng selectedImageIndex
<img 
  src={room.images?.[selectedImageIndex]?.imageUrl || fallbackImage} 
  alt="Room main" 
/>
```

## Test checklist:

- [ ] Tất cả 6 ảnh load thành công ở `/debug-images`
- [ ] Trang booking hiển thị ảnh chính đúng
- [ ] 4 thumbnail hiển thị khác nhau
- [ ] Click thumbnail thay đổi ảnh chính
- [ ] Hover effects hoạt động
- [ ] Không có lỗi trong console
- [ ] Ảnh fallback hoạt động khi không có ảnh từ database
