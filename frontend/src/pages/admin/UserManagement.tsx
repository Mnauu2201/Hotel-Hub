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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockUsers: User[] = [
        {
          id: 1,
          name: 'Nguyễn Văn A',
          email: 'user1@example.com',
          phone: '0123456789',
          enabled: true,
          emailVerified: true,
          roles: ['ROLE_CUSTOMER'],
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          name: 'Trần Thị B',
          email: 'user2@example.com',
          phone: '0987654321',
          enabled: true,
          emailVerified: false,
          roles: ['ROLE_CUSTOMER'],
          createdAt: '2024-01-20'
        },
        {
          id: 3,
          name: 'Admin User',
          email: 'admin@hotelhub.com',
          phone: '0123456789',
          enabled: true,
          emailVerified: true,
          roles: ['ROLE_ADMIN'],
          createdAt: '2024-01-01'
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      setUsers([]); // Set empty array on error
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
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, enabled: !currentStatus }
            : user
        ));
      }
    } catch (error) {
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
                      >
                        {user.enabled ? '🔒 Khóa' : '🔓 Mở khóa'}
                      </button>
                      <button className="btn-action btn-edit">✏️ Sửa</button>
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
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
