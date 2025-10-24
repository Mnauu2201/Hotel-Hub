import axios, { AxiosHeaders } from 'axios';

// Helper function để hiển thị notification
const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  // Tạo một element notification tạm thời
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    max-width: 400px;
    word-wrap: break-word;
    animation: slideInRight 0.3s ease-out;
  `;
  
  // Thêm animation CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
  notification.innerHTML = `${icon} ${message}`;
  
  document.body.appendChild(notification);
  
  // Tự động ẩn sau 3 giây
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
};

// Cấu hình axios để xử lý CORS
axios.defaults.withCredentials = true;

// Tạo instance axios riêng với cấu hình cụ thể
const axiosInstance = axios.create({
  // Dùng đường dẫn tương đối để đi qua Vite proxy (xem vite.config.ts)
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Thêm interceptor để xử lý CORS
axiosInstance.interceptors.request.use(
  config => {
    // Đảm bảo headers tồn tại
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// API URL không cần thiết nữa vì đã cấu hình trong axiosInstance

// Hàm đăng nhập
export const userLogin = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(`/auth/login`, {
      email,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('🔍 Login response data:', response.data);
    
    if (response.data && (response.data.accessToken || response.data.token)) {
      const accessToken = response.data.accessToken || response.data.token;
      const refreshToken = response.data.refreshToken;
      const user = response.data.user || {
        email: response.data.email,
        name: response.data.name,
        phone: response.data.phone || '',
        roles: response.data.roles
      };
      
      // Debug: Log phone specifically
      console.log('🔍 Phone from response:', {
        'response.data.phone': response.data.phone,
        'user.phone': user.phone,
        'response.data': response.data
      });
      
      console.log('✅ Saving to localStorage:', {
        accessToken: accessToken ? accessToken.substring(0, 20) + '...' : null,
        refreshToken: refreshToken ? refreshToken.substring(0, 20) + '...' : null,
        user: user
      });
      
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      if (user) localStorage.setItem('user', JSON.stringify(user));
      
      // Thêm thông báo đăng nhập thành công
      showNotification('Đăng nhập thành công!', 'success');
    } else {
      console.error('❌ No accessToken found in response:', response.data);
    }
    
    return response.data;
  } catch (error: any) {
    console.error("Lỗi đăng nhập:", error);
    if (error.response) {
      // Lỗi từ server với status code
      throw new Error(error.response.data.message || 'Đăng nhập thất bại');
    } else if (error.request) {
      // Không nhận được phản hồi từ server
      throw new Error('Không thể kết nối đến server');
    } else {
      // Lỗi khác
      throw new Error('Đã xảy ra lỗi khi đăng nhập');
    }
  }
};

// Hàm đăng ký
export const userRegister = async (email: string, password: string, fullName: string, phone: string) => {
  try {
    const response = await axiosInstance.post(`/auth/register`, {
      email,
      password,
      name: fullName,
      phone
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Thêm thông báo đăng ký thành công
    showNotification('Đăng ký thành công!', 'success');
    
    return response.data;
  } catch (error: any) {
    console.error("Lỗi đăng ký:", error);
    if (error.response) {
      // Kiểm tra lỗi email đã tồn tại
      if (error.response.status === 400 && error.response.data.message.includes('email')) {
        throw new Error('Email này đã tồn tại trong hệ thống');
      }
      throw new Error(error.response.data.message || 'Đăng ký thất bại');
    } else if (error.request) {
      throw new Error('Không thể kết nối đến server');
    } else {
      throw new Error('Đã xảy ra lỗi khi đăng ký');
    }
  }
};

// Hàm quên mật khẩu
export const forgotPassword = async (email: string) => {
  try {
    const response = await axiosInstance.post(`/auth/forgot-password`, {
      email
    });
    
    return response.data;
  } catch (error: any) {
    console.error("Lỗi quên mật khẩu:", error);
    if (error.response) {
      throw new Error(error.response.data.message || 'Không thể gửi yêu cầu đặt lại mật khẩu');
    } else if (error.request) {
      throw new Error('Không thể kết nối đến server');
    } else {
      throw new Error('Đã xảy ra lỗi khi gửi yêu cầu đặt lại mật khẩu');
    }
  }
};

// Hàm lấy thông tin người dùng hiện tại
export const getCurrentUser = () => {
  const userDataString = localStorage.getItem('userData');
  if (userDataString) {
    return JSON.parse(userDataString);
  }
  return null;
};

// Hàm cập nhật thông tin người dùng
export const updateUserProfile = async (name: string, phone: string) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('Chưa đăng nhập');
    }

    const response = await axiosInstance.put('/users/me', {
      name: name.trim(),
      phone: phone.trim()
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Profile updated successfully:', response.data);
    
    // Cập nhật thông tin user trong localStorage
    if (response.data) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = {
        ...currentUser,
        name: response.data.name || currentUser.name,
        phone: response.data.phone || currentUser.phone
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    return response.data;
  } catch (error: any) {
    console.error("Lỗi cập nhật thông tin:", error);
    if (error.response) {
      // Lỗi từ server với status code
      if (error.response.status === 401) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
      if (error.response.data && error.response.data.phone) {
        throw new Error(error.response.data.phone);
      }
      throw new Error(error.response.data.message || 'Cập nhật thông tin thất bại');
    } else if (error.request) {
      throw new Error('Không thể kết nối đến server');
    } else {
      throw new Error('Đã xảy ra lỗi khi cập nhật thông tin');
    }
  }
};

// Hàm đăng xuất
export const logout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userData');
  window.location.href = '/';
};