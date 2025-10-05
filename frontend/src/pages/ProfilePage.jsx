import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import userApi from '../services/userApi';
import { Link } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, isAuthenticated, getUserAvatar } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: ''
  });

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
  };

  const handleSave = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        return;
      }
      const payload = { name: formData.name, phone: formData.phone };
      const updated = await userApi.updateProfile(accessToken, payload);
      // cập nhật UI và localStorage
      const nextUser = { ...user, name: updated.name, email: updated.email, roles: user?.roles || [] };
      localStorage.setItem('user', JSON.stringify(nextUser));
      alert('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (e) {
      alert(e?.message || 'Cập nhật thông tin thất bại');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-header">
          <div className="profile-avatar">
            <img src={getUserAvatar()} alt="User Avatar" />
          </div>
          <div className="profile-info">
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            <span className="role-badge">
              {user?.roles?.includes('ROLE_ADMIN') ? 'Quản trị viên' : 'Khách hàng'}
            </span>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <div className="section-header">
              <h3>Thông tin cá nhân</h3>
              <button 
                className="edit-btn"
                onClick={() => setIsEditing(!isEditing)}
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
                  value={formData.email}
                  onChange={handleChange}
                  disabled={true}
                  className="readonly"
                />
                <small>Email không thể thay đổi</small>
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : 'readonly'}
                  placeholder="Chưa cập nhật"
                />
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button className="btn-primary" onClick={handleSave}>
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="profile-section">
            <div className="section-header">
              <h3>Hoạt động gần đây</h3>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <i className="fas fa-calendar-check"></i>
                <div className="activity-content">
                  <h4>Đặt phòng thành công</h4>
                  <p>Phòng Deluxe - Ngày 15/12/2024</p>
                  <span>2 ngày trước</span>
                </div>
              </div>
              <div className="activity-item">
                <i className="fas fa-user-check"></i>
                <div className="activity-content">
                  <h4>Đăng ký tài khoản</h4>
                  <p>Chào mừng bạn đến với HotelHub!</p>
                  <span>1 tuần trước</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
