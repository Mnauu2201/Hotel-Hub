import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import userApi from '../services/userApi';
import { Link } from 'react-router-dom';
import './ProfilePage.css';

const API_BASE_URL = 'http://localhost:8080/api';

const ProfilePage = () => {
  const { user, isAuthenticated, getUserAvatar } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // Load user data từ API nếu cần
  const loadUserData = async () => {
    try {
      let accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;
      
      const response = await userApi.getUserProfile(accessToken);
      console.log('Loaded user data from API:', response);
      
      // Cập nhật localStorage với dữ liệu mới
      const updatedUser = {
        ...user,
        name: response.name || user?.name,
        email: response.email || user?.email,
        phone: response.phone || user?.phone,
        roles: response.roles || user?.roles
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Cập nhật formData
      setFormData(prev => ({
        ...prev,
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        phone: updatedUser.phone || ''
      }));
      
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Load dữ liệu user khi component mount
  useEffect(() => {
    if (isAuthenticated && user && !user.phone) {
      console.log('User phone not found, loading from API...');
      loadUserData();
    }
  }, [isAuthenticated, user]);

  // Cập nhật formData khi user thay đổi
  useEffect(() => {
    if (user) {
      console.log('Loading user data for profile:', {
        name: user.name,
        email: user.email,
        phone: user.phone,
        roles: user.roles,
        fullUserObject: user
      });
      
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      console.log('No user data available');
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <h2>Bạn cần đăng nhập để xem trang này</h2>
          <Link to="/login" className="btn-primary">Đăng nhập</Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Xóa message khi user thay đổi input
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
    if (passwordMessage.text) {
      setPasswordMessage({ type: '', text: '' });
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const showPasswordMessage = (type, text) => {
    setPasswordMessage({ type, text });
    setTimeout(() => setPasswordMessage({ type: '', text: '' }), 5000);
  };

  const handleSaveProfile = async () => {
    try {
      // Validation email
      if (!formData.email.trim()) {
        showMessage('error', 'Vui lòng nhập email');
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        showMessage('error', 'Email không hợp lệ');
        return;
      }
      
      // Validation tên
      if (!formData.name.trim()) {
        showMessage('error', 'Vui lòng nhập họ và tên');
        return;
      }
      
      setLoading(true);
      let accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        showMessage('error', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        return;
      }

      // Kiểm tra token có hợp lệ không
      console.log('Current access token:', {
        hasToken: !!accessToken,
        tokenLength: accessToken.length,
        tokenStart: accessToken.substring(0, 20) + '...',
        timestamp: new Date().toISOString()
      });

      // Test JWT debug endpoint trước
      try {
        console.log('Testing JWT test endpoint...');
        const testResponse = await fetch(`${API_BASE_URL}/users/test-jwt`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log('JWT test endpoint response status:', testResponse.status);
        const testData = await testResponse.text();
        console.log('JWT test endpoint response:', testData);
        
        if (!testResponse.ok) {
          throw new Error(`JWT test endpoint failed: ${testResponse.status}`);
        }
        
        // Parse response để xem chi tiết
        try {
          const parsedData = JSON.parse(testData);
          console.log('JWT test parsed data:', parsedData);
          
          if (!parsedData.jwtValidation) {
            throw new Error('JWT validation failed: ' + (parsedData.jwtError || 'Unknown error'));
          }
        } catch (parseError) {
          console.error('Failed to parse JWT test response:', parseError);
        }
      } catch (debugError) {
        console.error('JWT test endpoint error:', debugError);
        
        // Thử refresh token nếu có refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          console.log('Attempting to refresh token...');
          try {
            const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refreshToken }),
            });
            
            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              console.log('Token refreshed successfully:', refreshData);
              
              // Lưu token mới
              localStorage.setItem('accessToken', refreshData.accessToken);
              if (refreshData.refreshToken) {
                localStorage.setItem('refreshToken', refreshData.refreshToken);
              }
              
              // Thử lại với token mới
              console.log('Retrying with new token...');
              const newAccessToken = refreshData.accessToken;
              
              const retryResponse = await fetch(`${API_BASE_URL}/users/test-jwt`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${newAccessToken}`,
                  'Content-Type': 'application/json',
                },
              });
              
              if (retryResponse.ok) {
                console.log('Retry successful with new token');
                // Tiếp tục với token mới
                accessToken = newAccessToken;
              } else {
                throw new Error('Retry failed even with new token');
              }
            } else {
              throw new Error('Token refresh failed');
            }
          } catch (refreshError) {
            console.error('Token refresh error:', refreshError);
            showMessage('error', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            // Redirect to login
            setTimeout(() => {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }, 2000);
            return;
          }
        } else {
          showMessage('error', 'Token không hợp lệ. Vui lòng đăng nhập lại.');
          return;
        }
      }
      
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };
      
      console.log('Sending profile update request:', {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        timestamp: new Date().toISOString()
      });
      
      const updated = await userApi.updateProfile(accessToken, payload);
      
      console.log('Profile update result:', updated);
      
      // Cập nhật UI và localStorage
      const nextUser = { 
        ...user, 
        name: updated.name || formData.name, 
        email: updated.email || formData.email, 
        phone: updated.phone || formData.phone,
        roles: user?.roles || [] 
      };
      
      console.log('Updated user data:', nextUser);
      localStorage.setItem('user', JSON.stringify(nextUser));
      
      showMessage('success', 'Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (e) {
      console.error('Profile update error:', e);
      
      // Xử lý các lỗi cụ thể
      if (e?.message?.includes('email') && e?.message?.includes('đã tồn tại')) {
        showMessage('error', 'Email này đã được sử dụng bởi tài khoản khác');
      } else if (e?.message?.includes('email') && e?.message?.includes('invalid')) {
        showMessage('error', 'Email không hợp lệ');
      } else if (e?.message?.includes('401') || e?.message?.includes('Unauthorized')) {
        showMessage('error', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (e?.message?.includes('403') || e?.message?.includes('Forbidden')) {
        showMessage('error', 'Không có quyền cập nhật thông tin. Token có thể đã hết hạn. Vui lòng đăng nhập lại.');
        // Tự động logout nếu 403
        setTimeout(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }, 3000);
      } else {
        showMessage('error', e?.message || 'Cập nhật thông tin thất bại');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      // Validation mật khẩu hiện tại
      if (!formData.currentPassword.trim()) {
        showPasswordMessage('error', '❌ Vui lòng nhập mật khẩu hiện tại');
        return;
      }
      
      // Validation mật khẩu mới
      if (!formData.newPassword.trim()) {
        showPasswordMessage('error', '❌ Vui lòng nhập mật khẩu mới');
        return;
      }
      
      if (formData.newPassword.length < 6) {
        showPasswordMessage('error', '❌ Mật khẩu mới phải có ít nhất 6 ký tự');
        return;
      }
      
      if (formData.newPassword === formData.currentPassword) {
        showPasswordMessage('error', '❌ Mật khẩu mới phải khác mật khẩu hiện tại');
        return;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        showPasswordMessage('error', '❌ Mật khẩu mới và xác nhận mật khẩu không khớp');
        return;
      }
      
      // Kiểm tra độ mạnh mật khẩu
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
      if (!passwordRegex.test(formData.newPassword)) {
        showPasswordMessage('error', '❌ Mật khẩu mới phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số');
        return;
      }
      
      setLoading(true);
      let accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        showPasswordMessage('error', '❌ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        return;
      }

      // Kiểm tra token có hợp lệ không
      console.log('Current access token for password change:', {
        hasToken: !!accessToken,
        tokenLength: accessToken.length,
        tokenStart: accessToken.substring(0, 20) + '...',
        timestamp: new Date().toISOString()
      });

      // Test JWT trước khi đổi mật khẩu
      try {
        console.log('Testing JWT for password change...');
        const testResponse = await fetch(`${API_BASE_URL}/users/test-jwt`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log('JWT test for password change response status:', testResponse.status);
        const testData = await testResponse.text();
        console.log('JWT test for password change response:', testData);
        
        if (!testResponse.ok) {
          throw new Error(`JWT test failed: ${testResponse.status}`);
        }
        
        // Parse response để xem chi tiết
        try {
          const parsedData = JSON.parse(testData);
          console.log('JWT test for password change parsed data:', parsedData);
          
          if (!parsedData.jwtValidation) {
            throw new Error('JWT validation failed: ' + (parsedData.jwtError || 'Unknown error'));
          }
        } catch (parseError) {
          console.error('Failed to parse JWT test response for password change:', parseError);
        }
      } catch (debugError) {
        console.error('JWT test for password change error:', debugError);
        
        // Thử refresh token nếu có refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          console.log('Attempting to refresh token for password change...');
          try {
            const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refreshToken }),
            });
            
            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              console.log('Token refreshed successfully for password change:', refreshData);
              
              // Lưu token mới
              localStorage.setItem('accessToken', refreshData.accessToken);
              if (refreshData.refreshToken) {
                localStorage.setItem('refreshToken', refreshData.refreshToken);
              }
              
              // Thử lại với token mới
              console.log('Retrying JWT test with new token for password change...');
              const newAccessToken = refreshData.accessToken;
              
              const retryResponse = await fetch(`${API_BASE_URL}/users/test-jwt`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${newAccessToken}`,
                  'Content-Type': 'application/json',
                },
              });
              
              if (retryResponse.ok) {
                console.log('Retry successful with new token for password change');
                // Tiếp tục với token mới
                accessToken = newAccessToken;
              } else {
                throw new Error('Retry failed even with new token for password change');
              }
            } else {
              throw new Error('Token refresh failed for password change');
            }
          } catch (refreshError) {
            console.error('Token refresh error for password change:', refreshError);
            showPasswordMessage('error', '❌ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            // Redirect to login
            setTimeout(() => {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }, 2000);
            return;
          }
        } else {
          showPasswordMessage('error', '❌ Token không hợp lệ. Vui lòng đăng nhập lại.');
          return;
        }
      }
      
      const payload = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      };
      
      console.log('Sending password change request to backend:', { 
        currentPassword: '***', 
        newPassword: '***',
        timestamp: new Date().toISOString()
      });
      
      // Gọi API đổi mật khẩu
      const result = await userApi.changePassword(accessToken, payload);
      
      console.log('Password change result:', result);
      
      // Thông báo thành công
      showPasswordMessage('success', '✅ Đổi mật khẩu thành công!');
      
      // Đóng form đổi mật khẩu
      setIsEditingPassword(false);
      
      // Reset form
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      // Có thể thêm logic để logout user sau khi đổi mật khẩu thành công
      // để bảo mật hơn
      setTimeout(() => {
        showMessage('info', 'ℹ️ Vui lòng đăng nhập lại với mật khẩu mới để bảo mật tài khoản.');
      }, 2000);
      
    } catch (e) {
      console.error('Password change error:', e);
      
      // Xử lý các lỗi cụ thể từ backend
      if (e?.message?.includes('mật khẩu hiện tại') || 
          e?.message?.includes('current password') ||
          e?.message?.includes('incorrect password') ||
          e?.message?.includes('wrong password') ||
          e?.message?.includes('Invalid current password') ||
          e?.message?.includes('Mật khẩu hiện tại không đúng')) {
        showPasswordMessage('error', '❌ Mật khẩu hiện tại không đúng. Vui lòng kiểm tra lại.');
      } else if (e?.message?.includes('401') || 
                 e?.message?.includes('Unauthorized') ||
                 e?.message?.includes('token')) {
        showPasswordMessage('error', '❌ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (e?.message?.includes('403') || 
                 e?.message?.includes('Forbidden')) {
        showPasswordMessage('error', '❌ Không có quyền thay đổi mật khẩu.');
      } else if (e?.message?.includes('500') || 
                 e?.message?.includes('Internal Server Error')) {
        showPasswordMessage('error', '❌ Lỗi máy chủ. Vui lòng thử lại sau.');
      } else if (e?.message?.includes('Network') || 
                 e?.message?.includes('fetch')) {
        showPasswordMessage('error', '❌ Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.');
      } else {
        showPasswordMessage('error', '❌ ' + (e?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsEditingPassword(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setMessage({ type: '', text: '' });
    setPasswordMessage({ type: '', text: '' });
  };

  return (
    <div className="profile-container">
      <div className="profile-title">
        <h1>Thông tin người dùng</h1>
      </div>
      <div className="profile-wrapper">
        <div className="profile-header">
          <div className="profile-avatar">
            <img src={getUserAvatar()} alt="User Avatar" />
          </div>
          <div className="profile-info">
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            {user?.phone && (
              <p style={{ fontSize: '14px', opacity: 0.9, margin: '5px 0' }}>
                📞 {user.phone}
              </p>
            )}
            <span className="role-badge">
              {user?.roles?.includes('ROLE_ADMIN') ? 'Quản trị viên' : 'Khách hàng'}
            </span>
          </div>
        </div>

        <div className="profile-content">
          {/* Message Display */}
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="profile-section">
            <div className="section-header">
              <h3>Thông tin cá nhân</h3>
              <button
                className="edit-btn"
                onClick={() => setIsEditing(!isEditing)}
                disabled={loading}
              >
                {isEditing ? 'Hủy' : 'Chỉnh sửa'}
              </button>
            </div>

            

            <div className="profile-form">
              <div className="form-group">
                <label>Họ và tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : 'readonly'}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : 'readonly'}
                  placeholder="Nhập email của bạn"
                />
                {!isEditing && !formData.email && (
                  <small style={{ color: '#999', fontSize: '12px', marginTop: '5px' }}>
                    Chưa có email. Nhấn "Chỉnh sửa" để thêm.
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : 'readonly'}
                  placeholder={formData.phone ? formData.phone : "Chưa cập nhật số điện thoại"}
                />
                
                {!isEditing && !formData.phone && (
                  <small style={{ color: '#999', fontSize: '12px', marginTop: '5px' }}>
                    Chưa có số điện thoại. Nhấn "Chỉnh sửa" để thêm.
                  </small>
                )}
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button 
                    className="btn-secondary" 
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Hủy
                  </button>
                  <button 
                    className="btn-primary" 
                    onClick={handleSaveProfile}
                    disabled={loading}
                  >
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Password Change Section */}
          <div className="profile-section">
            <div className="section-header">
              <h3>Bảo mật</h3>
              <button
                className="edit-btn"
                onClick={() => setIsEditingPassword(!isEditingPassword)}
                disabled={loading}
              >
                {isEditingPassword ? 'Hủy' : 'Đổi mật khẩu'}
              </button>
            </div>
            
            {/* Password Message Display - Hiển thị ngay dưới dòng Bảo mật */}
            {passwordMessage.text && (
              <div className={`password-message ${passwordMessage.type}`}>
                {passwordMessage.text}
              </div>
            )}

            {isEditingPassword && (
              <div className="profile-form">
                <div className="form-group">
                  <label>Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="editable"
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mật khẩu mới</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="editable"
                    placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="editable"
                    placeholder="Nhập lại mật khẩu mới"
                    required
                  />
              </div>

                <div className="form-actions">
                  <button 
                    className="btn-secondary" 
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Hủy
                  </button>
                  <button 
                    className="btn-primary" 
                    onClick={handleChangePassword}
                    disabled={loading}
                  >
                    {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
