import React, { useState } from 'react';
import './UserModal.css';
import { useAuth } from '../../contexts/AuthContext';
import userApi from '../../services/userApi';
import { useNavigate } from 'react-router-dom';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  position?: { top: number; left: number };
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, position }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await login({ email, password });
      setSuccess('Đăng nhập thành công!');
      setTimeout(() => {
        onClose();
      }, 800);
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
      await register({ name: fullName, email, password, phone });
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
        </div>
      </div>
    </div>
  );
};

export default UserModal;