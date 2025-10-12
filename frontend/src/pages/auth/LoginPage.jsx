import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AuthStyles.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, user, isAdmin } = useAuth();

  // Kiểm tra nếu user đã đăng nhập và có role admin
  useEffect(() => {
    if (user && isAdmin) {
      console.log('User already logged in as admin, redirecting to /admin');
      navigate('/admin');
    } else if (user && !isAdmin) {
      console.log('User already logged in as regular user, redirecting to /');
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await login({ email, password });
      
      // Debug: Log response để kiểm tra
      console.log('Login response:', response);
      console.log('User roles:', response.roles);
      
      // Kiểm tra role admin và redirect tương ứng
      if (response.roles && response.roles.includes('ROLE_ADMIN')) {
        console.log('Admin detected from response, redirecting to /admin');
        navigate('/admin');
      } else {
        console.log('Regular user, redirecting to /');
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Email hoặc mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Đăng nhập</h2>
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </p>
          <p>
            Quên mật khẩu? <Link to="/forgot-password">Khôi phục mật khẩu</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;