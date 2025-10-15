# Hướng dẫn sử dụng Gallery Ảnh Phòng

## Tính năng đã hoàn thành

### 1. **Gallery ảnh phòng chính**
- Hiển thị ảnh chính lớn (200px height) với hiệu ứng zoom khi hover
- Counter hiển thị số lượng ảnh trên góc phải ảnh chính
- Click vào thumbnail để thay đổi ảnh chính

### 2. **Thumbnail Gallery**
- **Ảnh thường**: 2 ảnh đầu tiên từ database
- **Ảnh mô tả đặc biệt**: 3 ảnh với text overlay:
  - "KÉO DÀI THỜI GIAN" (màu xanh dương)
  - "SIÊU CHÂN THẬT" (màu xanh lá)
  - "TIỆN NGHI CAO CẤP" (màu đỏ)
- Border highlight cho ảnh đang được chọn
- Hiệu ứng hover với scale và shadow

### 3. **Tính năng tương tác**
- Click vào bất kỳ thumbnail nào để thay đổi ảnh chính
- Reset về ảnh đầu tiên khi chọn phòng mới
- Smooth transitions và animations

## Cách sử dụng

1. **Truy cập trang booking**: `http://localhost:3001/booking`
2. **Chọn ngày**: Nhập check-in và check-out
3. **Chọn phòng**: Từ danh sách gợi ý hoặc trang phòng
4. **Xem gallery**: 
   - Ảnh chính hiển thị ở trên
   - Thumbnail gallery ở dưới
   - Click thumbnail để thay đổi ảnh chính

## Cấu trúc Database

```sql
-- Bảng room_images đã có sẵn
CREATE TABLE room_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary TINYINT(1) DEFAULT 0,
    alt_text VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

- `GET /api/rooms/{roomId}/images` - Lấy tất cả ảnh của phòng
- `GET /api/rooms/{roomId}/images/primary` - Lấy ảnh chính
- `GET /api/rooms/{roomId}` - Lấy thông tin phòng kèm ảnh

## Customization

### Thay đổi màu sắc
```jsx
// Trong RoomFeatureImage.jsx
backgroundColor="#1e3a8a"  // Màu nền
textColor="white"          // Màu chữ
```

### Thay đổi text mô tả
```jsx
// Trong BookingPage.jsx
<RoomFeatureImage 
  text="TEXT MỚI" 
  icon="🔥"
  backgroundColor="#ff6b35"
/>
```

### Thay đổi kích thước
```jsx
// Trong RoomFeatureImage.jsx
width: 80,    // Chiều rộng
height: 60,   // Chiều cao
```

## Lưu ý

- Ảnh được load từ database qua API
- Fallback về ảnh mặc định nếu không có ảnh
- Responsive design cho mobile
- Hỗ trợ hover effects và transitions