import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumb?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, breadcrumb }) => {
  const { user } = useAuth();
  
  // Load sidebar state from localStorage on mount
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    // Save to localStorage
    localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(newState));
  };

  return (
    <div className="admin-layout">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={toggleSidebar} 
      />
      
      <div className={`admin-main ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header 
          onToggleSidebar={toggleSidebar} 
          isSidebarCollapsed={isSidebarCollapsed}
          user={user}
        />
        
        <div className="admin-content">
          <div className="breadcrumb">
            <a href="/admin">Home</a> / {breadcrumb || title}
          </div>
          
          <div className="admin-page-header">
            <h1>{title}</h1>
          </div>
          
          <div className="admin-page-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
