import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminPages.css';

interface SystemSettings {
  hotelName: string;
  hotelAddress: string;
  hotelPhone: string;
  hotelEmail: string;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  maxBookingDays: number;
  autoCancelHours: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    hotelName: 'HotelHub',
    hotelAddress: '123 Đường ABC, Quận 1, TP.HCM',
    hotelPhone: '+84 777 666 555',
    hotelEmail: 'info@hotelhub.com',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    cancellationPolicy: 'Hủy miễn phí trước 24h',
    maxBookingDays: 30,
    autoCancelHours: 24,
    emailNotifications: true,
    smsNotifications: false
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Mock save - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SystemSettings, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <AdminLayout title="Cài đặt hệ thống" breadcrumb="Cài đặt hệ thống">
      <div className="admin-page">
        <div className="settings-container">
          {/* Hotel Information */}
          <div className="settings-section">
            <h3>Thông tin khách sạn</h3>
            <div className="settings-grid">
              <div className="form-group">
                <label>Tên khách sạn:</label>
                <input
                  type="text"
                  value={settings.hotelName}
                  onChange={(e) => handleInputChange('hotelName', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Địa chỉ:</label>
                <input
                  type="text"
                  value={settings.hotelAddress}
                  onChange={(e) => handleInputChange('hotelAddress', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại:</label>
                <input
                  type="text"
                  value={settings.hotelPhone}
                  onChange={(e) => handleInputChange('hotelPhone', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={settings.hotelEmail}
                  onChange={(e) => handleInputChange('hotelEmail', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Booking Settings */}
          <div className="settings-section">
            <h3>Cài đặt đặt phòng</h3>
            <div className="settings-grid">
              <div className="form-group">
                <label>Giờ nhận phòng:</label>
                <input
                  type="time"
                  value={settings.checkInTime}
                  onChange={(e) => handleInputChange('checkInTime', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Giờ trả phòng:</label>
                <input
                  type="time"
                  value={settings.checkOutTime}
                  onChange={(e) => handleInputChange('checkOutTime', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Chính sách hủy:</label>
                <input
                  type="text"
                  value={settings.cancellationPolicy}
                  onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Số ngày đặt tối đa:</label>
                <input
                  type="number"
                  value={settings.maxBookingDays}
                  onChange={(e) => handleInputChange('maxBookingDays', parseInt(e.target.value))}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Tự động hủy sau (giờ):</label>
                <input
                  type="number"
                  value={settings.autoCancelHours}
                  onChange={(e) => handleInputChange('autoCancelHours', parseInt(e.target.value))}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="settings-section">
            <h3>Cài đặt thông báo</h3>
            <div className="notification-settings">
              <div className="setting-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Gửi thông báo qua email
                </label>
              </div>
              <div className="setting-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Gửi thông báo qua SMS
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="settings-actions">
            <button 
              className="btn-primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : 'Lưu cài đặt'}
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

export default SystemSettings;
