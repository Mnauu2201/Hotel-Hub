import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getNotifications, sendNotification, deleteNotification } from '../../services/notificationsApi';
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
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchNotifications();
  }, [typeFilter, statusFilter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching notifications from API...');
      
      // Try API call first
      try {
        console.log('🔍 Filter values:', { typeFilter, statusFilter });
        
        const apiData = await getNotifications({
          type: typeFilter,
          status: statusFilter,
          sortBy: 'createdAt',
          sortDir: 'desc'
        });
        
        console.log('✅ API data received:', apiData);
        setNotifications(apiData);
        return;
      } catch (apiError) {
        console.log('⚠️ API call failed, using mock data:', apiError);
      }
      
      // Fallback to mock data if API fails
      const mockNotifications: Notification[] = [
        {
          id: 1,
          title: 'Chào mừng khách hàng mới',
          message: 'Chào mừng bạn đến với HotelHub! Chúng tôi hân hạnh được phục vụ.',
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
      console.error('💥 Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const getTypeBadge = (type: string) => {
    const typeMap: { [key: string]: { text: string; class: string } } = {
      'WELCOME': { text: 'Chào mừng', class: 'type-welcome' },
      'BOOKING_CONFIRMATION': { text: 'Xác nhận đặt phòng', class: 'type-booking' },
      'BOOKING_CREATED': { text: 'Tạo đặt phòng', class: 'type-booking' },
      'PAYMENT_REMINDER': { text: 'Nhắc nhở thanh toán', class: 'type-payment' },
      'SYSTEM_MAINTENANCE': { text: 'Bảo trì hệ thống', class: 'type-maintenance' },
      'PROMOTION': { text: 'Khuyến mãi', class: 'type-promotion' }
    };
    return typeMap[type] || { text: type, class: 'type-default' };
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { text: string; class: string } } = {
      'SENT': { text: 'ĐÃ GỬI', class: 'status-sent' },
      'PENDING': { text: 'CHỜ GỬI', class: 'status-pending' },
      'DRAFT': { text: 'BẢN NHÁP', class: 'status-draft' },
      'FAILED': { text: 'THẤT BẠI', class: 'status-failed' }
    };
    return statusMap[status] || { text: status, class: 'status-default' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleSendNotification = async (id: number) => {
    try {
      console.log('📤 Sending notification:', id);
      await sendNotification(id);
      console.log('✅ Notification sent successfully');
      // Refresh the list
      fetchNotifications();
    } catch (error) {
      console.error('💥 Failed to send notification:', error);
      alert('Không thể gửi thông báo. Vui lòng thử lại.');
    }
  };

  const handleDeleteNotification = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
      return;
    }
    
    try {
      console.log('🗑️ Deleting notification:', id);
      await deleteNotification(id);
      console.log('✅ Notification deleted successfully');
      // Refresh the list
      fetchNotifications();
    } catch (error) {
      console.error('💥 Failed to delete notification:', error);
      alert('Không thể xóa thông báo. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Quản lý thông báo" breadcrumb="Quản lý thông báo">
        <div className="admin-page">
          <div className="loading">Đang tải...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Quản lý thông báo" breadcrumb="Quản lý thông báo">
      <div className="admin-page">
        {/* Header Actions */}
        <div className="admin-page-actions">
          <button 
            className="btn-primary"
            onClick={() => console.log('Create notification')}
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
              <option value="BOOKING_CREATED">Tạo đặt phòng</option>
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
              <option value="SENT">Đã gửi</option>
              <option value="PENDING">Chờ gửi</option>
              <option value="DRAFT">Bản nháp</option>
              <option value="FAILED">Thất bại</option>
            </select>
          </div>
        </div>

        {/* Notifications Table */}
        <div className="admin-table-container">
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
              {notifications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center">
                    Không có thông báo nào
                  </td>
                </tr>
              ) : (
                notifications.map((notification) => {
                  const typeInfo = getTypeBadge(notification.type);
                  const statusInfo = getStatusBadge(notification.status);
                  
                  return (
                    <tr key={notification.id}>
                      <td>{notification.id}</td>
                      <td>
                        <div>
                          <strong>{notification.title}</strong>
                          <div className="notification-message">
                            {notification.message}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`type-badge ${typeInfo.class}`}>
                          {typeInfo.text}
                        </span>
                      </td>
                      <td>{notification.recipient}</td>
                      <td>
                        <span className={`status-badge ${statusInfo.class}`}>
                          {statusInfo.text}
                        </span>
                      </td>
                      <td>{formatDate(notification.createdAt)}</td>
                      <td>{notification.sentAt ? formatDate(notification.sentAt) : '-'}</td>
                      <td>
                        <div className="action-buttons">
                          {notification.status === 'PENDING' && (
                            <button 
                              className="btn-action btn-send"
                              onClick={() => handleSendNotification(notification.id)}
                            >
                              Gửi
                            </button>
                          )}
                          <button className="btn-action btn-edit">Sửa</button>
                          <button 
                            className="btn-action btn-delete"
                            onClick={() => handleDeleteNotification(notification.id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Notifications;