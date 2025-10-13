import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminPages.css';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  recipient: string;
  status: string;
  createdAt: string;
  sentAt?: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchNotifications();
  }, [typeFilter, statusFilter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
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
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (notificationId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/notifications/${notificationId}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setNotifications(notifications.map(notif => 
          notif.id === notificationId 
            ? { ...notif, status: 'SENT', sentAt: new Date().toISOString() }
            : notif
        ));
      }
    } catch (error) {
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`/api/notifications/${notificationId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          setNotifications(notifications.filter(notif => notif.id !== notificationId));
        }
      } catch (error) {
      }
    }
  };

  const getTypeBadge = (type: string) => {
    const typeMap: { [key: string]: { class: string; text: string } } = {
      'WELCOME': { class: 'type-welcome', text: 'Chào mừng' },
      'BOOKING_CONFIRMATION': { class: 'type-booking', text: 'Xác nhận đặt phòng' },
      'PAYMENT_REMINDER': { class: 'type-payment', text: 'Nhắc nhở thanh toán' },
      'SYSTEM_MAINTENANCE': { class: 'type-system', text: 'Bảo trì hệ thống' },
      'PROMOTION': { class: 'type-promotion', text: 'Khuyến mãi' }
    };
    
    const typeInfo = typeMap[type] || { class: 'type-default', text: type };
    return <span className={`type-badge ${typeInfo.class}`}>{typeInfo.text}</span>;
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { class: string; text: string } } = {
      'DRAFT': { class: 'status-draft', text: 'Bản nháp' },
      'PENDING': { class: 'status-pending', text: 'Chờ gửi' },
      'SENT': { class: 'status-sent', text: 'Đã gửi' },
      'FAILED': { class: 'status-failed', text: 'Gửi thất bại' }
    };
    
    const statusInfo = statusMap[status] || { class: 'status-default', text: status };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
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
