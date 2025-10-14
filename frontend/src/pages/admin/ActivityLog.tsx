import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import './AdminPages.css';

interface ActivityLog {
  logId: number;
  userId: number | null;
  action: string;
  detail: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

const ActivityLog: React.FC = () => {
  const { accessToken } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [userFilter, setUserFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, [currentPage, userFilter, actionFilter]);

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

  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      if (!accessToken) {
        console.error('No access token available from AuthContext');
        setLogs([]);
        setTotalPages(1);
        return;
      }

      console.log('Using accessToken from AuthContext:', accessToken.substring(0, 20) + '...');

      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(`http://localhost:8080/api/admin/activity-logs?page=${currentPage}&size=20&sortBy=createdAt&sortDir=desc`, {
        method: 'GET',
        headers: headers
      });

      console.log('API Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('API Response data:', data);
        
        // Ensure logs data is properly formatted
        const formattedLogs = (data.logs || []).map((log: any) => ({
          logId: log.logId,
          userId: log.userId,
          action: log.action,
          detail: log.detail,
          createdAt: log.createdAt,
          user: log.user ? {
            name: log.user.name,
            email: log.user.email
          } : null
        }));
        
        console.log('Formatted logs:', formattedLogs);
        setLogs(formattedLogs);
        setTotalPages(data.totalPages || 1);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch logs:', response.status, errorText);
        // Fallback to empty array if API fails
        setLogs([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      // Fallback to empty array if API fails
      setLogs([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };


  const getActionBadge = (action: string) => {
    const actionMap: { [key: string]: { class: string; text: string } } = {
      'ADMIN_UPDATE_BOOKING_STATUS': { class: 'action-update', text: 'Cập nhật trạng thái đặt phòng' },
      'ADMIN_CANCEL_BOOKING': { class: 'action-cancel', text: 'Hủy đặt phòng' },
      'CREATE_GUEST_BOOKING': { class: 'action-create', text: 'Tạo đặt phòng khách' },
      'CREATE_GUEST_PAYMENT': { class: 'action-create', text: 'Tạo thanh toán khách' },
      'CREATE_USER_BOOKING': { class: 'action-create', text: 'Tạo đặt phòng người dùng' },
      'CREATE_PAYMENT': { class: 'action-create', text: 'Tạo thanh toán' },
      'PROCESS_GUEST_PAYMENT': { class: 'action-update', text: 'Xử lý thanh toán khách' },
      'PROCESS_PAYMENT': { class: 'action-update', text: 'Xử lý thanh toán' },
      'PAYMENT_FAILED': { class: 'action-failed', text: 'Thanh toán thất bại' },
      'VIEW_USERS': { class: 'action-login', text: 'Xem danh sách người dùng' },
      'TOGGLE_USER_STATUS': { class: 'action-update', text: 'Thay đổi trạng thái người dùng' },
      'DELETE_USER': { class: 'action-cancel', text: 'Xóa người dùng' },
      'ADD_ROLE_TO_USER': { class: 'action-create', text: 'Thêm vai trò cho người dùng' },
      'REMOVE_ROLE_FROM_USER': { class: 'action-cancel', text: 'Xóa vai trò khỏi người dùng' },
      'UPDATE_USER_ROLES': { class: 'action-update', text: 'Cập nhật vai trò người dùng' }
    };
    
    const actionInfo = actionMap[action] || { class: 'action-default', text: action };
    return <span className={`action-badge ${actionInfo.class}`}>{actionInfo.text}</span>;
  };

  const filteredLogs = logs.filter(log => {
    const userName = log.user?.name || 'System';
    const userEmail = log.user?.email || 'System';
    const logDetail = log.detail || '';

    console.log('Filtering log:', {
      logId: log.logId,
      userName,
      userEmail,
      userId: log.userId,
      action: log.action,
      userFilter,
      actionFilter
    });

    const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         logDetail.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by role type
    const matchesUser = userFilter === 'ALL' ||
                        (userFilter === 'ADMIN' && userEmail.includes('admin')) ||
                        (userFilter === 'STAFF' && userEmail.includes('staff')) ||
                        (userFilter === 'USER' && userEmail !== 'System' && !userEmail.includes('admin') && !userEmail.includes('staff')) ||
                        (userFilter === 'GUEST' && log.userId === null) ||
                        (userFilter === 'SYSTEM' && userEmail === 'System');

    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    
    const result = matchesSearch && matchesUser && matchesAction;
    console.log('Filter result:', result, { matchesSearch, matchesUser, matchesAction });
    
    return result;
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
              <option value="ADMIN">Admin</option>
              <option value="STAFF">Staff</option>
              <option value="USER">User</option>
              <option value="GUEST">Guest</option>
              <option value="SYSTEM">System</option>
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
              <option value="CREATE_GUEST_BOOKING">Tạo đặt phòng khách</option>
              <option value="CREATE_USER_BOOKING">Tạo đặt phòng người dùng</option>
              <option value="ADMIN_UPDATE_BOOKING_STATUS">Cập nhật trạng thái đặt phòng</option>
              <option value="ADMIN_CANCEL_BOOKING">Hủy đặt phòng</option>
              <option value="CREATE_GUEST_PAYMENT">Tạo thanh toán khách</option>
              <option value="CREATE_PAYMENT">Tạo thanh toán</option>
              <option value="PROCESS_GUEST_PAYMENT">Xử lý thanh toán khách</option>
              <option value="PROCESS_PAYMENT">Xử lý thanh toán</option>
              <option value="PAYMENT_FAILED">Thanh toán thất bại</option>
              <option value="TOGGLE_USER_STATUS">Thay đổi trạng thái người dùng</option>
              <option value="DELETE_USER">Xóa người dùng</option>
              <option value="VIEW_USERS">Xem danh sách người dùng</option>
              <option value="ADD_ROLE_TO_USER">Thêm vai trò cho người dùng</option>
              <option value="REMOVE_ROLE_FROM_USER">Xóa vai trò khỏi người dùng</option>
              <option value="UPDATE_USER_ROLES">Cập nhật vai trò người dùng</option>
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
                  <th>Tên người dùng</th>
                  <th>Email người dùng</th>
                  <th>Hành động</th>
                  <th>Mô tả</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.logId}>
                    <td>{log.logId}</td>
                    <td>{log.user?.name || 'System'}</td>
                    <td>{log.user?.email || ''}</td>
                    <td>{getActionBadge(log.action)}</td>
                    <td>{log.detail}</td>
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
