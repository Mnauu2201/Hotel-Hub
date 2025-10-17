import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import './AdminPages.css';

interface ActivityLog {
  logId: number;
  userId?: number;
  action: string;
  detail: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

interface ActivityLogResponse {
  logs: ActivityLog[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

const ActivityLog: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [userFilter, setUserFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [currentPage, userFilter, actionFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = {
        page: currentPage,
        size: 20,
        sortBy: 'createdAt',
        sortDir: 'desc'
      };

      // Add action filter if not ALL
      if (actionFilter !== 'ALL') {
        params.action = actionFilter;
      }

      const response = await api.get('/admin/activity-logs', { params });
      const data: ActivityLogResponse = response.data;
      
      setLogs(data.logs);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
    } catch (error) {
      console.error('Error fetching logs:', error);
      // Fallback to empty array on error
      setLogs([]);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (action: string) => {
    // Determine status based on action type
    let statusClass = 'status-success';
    let statusText = 'Thành công';
    
    if (action.includes('FAILED') || action.includes('ERROR')) {
      statusClass = 'status-failed';
      statusText = 'Thất bại';
    } else if (action.includes('WARNING') || action.includes('CANCEL')) {
      statusClass = 'status-warning';
      statusText = 'Cảnh báo';
    }
    
    return <span className={`status-badge ${statusClass}`}>{statusText}</span>;
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
      'CREATE_ROOM': { class: 'action-create', text: 'Tạo phòng' },
      'DELETE_ROOM': { class: 'action-cancel', text: 'Xóa phòng' },
      'CREATE_USER': { class: 'action-create', text: 'Tạo người dùng' },
      'UPDATE_USER': { class: 'action-update', text: 'Cập nhật người dùng' },
      'DELETE_USER': { class: 'action-cancel', text: 'Xóa người dùng' },
      'PAYMENT_SUCCESS': { class: 'action-login', text: 'Thanh toán thành công' },
      'PAYMENT_FAILED': { class: 'action-failed', text: 'Thanh toán thất bại' },
      'SYSTEM_START': { class: 'action-login', text: 'Khởi động hệ thống' },
      'SYSTEM_ERROR': { class: 'action-failed', text: 'Lỗi hệ thống' }
    };
    
    const actionInfo = actionMap[action] || { class: 'action-default', text: action };
    return <span className={`action-badge ${actionInfo.class}`}>{actionInfo.text}</span>;
  };

  const filteredLogs = logs.filter(log => {
    const userEmail = log.user?.email || 'System';
    const userName = log.user?.name || 'System';
    const matchesSearch = userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.detail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = userFilter === 'ALL' || userEmail.includes(userFilter);
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
              <option value="test@hotelhub.com">Test User</option>
              <option value="staff@hotelhub.com">Staff User</option>
              <option value="System">System</option>
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
              <option value="CREATE_ROOM">Tạo phòng</option>
              <option value="UPDATE_ROOM">Cập nhật phòng</option>
              <option value="DELETE_ROOM">Xóa phòng</option>
              <option value="CREATE_USER">Tạo người dùng</option>
              <option value="UPDATE_USER">Cập nhật người dùng</option>
              <option value="DELETE_USER">Xóa người dùng</option>
              <option value="PAYMENT_SUCCESS">Thanh toán thành công</option>
              <option value="PAYMENT_FAILED">Thanh toán thất bại</option>
              <option value="SYSTEM_START">Khởi động hệ thống</option>
              <option value="SYSTEM_ERROR">Lỗi hệ thống</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Tìm kiếm:</label>
            <input
              type="text"
              placeholder="Tìm kiếm theo người dùng hoặc chi tiết..."
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
          ) : filteredLogs.length === 0 ? (
            <div className="no-data">
              <p>Không có dữ liệu nhật ký hoạt động</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Người dùng</th>
                  <th>Hành động</th>
                  <th>Chi tiết</th>
                  <th>Trạng thái</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.logId}>
                    <td>{log.logId}</td>
                    <td>
                      {log.user ? (
                        <div>
                          <div style={{ fontWeight: '600' }}>{log.user.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>{log.user.email}</div>
                        </div>
                      ) : (
                        <span style={{ color: '#6c757d', fontStyle: 'italic' }}>System</span>
                      )}
                    </td>
                    <td>{getActionBadge(log.action)}</td>
                    <td style={{ maxWidth: '300px', wordWrap: 'break-word' }}>{log.detail}</td>
                    <td>{getStatusBadge(log.action)}</td>
                    <td>{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
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
              Trang {currentPage + 1} / {totalPages} ({totalItems} mục)
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
