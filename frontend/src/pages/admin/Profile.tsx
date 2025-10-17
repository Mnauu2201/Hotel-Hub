import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import './AdminPages.css';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: '',
        address: '',
        bio: ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Mock save - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <AdminLayout title="Thông tin cá nhân" breadcrumb="Thông tin cá nhân">
      <div className="admin-page">
        <div className="profile-container">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar">
              <div className="avatar-circle">
                <span>{user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AD'}</span>
              </div>
            </div>
            <div className="profile-info">
              <h2>{user?.name || 'Admin User'}</h2>
              <p>{user?.email || 'admin@hotelhub.com'}</p>
              <span className="role-badge role-admin">Admin</span>
            </div>
          </div>

          {/* Profile Form */}
          <div className="profile-form">
            <h3>Thông tin cá nhân</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Họ và tên:</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="form-input"
                  disabled
                />
                <small>Email không thể thay đổi</small>
              </div>
              <div className="form-group">
                <label>Số điện thoại:</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="form-input"
                  placeholder="Nhập số điện thoại..."
                />
              </div>
              <div className="form-group">
                <label>Địa chỉ:</label>
                <input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="form-input"
                  placeholder="Nhập địa chỉ..."
                />
              </div>
              <div className="form-group full-width">
                <label>Giới thiệu:</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="form-input"
                  rows={4}
                  placeholder="Viết giới thiệu về bản thân..."
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                className="btn-primary"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Đang lưu...' : 'Lưu thông tin'}
              </button>
              {saved && (
                <span className="save-success">✅ Đã lưu thành công!</span>
              )}
            </div>
          </div>

          {/* Account Security */}
          <div className="profile-security">
            <h3>Bảo mật tài khoản</h3>
            <div className="security-items">
              <div className="security-item">
                <div className="security-info">
                  <h4>Mật khẩu</h4>
                  <p>Thay đổi mật khẩu để bảo mật tài khoản</p>
                </div>
                <button className="btn-secondary">Đổi mật khẩu</button>
              </div>
              <div className="security-item">
                <div className="security-info">
                  <h4>Xác thực 2 bước</h4>
                  <p>Thêm lớp bảo mật cho tài khoản</p>
                </div>
                <button className="btn-secondary">Thiết lập</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Profile;
