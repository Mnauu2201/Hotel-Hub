import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getStatistics, testApiConnection } from '../../services/reportsApi';
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
  }, []); // Chỉ fetch một lần khi component mount

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching statistics from API...');
      
      // Test API connection first
      const isApiConnected = await testApiConnection();
      console.log('🔗 API connection status:', isApiConnected);
      
      // Try API call first
      try {
        const apiData = await getStatistics({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        });
        
        console.log('✅ API data received:', apiData);
        console.log('💰 Revenue data:', {
          totalRevenue: apiData.totalRevenue,
          totalBookings: apiData.totalBookings,
          monthlyRevenue: apiData.monthlyRevenue,
          maxMonthlyRevenue: Math.max(...(apiData.monthlyRevenue || [0])),
          dateRange: { startDate: dateRange.startDate, endDate: dateRange.endDate }
        });
        setStatistics(apiData);
        return;
      } catch (apiError) {
        console.log('⚠️ API call failed, using mock data:', apiError);
      }
      
      // Fallback to mock data if API fails
      const mockStats: Statistics = {
        totalBookings: 156,
        totalRevenue: 125000000,
        totalUsers: 89,
        totalRooms: 25,
        monthlyRevenue: [
          12000000, 15000000, 18000000, 22000000, 25000000, 28000000,
          30000000, 32000000, 28000000, 25000000, 22000000, 20000000
        ],
        bookingStatusCounts: {
          pending: 12,
          confirmed: 45,
          cancelled: 8,
          completed: 91
        }
      };
      setStatistics(mockStats);
    } catch (error) {
      console.error('💥 Error fetching statistics:', error);
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
          <button 
            className="btn-secondary" 
            onClick={async () => {
              const isConnected = await testApiConnection();
              alert(isConnected ? '✅ API kết nối thành công!' : '❌ API kết nối thất bại!');
            }}
            style={{ marginLeft: '10px', padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            🧪 Test API
          </button>
          <button 
            className="btn-secondary" 
            onClick={async () => {
              try {
                const apiData = await getStatistics({
                  startDate: dateRange.startDate,
                  endDate: dateRange.endDate
                });
                console.log('🔍 Debug revenue data:', apiData);
                
                const monthlyData = apiData.monthlyRevenue.map((revenue, index) => 
                  `Tháng ${index + 1}: ${revenue.toLocaleString('vi-VN')} VNĐ`
                ).join('\n');
                
                alert(`📊 Chi tiết doanh thu:\n\n${monthlyData}\n\nTổng doanh thu: ${apiData.totalRevenue.toLocaleString('vi-VN')} VNĐ\nTổng đặt phòng: ${apiData.totalBookings}\nKhoảng thời gian: ${dateRange.startDate} đến ${dateRange.endDate}`);
              } catch (error) {
                console.error('Debug error:', error);
                alert('Lỗi khi debug: ' + error.message);
              }
            }}
            style={{ marginLeft: '10px', padding: '8px 16px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            🔍 Debug Revenue
          </button>
          <button 
            className="btn-secondary" 
            onClick={() => {
              // Test với dữ liệu mẫu để kiểm tra biểu đồ
              const testData = {
                totalBookings: 50,
                totalRevenue: 50000000,
                totalUsers: 20,
                totalRooms: 10,
                monthlyRevenue: [
                  5000000, 8000000, 12000000, 15000000, 18000000, 20000000,
                  22000000, 25000000, 20000000, 15000000, 10000000, 5000000
                ],
                bookingStatusCounts: {
                  pending: 5,
                  confirmed: 30,
                  cancelled: 10,
                  completed: 5
                }
              };
              setStatistics(testData);
              console.log('🧪 Test data applied:', testData);
            }}
            style={{ marginLeft: '10px', padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            🧪 Test Chart
          </button>
          <button 
            className="btn-secondary" 
            onClick={async () => {
              // Force refresh với dữ liệu thực từ API
              try {
                console.log('🔄 Force refreshing with real API data...');
                await fetchStatistics();
              } catch (error) {
                console.error('Force refresh error:', error);
              }
            }}
            style={{ marginLeft: '10px', padding: '8px 16px', backgroundColor: '#ff6b35', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            🔄 Force Refresh
          </button>
          <button 
            className="btn-secondary" 
            onClick={() => {
              // Debug chi tiết về phân bổ doanh thu
              if (statistics) {
                const monthlyData = statistics.monthlyRevenue || [];
                const totalRevenue = statistics.totalRevenue;
                const sumMonthly = monthlyData.reduce((sum, revenue) => sum + revenue, 0);
                
                const debugInfo = monthlyData.map((revenue, index) => {
                  const startDate = new Date(dateRange.startDate);
                  const endDate = new Date(dateRange.endDate);
                  const startMonth = startDate.getMonth();
                  const endMonth = endDate.getMonth();
                  const isInRange = index >= startMonth && index <= endMonth;
                  
                  return `Tháng ${index + 1}: ${revenue.toLocaleString('vi-VN')} VNĐ ${isInRange ? '(Trong khoảng)' : '(Ngoài khoảng)'}`;
                }).join('\n');
                
                alert(`📊 Debug Revenue Distribution:\n\nTổng doanh thu: ${totalRevenue.toLocaleString('vi-VN')} VNĐ\nTổng phân bổ: ${sumMonthly.toLocaleString('vi-VN')} VNĐ\nChênh lệch: ${(totalRevenue - sumMonthly).toLocaleString('vi-VN')} VNĐ\n\nChi tiết:\n${debugInfo}`);
              }
            }}
            style={{ marginLeft: '10px', padding: '8px 16px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            🔍 Debug Distribution
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
        <div className="charts-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div className="chart-container">
            <h3>📈 Doanh thu theo tháng</h3>
            <div className="chart-content">
              <div className="chart-bars">
                {statistics?.monthlyRevenue.map((revenue, index) => {
                  const monthlyData = statistics?.monthlyRevenue || [];
                  const maxRevenue = Math.max(...monthlyData);
                  
                  // Kiểm tra xem tháng này có trong khoảng thời gian đã chọn không
                  const currentDate = new Date();
                  const startDate = new Date(dateRange.startDate);
                  const endDate = new Date(dateRange.endDate);
                  const monthDate = new Date(currentDate.getFullYear(), index, 1);
                  
                  // Tính tháng bắt đầu và kết thúc từ date range
                  const startMonth = startDate.getMonth();
                  const endMonth = endDate.getMonth();
                  const isInRange = index >= startMonth && index <= endMonth;
                  
                  // Tính chiều cao cột
                  let heightPercentage = 10; // Minimum 10%
                  
                  if (maxRevenue > 0) {
                    heightPercentage = Math.max((revenue / maxRevenue) * 100, 10);
                  } else if (statistics?.totalRevenue > 0) {
                    // Nếu không có maxRevenue nhưng có totalRevenue, sử dụng totalRevenue làm base
                    heightPercentage = Math.max((revenue / statistics.totalRevenue) * 100, 10);
                  }
                  
                  // Đảm bảo cột luôn có chiều cao tối thiểu
                  const finalHeight = Math.max(heightPercentage, 15);
                  
                  return (
                    <div key={index} className="chart-bar">
                      <div 
                        className="bar-fill" 
                        style={{ 
                          height: `${finalHeight}%`,
                          background: revenue > 0 && isInRange ? 
                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                            'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)',
                          minHeight: '20px',
                          opacity: isInRange ? 1 : 0.3
                        }}
                        title={`Tháng ${index + 1}: ${revenue.toLocaleString('vi-VN')} VNĐ ${isInRange ? '(Trong khoảng thời gian)' : '(Ngoài khoảng thời gian)'}`}
                      ></div>
                      <span className="bar-label" style={{ 
                        color: isInRange ? '#4a5568' : '#a0aec0',
                        fontWeight: isInRange ? '600' : '400'
                      }}>T{index + 1}</span>
                      {revenue > 0 && isInRange && (
                        <span className="bar-value" style={{ 
                          fontSize: '0.7rem', 
                          color: '#4a5568', 
                          marginTop: '4px',
                          fontWeight: '600'
                        }}>
                          {(revenue / 1000000).toFixed(1)}M
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="chart-container">
            <h3>📊 Trạng thái đặt phòng</h3>
            <ul className="status-list">
              <li>
                <div className="status-item-content">
                  <span className="status-dot" style={{ backgroundColor: '#fbbf24' }}></span>
                  <span className="status-label">Chờ xử lý</span>
                </div>
                <span className="status-count">{statistics?.bookingStatusCounts.pending || 0}</span>
              </li>
              <li>
                <div className="status-item-content">
                  <span className="status-dot" style={{ backgroundColor: '#10b981' }}></span>
                  <span className="status-label">Đã xác nhận</span>
                </div>
                <span className="status-count">{statistics?.bookingStatusCounts.confirmed || 0}</span>
              </li>
              <li>
                <div className="status-item-content">
                  <span className="status-dot" style={{ backgroundColor: '#ef4444' }}></span>
                  <span className="status-label">Đã hủy</span>
                </div>
                <span className="status-count">{statistics?.bookingStatusCounts.cancelled || 0}</span>
              </li>
              <li>
                <div className="status-item-content">
                  <span className="status-dot" style={{ backgroundColor: '#3b82f6' }}></span>
                  <span className="status-label">Hoàn thành</span>
                </div>
                <span className="status-count">{statistics?.bookingStatusCounts.completed || 0}</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default StatisticsReport;
