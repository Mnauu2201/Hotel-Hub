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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains('dark-mode'));
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [actionLoading, setActionLoading] = useState<{action: string, roleId?: number} | null>(null);

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

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setShowEditModal(true);
  };

  const handleUpdateRole = async (updatedRole: Role) => {
    setActionLoading({ action: 'update', roleId: updatedRole.id });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRoles(roles.map(role => 
        role.id === updatedRole.id ? updatedRole : role
      ));
      setShowEditModal(false);
      setEditingRole(null);
      showNotification('success', 'Cập nhật vai trò thành công!');
    } catch (error) {
      showNotification('error', `Lỗi: ${error}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddRole = async (newRole: Omit<Role, 'id' | 'userCount' | 'createdAt'>) => {
    setActionLoading({ action: 'add' });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new role with mock data
      const newId = Math.max(...roles.map(r => r.id), 0) + 1;
      const createdRole: Role = {
        id: newId,
        name: newRole.name,
        description: newRole.description,
        permissions: newRole.permissions,
        userCount: 0,
        createdAt: new Date().toISOString()
      };
      
      setRoles([...roles, createdRole]);
      setShowAddModal(false);
      showNotification('success', 'Thêm vai trò thành công!');
    } catch (error) {
      showNotification('error', `Lỗi: ${error}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vai trò này?')) {
      setActionLoading({ action: 'delete', roleId });
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
          setRoles(roles.filter(role => role.id !== roleId));
        showNotification('success', 'Xóa vai trò thành công!');
      } catch (error) {
        showNotification('error', `Lỗi: ${error}`);
      } finally {
        setActionLoading(null);
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
                        onClick={() => handleEditRole(role)}
                        disabled={actionLoading?.action === 'update' && actionLoading?.roleId === role.id}
                      >
                        {actionLoading?.action === 'update' && actionLoading?.roleId === role.id ? '⏳ Đang cập nhật...' : '✏️ Sửa'}
                      </button>
                      <button 
                        className="btn-action btn-delete"
                        onClick={() => handleDeleteRole(role.id)}
                        disabled={actionLoading?.action === 'delete' && actionLoading?.roleId === role.id}
                      >
                        {actionLoading?.action === 'delete' && actionLoading?.roleId === role.id ? '⏳ Đang xóa...' : '🗑️ Xóa'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Edit Role Modal */}
        {showEditModal && editingRole && (
          <div 
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
              zIndex: 99999
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowEditModal(false);
                setEditingRole(null);
              }
            }}
          >
            <div 
              style={{
                backgroundColor: isDarkMode ? '#2d3748' : 'white',
                borderRadius: '8px',
                padding: '0',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                position: 'relative'
              }}
            >
              <div 
                className="modal-header"
                style={{
                  padding: '1.5rem',
                  borderBottom: isDarkMode ? '1px solid #4a5568' : '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <h2 style={{ 
                  margin: 0, 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  color: isDarkMode ? '#e2e8f0' : '#2d3748' 
                }}>
                  Chỉnh sửa vai trò
                </h2>
                <button 
                  className="modal-close"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingRole(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: isDarkMode ? '#a0aec0' : '#718096',
                    padding: '0.5rem'
                  }}
                >
                  ✕
                </button>
              </div>
              <div 
                className="modal-content"
                style={{
                  padding: '1.5rem',
                  backgroundColor: isDarkMode ? '#2d3748' : 'white'
                }}
              >
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const updatedRole = {
                    ...editingRole,
                    name: formData.get('name') as string,
                    description: formData.get('description') as string,
                    permissions: Array.from(document.querySelectorAll('input[name="permissions"]:checked')).map(input => input.value)
                  };
                  handleUpdateRole(updatedRole);
                }}>
                  <div 
                    className="form-group"
                    style={{ marginBottom: '1.5rem' }}
                  >
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '600', 
                      color: isDarkMode ? '#e2e8f0' : '#2d3748' 
                    }}>
                      Tên vai trò:
                    </label>
                    <input 
                      type="text" 
                      name="name"
                      className="form-input" 
                      defaultValue={editingRole.name}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: isDarkMode ? '1px solid #4a5568' : '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        backgroundColor: isDarkMode ? '#4a5568' : 'white',
                        color: isDarkMode ? '#e2e8f0' : '#2d3748'
                      }}
                    />
                  </div>
                  <div 
                    className="form-group"
                    style={{ marginBottom: '1.5rem' }}
                  >
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '600', 
                      color: isDarkMode ? '#e2e8f0' : '#2d3748' 
                    }}>
                      Mô tả:
                    </label>
                    <textarea 
                      name="description"
                      className="form-input" 
                      rows={3} 
                      defaultValue={editingRole.description}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: isDarkMode ? '1px solid #4a5568' : '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        resize: 'vertical',
                        backgroundColor: isDarkMode ? '#4a5568' : 'white',
                        color: isDarkMode ? '#e2e8f0' : '#2d3748'
                      }}
                    />
                  </div>
                  <div 
                    className="form-group"
                    style={{ marginBottom: '1.5rem' }}
                  >
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '600', 
                      color: isDarkMode ? '#e2e8f0 !important' : '#2d3748 !important'
                    }}>
                      Quyền hạn:
                    </label>
                    <div 
                      className="permissions-checkboxes"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '0.75rem'
                      }}
                    >
                      <label style={{ 
                        color: isDarkMode ? '#e2e8f0 !important' : '#2d3748 !important',
                        fontWeight: '500'
                      }}>
                        <input 
                          type="checkbox" 
                          name="permissions" 
                          value="READ"
                          defaultChecked={editingRole.permissions.includes('READ')}
                        /> 
                        Đọc
                      </label>
                      <label style={{ 
                        color: isDarkMode ? '#e2e8f0 !important' : '#2d3748 !important',
                        fontWeight: '500'
                      }}>
                        <input 
                          type="checkbox" 
                          name="permissions" 
                          value="WRITE"
                          defaultChecked={editingRole.permissions.includes('WRITE')}
                        /> 
                        Ghi
                      </label>
                      <label style={{ 
                        color: isDarkMode ? '#e2e8f0 !important' : '#2d3748 !important',
                        fontWeight: '500'
                      }}>
                        <input 
                          type="checkbox" 
                          name="permissions" 
                          value="DELETE"
                          defaultChecked={editingRole.permissions.includes('DELETE')}
                        /> 
                        Xóa
                      </label>
                      <label style={{ 
                        color: isDarkMode ? '#e2e8f0 !important' : '#2d3748 !important',
                        fontWeight: '500'
                      }}>
                        <input 
                          type="checkbox" 
                          name="permissions" 
                          value="MANAGE_USERS"
                          defaultChecked={editingRole.permissions.includes('MANAGE_USERS')}
                        /> 
                        Quản lý người dùng
                      </label>
                      <label style={{ 
                        color: isDarkMode ? '#e2e8f0 !important' : '#2d3748 !important',
                        fontWeight: '500'
                      }}>
                        <input 
                          type="checkbox" 
                          name="permissions" 
                          value="MANAGE_ROLES"
                          defaultChecked={editingRole.permissions.includes('MANAGE_ROLES')}
                        /> 
                        Quản lý vai trò
                      </label>
                      <label style={{ 
                        color: isDarkMode ? '#e2e8f0 !important' : '#2d3748 !important',
                        fontWeight: '500'
                      }}>
                        <input 
                          type="checkbox" 
                          name="permissions" 
                          value="MANAGE_BOOKINGS"
                          defaultChecked={editingRole.permissions.includes('MANAGE_BOOKINGS')}
                        /> 
                        Quản lý đặt phòng
                      </label>
                      <label style={{ 
                        color: isDarkMode ? '#e2e8f0 !important' : '#2d3748 !important',
                        fontWeight: '500'
                      }}>
                        <input 
                          type="checkbox" 
                          name="permissions" 
                          value="BOOK_ROOM"
                          defaultChecked={editingRole.permissions.includes('BOOK_ROOM')}
                        /> 
                        Đặt phòng
                      </label>
                    </div>
                  </div>
                  <div 
                    className="form-actions"
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '1rem',
                      marginTop: '2rem',
                      paddingTop: '1.5rem',
                      borderTop: isDarkMode ? '1px solid #4a5568' : '1px solid #e2e8f0'
                    }}
                  >
                    <button 
                      type="button" 
                      className="btn-secondary" 
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingRole(null);
                      }}
                      style={{
                        padding: '0.75rem 1.5rem',
                        border: isDarkMode ? '1px solid #4a5568' : '1px solid #d1d5db',
                        borderRadius: '6px',
                        backgroundColor: isDarkMode ? '#4a5568' : '#f9fafb',
                        color: isDarkMode ? '#e2e8f0' : '#374151',
                        cursor: 'pointer',
                        fontSize: '1rem'
                      }}
                    >
                      Hủy
                    </button>
                    <button 
                      type="submit" 
                      className="btn-primary"
                      disabled={actionLoading?.action === 'update' && actionLoading?.roleId === editingRole?.id}
                      style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        borderRadius: '6px',
                        backgroundColor: actionLoading?.action === 'update' && actionLoading?.roleId === editingRole?.id ? '#9ca3af' : '#3b82f6',
                        color: 'white',
                        cursor: actionLoading?.action === 'update' && actionLoading?.roleId === editingRole?.id ? 'not-allowed' : 'pointer',
                        fontSize: '1rem'
                      }}
                    >
                      {actionLoading?.action === 'update' && actionLoading?.roleId === editingRole?.id ? '⏳ Đang cập nhật...' : 'Cập nhật vai trò'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Add Role Modal */}
        {showAddModal && (
          <div 
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
              zIndex: 99999
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAddModal(false);
              }
            }}
          >
            <div 
              style={{
                backgroundColor: isDarkMode ? '#2d3748' : 'white',
                borderRadius: '8px',
                padding: '0',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                position: 'relative'
              }}
            >
              <div 
                className="modal-header"
                style={{
                  padding: '1.5rem',
                  borderBottom: isDarkMode ? '1px solid #4a5568' : '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <h2 style={{ 
                  margin: 0, 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  color: isDarkMode ? '#e2e8f0' : '#2d3748' 
                }}>
                  Thêm vai trò mới
                </h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: isDarkMode ? '#a0aec0' : '#718096',
                    padding: '0.5rem'
                  }}
                >
                  ✕
                </button>
              </div>
              <div 
                className="modal-content"
                style={{
                  padding: '1.5rem',
                  backgroundColor: isDarkMode ? '#2d3748' : 'white'
                }}
              >
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const newRole = {
                    name: formData.get('name') as string,
                    description: formData.get('description') as string,
                    permissions: Array.from(document.querySelectorAll('input[name="permissions"]:checked')).map(input => input.value)
                  };
                  handleAddRole(newRole);
                }}>
                  <div 
                    className="form-group"
                    style={{ marginBottom: '1.5rem' }}
                  >
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '600', 
                      color: isDarkMode ? '#e2e8f0' : '#2d3748' 
                    }}>
                      Tên vai trò:
                    </label>
                    <input 
                      type="text" 
                      name="name"
                      className="form-input" 
                      placeholder="ROLE_NAME"
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: isDarkMode ? '1px solid #4a5568' : '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        backgroundColor: isDarkMode ? '#4a5568' : 'white',
                        color: isDarkMode ? '#e2e8f0' : '#2d3748'
                      }}
                    />
                  </div>
                  <div 
                    className="form-group"
                    style={{ marginBottom: '1.5rem' }}
                  >
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '600', 
                      color: isDarkMode ? '#e2e8f0' : '#2d3748' 
                    }}>
                      Mô tả:
                    </label>
                    <textarea 
                      name="description"
                      className="form-input" 
                      rows={3} 
                      placeholder="Mô tả vai trò..."
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: isDarkMode ? '1px solid #4a5568' : '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        resize: 'vertical',
                        backgroundColor: isDarkMode ? '#4a5568' : 'white',
                        color: isDarkMode ? '#e2e8f0' : '#2d3748'
                      }}
                    />
                  </div>
                  <div 
                    className="form-group"
                    style={{ marginBottom: '1.5rem' }}
                  >
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '600', 
                      color: isDarkMode ? '#e2e8f0 !important' : '#2d3748 !important'
                    }}>
                      Quyền hạn:
                    </label>
                    <div 
                      className="permissions-checkboxes"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '0.75rem'
                      }}
                    >
                      <label style={{ 
                        color: isDarkMode ? '#e2e8f0 !important' : '#2d3748 !important',
                        fontWeight: '500'
                      }}>
                        <input type="checkbox" name="permissions" value="READ" /> 
                        Đọc
                      </label>
                      <label style={{ 
                        color: isDarkMode ? '#e2e8f0 !important' : '#2d3748 !important',
                        fontWeight: '500'
                      }}>
                        <input type="checkbox" name="permissions" value="WRITE" /> 
                        Ghi
                      </label>
                      <label style={{ 
                        color: isDarkMode ? '#e2e8f0 !important' : '#2d3748 !important',
                        fontWeight: '500'
                      }}>
                        <input type="checkbox" name="permissions" value="DELETE" /> 
                        Xóa
                      </label>
                      <label style={{ 
                        color: isDarkMode ? '#e2e8f0 !important' : '#2d3748 !important',
                        fontWeight: '500'
                      }}>
                        <input type="checkbox" name="permissions" value="MANAGE_USERS" /> 
                        Quản lý người dùng
                      </label>
                      <label style={{ 
                        color: isDarkMode ? '#e2e8f0 !important' : '#2d3748 !important',
                        fontWeight: '500'
                      }}>
                        <input type="checkbox" name="permissions" value="MANAGE_ROLES" /> 
                        Quản lý vai trò
                      </label>
                      <label style={{ 
                        color: isDarkMode ? '#e2e8f0 !important' : '#2d3748 !important',
                        fontWeight: '500'
                      }}>
                        <input type="checkbox" name="permissions" value="MANAGE_BOOKINGS" /> 
                        Quản lý đặt phòng
                      </label>
                      <label style={{ 
                        color: isDarkMode ? '#e2e8f0 !important' : '#2d3748 !important',
                        fontWeight: '500'
                      }}>
                        <input type="checkbox" name="permissions" value="BOOK_ROOM" /> 
                        Đặt phòng
                      </label>
                    </div>
                  </div>
                  <div 
                    className="form-actions"
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '1rem',
                      marginTop: '2rem',
                      paddingTop: '1.5rem',
                      borderTop: isDarkMode ? '1px solid #4a5568' : '1px solid #e2e8f0'
                    }}
                  >
                    <button 
                      type="button" 
                      className="btn-secondary" 
                      onClick={() => setShowAddModal(false)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        border: isDarkMode ? '1px solid #4a5568' : '1px solid #d1d5db',
                        borderRadius: '6px',
                        backgroundColor: isDarkMode ? '#4a5568' : '#f9fafb',
                        color: isDarkMode ? '#e2e8f0' : '#374151',
                        cursor: 'pointer',
                        fontSize: '1rem'
                      }}
                    >
                      Hủy
                    </button>
                    <button 
                      type="submit" 
                      className="btn-primary"
                      disabled={actionLoading?.action === 'add'}
                      style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        borderRadius: '6px',
                        backgroundColor: actionLoading?.action === 'add' ? '#9ca3af' : '#3b82f6',
                        color: 'white',
                        cursor: actionLoading?.action === 'add' ? 'not-allowed' : 'pointer',
                        fontSize: '1rem'
                      }}
                    >
                      {actionLoading?.action === 'add' ? '⏳ Đang thêm...' : 'Thêm vai trò'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {actionLoading && (
          <div 
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
              zIndex: 9998
            }}
          >
            <div 
              style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d3748' }}>
                {actionLoading.action === 'add' && 'Đang thêm vai trò...'}
                {actionLoading.action === 'update' && 'Đang cập nhật vai trò...'}
                {actionLoading.action === 'delete' && 'Đang xóa vai trò...'}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#718096', marginTop: '0.5rem' }}>
                Vui lòng chờ trong giây lát...
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

export default RoleManagement;
