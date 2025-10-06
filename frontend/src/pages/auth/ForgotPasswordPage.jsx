import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userApi from '../../services/userApi';
import './AuthStyles.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await userApi.forgotPassword({ email });
      setMessage(res.message || 'Mã xác thực đã được gửi đến email của bạn');
      // Chuyển sang trang xác thực OTP
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 800);
    } catch (e) {
      setError(e?.message || 'Không thể gửi email. Vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container auth-lux">
      <div className="auth-form-container auth-card-lux">
        <h2 className="auth-title">Khôi phục mật khẩu</h2>
        <p className="auth-subtitle">Nhập email đã đăng ký để nhận mã OTP</p>
        {message && <div className="auth-success">{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email đã đăng ký"
              required
            />
          </div>

          <button type="submit" className="auth-button primary" disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi mã xác thực' }
          </button>
        </form>

        <div className="auth-links">
          <p>
            Nhớ mật khẩu? <Link to="/">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;


