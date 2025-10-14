import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

interface OverviewData {
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
  totalRooms: number;
  fromDate: string;
  toDate: string;
}

interface MonthlyRevenue {
  month: string;
  revenue: number;
  year: number;
  monthNumber: number;
}

interface BookingStatus {
  status: string;
  statusCode: string;
  count: number;
  color: string;
}

interface PopularRoom {
  rank: number;
  roomType: string;
  bookingCount: number;
  totalRevenue: number;
  revenueFormatted: string;
}

const Reports: React.FC = () => {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [bookingStatus, setBookingStatus] = useState<BookingStatus[]>([]);
  const [popularRooms, setPopularRooms] = useState<PopularRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('2025-09-30');
  const [toDate, setToDate] = useState('2025-10-14');
  const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains('dark-mode'));

  // Fallback data khi API không hoạt động
  const fallbackOverview: OverviewData = {
    totalBookings: 8,
    totalRevenue: 21000000,
    totalUsers: 13,
    totalRooms: 8,
    fromDate: '2025-09-30',
    toDate: '2025-10-14'
  };

  const fallbackMonthlyRevenue: MonthlyRevenue[] = [
    { month: 'T1', revenue: 0, year: 2025, monthNumber: 1 },
    { month: 'T2', revenue: 0, year: 2025, monthNumber: 2 },
    { month: 'T3', revenue: 0, year: 2025, monthNumber: 3 },
    { month: 'T4', revenue: 0, year: 2025, monthNumber: 4 },
    { month: 'T5', revenue: 0, year: 2025, monthNumber: 5 },
    { month: 'T6', revenue: 0, year: 2025, monthNumber: 6 },
    { month: 'T7', revenue: 0, year: 2025, monthNumber: 7 },
    { month: 'T8', revenue: 0, year: 2025, monthNumber: 8 },
    { month: 'T9', revenue: 2600000, year: 2025, monthNumber: 9 },
    { month: 'T10', revenue: 10900000, year: 2025, monthNumber: 10 },
    { month: 'T11', revenue: 3000000, year: 2025, monthNumber: 11 },
    { month: 'T12', revenue: 4500000, year: 2025, monthNumber: 12 }
  ];

  const fallbackBookingStatus: BookingStatus[] = [
    { status: 'Chờ xử lý', statusCode: 'PENDING', count: 0, color: 'yellow' },
    { status: 'Đã xác nhận', statusCode: 'CONFIRMED', count: 4, color: 'green' },
    { status: 'Đã hủy', statusCode: 'CANCELLED', count: 0, color: 'red' },
    { status: 'Hoàn thành', statusCode: 'COMPLETED', count: 4, color: 'blue' }
  ];

  const fallbackPopularRooms: PopularRoom[] = [
    { rank: 1, roomType: 'Suite', bookingCount: 4, totalRevenue: 12000000, revenueFormatted: '12.000.000 VNĐ' },
    { rank: 2, roomType: 'Double', bookingCount: 2, totalRevenue: 4000000, revenueFormatted: '4.000.000 VNĐ' },
    { rank: 3, roomType: 'Single', bookingCount: 2, totalRevenue: 2000000, revenueFormatted: '2.000.000 VNĐ' }
  ];

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains('dark-mode'));
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No access token found');
        setLoading(false);
        return;
      }
      
      console.log('Token found:', token.substring(0, 20) + '...');
      console.log('Token length:', token.length);
      
      // Decode token to check roles
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        console.log('User roles:', payload.roles || payload.authorities);
      } catch (error) {
        console.error('Error decoding token:', error);
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      console.log('Fetching reports data...');
      console.log('From date:', fromDate, 'To date:', toDate);

      // Test public API first (no auth required)
      try {
        const publicTestRes = await fetch('http://localhost:8080/api/admin/reports/public-test');
        console.log('Public test API status:', publicTestRes.status);
        if (publicTestRes.ok) {
          const publicTestData = await publicTestRes.json();
          console.log('Public test API response:', publicTestData);
        } else {
          console.error('Public test API failed:', publicTestRes.status);
        }
      } catch (error) {
        console.error('Public test API error:', error);
      }

      // Test API authentication
      try {
        const testRes = await fetch('http://localhost:8080/api/admin/reports/test', { headers });
        console.log('Test API status:', testRes.status);
        if (testRes.ok) {
          const testData = await testRes.json();
          console.log('Test API response:', testData);
        } else {
          console.error('Test API failed:', testRes.status);
        }
      } catch (error) {
        console.error('Test API error:', error);
      }

      // Fetch overview data
      try {
        const overviewUrl = `http://localhost:8080/api/admin/reports/overview?fromDate=${fromDate}&toDate=${toDate}`;
        console.log('Overview URL:', overviewUrl);
        
        const overviewRes = await fetch(overviewUrl, { headers });
        console.log('Overview response status:', overviewRes.status);
        
        if (overviewRes.ok) {
          const overviewData = await overviewRes.json();
          console.log('Overview data received:', overviewData);
          setOverview(overviewData);
        } else {
          console.error('Overview API error:', overviewRes.status);
          const errorText = await overviewRes.text();
          console.error('Overview error details:', errorText);
        }
      } catch (error) {
        console.error('Overview fetch error:', error);
      }

      // Fetch monthly revenue data
      try {
        const monthlyUrl = 'http://localhost:8080/api/admin/reports/revenue-monthly?year=2025';
        console.log('Monthly revenue URL:', monthlyUrl);
        
        const monthlyRes = await fetch(monthlyUrl, { headers });
        console.log('Monthly revenue response status:', monthlyRes.status);
        
        if (monthlyRes.ok) {
          const monthlyData = await monthlyRes.json();
          console.log('Monthly revenue data received:', monthlyData);
          console.log('Monthly revenue data length:', monthlyData.length);
          setMonthlyRevenue(monthlyData);
        } else {
          console.error('Monthly revenue API error:', monthlyRes.status);
          const errorText = await monthlyRes.text();
          console.error('Monthly revenue error details:', errorText);
        }
      } catch (error) {
        console.error('Monthly revenue fetch error:', error);
      }

      // Fetch booking status data
      try {
        const statusRes = await fetch(`http://localhost:8080/api/admin/reports/booking-status?fromDate=${fromDate}&toDate=${toDate}`, { headers });
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          console.log('Booking status data:', statusData);
          setBookingStatus(statusData);
        } else {
          console.error('Booking status API error:', statusRes.status);
          const errorText = await statusRes.text();
          console.error('Booking status error details:', errorText);
        }
      } catch (error) {
        console.error('Booking status fetch error:', error);
      }

      // Fetch popular rooms data
      try {
        const roomsRes = await fetch(`http://localhost:8080/api/admin/reports/popular-rooms?fromDate=${fromDate}&toDate=${toDate}`, { headers });
        if (roomsRes.ok) {
          const roomsData = await roomsRes.json();
          console.log('Popular rooms data:', roomsData);
          setPopularRooms(roomsData);
        } else {
          console.error('Popular rooms API error:', roomsRes.status);
          const errorText = await roomsRes.text();
          console.error('Popular rooms error details:', errorText);
        }
      } catch (error) {
        console.error('Popular rooms fetch error:', error);
      }

    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    fetchAllData();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusColor = (color: string) => {
    const colors: { [key: string]: string } = {
      'yellow': '#fbbf24',
      'green': '#10b981',
      'red': '#ef4444',
      'blue': '#3b82f6'
    };
    return colors[color] || '#6b7280';
  };

  if (loading) {
    return (
      <AdminLayout title="Báo cáo thống kê" breadcrumb="Báo cáo thống kê">
        <div className="admin-page">
          <div className="loading">Đang tải dữ liệu...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Báo cáo thống kê" breadcrumb="Báo cáo thống kê">
      <div className="admin-page">
        {/* Date Range Filter */}
        <div className="reports-filter" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: isDarkMode ? '#e2e8f0' : '#2d3748'
              }}>
                Từ ngày:
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: isDarkMode ? '1px solid #4a5568' : '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: isDarkMode ? '#4a5568' : 'white',
                  color: isDarkMode ? '#e2e8f0' : '#2d3748'
                }}
              />
            </div>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: isDarkMode ? '#e2e8f0' : '#2d3748'
              }}>
                Đến ngày:
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: isDarkMode ? '1px solid #4a5568' : '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: isDarkMode ? '#4a5568' : 'white',
                  color: isDarkMode ? '#e2e8f0' : '#2d3748'
                }}
              />
            </div>
            <div style={{ alignSelf: 'flex-end' }}>
              <button
                onClick={handleUpdate}
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="reports-overview" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: isDarkMode ? '#2d3748' : 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: isDarkMode ? '1px solid #4a5568' : '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                backgroundColor: '#10b981', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem'
              }}>
                📊
              </div>
              <div>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold',
                  color: isDarkMode ? '#e2e8f0' : '#2d3748'
                }}>
                  {overview?.totalBookings ?? fallbackOverview.totalBookings}
                </div>
                <div style={{ 
                  color: isDarkMode ? '#a0aec0' : '#6b7280',
                  fontSize: '0.9rem'
                }}>
                  Tổng đặt phòng
                </div>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: isDarkMode ? '#2d3748' : 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: isDarkMode ? '1px solid #4a5568' : '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                backgroundColor: '#f59e0b', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem'
              }}>
                💰
              </div>
              <div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold',
                  color: isDarkMode ? '#e2e8f0' : '#2d3748'
                }}>
                  {formatCurrency(overview?.totalRevenue ?? fallbackOverview.totalRevenue)}
                </div>
                <div style={{ 
                  color: isDarkMode ? '#a0aec0' : '#6b7280',
                  fontSize: '0.9rem'
                }}>
                  Tổng doanh thu
                </div>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: isDarkMode ? '#2d3748' : 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: isDarkMode ? '1px solid #4a5568' : '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                backgroundColor: '#fbbf24', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem'
              }}>
                👥
              </div>
              <div>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold',
                  color: isDarkMode ? '#e2e8f0' : '#2d3748'
                }}>
                  {overview?.totalUsers ?? fallbackOverview.totalUsers}
                </div>
                <div style={{ 
                  color: isDarkMode ? '#a0aec0' : '#6b7280',
                  fontSize: '0.9rem'
                }}>
                  Tổng người dùng
                </div>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: isDarkMode ? '#2d3748' : 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: isDarkMode ? '1px solid #4a5568' : '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                backgroundColor: '#8b5cf6', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem'
              }}>
                🏨
              </div>
              <div>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold',
                  color: isDarkMode ? '#e2e8f0' : '#2d3748'
                }}>
                  {overview?.totalRooms ?? fallbackOverview.totalRooms}
                </div>
                <div style={{ 
                  color: isDarkMode ? '#a0aec0' : '#6b7280',
                  fontSize: '0.9rem'
                }}>
                  Tổng phòng
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div style={{
          backgroundColor: isDarkMode ? '#2d3748' : 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: isDarkMode ? '1px solid #4a5568' : '1px solid #e2e8f0',
          marginBottom: '2rem'
        }}>
          <h3 style={{ 
            marginBottom: '1rem',
            color: isDarkMode ? '#e2e8f0' : '#2d3748'
          }}>
            Doanh thu theo tháng
          </h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'end', height: '200px' }}>
            {(monthlyRevenue && monthlyRevenue.length > 0 ? monthlyRevenue : fallbackMonthlyRevenue).slice(0, 6).map((month, index) => {
              const data = monthlyRevenue && monthlyRevenue.length > 0 ? monthlyRevenue : fallbackMonthlyRevenue;
              const maxRevenue = Math.max(...data.map(m => m.revenue), 1);
              const barHeight = Math.max((month.revenue / maxRevenue) * 150, 10);
              
              console.log(`Month ${index}: ${month.month}, Revenue: ${month.revenue}, Bar Height: ${barHeight}px`);
              
              return (
                <div key={index} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    height: `${barHeight}px`,
                    backgroundColor: '#3b82f6',
                    borderRadius: '4px 4px 0 0',
                    marginBottom: '0.5rem',
                    minHeight: '10px'
                  }} />
                  <div style={{ 
                    fontSize: '0.8rem',
                    color: isDarkMode ? '#a0aec0' : '#6b7280'
                  }}>
                    {month.month}
                  </div>
                  <div style={{ 
                    fontSize: '0.7rem',
                    color: isDarkMode ? '#a0aec0' : '#6b7280'
                  }}>
                    {formatCurrency(month.revenue)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Booking Status and Popular Rooms */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem'
        }}>
          {/* Booking Status */}
          <div style={{
            backgroundColor: isDarkMode ? '#2d3748' : 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: isDarkMode ? '1px solid #4a5568' : '1px solid #e2e8f0'
          }}>
            <h3 style={{ 
              marginBottom: '1rem',
              color: isDarkMode ? '#e2e8f0' : '#2d3748'
            }}>
              Trạng thái đặt phòng
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(bookingStatus && bookingStatus.length > 0 ? bookingStatus : fallbackBookingStatus).map((status, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  backgroundColor: isDarkMode ? '#4a5568' : '#f9fafb',
                  borderRadius: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(status.color),
                      marginRight: '0.75rem'
                    }} />
                    <span style={{ 
                      color: isDarkMode ? '#e2e8f0' : '#2d3748',
                      fontWeight: '500'
                    }}>
                      {status.status}
                    </span>
                  </div>
                  <span style={{ 
                    color: isDarkMode ? '#e2e8f0' : '#2d3748',
                    fontWeight: 'bold'
                  }}>
                    {status.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Rooms */}
          <div style={{
            backgroundColor: isDarkMode ? '#2d3748' : 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: isDarkMode ? '1px solid #4a5568' : '1px solid #e2e8f0'
          }}>
            <h3 style={{ 
              marginBottom: '1rem',
              color: isDarkMode ? '#e2e8f0' : '#2d3748'
            }}>
              Phòng được đặt nhiều nhất
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(popularRooms && popularRooms.length > 0 ? popularRooms : fallbackPopularRooms).map((room, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '1rem',
                  backgroundColor: isDarkMode ? '#4a5568' : '#f9fafb',
                  borderRadius: '6px'
                }}>
                  <div>
                    <div style={{ 
                      color: isDarkMode ? '#e2e8f0' : '#2d3748',
                      fontWeight: '600',
                      marginBottom: '0.25rem'
                    }}>
                      #{room.rank} {room.roomType}
                    </div>
                    <div style={{ 
                      color: isDarkMode ? '#a0aec0' : '#6b7280',
                      fontSize: '0.9rem'
                    }}>
                      {room.bookingCount} đặt phòng
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      color: isDarkMode ? '#e2e8f0' : '#2d3748',
                      fontWeight: 'bold'
                    }}>
                      {room.revenueFormatted}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reports;
