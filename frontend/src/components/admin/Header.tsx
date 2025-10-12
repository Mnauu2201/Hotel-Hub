import React, { useState, useEffect } from 'react';
import './AdminStyles.css';

interface User {
  email: string;
  name: string;
  roles: string[];
}

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed?: boolean;
  user?: User | null;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarCollapsed = false, user }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('admin-dark-mode');
    return saved ? JSON.parse(saved) : false;
  });

  // Cập nhật thời gian mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Apply dark mode to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('admin-dark-mode', JSON.stringify(newMode));
  };

  // Format thời gian theo múi giờ Việt Nam
  const formatVietnamTime = (date: Date) => {
    return date.toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const handleLogout = () => {
    // Xóa token khỏi localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect về trang login
    window.location.href = '/login';
  };

  return (
    <div className={`admin-full-header ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Top Bar */}
      <div className="admin-top-bar">
        <div className="top-bar-left">
          <span>🕒 Thứ Hai - Thứ Sáu: 9:00 - 19:00/ Đóng cửa cuối tuần</span>
          <span>📞 +84 777 666 555</span>
        </div>
        <div className="top-bar-right">
        </div>
      </div>
      
      {/* Main Header */}
      <header className="admin-main-header">
            <div className="header-left">
              <div className="header-nav">
                <span className="nav-title">Dashboard</span>
              </div>
            </div>

            {/* Clock in the center with flags */}
            <div className="header-center">
              <div className="vietnam-flag">
                <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                  <rect width="24" height="16" fill="#DA020E"/>
                  <polygon points="12,4 13.4,7.2 16.8,7.2 14.2,9.4 15.6,12.6 12,10.4 8.4,12.6 9.8,9.4 7.2,7.2 10.6,7.2" fill="#FFCD00"/>
                </svg>
              </div>
              <div className="clock-time">{formatVietnamTime(currentTime)}</div>
              <div className="vietnam-flag">
                <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                  <rect width="24" height="16" fill="#DA020E"/>
                  <polygon points="12,4 13.4,7.2 16.8,7.2 14.2,9.4 15.6,12.6 12,10.4 8.4,12.6 9.8,9.4 7.2,7.2 10.6,7.2" fill="#FFCD00"/>
                </svg>
              </div>
            </div>
        
        <div className="header-right">
          <div className="header-icons">
            <button 
              className="icon-btn dark-mode-btn" 
              onClick={toggleDarkMode}
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
            >
              {isDarkMode ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
