import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useNotification } from '../../hooks/useNotification';
import './AdminPages.css';

interface Role {
  id?: number;
  roleId?: number;
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });
  const { showSuccess, showError, showWarning, showInfo, NotificationContainer } = useNotification();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        showError('Bạn cần đăng nhập để truy cập trang này');
        return;
      }

      const response = await fetch('/api/admin/roles', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRoles(data.roles || []);
      } else if (response.status === 401) {
        showError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (response.status === 403) {
        showError('Bạn không có quyền truy cập trang này.');
      } else {
        showError('Không thể tải danh sách vai trò');
      }
    } catch (error) {
      showError('Lỗi kết nối khi lấy danh sách vai trò: ' + (error as Error).message);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vai trò này?')) {
      if (!roleId) {
        showError('Lỗi: Không tìm thấy ID vai trò để xóa');
        return;
      }

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
          showSuccess('Xóa vai trò thành công!');
          setRoles(roles.filter(role => role.id !== roleId));
        } else {
          const errorData = await response.json();
          showError('Lỗi: ' + (errorData.message || 'Không thể xóa vai trò'));
        }
      } catch (error) {
        showError('Lỗi kết nối: ' + (error as Error).message);
      }
    }
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      showError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showSuccess('Thêm vai trò thành công!');
        setShowAddModal(false);
        setFormData({ name: '', description: '', permissions: [] });
        fetchRoles();
      } else {
        const errorData = await response.json();
        showError('Lỗi: ' + (errorData.message || 'Không thể thêm vai trò'));
      }
    } catch (error) {
      showError('Lỗi kết nối: ' + (error as Error).message);
    }
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    setShowEditModal(true);
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingRole) return;

    const roleId = editingRole.roleId || editingRole.id;
    if (!roleId) {
      showError('Lỗi: Không tìm thấy ID vai trò để cập nhật');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/admin/roles/${roleId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showSuccess('Cập nhật vai trò thành công!');
        setShowEditModal(false);
        setEditingRole(null);
        setFormData({ name: '', description: '', permissions: [] });
        fetchRoles();
      } else {
        const errorData = await response.json();
        showError('Lỗi: ' + (errorData.message || 'Không thể cập nhật vai trò'));
      }
    } catch (error) {
      showError('Lỗi kết nối: ' + (error as Error).message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...(prev.permissions || []), permission]
        : (prev.permissions || []).filter(p => p !== permission)
    }));
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
      <NotificationContainer />
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
                  <th>Số người dùng</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {(roles || []).map((role) => (
                  <tr key={role.roleId || role.id}>
                    <td>{role.roleId || role.id}</td>
                    <td>
                      <span className="role-name">{role.name}</span>
                    </td>
                    <td>{role.description}</td>
                    <td>
                      <span className="user-count">{role.userCount || 0} người</span>
                    </td>
                    <td>
                      <button 
                        className="btn-action btn-edit"
                        onClick={() => handleEditRole(role)}
                      >
                        ✏️ Sửa
                      </button>
                      <button 
                        className="btn-action btn-delete"
                        onClick={() => handleDeleteRole(role.roleId || role.id || 0)}
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

        {/* Add Role Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Thêm vai trò mới</h3>
                <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddRole}>
                  <div className="form-group">
                    <label>Tên vai trò:</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input" 
                      placeholder="ROLE_NAME" 
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Mô tả:</label>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="form-input" 
                      rows={3} 
                      placeholder="Mô tả vai trò..."
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Quyền hạn:</label>
                    <div className="permissions-checkboxes">
                      <label>
                        <input 
                          type="checkbox" 
                          checked={(formData.permissions || []).includes('READ')}
                          onChange={(e) => handlePermissionChange('READ', e.target.checked)}
                        /> 
                        Đọc
                      </label>
                      <label>
                        <input 
                          type="checkbox" 
                          checked={(formData.permissions || []).includes('WRITE')}
                          onChange={(e) => handlePermissionChange('WRITE', e.target.checked)}
                        /> 
                        Ghi
                      </label>
                      <label>
                        <input 
                          type="checkbox" 
                          checked={(formData.permissions || []).includes('DELETE')}
                          onChange={(e) => handlePermissionChange('DELETE', e.target.checked)}
                        /> 
                        Xóa
                      </label>
                      <label>
                        <input 
                          type="checkbox" 
                          checked={(formData.permissions || []).includes('MANAGE_USERS')}
                          onChange={(e) => handlePermissionChange('MANAGE_USERS', e.target.checked)}
                        /> 
                        Quản lý người dùng
                      </label>
                      <label>
                        <input 
                          type="checkbox" 
                          checked={(formData.permissions || []).includes('MANAGE_ROLES')}
                          onChange={(e) => handlePermissionChange('MANAGE_ROLES', e.target.checked)}
                        /> 
                        Quản lý vai trò
                      </label>
                      <label>
                        <input 
                          type="checkbox" 
                          checked={(formData.permissions || []).includes('MANAGE_BOOKINGS')}
                          onChange={(e) => handlePermissionChange('MANAGE_BOOKINGS', e.target.checked)}
                        /> 
                        Quản lý đặt phòng
                      </label>
                      <label>
                        <input 
                          type="checkbox" 
                          checked={(formData.permissions || []).includes('BOOK_ROOM')}
                          onChange={(e) => handlePermissionChange('BOOK_ROOM', e.target.checked)}
                        /> 
                        Đặt phòng
                      </label>
                    </div>
                  </div>
                  <div className="modal-footer">
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

        {/* Edit Role Modal */}
        {showEditModal && editingRole && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Sửa vai trò</h3>
                <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdateRole}>
                  <div className="form-group">
                    <label>Tên vai trò:</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input" 
                      placeholder="ROLE_NAME" 
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Mô tả:</label>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="form-input" 
                      rows={3} 
                      placeholder="Mô tả vai trò..."
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Quyền hạn:</label>
                    <div className="permissions-checkboxes">
                      <label>
                        <input 
                          type="checkbox" 
                          checked={(formData.permissions || []).includes('READ')}
                          onChange={(e) => handlePermissionChange('READ', e.target.checked)}
                        /> 
                        Đọc
                      </label>
                      <label>
                        <input 
                          type="checkbox" 
                          checked={(formData.permissions || []).includes('WRITE')}
                          onChange={(e) => handlePermissionChange('WRITE', e.target.checked)}
                        /> 
                        Ghi
                      </label>
                      <label>
                        <input 
                          type="checkbox" 
                          checked={(formData.permissions || []).includes('DELETE')}
                          onChange={(e) => handlePermissionChange('DELETE', e.target.checked)}
                        /> 
                        Xóa
                      </label>
                      <label>
                        <input 
                          type="checkbox" 
                          checked={(formData.permissions || []).includes('MANAGE_USERS')}
                          onChange={(e) => handlePermissionChange('MANAGE_USERS', e.target.checked)}
                        /> 
                        Quản lý người dùng
                      </label>
                      <label>
                        <input 
                          type="checkbox" 
                          checked={(formData.permissions || []).includes('MANAGE_ROLES')}
                          onChange={(e) => handlePermissionChange('MANAGE_ROLES', e.target.checked)}
                        /> 
                        Quản lý vai trò
                      </label>
                      <label>
                        <input 
                          type="checkbox" 
                          checked={(formData.permissions || []).includes('MANAGE_BOOKINGS')}
                          onChange={(e) => handlePermissionChange('MANAGE_BOOKINGS', e.target.checked)}
                        /> 
                        Quản lý đặt phòng
                      </label>
                      <label>
                        <input 
                          type="checkbox" 
                          checked={(formData.permissions || []).includes('BOOK_ROOM')}
                          onChange={(e) => handlePermissionChange('BOOK_ROOM', e.target.checked)}
                        /> 
                        Đặt phòng
                      </label>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                      Hủy
                    </button>
                    <button type="submit" className="btn-primary">
                      Cập nhật vai trò
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
