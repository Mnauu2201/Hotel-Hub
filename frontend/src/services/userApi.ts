// Đảm bảo API_BASE_URL đúng với cấu hình backend
const API_BASE_URL = 'http://localhost:8080/api';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface ForgotPasswordData {
  email: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  email: string;
  name: string;
  roles: string[];
}

interface RegisterResponse {
  message: string;
  email: string;
  name: string;
}

interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

class UserApiService {
  // Đăng ký tài khoản
  async register(userData: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // Kiểm tra nếu response rỗng
      const text = await response.text();
      if (!text) {
        throw new Error('Máy chủ không phản hồi hoặc phản hồi rỗng');
      }
      // Ưu tiên bắt lỗi trùng email theo status code
      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Email này đã tồn tại trong hệ thống');
        }
        if (response.status === 400 && (text.toLowerCase().includes('email') || text.toLowerCase().includes('exist'))) {
          throw new Error('Email này đã tồn tại trong hệ thống');
        }
      }
      
      // Kiểm tra nếu phản hồi là chuỗi thông thường thay vì JSON
      if (text.startsWith('Registered') || text.includes('Registered')) {
        return {
          message: text,
          email: userData.email,
          name: userData.name
        };
      }
      
      // Chuyển đổi text thành JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Lỗi phân tích JSON:', text);
        // Nếu không phải JSON nhưng là thông báo thành công
        if (text.includes('success') || text.includes('Success') || text.includes('thành công')) {
          return {
            message: text,
            email: userData.email,
            name: userData.name
          };
        }
        // Nếu là thông báo lỗi liên quan đến email
        if (text.toLowerCase().includes('email') || text.toLowerCase().includes('exist')) {
          throw new Error('Email này đã tồn tại trong hệ thống');
        }
        throw new Error('Lỗi phân tích dữ liệu từ máy chủ: ' + text);
      }
      
      if (!response.ok) {
        const msg = (data && (data.message || data.error)) || '';
        if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('exist')) {
          throw new Error('Email này đã tồn tại trong hệ thống');
        }
        throw new Error(msg || 'Đăng ký thất bại');
      }
      
      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  // Đăng nhập
  async login(credentials: LoginData): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      // Kiểm tra nếu response rỗng
      const text = await response.text();
      if (!text) {
        throw new Error('Máy chủ không phản hồi hoặc phản hồi rỗng');
      }
      
      // Chuyển đổi text thành JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Lỗi phân tích JSON:', text);
        throw new Error('Lỗi phân tích dữ liệu từ máy chủ: ' + text);
      }
      
      if (!response.ok) {
        const msg = (data && (data.message || data.error)) || '';
        throw new Error(msg || 'Đăng nhập thất bại');
      }
      
      // Bổ sung name/email fallback nếu backend thiếu name
      const normalized = {
        ...data,
        email: data.email || data.username || data.emailAddress || credentials.email,
        name: data.name || data.fullName || data.displayName || (data.email ? data.email.split('@')[0] : credentials.email.split('@')[0]),
      };
      return normalized as LoginResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Đăng xuất
  async logout(refreshToken: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Đăng xuất thất bại');
      }
      
      return data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Refresh token thất bại');
      }
      
      return data;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  }

  // Lấy thông tin user (cần token)
  async getUserProfile(accessToken: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/protected`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Lấy thông tin user thất bại');
      }
      
      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  // Cập nhật thông tin người dùng hiện tại
  async updateProfile(accessToken: string, data: { name?: string; phone?: string }): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const respData = await response.json();
      if (!response.ok) {
        throw new Error(respData.message || 'Cập nhật thông tin thất bại');
      }
      return respData;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Quên mật khẩu
  async forgotPassword(data: ForgotPasswordData): Promise<ForgotPasswordResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Yêu cầu đặt lại mật khẩu thất bại');
      }
      
      return responseData;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }
}

export default new UserApiService();
