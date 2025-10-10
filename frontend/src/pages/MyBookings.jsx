import React, { useEffect, useState } from 'react';
import bookingService from '../services/bookingService';
import { useAuth } from '../contexts/AuthContext';

const MyBookings = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await bookingService.getUserBookings();
        setBookings(Array.isArray(data) ? data : (data?.bookings || []));
      } catch (e) {
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
          const roomDetailHref = b.roomId ? `/room-detail/${b.roomId}` : undefined;

          return (
            <div
              key={b.bookingId || idx}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: 16,
                background: '#fff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontWeight: 700 }}>Mã đặt phòng: {bookingCode}</div>
                <div style={{ padding: '2px 8px', borderRadius: 999, background: '#f3f4f6', fontSize: 12 }}>
                  {b.status}
                </div>
              </div>
              <div style={{ color: '#374151', marginBottom: 8 }}>
                Mã phòng: <strong>{roomCode}</strong>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
                <div>Nhận phòng: <strong>{b.checkIn}</strong></div>
                <div>Trả phòng: <strong>{b.checkOut}</strong></div>
                {b.totalPrice != null && (
                  <div>Tổng tiền: <strong>{Number(b.totalPrice).toLocaleString()} VND</strong></div>
                )}
              </div>
              {roomDetailHref && (
                <a href={roomDetailHref} style={{ color: '#2563eb', textDecoration: 'none' }}>Xem chi tiết phòng</a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBookings;


