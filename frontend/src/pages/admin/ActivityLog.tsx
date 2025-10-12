import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminPages.css';

interface ActivityLog {
  id: number;
  user: string;
  action: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: string;
}

const ActivityLog: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [userFilter, setUserFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [currentPage, userFilter, actionFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockLogs: ActivityLog[] = [
        {
          id: 1,
          user: 'admin@hotelhub.com',
          action: 'LOGIN',
          description: 'Đăng nhập vào hệ thống',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          timestamp: '2024-01-15T10:30:00Z',
          status: 'SUCCESS'
        },
        {
          id: 2,
          user: 'admin@hotelhub.com',
          action: 'CREATE_BOOKING',
          description: 'Tạo đặt phòng mới #12345',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          timestamp: '2024-01-15T10:35:00Z',
          status: 'SUCCESS'
        },
        {
          id: 3,
          user: 'user1@example.com',
          action: 'LOGIN',
          description: 'Đăng nhập vào hệ thống',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
          timestamp: '2024-01-15T11:00:00Z',
          status: 'SUCCESS'
        },
        {
          id: 4,
          user: 'user2@example.com',
          action: 'BOOKING_FAILED',
          description: 'Đặt phòng thất bại - phòng đã được đặt',
          ipAddress: '192.168.1.102',
          userAgent: 'Mozilla/5.0 (Android 10; Mobile; rv:68.0) Gecko/68.0',
          timestamp: '2024-01-15T11:15:00Z',
          status: 'FAILED'
        },
        {
          id: 5,
          user: 'admin@hotelhub.com',
          action: 'UPDATE_ROOM',
          description: 'Cập nhật thông tin phòng Deluxe Suite',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          timestamp: '2024-01-15T11:30:00Z',
          status: 'SUCCESS'
        }
      ];
      setLogs(mockLogs);
      setTotalPages(1);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { class: string; text: string } } = {
      'SUCCESS': { class: 'status-success', text: 'Thành công' },
      'FAILED': { class: 'status-failed', text: 'Thất bại' },
      'WARNING': { class: 'status-warning', text: 'Cảnh báo' }
    };
    
    const statusInfo = statusMap[status] || { class: 'status-default', text: status };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const getActionBadge = (action: string) => {
    const actionMap: { [key: string]: { class: string; text: string } } = {
      'LOGIN': { class: 'action-login', text: 'Đăng nhập' },
      'LOGOUT': { class: 'action-logout', text: 'Đăng xuất' },
      'CREATE_BOOKING': { class: 'action-create', text: 'Tạo đặt phòng' },
      'UPDATE_BOOKING': { class: 'action-update', text: 'Cập nhật đặt phòng' },
      'CANCEL_BOOKING': { class: 'action-cancel', text: 'Hủy đặt phòng' },
      'BOOKING_FAILED': { class: 'action-failed', text: 'Đặt phòng thất bại' },
      'UPDATE_ROOM': { class: 'action-update', text: 'Cập nhật phòng' },
      'CREATE_USER': { class: 'action-create', text: 'Tạo người dùng' },
      'UPDATE_USER': { class: 'action-update', text: 'Cập nhật người dùng' }
    };
    
    const actionInfo = actionMap[action] || { class: 'action-default', text: action };
    return <span className={`action-badge ${actionInfo.class}`}>{actionInfo.text}</span>;
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = userFilter === 'ALL' || log.user.includes(userFilter);
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    return matchesSearch && matchesUser && matchesAction;
  });

  return (
    <AdminLayout title="Nhật ký hoạt động" breadcrumb="Nhật ký hoạt động">
      <div className="admin-page">
        {/* Filters */}
        <div className="admin-filters">
          <div className="filter-group">
            <label>Người dùng:</label>
            <select 
              value={userFilter} 
              onChange={(e) => setUserFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">Tất cả</option>
              <option value="admin@hotelhub.com">Admin</option>
              <option value="user1@example.com">User 1</option>
              <option value="user2@example.com">User 2</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Hành động:</label>
            <select 
              value={actionFilter} 
              onChange={(e) => setActionFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">Tất cả</option>
              <option value="LOGIN">Đăng nhập</option>
              <option value="LOGOUT">Đăng xuất</option>
              <option value="CREATE_BOOKING">Tạo đặt phòng</option>
              <option value="UPDATE_BOOKING">Cập nhật đặt phòng</option>
              <option value="CANCEL_BOOKING">Hủy đặt phòng</option>
              <option value="BOOKING_FAILED">Đặt phòng thất bại</option>
              <option value="UPDATE_ROOM">Cập nhật phòng</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Tìm kiếm:</label>
            <input
              type="text"
              placeholder="Người dùng hoặc mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>
        </div>

        {/* Logs Table */}
        <div className="admin-table-container">
          {loading ? (
            <div className="loading">Đang tải...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Người dùng</th>
                  <th>Hành động</th>
                  <th>Mô tả</th>
                  <th>IP Address</th>
                  <th>Trạng thái</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{log.user}</td>
                    <td>{getActionBadge(log.action)}</td>
                    <td>{log.description}</td>
                    <td>
                      <span className="ip-address">{log.ipAddress}</span>
                    </td>
                    <td>{getStatusBadge(log.status)}</td>
                    <td>{new Date(log.timestamp).toLocaleString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="pagination-btn"
            >
              Trước
            </button>
            <span className="pagination-info">
              Trang {currentPage + 1} / {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="pagination-btn"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ActivityLog;
