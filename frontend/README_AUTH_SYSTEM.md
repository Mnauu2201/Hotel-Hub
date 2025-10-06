# 🔐 Hệ thống Authentication - HotelHub

## 📋 Tổng quan

Hệ thống đăng nhập/đăng ký hoàn chỉnh cho ứng dụng HotelHub với các tính năng:
- Đăng ký tài khoản user mới
- Đăng nhập với email/password
- Quản lý trạng thái đăng nhập
- Avatar user tự động tạo
- Dropdown menu với các tùy chọn
- Giao diện responsive và đẹp mắt

## 🚀 Cách sử dụng

### 1. Truy cập trang đăng nhập
- Click vào icon user ở góc phải header (khi chưa đăng nhập)
- Hoặc truy cập trực tiếp: `http://localhost:3000/login`

### 2. Đăng ký tài khoản mới
- Click "Đăng ký ngay" trên trang đăng nhập
- Hoặc truy cập trực tiếp: `http://localhost:3000/register`
- Điền đầy đủ thông tin:
  - Họ và tên
  - Email
  - Số điện thoại
  - Mật khẩu
  - Xác nhận mật khẩu

### 3. Đăng nhập
- Nhập email và mật khẩu
- Click "Đăng nhập"
- Sau khi đăng nhập thành công, icon user sẽ thay đổi thành avatar

### 4. Sử dụng dropdown menu
- Click vào avatar user (vòng tròn có hình ảnh)
- Menu sẽ hiện ra với các tùy chọn:
  - **Chỉnh sửa thông tin**: Chuyển đến trang profile
  - **Đăng xuất**: Đăng xuất khỏi hệ thống

## 🛠️ Cấu trúc code

### Files đã tạo/cập nhật:

```
frontend/src/
├── contexts/
│   └── AuthContext.tsx          # Context quản lý authentication
├── services/
│   └── userApi.ts               # Service call API backend
├── pages/
│   ├── auth/
│   │   ├── LoginPage.jsx        # Trang đăng nhập
│   │   ├── RegisterPage.jsx     # Trang đăng ký
│   │   └── AuthStyles.css       # CSS cho auth pages
│   └── ProfilePage.jsx          # Trang profile user
├── components/
│   └── header/
│       ├── index.tsx            # Header component (đã cập nhật)
│       └── HeaderStyles.css     # CSS cho header
└── App.js                       # App component (đã cập nhật)
```

## 🔌 API Endpoints sử dụng

### Backend APIs:
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/refresh` - Refresh token

### Request/Response Examples:

#### Đăng ký:
```json
POST /api/auth/register
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "password123",
  "phone": "0123456789"
}
```

#### Đăng nhập:
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Response đăng nhập:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "43dd26e6-104a-43b2-a627-eeba421e3df6",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "email": "user@example.com",
  "name": "Nguyễn Văn A",
  "roles": ["ROLE_CUSTOMER"]
}
```

## 🎨 Tính năng UI/UX

### 1. Giao diện đăng nhập/đăng ký
- Thiết kế hiện đại với gradient background
- Form validation real-time
- Responsive design cho mobile
- Loading states và error handling
- Animation mượt mà

### 2. Header với user icon
- Icon user khi chưa đăng nhập
- Avatar tự động tạo từ tên user khi đã đăng nhập
- Dropdown menu với animation
- Hover effects và transitions

### 3. Avatar tự động
- Sử dụng service ui-avatars.com
- Tạo avatar từ chữ cái đầu của tên
- Màu sắc ngẫu nhiên
- Responsive size

## 🔧 Cài đặt và chạy

### 1. Cài đặt dependencies (nếu cần):
```bash
cd frontend
npm install
```

### 2. Chạy ứng dụng:
```bash
npm run dev
```

### 3. Build production:
```bash
npm run build
```

## 🧪 Test tài khoản mẫu

### User thường:
- Email: `user@example.com`
- Password: `password123`

### Admin:
- Email: `admin1@hotelhub.com`
- Password: `admin123`

## 🔒 Bảo mật

- JWT tokens được lưu trong localStorage
- Refresh token tự động
- Logout xóa tất cả tokens
- Protected routes với authentication check

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 768px, 480px
- Touch-friendly interactions
- Optimized for all screen sizes

## 🚀 Tính năng nâng cao (có thể mở rộng)

1. **Quên mật khẩu**: Tích hợp email reset
2. **Social login**: Google, Facebook
3. **2FA**: Two-factor authentication
4. **Profile upload**: Upload ảnh đại diện
5. **Email verification**: Xác thực email
6. **Remember me**: Ghi nhớ đăng nhập lâu dài

## 🐛 Troubleshooting

### Lỗi thường gặp:

1. **"Network Error"**: Kiểm tra backend có chạy không (port 8080)
2. **"Invalid credentials"**: Kiểm tra email/password
3. **Avatar không hiện**: Kiểm tra kết nối internet
4. **Dropdown không đóng**: Click outside để đóng

### Debug:
- Mở Developer Tools (F12)
- Check Console tab để xem errors
- Check Network tab để xem API calls

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Backend server có chạy không
2. Database connection
3. Console errors
4. Network requests

---

**🎉 Hệ thống authentication đã sẵn sàng sử dụng!**
