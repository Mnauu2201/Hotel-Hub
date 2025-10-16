import React, { useEffect, useState } from 'react';
import bookingService from '../services/bookingService';
import { useAuth } from '../contexts/AuthContext';

const MyBookings = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState([]);
  const [cancelling, setCancelling] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await bookingService.getUserBookings();
        console.log('MyBookings - API response:', data);
        
        // Handle different response structures
        let bookingsList = [];
        if (Array.isArray(data)) {
          bookingsList = data;
        } else if (data?.bookings && Array.isArray(data.bookings)) {
          bookingsList = data.bookings;
        } else if (data?.data?.bookings && Array.isArray(data.data.bookings)) {
          bookingsList = data.data.bookings;
        }
        
        console.log('MyBookings - Processed bookings:', bookingsList);
        setBookings(bookingsList);
      } catch (e) {
        console.error('MyBookings - Error loading bookings:', e);
        setError(e?.message || 'Không thể tải danh sách phòng đã đặt');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      load();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleCancelBooking = async (bookingId) => {
    try {
      setCancelling(prev => ({ ...prev, [bookingId]: true }));
      await bookingService.cancelBooking(bookingId);
      
      // Reload bookings after successful cancellation
      const data = await bookingService.getUserBookings();
      let bookingsList = [];
      if (Array.isArray(data)) {
        bookingsList = data;
      } else if (data?.bookings && Array.isArray(data.bookings)) {
        bookingsList = data.bookings;
      } else if (data?.data?.bookings && Array.isArray(data.data.bookings)) {
        bookingsList = data.data.bookings;
      }
      setBookings(bookingsList);
      
      alert('Hủy đặt phòng thành công!');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Không thể hủy đặt phòng. Vui lòng thử lại sau.');
    } finally {
      setCancelling(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ paddingTop: 120, paddingBottom: 40 }}>
        <h2 style={{ marginBottom: 12 }}>Bạn cần đăng nhập để xem phòng đã đặt</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 120, paddingBottom: 40 }}>
      <h2 style={{ marginBottom: 20 }}>Phòng đã đặt</h2>
      {loading && <div>Đang tải...</div>}
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      {!loading && bookings.length === 0 && <div>Chưa có đặt phòng nào.</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {bookings.map((b, idx) => {
          const bookingCode = b.bookingReference || b.bookingId || 'N/A';
          const roomCode = b.roomNumber || b.roomId || 'N/A';
          const roomType = b.roomType || 'N/A';
          const roomDetailHref = b.roomId ? `/room-detail/${b.roomId}` : undefined;
          
          // Format dates
          const formatDate = (dateStr) => {
            if (!dateStr) return 'N/A';
            try {
              return new Date(dateStr).toLocaleDateString('vi-VN');
            } catch {
              return dateStr;
            }
          };

          // Format status
          const getStatusColor = (status) => {
            switch (status?.toLowerCase()) {
              case 'pending': return '#f59e0b';
              case 'confirmed': return '#10b981';
              case 'cancelled': return '#ef4444';
              case 'completed': return '#6b7280';
              default: return '#6b7280';
            }
          };

          const getStatusText = (status) => {
            switch (status?.toLowerCase()) {
              case 'pending': return 'Chờ xác nhận';
              case 'confirmed': return 'Đã xác nhận';
              case 'cancelled': return 'Đã hủy';
              case 'completed': return 'Hoàn thành';
              default: return status || 'N/A';
            }
          };

          return (
            <div
              key={b.bookingId || idx}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: 20,
                background: '#fff',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#1f2937' }}>
                  Mã đặt phòng: {bookingCode}
                </div>
                <div style={{ 
                  padding: '4px 12px', 
                  borderRadius: 20, 
                  background: getStatusColor(b.status) + '20',
                  color: getStatusColor(b.status),
                  fontSize: 12,
                  fontWeight: 600
                }}>
                  {getStatusText(b.status)}
                </div>
              </div>
              
              <div style={{ marginBottom: 12 }}>
                <div style={{ color: '#374151', marginBottom: 4 }}>
                  <strong>Phòng:</strong> {roomCode} - {roomType}
                </div>
                {b.roomCapacity && (
                  <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 4 }}>
                    Sức chứa: {b.roomCapacity} khách
                  </div>
                )}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ color: '#6b7280', fontSize: 14 }}>Ngày nhận phòng</div>
                  <div style={{ fontWeight: 600, color: '#1f2937' }}>{formatDate(b.checkIn)}</div>
                </div>
                <div>
                  <div style={{ color: '#6b7280', fontSize: 14 }}>Ngày trả phòng</div>
                  <div style={{ fontWeight: 600, color: '#1f2937' }}>{formatDate(b.checkOut)}</div>
                </div>
                <div>
                  <div style={{ color: '#6b7280', fontSize: 14 }}>Số khách</div>
                  <div style={{ fontWeight: 600, color: '#1f2937' }}>{b.guests || 'N/A'} người</div>
                </div>
                {b.totalPrice != null && (
                  <div>
                    <div style={{ color: '#6b7280', fontSize: 14 }}>Tổng tiền</div>
                    <div style={{ fontWeight: 600, color: '#059669' }}>
                      {Number(b.totalPrice).toLocaleString('vi-VN')} VND
                    </div>
                  </div>
                )}
              </div>
              
              {b.notes && (
                <div style={{ marginBottom: 12, padding: 8, background: '#f9fafb', borderRadius: 6 }}>
                  <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 4 }}>Ghi chú:</div>
                  <div style={{ color: '#374151', fontSize: 14 }}>{b.notes}</div>
                </div>
              )}
              
              {b.createdAt && (
                <div style={{ color: '#9ca3af', fontSize: 12, marginBottom: 8 }}>
                  Đặt phòng lúc: {new Date(b.createdAt).toLocaleString('vi-VN')}
                </div>
              )}
              
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                {roomDetailHref && (
                  <a 
                    href={roomDetailHref} 
                    style={{ 
                      color: '#2563eb', 
                      textDecoration: 'none',
                      fontSize: 14,
                      fontWeight: 500
                    }}
                  >
                    📋 Xem chi tiết phòng
                  </a>
                )}
                {b.status?.toLowerCase() === 'pending' && (
                  <button
                    style={{
                      color: '#dc2626',
                      background: 'none',
                      border: 'none',
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: cancelling[b.bookingId] ? 'not-allowed' : 'pointer',
                      textDecoration: 'underline',
                      opacity: cancelling[b.bookingId] ? 0.6 : 1
                    }}
                    disabled={cancelling[b.bookingId]}
                    onClick={() => {
                      if (window.confirm('Bạn có chắc chắn muốn hủy đặt phòng này?')) {
                        handleCancelBooking(b.bookingId);
                      }
                    }}
                  >
                    {cancelling[b.bookingId] ? '⏳ Đang hủy...' : '❌ Hủy đặt phòng'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBookings;



