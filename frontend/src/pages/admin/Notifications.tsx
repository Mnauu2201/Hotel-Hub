import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import './AdminPages.css';

interface Notification {
  id: number;
  title?: string;
  message: string;
  type: string;
  recipient: string;
  status: string;
  createdAt: string;
  sentAt?: string;
  url?: string;
}

const Notifications: React.FC = () => {
  const { accessToken } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [typeFilter, statusFilter]);

  useEffect(() => {
    // Check initial dark mode
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains('dark-mode'));
    };
    
    checkDarkMode();
    
    // Watch for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      if (!accessToken) {
        console.error('No access token available from AuthContext');
        // Fallback to mock data for now
      const mockNotifications: Notification[] = [
        {
          id: 1,
          title: 'Chào mừng khách hàng mới',
          message: 'Chào mừng bạn đến với HotelHub! Chúng tôi hân hạnh được phục vụ bạn.',
          type: 'WELCOME',
          recipient: 'user1@example.com',
          status: 'SENT',
          createdAt: '2024-01-15T10:00:00Z',
          sentAt: '2024-01-15T10:05:00Z'
        },
        {
          id: 2,
          title: 'Xác nhận đặt phòng',
          message: 'Đặt phòng của bạn đã được xác nhận. Mã đặt phòng: #12345',
          type: 'BOOKING_CONFIRMATION',
          recipient: 'user2@example.com',
          status: 'SENT',
          createdAt: '2024-01-15T11:00:00Z',
          sentAt: '2024-01-15T11:02:00Z'
        },
        {
          id: 3,
          title: 'Nhắc nhở thanh toán',
          message: 'Vui lòng thanh toán đặt phòng #12345 trong vòng 24 giờ.',
          type: 'PAYMENT_REMINDER',
          recipient: 'user3@example.com',
          status: 'PENDING',
          createdAt: '2024-01-15T12:00:00Z'
        },
        {
          id: 4,
          title: 'Thông báo bảo trì hệ thống',
          message: 'Hệ thống sẽ bảo trì từ 02:00 - 04:00 ngày mai.',
          type: 'SYSTEM_MAINTENANCE',
          recipient: 'all@hotelhub.com',
          status: 'SENT',
          createdAt: '2024-01-15T13:00:00Z',
          sentAt: '2024-01-15T13:05:00Z'
        },
        {
          id: 5,
          title: 'Khuyến mãi đặc biệt',
          message: 'Giảm 20% cho tất cả phòng trong tháng này!',
          type: 'PROMOTION',
          recipient: 'all@hotelhub.com',
          status: 'DRAFT',
          createdAt: '2024-01-15T14:00:00Z'
        }
      ];
      setNotifications(mockNotifications);
      return;
    }

    console.log('Using accessToken from AuthContext for notifications');

    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (typeFilter !== 'ALL') {
        params.append('type', typeFilter);
      }
      if (statusFilter !== 'ALL') {
        params.append('status', statusFilter);
      }
      
      const queryString = params.toString();
      const url = `http://localhost:8080/api/admin/notifications${queryString ? '?' + queryString : ''}`;
      
      console.log('Fetching notifications from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('API Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('API Response data:', data);
        setNotifications(data.notifications || []);
        return;
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch notifications:', response.status, errorText);
      }
    } catch (apiError) {
      console.error('API call failed:', apiError);
    }

    // Fallback to mock data if API fails
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: 'Chào mừng khách hàng mới',
        message: 'Chào mừng bạn đến với HotelHub! Chúng tôi hân hạnh được phục vụ bạn.',
        type: 'WELCOME',
        recipient: 'user1@example.com',
        status: 'SENT',
        createdAt: '2024-01-15T10:00:00Z',
        sentAt: '2024-01-15T10:05:00Z'
      },
      {
        id: 2,
        title: 'Xác nhận đặt phòng',
        message: 'Đặt phòng của bạn đã được xác nhận. Mã đặt phòng: #12345',
        type: 'BOOKING_CONFIRMATION',
        recipient: 'user2@example.com',
        status: 'SENT',
        createdAt: '2024-01-15T11:00:00Z',
        sentAt: '2024-01-15T11:02:00Z'
      },
      {
        id: 3,
        title: 'Nhắc nhở thanh toán',
        message: 'Vui lòng thanh toán đặt phòng #12345 trong vòng 24 giờ.',
        type: 'PAYMENT_REMINDER',
        recipient: 'user3@example.com',
        status: 'PENDING',
        createdAt: '2024-01-15T12:00:00Z'
      },
      {
        id: 4,
        title: 'Thông báo bảo trì hệ thống',
        message: 'Hệ thống sẽ bảo trì từ 02:00 - 04:00 ngày mai.',
        type: 'SYSTEM_MAINTENANCE',
        recipient: 'all@hotelhub.com',
        status: 'SENT',
        createdAt: '2024-01-15T13:00:00Z',
        sentAt: '2024-01-15T13:05:00Z'
      },
      {
        id: 5,
        title: 'Khuyến mãi đặc biệt',
        message: 'Giảm 20% cho tất cả phòng trong tháng này!',
        type: 'PROMOTION',
        recipient: 'all@hotelhub.com',
        status: 'DRAFT',
        createdAt: '2024-01-15T14:00:00Z'
      }
    ];
    setNotifications(mockNotifications);
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (notificationId: number) => {
    try {
      if (!accessToken) {
        console.error('No access token available');
        return;
      }
      
      const response = await fetch(`http://localhost:8080/api/admin/notifications/${notificationId}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNotifications(notifications.map(notif => 
            notif.id === notificationId 
              ? { ...notif, status: 'SENT', sentAt: new Date().toISOString() }
              : notif
          ));
          console.log('Notification sent successfully');
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to send notification:', response.status, errorText);
      }
    } catch (error) {
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
      try {
        if (!accessToken) {
          console.error('No access token available');
          return;
        }
        
        const response = await fetch(`http://localhost:8080/api/admin/notifications/${notificationId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setNotifications(notifications.filter(notif => notif.id !== notificationId));
            console.log('Notification deleted successfully');
          }
        } else {
          const errorText = await response.text();
          console.error('Failed to delete notification:', response.status, errorText);
        }
      } catch (error) {
      }
    }
  };


  const getTypeBadge = (type: string) => {
    const typeMap: { [key: string]: { text: string; lightBg: string; lightColor: string; darkBg: string; darkColor: string } } = {
      'WELCOME': {
        text: 'Chào mừng',
        lightBg: '#d4edda',
        lightColor: '#155724',
        darkBg: '#1a4d1a',
        darkColor: '#a8e6a8'
      },
      'BOOKING_CONFIRMATION': {
        text: 'Xác nhận đặt phòng',
        lightBg: '#cce5ff',
        lightColor: '#004085',
        darkBg: '#1a3a5c',
        darkColor: '#66b3ff'
      },
      'PAYMENT_REMINDER': {
        text: 'Nhắc nhở thanh toán',
        lightBg: '#fff3cd',
        lightColor: '#856404',
        darkBg: '#4d3d1a',
        darkColor: '#ffd700'
      },
      'SYSTEM_MAINTENANCE': {
        text: 'Bảo trì hệ thống',
        lightBg: '#f8d7da',
        lightColor: '#721c24',
        darkBg: '#4d1a1a',
        darkColor: '#ffb3b3'
      },
      'PROMOTION': {
        text: 'Khuyến mãi',
        lightBg: '#e2e3ff',
        lightColor: '#4c4c99',
        darkBg: '#2d2d5c',
        darkColor: '#b3b3ff'
      },
      'BOOKING_CREATED': {
        text: 'Tạo đặt phòng',
        lightBg: '#d1ecf1',
        lightColor: '#0c5460',
        darkBg: '#1a3a3e',
        darkColor: '#7dd3fc'
      },
      'PAYMENT_SUCCESS': {
        text: 'Thanh toán thành công',
        lightBg: '#d4edda',
        lightColor: '#155724',
        darkBg: '#1a3a1a',
        darkColor: '#86efac'
      },
      'PAYMENT_FAILED': {
        text: 'Thanh toán thất bại',
        lightBg: '#f8d7da',
        lightColor: '#721c24',
        darkBg: '#4d1a1a',
        darkColor: '#fca5a5'
      },
      'ADMIN_ALERT': {
        text: 'Cảnh báo Admin',
        lightBg: '#fff3cd',
        lightColor: '#856404',
        darkBg: '#4d3d1a',
        darkColor: '#fde047'
      },
      'STAFF_TASK': {
        text: 'Nhiệm vụ Staff',
        lightBg: '#e2e3ff',
        lightColor: '#4c4c99',
        darkBg: '#2d2d5c',
        darkColor: '#b3b3ff'
      },
      'OTHER': {
        text: 'Khác',
        lightBg: '#f8f9fa',
        lightColor: '#6c757d',
        darkBg: '#343a40',
        darkColor: '#adb5bd'
      }
    };
    
    const typeInfo = typeMap[type] || {
      text: type,
      lightBg: '#f5f5f5',
      lightColor: '#616161',
      darkBg: '#2d3748',
      darkColor: '#e2e8f0'
    };
    
    return (
      <span
        className="type-badge"
        style={{
          backgroundColor: isDarkMode ? typeInfo.darkBg : typeInfo.lightBg,
          color: isDarkMode ? typeInfo.darkColor : typeInfo.lightColor,
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          fontSize: '0.8rem',
          fontWeight: '500'
        }}
      >
        {typeInfo.text}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { text: string; lightBg: string; lightColor: string; darkBg: string; darkColor: string } } = {
      'DRAFT': {
        text: 'Bản nháp',
        lightBg: '#f8f9fa',
        lightColor: '#6c757d',
        darkBg: '#2d3748',
        darkColor: '#a0aec0'
      },
      'PENDING': {
        text: 'Chờ gửi',
        lightBg: '#fff3cd',
        lightColor: '#856404',
        darkBg: '#4d3d1a',
        darkColor: '#ffd700'
      },
      'SENT': {
        text: 'Đã gửi',
        lightBg: '#d4edda',
        lightColor: '#155724',
        darkBg: '#1a4d1a',
        darkColor: '#a8e6a8'
      },
      'FAILED': {
        text: 'Gửi thất bại',
        lightBg: '#f8d7da',
        lightColor: '#721c24',
        darkBg: '#4d1a1a',
        darkColor: '#ffb3b3'
      }
    };
    
    const statusInfo = statusMap[status] || {
      text: status,
      lightBg: '#f5f5f5',
      lightColor: '#616161',
      darkBg: '#2d3748',
      darkColor: '#e2e8f0'
    };
    
    return (
      <span
        className="status-badge"
        style={{
          backgroundColor: isDarkMode ? statusInfo.darkBg : statusInfo.lightBg,
          color: isDarkMode ? statusInfo.darkColor : statusInfo.lightColor,
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          fontSize: '0.8rem',
          fontWeight: '500'
        }}
      >
        {statusInfo.text}
      </span>
    );
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesType = typeFilter === 'ALL' || notif.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || notif.status === statusFilter;
    return matchesType && matchesStatus;
  });

  return (
    <AdminLayout title="Quản lý thông báo" breadcrumb="Quản lý thông báo">
      <div className="admin-page">
        {/* Header Actions */}
        <div className="admin-page-actions">
          <button 
            className="btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            ➕ Tạo thông báo mới
          </button>
        </div>

        {/* Filters */}
        <div className="admin-filters">
          <div className="filter-group">
            <label>Loại thông báo:</label>
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">Tất cả</option>
              <option value="WELCOME">Chào mừng</option>
              <option value="BOOKING_CONFIRMATION">Xác nhận đặt phòng</option>
              <option value="PAYMENT_REMINDER">Nhắc nhở thanh toán</option>
              <option value="SYSTEM_MAINTENANCE">Bảo trì hệ thống</option>
              <option value="PROMOTION">Khuyến mãi</option>
              <option value="BOOKING_CREATED">Tạo đặt phòng</option>
              <option value="PAYMENT_SUCCESS">Thanh toán thành công</option>
              <option value="PAYMENT_FAILED">Thanh toán thất bại</option>
              <option value="ADMIN_ALERT">Cảnh báo Admin</option>
              <option value="STAFF_TASK">Nhiệm vụ Staff</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Trạng thái:</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">Tất cả</option>
              <option value="DRAFT">Bản nháp</option>
              <option value="PENDING">Chờ gửi</option>
              <option value="SENT">Đã gửi</option>
              <option value="FAILED">Gửi thất bại</option>
            </select>
          </div>
        </div>

        {/* Notifications Table */}
        <div className="admin-table-container">
          {loading ? (
            <div className="loading">Đang tải...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tiêu đề</th>
                  <th>Loại</th>
                  <th>Người nhận</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Ngày gửi</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotifications.map((notif) => (
                  <tr key={notif.id}>
                    <td>{notif.id}</td>
                    <td>
                      <div className="notification-title">
                        <strong>{notif.title}</strong>
                        <p className="notification-preview">{notif.message.substring(0, 50)}...</p>
                      </div>
                    </td>
                    <td>{getTypeBadge(notif.type)}</td>
                    <td>{notif.recipient}</td>
                    <td>{getStatusBadge(notif.status)}</td>
                    <td>{new Date(notif.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>{notif.sentAt ? new Date(notif.sentAt).toLocaleDateString('vi-VN') : '-'}</td>
                    <td>
                      {notif.status === 'PENDING' && (
                        <button 
                          className="btn-action btn-send"
                          onClick={() => handleSendNotification(notif.id)}
                        >
                          📤 Gửi
                        </button>
                      )}
                      <button className="btn-action btn-edit">✏️ Sửa</button>
                      <button 
                        className="btn-action btn-delete"
                        onClick={() => handleDeleteNotification(notif.id)}
                      >
                        🗑️ Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Tạo thông báo mới</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowAddModal(false)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-content">
                <form>
                  <div className="form-group">
                    <label>Tiêu đề:</label>
                    <input type="text" className="form-input" placeholder="Nhập tiêu đề..." />
                  </div>
                  <div className="form-group">
                    <label>Loại thông báo:</label>
                    <select className="form-select">
                      <option value="WELCOME">Chào mừng</option>
                      <option value="BOOKING_CONFIRMATION">Xác nhận đặt phòng</option>
                      <option value="PAYMENT_REMINDER">Nhắc nhở thanh toán</option>
                      <option value="SYSTEM_MAINTENANCE">Bảo trì hệ thống</option>
                      <option value="PROMOTION">Khuyến mãi</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Người nhận:</label>
                    <input type="text" className="form-input" placeholder="Email hoặc 'all' cho tất cả" />
                  </div>
                  <div className="form-group">
                    <label>Nội dung:</label>
                    <textarea className="form-input" rows={4} placeholder="Nhập nội dung thông báo..."></textarea>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                      Hủy
                    </button>
                    <button type="button" className="btn-secondary">
                      Lưu bản nháp
                    </button>
                    <button type="submit" className="btn-primary">
                      Tạo và gửi
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Notifications;
