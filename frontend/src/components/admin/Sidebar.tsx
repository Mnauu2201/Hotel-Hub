import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminStyles.css';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  // Load expanded items from localStorage on mount
  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('admin-sidebar-expanded');
    return saved ? JSON.parse(saved) : [];
  });
  const location = useLocation();

  const toggleExpanded = (item: string) => {
    const newExpandedItems = expandedItems.includes(item) 
      ? expandedItems.filter(i => i !== item)
      : [...expandedItems, item];
    
    setExpandedItems(newExpandedItems);
    // Save to localStorage
    localStorage.setItem('admin-sidebar-expanded', JSON.stringify(newExpandedItems));
  };

  const handleLogout = () => {
    // Xóa token khỏi localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Redirect về trang login
    window.location.href = '/login';
  };

  const menuItems = [
    {
      id: 'management',
      label: 'QUẢN LÝ',
      children: [
        { id: 'booking-management', label: 'Quản lý đặt phòng', icon: '📋', link: '/admin/bookings' },
        { id: 'room-management', label: 'Quản lý phòng', icon: '🏨', link: '/admin/rooms' },
        { id: 'user-management', label: 'Quản lý người dùng', icon: '👥', link: '/admin/users' },
        { id: 'role-management', label: 'Quản lý vai trò', icon: '🔧', link: '/admin/roles' }
      ]
    },
    {
      id: 'system',
      label: 'HỆ THỐNG',
      children: [
        { id: 'statistics-report', label: 'Báo cáo thống kê', icon: '📈', link: '/admin/reports' },
        { id: 'system-settings', label: 'Cài đặt hệ thống', icon: '⚙️', link: '/admin/settings' },
        { id: 'activity-log', label: 'Nhật ký hoạt động', icon: '📝', link: '/admin/activity-log' },
        { id: 'notifications', label: 'Thông báo', icon: '🔔', link: '/admin/notifications' }
      ]
    },
    {
      id: 'account',
      label: 'TÀI KHOẢN',
      children: [
        { id: 'profile', label: 'Thông tin cá nhân', icon: '👤', link: '/admin/profile' },
        { id: 'edit-account', label: 'Chỉnh sửa tài khoản', icon: '✏️', link: '/admin/edit-account' },
        { id: 'logout', label: 'Đăng xuất', icon: '🚪', link: '/logout', isLogout: true }
      ]
    }
  ];

  return (
    <div className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src="/src/assets/img/logo/logo.png" alt="HotelHub Logo" className="sidebar-logo-img" />
        </div>
        <button className="toggle-btn" onClick={onToggle}>
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.id} className="nav-section">
            {item.children ? (
              <div>
                <div 
                  className="nav-section-header"
                  onClick={() => !isCollapsed && toggleExpanded(item.id)}
                >
                  <span className="nav-label">{item.label}</span>
                  {!isCollapsed && (
                    <span className={`nav-arrow ${expandedItems.includes(item.id) ? 'expanded' : ''}`}>
                      ▼
                    </span>
                  )}
                </div>
                {expandedItems.includes(item.id) && !isCollapsed && (
                  <div className="nav-children">
                    {item.children.map((child) => (
                      child.isLogout ? (
                        <div 
                          key={child.id} 
                          className="nav-item logout-item"
                          onClick={handleLogout}
                        >
                          <span className="nav-icon">{child.icon}</span>
                          <span className="nav-label">{child.label}</span>
                        </div>
                      ) : (
                        <Link 
                          key={child.id} 
                          to={child.link || '#'} 
                          className={`nav-item ${location.pathname === child.link ? 'active' : ''}`}
                        >
                          <span className="nav-icon">{child.icon}</span>
                          <span className="nav-label">{child.label}</span>
                          {child.badge && (
                            <span className="nav-badge">{child.badge}</span>
                          )}
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to={item.link || '#'} 
                className={`nav-item ${item.isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
