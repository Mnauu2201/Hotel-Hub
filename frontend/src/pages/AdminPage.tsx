import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/admin/Header';
import DashboardCards from '../components/admin/DashboardCards';
import ProgressCards from '../components/admin/ProgressCards';
import SocialCards from '../components/admin/SocialCards';
import ChartSection from '../components/admin/ChartSection';
import '../components/admin/AdminStyles.css';

const AdminPage: React.FC = () => {
  // Load sidebar state from localStorage on mount
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const { user } = useAuth();

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
            <a href="#">Home</a> / Dashboard
          </div>
          
          <DashboardCards />
          
          <ChartSection />
          
          <ProgressCards />
          
          <SocialCards />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
