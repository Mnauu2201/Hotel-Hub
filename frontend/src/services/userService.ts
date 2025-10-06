import axios, { AxiosHeaders } from 'axios';

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
    
    if (response.data && (response.data.accessToken || response.data.token)) {
      const accessToken = response.data.accessToken || response.data.token;
      const refreshToken = response.data.refreshToken;
      const user = response.data.user || {
        email: response.data.email,
        name: response.data.name,
        roles: response.data.roles
      };
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      if (user) localStorage.setItem('user', JSON.stringify(user));
      
      // Thêm thông báo đăng nhập thành công
      alert('Đăng nhập thành công!');
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
    alert('Đăng ký thành công!');
    
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

// Hàm đăng xuất
export const logout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userData');
  window.location.href = '/';
};