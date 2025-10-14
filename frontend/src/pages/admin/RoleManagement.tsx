import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminPages.css';

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
}

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains('dark-mode'));

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains('dark-mode'));
    };

    // Check initial state
    checkDarkMode();

    // Listen for class changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockRoles: Role[] = [
        {
          id: 1,
          name: 'ROLE_ADMIN',
          description: 'Quản trị viên hệ thống',
          permissions: ['READ', 'WRITE', 'DELETE', 'MANAGE_USERS', 'MANAGE_ROLES'],
          userCount: 2,
          createdAt: '2024-01-01'
        },
        {
          id: 2,
          name: 'ROLE_STAFF',
          description: 'Nhân viên khách sạn',
          permissions: ['READ', 'WRITE', 'MANAGE_BOOKINGS'],
          userCount: 5,
          createdAt: '2024-01-01'
        },
        {
          id: 3,
          name: 'ROLE_CUSTOMER',
          description: 'Khách hàng',
          permissions: ['READ', 'BOOK_ROOM'],
          userCount: 82,
          createdAt: '2024-01-01'
        }
      ];
      setRoles(mockRoles);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vai trò này?')) {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`/api/admin/roles/${roleId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          setRoles(roles.filter(role => role.id !== roleId));
        }
      } catch (error) {
      }
    }
  };

  const getPermissionBadge = (permission: string) => {
    const permissionMap: { [key: string]: { class: string; text: string } } = {
      'READ': { class: 'permission-read', text: 'Đọc' },
      'WRITE': { class: 'permission-write', text: 'Ghi' },
      'DELETE': { class: 'permission-delete', text: 'Xóa' },
      'MANAGE_USERS': { class: 'permission-manage', text: 'Quản lý người dùng' },
      'MANAGE_ROLES': { class: 'permission-manage', text: 'Quản lý vai trò' },
      'MANAGE_BOOKINGS': { class: 'permission-manage', text: 'Quản lý đặt phòng' },
      'BOOK_ROOM': { class: 'permission-book', text: 'Đặt phòng' }
    };
    
    const permissionInfo = permissionMap[permission] || { class: 'permission-default', text: permission };
    return <span className={`permission-badge ${permissionInfo.class}`}>{permissionInfo.text}</span>;
  };

  return (
    <AdminLayout title="Quản lý vai trò" breadcrumb="Quản lý vai trò">
      <div className="admin-page">
        {/* Header Actions */}
        <div className="admin-page-actions">
          <button 
            className="btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            ➕ Thêm vai trò mới
          </button>
        </div>

        {/* Roles Table */}
        <div className="admin-table-container">
          {loading ? (
            <div className="loading">Đang tải...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên vai trò</th>
                  <th>Mô tả</th>
                  <th>Quyền hạn</th>
                  <th>Số người dùng</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td>{role.id}</td>
                    <td>
                      <span 
                        className="role-name"
                        style={{
                          color: isDarkMode ? '#e2e8f0' : '#6c757d'
                        }}
                      >
                        {role.name}
                      </span>
                    </td>
                    <td>{role.description}</td>
                    <td>
                      <div className="permissions-list">
                        {role.permissions.map((permission, index) => (
                          <span key={index}>
                            {getPermissionBadge(permission)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className="user-count">{role.userCount} người</span>
                    </td>
                    <td>{new Date(role.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <button 
                        className="btn-action btn-edit"
                        onClick={() => setEditingRole(role)}
                      >
                        ✏️ Sửa
                      </button>
                      <button 
                        className="btn-action btn-delete"
                        onClick={() => handleDeleteRole(role.id)}
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
                <h2>Thêm vai trò mới</h2>
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
                    <label>Tên vai trò:</label>
                    <input type="text" className="form-input" placeholder="ROLE_NAME" />
                  </div>
                  <div className="form-group">
                    <label>Mô tả:</label>
                    <textarea className="form-input" rows={3} placeholder="Mô tả vai trò..."></textarea>
                  </div>
                  <div className="form-group">
                    <label>Quyền hạn:</label>
                    <div className="permissions-checkboxes">
                      <label><input type="checkbox" /> Đọc</label>
                      <label><input type="checkbox" /> Ghi</label>
                      <label><input type="checkbox" /> Xóa</label>
                      <label><input type="checkbox" /> Quản lý người dùng</label>
                      <label><input type="checkbox" /> Quản lý vai trò</label>
                      <label><input type="checkbox" /> Quản lý đặt phòng</label>
                      <label><input type="checkbox" /> Đặt phòng</label>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                      Hủy
                    </button>
                    <button type="submit" className="btn-primary">
                      Thêm vai trò
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

export default RoleManagement;
