import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { userLogin, userRegister, updateUserProfile } from '../services/userService';

interface User {
  email: string;
  name: string;
  phone?: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  register: (userData: { name: string; email: string; password: string; phone: string }) => Promise<any>;
  updateProfile: (name: string, phone: string) => Promise<any>;
  logout: () => Promise<void>;
  refreshAuthToken: () => Promise<string>;
  getUserAvatar: () => string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Khởi tạo từ localStorage khi component mount
  useEffect(() => {
    const initAuth = () => {
      try {
        // Đồng bộ với UserContext: ưu tiên các khóa hiện có nếu đã dùng trước đó
        const storedUser = localStorage.getItem('user') || localStorage.getItem('userData');
        const storedAccessToken = localStorage.getItem('accessToken') || localStorage.getItem('userToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        
        console.log('🔍 AuthContext initialization:', {
          storedUser,
          storedAccessToken: storedAccessToken ? storedAccessToken.substring(0, 20) + '...' : null,
          storedRefreshToken: storedRefreshToken ? storedRefreshToken.substring(0, 20) + '...' : null
        });

        if (storedUser && storedAccessToken) {
          const parsedUser = JSON.parse(storedUser);
          const mappedEmail = parsedUser.email || parsedUser.username || parsedUser.emailAddress;
          const mappedName = parsedUser.name || parsedUser.fullName || parsedUser.displayName || '';
          const mappedPhone = parsedUser.phone || '';
          const mappedRoles = parsedUser.roles || parsedUser.authorities || [];

          // Chỉ khởi tạo user nếu có email hợp lệ
          if (mappedEmail) {
            setUser({
              email: mappedEmail,
              name: mappedName,
              phone: mappedPhone,
              roles: mappedRoles
            });
            setAccessToken(storedAccessToken);
            if (storedRefreshToken) {
              setRefreshToken(storedRefreshToken);
            }
          } else {
            // Dữ liệu không hợp lệ: dọn dẹp
            localStorage.removeItem('user');
            localStorage.removeItem('userData');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userToken');
            localStorage.removeItem('refreshToken');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Đăng nhập
  const login = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true);
      const response = await userLogin(credentials.email, credentials.password);

      // userService đã lưu token vào localStorage, chỉ cần cập nhật state
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const storedToken = localStorage.getItem('accessToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');

      setUser({
        email: storedUser.email,
        name: storedUser.name,
        phone: storedUser.phone,
        roles: storedUser.roles
      });
      setAccessToken(storedToken);
      setRefreshToken(storedRefreshToken);
      
      // Debug: Kiểm tra localStorage sau khi lưu
      console.log('🔍 localStorage after login:', {
        user: localStorage.getItem('user'),
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken')
      });

      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Đăng ký
  const register = async (userData: { name: string; email: string; password: string; phone: string }) => {
    try {
      setLoading(true);
      const response = await userRegister(userData.email, userData.password, userData.name, userData.phone);

      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật thông tin profile
  const updateProfile = async (name: string, phone: string) => {
    try {
      setLoading(true);
      const response = await updateUserProfile(name, phone);

      // Cập nhật lại thông tin user trong state
      if (user) {
        const updatedUser = {
          ...user,
          name: name.trim(),
          phone: phone.trim()
        };
        setUser(updatedUser);
      }

      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Đăng xuất
  const logout = async () => {
    try {
      // Clear state và localStorage
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Refresh token
  const refreshAuthToken = async (): Promise<string> => {
    try {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // TODO: Implement refresh token logic
      throw new Error('Refresh token not implemented');
    } catch (error) {
      console.error('Refresh token error:', error);
      // Nếu refresh token thất bại, logout user
      await logout();
      throw error;
    }
  };

  // Lấy avatar user (placeholder cho đến khi có API thực)
  const getUserAvatar = (): string | null => {
    if (user) {
      // Tạo avatar từ chữ cái đầu của tên
      const initials = user.name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
      
      return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=40`;
    }
    return null;
  };

  const value: AuthContextType = {
    user,
    accessToken,
    refreshToken,
    loading,
    login,
    register,
    updateProfile,
    logout,
    refreshAuthToken,
    getUserAvatar,
    isAuthenticated: !!(user?.email) && !!accessToken,
    isAdmin: user?.roles?.includes('ROLE_ADMIN') || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
