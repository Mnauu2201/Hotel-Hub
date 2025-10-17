import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useNotification } from '../../hooks/useNotification';
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  const { showSuccess, showError, showWarning, showInfo, NotificationContainer } = useNotification();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        showError('Bạn cần đăng nhập để truy cập trang này');
        return;
      }

      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else if (response.status === 401) {
        showError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (response.status === 403) {
        showError('Bạn không có quyền truy cập trang này.');
      } else {
        showError('Không thể tải danh sách người dùng');
      }
    } catch (error) {
      showError('Lỗi kết nối khi lấy danh sách người dùng: ' + (error as Error).message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/admin/users/${userId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ enabled: !currentStatus })
      });
      
      if (response.ok) {
        showSuccess(currentStatus ? 'Đã khóa người dùng' : 'Đã mở khóa người dùng');
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, enabled: !currentStatus }
            : user
        ));
      } else {
        const errorData = await response.json();
        showError('Lỗi: ' + (errorData.message || 'Không thể thay đổi trạng thái người dùng'));
      }
    } catch (error) {
      showError('Lỗi kết nối: ' + (error as Error).message);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      enabled: user.enabled,
      roles: user.roles
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        showSuccess('Cập nhật thông tin người dùng thành công!');
        setShowEditModal(false);
        setSelectedUser(null);
        fetchUsers(); // Refresh the list
      } else {
        const errorData = await response.json();
        showError('Lỗi: ' + (errorData.message || 'Không thể cập nhật thông tin người dùng'));
      }
    } catch (error) {
      showError('Lỗi kết nối: ' + (error as Error).message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'roles' ? [value] : value
    }));
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
      <NotificationContainer />
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
                      >
                        {user.enabled ? '🔒 Khóa' : '🔓 Mở khóa'}
                      </button>
                      <button 
                        className="btn-action btn-edit"
                        onClick={() => handleEditUser(user)}
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
        {showEditModal && selectedUser && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Sửa thông tin người dùng</h3>
                <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Tên:</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name || ''}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email || ''}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Số điện thoại:</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editFormData.phone || ''}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Vai trò:</label>
                  <select
                    name="roles"
                    value={editFormData.roles?.[0] || ''}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="ROLE_CUSTOMER">Customer</option>
                    <option value="ROLE_STAFF">Staff</option>
                    <option value="ROLE_ADMIN">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="enabled"
                      checked={editFormData.enabled || false}
                      onChange={(e) => setEditFormData(prev => ({
                        ...prev,
                        enabled: e.target.checked
                      }))}
                    />
                    Tài khoản hoạt động
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowEditModal(false)}>
                  Hủy
                </button>
                <button className="btn-primary" onClick={handleUpdateUser}>
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
