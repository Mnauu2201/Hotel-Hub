import React, { useState } from 'react';
import './UserModal.css';
import { useAuth } from '../../contexts/AuthContext';
import userApi from '../../services/userApi';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from './EditProfileModal';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  position?: { top: number; left: number };
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, position }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot' | 'profile'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const { login, register, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await login({ email, password });
      
      // Debug: Log response để kiểm tra
      console.log('UserModal Login response:', response);
      console.log('UserModal User roles:', response.roles);
      
      setSuccess('Đăng nhập thành công!');
      
      // Kiểm tra role admin và redirect tương ứng
      if (response.roles && response.roles.includes('ROLE_ADMIN')) {
        console.log('UserModal Admin detected, redirecting to /admin');
        setTimeout(() => {
          onClose();
          navigate('/admin');
        }, 800);
      } else {
        console.log('UserModal Regular user, staying on home page');
        setTimeout(() => {
          onClose();
        }, 800);
      }
    } catch (err: any) {
      setError(err?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      setLoading(false);
      return;
    }

    try {
      const sanitizedPhone = (phone || '').replace(/\D/g, '');
      await register({ name: fullName.trim(), email: email.trim(), password, phone: sanitizedPhone });
      setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
      setTimeout(() => {
        setActiveTab('login');
      }, 800);
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('exist') || msg.toLowerCase().includes('đã tồn tại')) {
        setError('Email đã tồn tại trong hệ thống.');
      } else {
        setError(msg || 'Đăng ký thất bại. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await userApi.forgotPassword({ email });
      setSuccess(res.message || 'Mã xác thực đã được gửi đến email của bạn');
      setTimeout(() => {
        onClose();
        navigate('/reset-password', { state: { email } });
      }, 800);
    } catch (err: any) {
      setError(err?.message || 'Không thể gửi email. Vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!isOpen) return null;

  const modalStyle = position ? {
    position: 'fixed',
    top: `${position.top}px`,
    left: `${position.left}px`,
    transform: 'none',
    zIndex: 1000,
  } as React.CSSProperties : {};

  return (
    <div className="user-modal-overlay" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="user-modal" style={modalStyle}>
        <div className="user-modal-header">
          <div className="user-modal-tabs">
            {user ? (
              <button 
                className={`user-modal-tab ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Thông tin cá nhân
              </button>
            ) : (
              <>
                <button 
                  className={`user-modal-tab ${activeTab === 'login' ? 'active' : ''}`}
                  onClick={() => setActiveTab('login')}
                >
                  Đăng nhập
                </button>
                <button 
                  className={`user-modal-tab ${activeTab === 'register' ? 'active' : ''}`}
                  onClick={() => setActiveTab('register')}
                >
                  Đăng ký
                </button>
              </>
            )}
          </div>
          <button className="user-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="user-modal-content">
          {error && <div className="user-modal-error">{error}</div>}
          {success && <div className="user-modal-success">{success}</div>}

          {activeTab === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="user-modal-form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="user-modal-form-group">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="user-modal-forgot">
                <span onClick={() => setActiveTab('forgot')}>Quên mật khẩu?</span>
              </div>
              <button type="submit" className="user-modal-button" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
            </form>
          )}

          {activeTab === 'register' && (
            <form onSubmit={handleRegister}>
              <div className="user-modal-form-group">
                <label htmlFor="fullName">Họ và tên</label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="user-modal-form-group">
                <label htmlFor="registerEmail">Email</label>
                <input
                  type="email"
                  id="registerEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="user-modal-form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="user-modal-form-group">
                <label htmlFor="registerPassword">Mật khẩu</label>
                <input
                  type="password"
                  id="registerPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="user-modal-form-group">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="user-modal-button" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
              </button>
            </form>
          )}

          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotPassword}>
              <div className="user-modal-form-group">
                <label htmlFor="forgotEmail">Email</label>
                <input
                  type="email"
                  id="forgotEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="user-modal-button" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Gửi yêu cầu'}
              </button>
              <div className="user-modal-back">
                <span onClick={() => setActiveTab('login')}>Quay lại đăng nhập</span>
              </div>
            </form>
          )}

          {activeTab === 'profile' && user && (
            <div className="profile-info">
              <div className="user-info-display">
                <div className="user-info-item">
                  <label>Họ và tên:</label>
                  <span>{user.name || 'Chưa cập nhật'}</span>
                </div>
                <div className="user-info-item">
                  <label>Email:</label>
                  <span>{user.email}</span>
                </div>
                <div className="user-info-item">
                  <label>Số điện thoại:</label>
                  <span>{user.phone || 'Chưa cập nhật'}</span>
                </div>
              </div>
              
              <div className="profile-actions">
                <button 
                  className="user-modal-button" 
                  onClick={() => setShowEditProfile(true)}
                >
                  Sửa thông tin
                </button>
                <button 
                  className="user-modal-button user-modal-button-secondary" 
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfileModal
          isOpen={showEditProfile}
          onClose={() => setShowEditProfile(false)}
          position={position}
        />
      )}
    </div>
  );
};

export default UserModal;