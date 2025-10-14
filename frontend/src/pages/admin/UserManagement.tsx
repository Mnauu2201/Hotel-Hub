import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminPages.css';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  enabled: boolean;
  emailVerified: boolean;
  roles: string[];
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [actionLoading, setActionLoading] = useState<{userId: number, action: string} | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        showNotification('error', 'Vui lòng đăng nhập để tiếp tục');
        return;
      }
      
      const response = await fetch('/api/users/public', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const usersData = data.users || [];
        
        // Transform backend data to frontend format
        const transformedUsers: User[] = usersData.map((user: any) => ({
          id: user.userId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          enabled: user.enabled,
          emailVerified: user.emailVerified || false,
          roles: user.roles || ['ROLE_CUSTOMER'],
          createdAt: user.createdAt
        }));
        
        setUsers(transformedUsers);
      } else {
        // Try to get error message from response
        let errorMessage = 'Lỗi khi tải danh sách người dùng';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If can't parse error response, use status text
          errorMessage = `Lỗi ${response.status}: ${response.statusText}`;
        }
        
        showNotification('error', errorMessage);
      }
    } catch (error) {
      showNotification('error', `Lỗi kết nối: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      setActionLoading({ userId, action: 'toggle' });
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        showNotification('error', 'Vui lòng đăng nhập để tiếp tục');
        return;
      }

      const response = await fetch(`/api/users/${userId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ enabled: !currentStatus })
      });
      
      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, enabled: !currentStatus }
            : user
        ));
        showNotification('success', currentStatus ? 'Đã khóa người dùng' : 'Đã mở khóa người dùng');
      } else {
        const errorData = await response.json();
        showNotification('error', `Lỗi: ${errorData.message || 'Không thể thay đổi trạng thái'}`);
      }
    } catch (error) {
      showNotification('error', `Lỗi kết nối: ${error}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      setActionLoading({ userId: updatedUser.id, action: 'update' });
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        showNotification('error', 'Vui lòng đăng nhập để tiếp tục');
        return;
      }

      const response = await fetch(`/api/users/${updatedUser.id}/public`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: updatedUser.name,
          phone: updatedUser.phone
        })
      });
      
      if (response.ok) {
        setUsers(users.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        ));
        setShowEditModal(false);
        setEditingUser(null);
        showNotification('success', 'Cập nhật thông tin người dùng thành công!');
      } else {
        let errorMessage = 'Không thể cập nhật thông tin';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          errorMessage = `Lỗi ${response.status}: ${response.statusText}`;
        }
        showNotification('error', `Lỗi: ${errorMessage}`);
      }
    } catch (error) {
      showNotification('error', `Lỗi kết nối: ${error}`);
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleBadge = (roles: string[] | undefined) => {
    // Đảm bảo roles là array
    const rolesArray = Array.isArray(roles) ? roles : [];
    
    if (rolesArray.includes('ROLE_ADMIN')) {
      return <span className="role-badge role-admin">Admin</span>;
    } else if (rolesArray.includes('ROLE_STAFF')) {
      return <span className="role-badge role-staff">Staff</span>;
    } else {
      return <span className="role-badge role-customer">Customer</span>;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const userRoles = Array.isArray(user.roles) ? user.roles : [];
    const matchesRole = roleFilter === 'ALL' || userRoles.includes(roleFilter);
    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout title="Quản lý người dùng" breadcrumb="Quản lý người dùng">
      <div className="admin-page">
        {/* Filters */}
        <div className="admin-filters">
          <div className="filter-group">
            <label>Vai trò:</label>
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">Tất cả</option>
              <option value="ROLE_ADMIN">Admin</option>
              <option value="ROLE_STAFF">Staff</option>
              <option value="ROLE_CUSTOMER">Customer</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Tìm kiếm:</label>
            <input
              type="text"
              placeholder="Tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="admin-table-container">
          {loading ? (
            <div className="loading">Đang tải...</div>
          ) : Array.isArray(users) && users.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Email xác thực</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{getRoleBadge(user.roles)}</td>
                    <td>
                      <span className={`status-badge ${user.enabled ? 'status-active' : 'status-inactive'}`}>
                        {user.enabled ? 'Hoạt động' : 'Tạm khóa'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.emailVerified ? 'status-verified' : 'status-unverified'}`}>
                        {user.emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <button 
                        className="btn-action btn-toggle"
                        onClick={() => handleToggleUserStatus(user.id, user.enabled)}
                        disabled={actionLoading?.userId === user.id && actionLoading?.action === 'toggle'}
                        style={{
                          opacity: actionLoading?.userId === user.id && actionLoading?.action === 'toggle' ? 0.6 : 1,
                          cursor: actionLoading?.userId === user.id && actionLoading?.action === 'toggle' ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {actionLoading?.userId === user.id && actionLoading?.action === 'toggle' 
                          ? '⏳ Đang xử lý...' 
                          : (user.enabled ? '🔒 Khóa' : '🔓 Mở khóa')
                        }
                      </button>
                      <button 
                        className="btn-action btn-edit"
                        onClick={() => handleEditUser(user)}
                        disabled={actionLoading?.userId === user.id}
                        style={{
                          opacity: actionLoading?.userId === user.id ? 0.6 : 1,
                          cursor: actionLoading?.userId === user.id ? 'not-allowed' : 'pointer'
                        }}
                      >
                        ✏️ Sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">
              <p>Không có người dùng nào được tìm thấy.</p>
            </div>
          )}
        </div>

        {/* Edit User Modal */}
        {showEditModal && editingUser && (
          <div 
            className="modal-overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowEditModal(false);
                setEditingUser(null);
              }
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
          >
            <div 
              className="modal-content"
              style={{
                backgroundColor: document.body.classList.contains('dark-mode') ? '#2d3748' : '#ffffff',
                color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748',
                border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '0',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'hidden',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
            >
              {/* Modal Header */}
              <div 
                className="modal-header"
                style={{
                  padding: '20px 24px',
                  borderBottom: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: document.body.classList.contains('dark-mode') ? '#374151' : '#f8f9fa'
                }}
              >
                <h3 style={{ 
                  color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748',
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '600'
                }}>
                  ✏️ Chỉnh sửa thông tin người dùng
                </h3>
                <button 
                  className="modal-close"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: document.body.classList.contains('dark-mode') ? '#9ca3af' : '#6b7280',
                    padding: '4px',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = document.body.classList.contains('dark-mode') ? '#4a5568' : '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  ×
                </button>
              </div>
              
              {/* Modal Body */}
              <div 
                className="modal-body"
                style={{
                  padding: '24px',
                  maxHeight: '60vh',
                  overflowY: 'auto'
                }}
              >
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const updatedUser = {
                    ...editingUser,
                    name: formData.get('name') as string,
                    email: formData.get('email') as string,
                    phone: formData.get('phone') as string
                  };
                  handleUpdateUser(updatedUser);
                }}>
                  {/* User Info Display */}
                  <div style={{
                    backgroundColor: document.body.classList.contains('dark-mode') ? '#374151' : '#f8f9fa',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', color: document.body.classList.contains('dark-mode') ? '#9ca3af' : '#6b7280' }}>
                        ID: {editingUser.id}
                      </span>
                      <span style={{ 
                        fontSize: '12px', 
                        padding: '2px 8px', 
                        borderRadius: '12px',
                        backgroundColor: editingUser.enabled 
                          ? (document.body.classList.contains('dark-mode') ? '#065f46' : '#d1fae5')
                          : (document.body.classList.contains('dark-mode') ? '#7f1d1d' : '#fee2e2'),
                        color: editingUser.enabled 
                          ? (document.body.classList.contains('dark-mode') ? '#6ee7b7' : '#065f46')
                          : (document.body.classList.contains('dark-mode') ? '#fca5a5' : '#dc2626')
                      }}>
                        {editingUser.enabled ? 'Hoạt động' : 'Tạm khóa'}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: document.body.classList.contains('dark-mode') ? '#9ca3af' : '#6b7280' }}>
                      Vai trò: {editingUser.roles?.join(', ') || 'Customer'}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group">
                      <label style={{ 
                        color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748',
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        👤 Tên người dùng:
                      </label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={editingUser.name}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : '#ffffff',
                          color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748',
                          border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = document.body.classList.contains('dark-mode') ? '#60a5fa' : '#3b82f6';
                          e.target.style.boxShadow = document.body.classList.contains('dark-mode') 
                            ? '0 0 0 3px rgba(96, 165, 250, 0.1)' 
                            : '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = document.body.classList.contains('dark-mode') ? '#4a5568' : '#d1d5db';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label style={{ 
                        color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748',
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        📧 Email:
                      </label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={editingUser.email}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : '#ffffff',
                          color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748',
                          border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = document.body.classList.contains('dark-mode') ? '#60a5fa' : '#3b82f6';
                          e.target.style.boxShadow = document.body.classList.contains('dark-mode') 
                            ? '0 0 0 3px rgba(96, 165, 250, 0.1)' 
                            : '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = document.body.classList.contains('dark-mode') ? '#4a5568' : '#d1d5db';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label style={{ 
                        color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748',
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        📱 Số điện thoại:
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        defaultValue={editingUser.phone}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : '#ffffff',
                          color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748',
                          border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = document.body.classList.contains('dark-mode') ? '#60a5fa' : '#3b82f6';
                          e.target.style.boxShadow = document.body.classList.contains('dark-mode') 
                            ? '0 0 0 3px rgba(96, 165, 250, 0.1)' 
                            : '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = document.body.classList.contains('dark-mode') ? '#4a5568' : '#d1d5db';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Modal Actions */}
                  <div 
                    className="modal-actions"
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '12px',
                      marginTop: '24px',
                      paddingTop: '20px',
                      borderTop: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e5e7eb'
                    }}
                  >
                    <button 
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingUser(null);
                      }}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: 'transparent',
                        color: document.body.classList.contains('dark-mode') ? '#9ca3af' : '#6b7280',
                        border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = document.body.classList.contains('dark-mode') ? '#374151' : '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      Hủy
                    </button>
                    <button 
                      type="submit" 
                      className="btn-save"
                      disabled={actionLoading?.userId === editingUser.id && actionLoading?.action === 'update'}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: document.body.classList.contains('dark-mode') ? '#3b82f6' : '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: actionLoading?.userId === editingUser.id && actionLoading?.action === 'update' ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        opacity: actionLoading?.userId === editingUser.id && actionLoading?.action === 'update' ? 0.6 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!(actionLoading?.userId === editingUser.id && actionLoading?.action === 'update')) {
                          e.currentTarget.style.backgroundColor = document.body.classList.contains('dark-mode') ? '#2563eb' : '#1d4ed8';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = document.body.classList.contains('dark-mode') ? '#3b82f6' : '#2563eb';
                      }}
                    >
                      {actionLoading?.userId === editingUser.id && actionLoading?.action === 'update' 
                        ? '⏳ Đang lưu...' 
                        : '💾 Lưu thay đổi'
                      }
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Notification */}
        {notification && (
          <div 
            className={`notification ${notification.type}`}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              padding: '12px 20px',
              borderRadius: '6px',
              color: 'white',
              backgroundColor: notification.type === 'success' ? '#48bb78' : 
                             notification.type === 'error' ? '#f56565' : '#4299e1',
              zIndex: 9999,
              animation: 'slideInRight 0.3s ease-out'
            }}
          >
            {notification.message}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
