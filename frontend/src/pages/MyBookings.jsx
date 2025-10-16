import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    <div style={{ 
      background: '#644222', 
      minHeight: '100vh',
      padding: '120px 0 40px 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(5deg); }
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes rotateBackground {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes rotateBackgroundReverse {
            0% { transform: rotate(360deg); }
            100% { transform: rotate(0deg); }
          }
          @keyframes colorShift {
            0% { background: #644222; }
            25% { background: #8a643f; }
            50% { background: #a67c52; }
            75% { background: #8a643f; }
            100% { background: #644222; }
          }
          .float-animation {
            animation: float 4s ease-in-out infinite;
          }
          .slide-in {
            animation: slideIn 1s ease-out;
          }
          .shimmer {
            position: relative;
            overflow: hidden;
          }
          .shimmer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            animation: shimmer 2s infinite;
          }
          .pulse-animation {
            animation: pulse 2s ease-in-out infinite;
          }
          .rotating-bg {
            animation: rotateBackground 20s linear infinite;
          }
          .rotating-bg-reverse {
            animation: rotateBackgroundReverse 25s linear infinite;
          }
          .color-shifting-bg {
            animation: colorShift 8s ease-in-out infinite;
          }
        `}
      </style>
      
      {/* Rotating Background Elements */}
      <div className="rotating-bg" style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'conic-gradient(from 0deg, #644222 0%, #8a643f 25%, #a67c52 50%, #8a643f 75%, #644222 100%)',
        opacity: 0.1,
        zIndex: 0
      }} />
      
      <div className="rotating-bg-reverse" style={{
        position: 'absolute',
        top: '-30%',
        right: '-30%',
        width: '160%',
        height: '160%',
        background: 'conic-gradient(from 180deg, rgba(100, 66, 34, 0.2) 0%, rgba(138, 100, 63, 0.3) 25%, rgba(166, 124, 82, 0.2) 50%, rgba(138, 100, 63, 0.3) 75%, rgba(100, 66, 34, 0.2) 100%)',
        borderRadius: '50%',
        zIndex: 0
      }} />
      
      <div className="color-shifting-bg" style={{
        position: 'absolute',
        top: '20%',
        left: '20%',
        width: 400,
        height: 400,
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 10s ease-in-out infinite',
        zIndex: 0
      }} />
      
      <div className="rotating-bg" style={{
        position: 'absolute',
        bottom: '-40%',
        left: '-20%',
        width: '180%',
        height: '180%',
        background: 'conic-gradient(from 90deg, rgba(100, 66, 34, 0.15) 0%, rgba(138, 100, 63, 0.25) 33%, rgba(166, 124, 82, 0.15) 66%, rgba(100, 66, 34, 0.15) 100%)',
        borderRadius: '50%',
        zIndex: 0
      }} />
      
      {/* Main Container */}
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          borderRadius: 32,
          padding: 40,
          boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.3)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 40
        }}>
          {/* Shimmer Effect */}
          <div className="shimmer" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #fff, transparent)'
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Title Section */}
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
              <div className="float-animation pulse-animation" style={{
                width: 80,
                height: 80,
                background: 'linear-gradient(135deg, #644222 0%, #8a643f 50%, #d4af37 100%)',
                borderRadius: '50%',
                margin: '0 auto 20px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 15px 40px rgba(100, 66, 34, 0.4)',
                position: 'relative'
              }}>
                <span style={{ color: 'white', fontSize: 32 }}>🏨</span>
                <div style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  width: 20,
                  height: 20,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                }}>
                  ✓
                </div>
              </div>
              
              <h1 style={{ 
                fontSize: 42,
                fontWeight: 800,
                color: 'white',
                margin: '0 0 16px 0',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                letterSpacing: '-0.5px'
              }}>
                Phòng đã đặt
              </h1>
              
              <p style={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: 18, 
                margin: 0,
                fontWeight: 500,
                textShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}>
                Danh sách các phòng bạn đã đặt
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 0',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ 
              display: 'inline-block',
              width: 50,
              height: 50,
              border: `4px solid rgba(255,255,255,0.3)`,
              borderTop: `4px solid white`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ 
              marginTop: 20, 
              color: 'white', 
              fontSize: 16,
              fontWeight: 500
            }}>
              Đang tải danh sách đặt phòng...
            </p>
          </div>
        )}
        
        {error && (
          <div style={{ 
            color: '#ff6b6b', 
            marginBottom: 24,
            background: 'rgba(255, 107, 107, 0.1)',
            backdropFilter: 'blur(10px)',
            padding: 20,
            borderRadius: 16,
            border: '1px solid rgba(255, 107, 107, 0.3)',
            textAlign: 'center',
            fontWeight: 500
          }}>
            {error}
          </div>
        )}
        
        {!loading && bookings.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>📋</div>
            <h3 style={{ color: 'white', marginBottom: 12, fontSize: 24 }}>Chưa có đặt phòng nào</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>
              Bạn chưa đặt phòng nào. Hãy khám phá các phòng khách sạn tuyệt vời của chúng tôi!
            </p>
          </div>
        )}

        {/* Bookings List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
                className="slide-in"
              style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 24,
                  padding: 32,
                  boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-5px)';
                  e.target.style.boxShadow = '0 20px 50px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                  Mã đặt phòng: {bookingCode}
                </div>
                <div style={{ 
                    padding: '8px 16px', 
                  borderRadius: 20, 
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 700,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}>
                  {getStatusText(b.status)}
                </div>
              </div>
              
                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: 'white', marginBottom: 8, fontSize: 16, fontWeight: 600, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                  <strong>Phòng:</strong> {roomCode} - {roomType}
                </div>
                {b.roomCapacity && (
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, marginBottom: 8 }}>
                    Sức chứa: {b.roomCapacity} khách
                  </div>
                )}
              </div>
              
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
                <div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 4 }}>Ngày nhận phòng</div>
                    <div style={{ fontWeight: 600, color: 'white', fontSize: 16, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{formatDate(b.checkIn)}</div>
                </div>
                <div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 4 }}>Ngày trả phòng</div>
                    <div style={{ fontWeight: 600, color: 'white', fontSize: 16, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{formatDate(b.checkOut)}</div>
                </div>
                <div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 4 }}>Số khách</div>
                    <div style={{ fontWeight: 600, color: 'white', fontSize: 16, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{b.guests || 'N/A'} người</div>
                </div>
                {b.totalPrice != null && (
                  <div>
                      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 4 }}>Tổng tiền</div>
                      <div style={{ fontWeight: 700, color: '#d4af37', fontSize: 18, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                      {Number(b.totalPrice).toLocaleString('vi-VN')} VND
                    </div>
                  </div>
                )}
              </div>
              
              {b.notes && (
                  <div style={{ marginBottom: 16, padding: 16, background: 'rgba(255,255,255,0.1)', borderRadius: 12, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 8, fontWeight: 500 }}>Ghi chú:</div>
                    <div style={{ color: 'white', fontSize: 15, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{b.notes}</div>
                </div>
              )}
              
              {b.createdAt && (
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 16, fontStyle: 'italic' }}>
                  Đặt phòng lúc: {new Date(b.createdAt).toLocaleString('vi-VN')}
                </div>
              )}
              
                <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
                  <Link 
                    to={`/my-bookings/${b.bookingId}`}
                    style={{ 
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: 14,
                      fontWeight: 600,
                      padding: '10px 20px',
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: 12,
                      border: '1px solid rgba(255,255,255,0.3)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.3)';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.2)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    📋 Xem chi tiết
                  </Link>
                  {roomDetailHref && (
                    <a 
                      href={roomDetailHref} 
                      style={{ 
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: 14,
                        fontWeight: 600,
                        padding: '10px 20px',
                        background: 'rgba(16, 185, 129, 0.2)',
                        borderRadius: 12,
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(16, 185, 129, 0.3)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(16, 185, 129, 0.2)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      🏨 Xem phòng
                  </a>
                )}
                {b.status?.toLowerCase() === 'pending' && (
                  <button
                    style={{
                        color: 'white',
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                      fontSize: 14,
                        fontWeight: 600,
                      cursor: cancelling[b.bookingId] ? 'not-allowed' : 'pointer',
                        padding: '10px 20px',
                        borderRadius: 12,
                        opacity: cancelling[b.bookingId] ? 0.6 : 1,
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                    }}
                    disabled={cancelling[b.bookingId]}
                    onClick={() => {
                      if (window.confirm('Bạn có chắc chắn muốn hủy đặt phòng này?')) {
                        handleCancelBooking(b.bookingId);
                      }
                    }}
                      onMouseEnter={(e) => {
                        if (!cancelling[b.bookingId]) {
                          e.target.style.background = 'rgba(239, 68, 68, 0.3)';
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.2)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!cancelling[b.bookingId]) {
                          e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
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
    </div>
  );
};

export default MyBookings;



