import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import userApi from '../../services/userApi';
import './AuthStyles.css';

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialEmail = location?.state?.email || '';

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isStrongPassword = (pwd) => {
    if (!pwd || pwd.length < 6) return false;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasDigit = /\d/.test(pwd);
    return hasUpper && hasLower && hasDigit;
  };

  const strength = {
    length: password.length >= 6,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    digit: /\d/.test(password)
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await userApi.verifyOtp({ email, otp });
      setMessage(res.message || 'Mã OTP hợp lệ. Vui lòng nhập mật khẩu mới.');
    } catch (e) {
      setError(e?.message || 'OTP không hợp lệ');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!password || password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (!isStrongPassword(password)) {
      setError('Mật khẩu phải có chữ hoa, chữ thường và số');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    setLoading(true);
    try {
      const res = await userApi.resetPassword({ email, otp, newPassword: password, confirmPassword });
      setMessage(res.message || 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập.');
      setTimeout(() => navigate('/'), 1000);
    } catch (e) {
      setError(e?.message || 'Đặt lại mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setMessage('');
    try {
      const res = await userApi.resendOtp(email);
      setMessage(res.message || 'Đã gửi lại mã OTP.');
    } catch (e) {
      setError(e?.message || 'Gửi lại OTP thất bại');
    }
  };

  return (
    <div className="auth-container auth-lux">
      <div className="auth-form-container auth-card-lux">
        <h2 className="auth-title">Đặt lại mật khẩu</h2>
        <p className="auth-subtitle">Xác thực OTP và tạo mật khẩu mới thật an toàn</p>
        {message && <div className="auth-success">{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleVerify} className="auth-form">
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

          <div className="form-group">
            <label htmlFor="otp">Mã OTP</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Nhập mã OTP"
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Đang kiểm tra...' : 'Xác thực OTP'}
          </button>
        </form>

        <form onSubmit={handleReset} className="auth-form" style={{ marginTop: 16 }}>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu mới</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
              required
            />
            <div className="password-hints" style={{ fontSize: 12, marginTop: 6 }}>
              <div style={{ color: strength.length ? '#2e7d32' : '#b00020' }}>• Tối thiểu 6 ký tự</div>
              <div style={{ color: strength.upper ? '#2e7d32' : '#b00020' }}>• Có ít nhất 1 chữ hoa (A-Z)</div>
              <div style={{ color: strength.lower ? '#2e7d32' : '#b00020' }}>• Có ít nhất 1 chữ thường (a-z)</div>
              <div style={{ color: strength.digit ? '#2e7d32' : '#b00020' }}>• Có ít nhất 1 số (0-9)</div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              required
            />
            {confirmPassword && (
              <div className="field-hint" style={{ fontSize: 12, marginTop: 6, color: password === confirmPassword ? '#2e7d32' : '#b00020' }}>
                {password === confirmPassword ? 'Mật khẩu khớp' : 'Mật khẩu chưa khớp'}
              </div>
            )}
          </div>
          <div className="form-group">
            <button type="button" className="auth-button secondary" onClick={handleResend}>
              Gửi lại OTP
            </button>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading || !isStrongPassword(password) || password !== confirmPassword}
          >
            {loading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
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

export default ResetPasswordPage;


