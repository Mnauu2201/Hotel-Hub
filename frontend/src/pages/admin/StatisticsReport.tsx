import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminPages.css';

interface Statistics {
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
  totalRooms: number;
  monthlyRevenue: number[];
  bookingStatusCounts: {
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
  };
  topRooms: Array<{
    roomName: string;
    bookingCount: number;
    revenue: number;
  }>;
}

const StatisticsReport: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchStatistics();
  }, [dateRange]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockStats: Statistics = {
        totalBookings: 156,
        totalRevenue: 125000000,
        totalUsers: 89,
        totalRooms: 25,
        monthlyRevenue: [12000000, 15000000, 18000000, 22000000, 25000000, 28000000],
        bookingStatusCounts: {
          pending: 12,
          confirmed: 45,
          cancelled: 8,
          completed: 91
        },
        topRooms: [
          { roomName: 'Deluxe Suite', bookingCount: 45, revenue: 45000000 },
          { roomName: 'Standard Room', bookingCount: 38, revenue: 28000000 },
          { roomName: 'Family Suite', bookingCount: 22, revenue: 35000000 }
        ]
      };
      setStatistics(mockStats);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{ title: string; value: string | number; icon: string; color: string }> = ({ title, value, icon, color }) => (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className="stat-content">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout title="Báo cáo thống kê" breadcrumb="Báo cáo thống kê">
        <div className="loading">Đang tải...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Báo cáo thống kê" breadcrumb="Báo cáo thống kê">
      <div className="admin-page">
        {/* Date Range Filter */}
        <div className="admin-filters">
          <div className="filter-group">
            <label>Từ ngày:</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label>Đến ngày:</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="filter-input"
            />
          </div>
          <button className="btn-primary" onClick={fetchStatistics}>
            🔄 Cập nhật
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <StatCard
            title="Tổng đặt phòng"
            value={statistics?.totalBookings || 0}
            icon="📋"
            color="#4CAF50"
          />
          <StatCard
            title="Tổng doanh thu"
            value={`${(statistics?.totalRevenue || 0).toLocaleString('vi-VN')} VNĐ`}
            icon="💰"
            color="#2196F3"
          />
          <StatCard
            title="Tổng người dùng"
            value={statistics?.totalUsers || 0}
            icon="👥"
            color="#FF9800"
          />
          <StatCard
            title="Tổng phòng"
            value={statistics?.totalRooms || 0}
            icon="🏨"
            color="#9C27B0"
          />
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-container">
            <h3>Doanh thu theo tháng</h3>
            <div className="chart-placeholder">
              <p>📊 Biểu đồ doanh thu sẽ được hiển thị ở đây</p>
              <div className="chart-bars">
                {statistics?.monthlyRevenue.map((revenue, index) => (
                  <div key={index} className="chart-bar">
                    <div 
                      className="bar-fill" 
                      style={{ height: `${(revenue / Math.max(...(statistics?.monthlyRevenue || [1]))) * 100}%` }}
                    ></div>
                    <span className="bar-label">T{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="chart-container">
            <h3>Trạng thái đặt phòng</h3>
            <div className="status-chart">
              <div className="status-item">
                <span className="status-dot status-pending"></span>
                <span>Chờ xử lý: {statistics?.bookingStatusCounts.pending}</span>
              </div>
              <div className="status-item">
                <span className="status-dot status-confirmed"></span>
                <span>Đã xác nhận: {statistics?.bookingStatusCounts.confirmed}</span>
              </div>
              <div className="status-item">
                <span className="status-dot status-cancelled"></span>
                <span>Đã hủy: {statistics?.bookingStatusCounts.cancelled}</span>
              </div>
              <div className="status-item">
                <span className="status-dot status-completed"></span>
                <span>Hoàn thành: {statistics?.bookingStatusCounts.completed}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Rooms */}
        <div className="top-rooms-section">
          <h3>Phòng được đặt nhiều nhất</h3>
          <div className="top-rooms-list">
            {statistics?.topRooms.map((room, index) => (
              <div key={index} className="top-room-item">
                <div className="room-rank">#{index + 1}</div>
                <div className="room-info">
                  <h4>{room.roomName}</h4>
                  <p>{room.bookingCount} đặt phòng</p>
                </div>
                <div className="room-revenue">
                  {room.revenue.toLocaleString('vi-VN')} VNĐ
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StatisticsReport;
