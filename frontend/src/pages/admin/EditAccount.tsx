import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import './AdminPages.css';

const EditAccount: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [accountData, setAccountData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    bio: '',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  });

  useEffect(() => {
    if (user) {
      setAccountData({
        name: user.name || '',
        email: user.email || '',
        phone: '',
        address: '',
        bio: '',
        notifications: {
          email: true,
          sms: false,
          push: true
        }
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
      console.error('Error saving account:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.startsWith('notifications.')) {
      const notificationField = field.split('.')[1];
      setAccountData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationField]: value
        }
      }));
    } else {
      setAccountData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <AdminLayout title="Chỉnh sửa tài khoản" breadcrumb="Chỉnh sửa tài khoản">
      <div className="admin-page">
        <div className="account-container">
          {/* Account Settings */}
          <div className="account-section">
            <h3>Thông tin cơ bản</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Họ và tên:</label>
                <input
                  type="text"
                  value={accountData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={accountData.email}
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
                  value={accountData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="form-input"
                  placeholder="Nhập số điện thoại..."
                />
              </div>
              <div className="form-group">
                <label>Địa chỉ:</label>
                <input
                  type="text"
                  value={accountData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="form-input"
                  placeholder="Nhập địa chỉ..."
                />
              </div>
              <div className="form-group full-width">
                <label>Giới thiệu:</label>
                <textarea
                  value={accountData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="form-input"
                  rows={4}
                  placeholder="Viết giới thiệu về bản thân..."
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="account-section">
            <h3>Cài đặt thông báo</h3>
            <div className="notification-settings">
              <div className="setting-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={accountData.notifications.email}
                    onChange={(e) => handleInputChange('notifications.email', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Nhận thông báo qua email
                </label>
              </div>
              <div className="setting-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={accountData.notifications.sms}
                    onChange={(e) => handleInputChange('notifications.sms', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Nhận thông báo qua SMS
                </label>
              </div>
              <div className="setting-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={accountData.notifications.push}
                    onChange={(e) => handleInputChange('notifications.push', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Nhận thông báo push
                </label>
              </div>
            </div>
          </div>

          {/* Password Settings */}
          <div className="account-section">
            <h3>Bảo mật</h3>
            <div className="password-form">
              <div className="form-group">
                <label>Mật khẩu hiện tại:</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Nhập mật khẩu hiện tại..."
                />
              </div>
              <div className="form-group">
                <label>Mật khẩu mới:</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Nhập mật khẩu mới..."
                />
              </div>
              <div className="form-group">
                <label>Xác nhận mật khẩu mới:</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Nhập lại mật khẩu mới..."
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="account-actions">
            <button 
              className="btn-primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
            {saved && (
              <span className="save-success">✅ Đã lưu thành công!</span>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditAccount;
