import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import bookingService from '../services/bookingService';
import fallbackRoomImg from '../assets/img/gallery/room-img01.png';

const MyBookingsDetail = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  
  const [booking, setBooking] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const themeColor = '#644222';
  const themeBgLight = '#faf7f2';
  const themeAccent = '#8a643f';

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Debug: Log user info
        console.log('🔍 User context in MyBookingsDetail:', {
          user: user,
          userPhone: user?.phone,
          userEmail: user?.email,
          userName: user?.name
        });
        
        // Fetch booking detail by ID
        const response = await bookingService.getBookingById(bookingId);
        console.log('Booking detail response:', response);
        
        if (response?.booking) {
          setBooking(response.booking);
          
          // Fetch room details if roomId exists
          if (response.booking.roomId) {
            try {
              const roomResponse = await bookingService.getRoomById(response.booking.roomId);
              console.log('Room detail response:', roomResponse);
              setRoom(roomResponse);
            } catch (roomErr) {
              console.error('Error fetching room details:', roomErr);
              // Continue without room details
            }
          }
          
          // Set edit data with user info from context (not from booking)
          setEditData({
            guestName: user?.name || '',
            guestEmail: user?.email || '',
            guestPhone: user?.phone || '',
            notes: response.booking.notes || ''
          });
        } else {
          setError('Không tìm thấy thông tin đặt phòng');
        }
      } catch (err) {
        console.error('Error fetching booking detail:', err);
        setError('Không thể tải thông tin đặt phòng');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetail();
    }
  }, [bookingId, user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      guestName: user?.name || '',
      guestEmail: user?.email || '',
      guestPhone: user?.phone || '',
      notes: booking?.notes || ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      
      // Tạm thời vô hiệu hóa chức năng cập nhật vì backend chưa có endpoint
      alert('Chức năng cập nhật thông tin đặt phòng đang được phát triển. Vui lòng liên hệ admin để được hỗ trợ.');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating booking:', err);
      alert('Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đặt phòng này?')) {
      return;
    }

    try {
      setCancelling(true);
      await bookingService.cancelBooking(bookingId);
      
      // Refresh booking data
      const response = await bookingService.getBookingById(bookingId);
      if (response?.booking) {
        setBooking(response.booking);
      }
      
      alert('Hủy đặt phòng thành công!');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Hủy đặt phòng thất bại. Vui lòng thử lại.');
    } finally {
      setCancelling(false);
    }
  };

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
      case 'pending': return 'Chờ duyệt';
      case 'confirmed': return 'Đã xác nhận';
      case 'cancelled': return 'Đã hủy';
      case 'completed': return 'Hoàn thành';
      default: return status || 'N/A';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN');
    } catch {
      return dateStr;
    }
  };

  const calculateNights = () => {
    if (!booking?.checkIn || !booking?.checkOut) return 0;
    const start = new Date(booking.checkIn);
    const end = new Date(booking.checkOut);
    const diffMs = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 120, paddingBottom: 40, textAlign: 'center' }}>
        <div>Đang tải thông tin đặt phòng...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: 120, paddingBottom: 40 }}>
        <div style={{ color: '#ef4444', textAlign: 'center' }}>
          <h3>Lỗi</h3>
          <p>{error}</p>
          <Link to="/my-bookings" className="btn" style={{ background: themeColor, color: 'white' }}>
            Quay lại danh sách đặt phòng
          </Link>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container" style={{ paddingTop: 120, paddingBottom: 40 }}>
        <div style={{ textAlign: 'center' }}>
          <h3>Không tìm thấy thông tin đặt phòng</h3>
          <Link to="/my-bookings" className="btn" style={{ background: themeColor, color: 'white' }}>
            Quay lại danh sách đặt phòng
          </Link>
        </div>
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
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            
            {/* Header Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              borderRadius: 32,
              padding: 50,
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
                {/* Back Button */}
                <div style={{ marginBottom: 40 }}>
                  <Link 
                    to="/my-bookings" 
                    className="slide-in"
                    style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 12,
                      color: 'rgba(255,255,255,0.9)',
                      textDecoration: 'none',
                      fontSize: 16,
                      fontWeight: 600,
                      padding: '12px 24px',
                      borderRadius: 20,
                      background: 'rgba(255,255,255,0.1)',
                      transition: 'all 0.4s ease',
                      border: '1px solid rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.2)';
                      e.target.style.color = '#fff';
                      e.target.style.transform = 'translateX(-5px) scale(1.05)';
                      e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.1)';
                      e.target.style.color = 'rgba(255,255,255,0.9)';
                      e.target.style.transform = 'translateX(0) scale(1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <span style={{ fontSize: 20 }}>←</span>
                    Quay lại danh sách
                  </Link>
                </div>

                {/* Title Section */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                  <div className="float-animation pulse-animation" style={{
                    width: 80,
                    height: 80,
                    background: 'linear-gradient(135deg, #644222 0%, #8a643f 50%, #d4af37 100%)',
                    borderRadius: '50%',
                    margin: '0 auto 30px auto',
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
                    Chi tiết đặt phòng
                  </h1>
                  
                  <p style={{ 
                    color: 'rgba(255,255,255,0.8)', 
                    fontSize: 18, 
                    margin: '0 0 30px 0',
                    fontWeight: 500,
                    textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                  }}>
                    Thông tin chi tiết về đặt phòng của bạn
                  </p>
                </div>

                {/* Booking ID Card */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: 24,
                  padding: 30,
                  border: '1px solid rgba(255,255,255,0.2)',
                  textAlign: 'center',
                  position: 'relative',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '8px 20px',
                    borderRadius: 20,
                    fontSize: 14,
                    fontWeight: 700,
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
                    letterSpacing: '1px'
                  }}>
                    MÃ ĐẶT PHÒNG
                  </div>
                  
                  <div style={{ marginTop: 12 }}>
                    <span style={{
                      background: 'linear-gradient(135deg, #644222 0%, #8a643f 50%, #d4af37 100%)',
                      color: 'white',
                      padding: '16px 32px',
                      borderRadius: 20,
                      fontSize: 20,
                      fontWeight: 800,
                      fontFamily: 'monospace',
                      letterSpacing: '2px',
                      boxShadow: '0 10px 30px rgba(100, 66, 34, 0.4)',
                      display: 'inline-block',
                      textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                    }}>
                      {booking.bookingReference || booking.bookingId}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Status Card */}
              <div 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.3)', 
                  borderRadius: 24, 
                  padding: 32,
                  boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, color: 'white', fontSize: 20, fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                      Trạng thái đặt phòng
                    </h3>
                    <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: 500 }}>
                      {booking.status?.toLowerCase() === 'pending' 
                        ? 'Đặt phòng đang chờ admin duyệt' 
                        : 'Thông tin chi tiết đặt phòng'
                      }
                    </p>
                  </div>
                  <div 
                    style={{ 
                      padding: '12px 24px', 
                      borderRadius: 25, 
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontSize: 16,
                      fontWeight: 700,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                      textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                    }}
                  >
                    {getStatusText(booking.status)}
                  </div>
                </div>
              </div>

              {/* Room Information */}
              <div 
                className="mb-4" 
                style={{ 
                  background: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: 12, 
                  padding: 24,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <h3 style={{ margin: '0 0 20px 0', color: '#1f2937', fontSize: 18, fontWeight: 700 }}>
                  Thông tin phòng
                </h3>
                
                <div className="row">
                  <div className="col-md-4">
                    <div style={{ marginBottom: 16 }}>
                      <img 
                        src={room?.images?.[0]?.imageUrl || booking.room?.images?.[0]?.imageUrl || fallbackRoomImg} 
                        alt="Room" 
                        style={{ 
                          width: '100%', 
                          height: 200, 
                          objectFit: 'cover', 
                          borderRadius: 8 
                        }} 
                      />
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div style={{ display: 'grid', gap: '12px' }}>
                      <div>
                        <span style={{ color: '#6b7280', fontSize: 14 }}>Số phòng:</span>
                        <span style={{ marginLeft: 8, fontWeight: 600, color: '#1f2937' }}>
                          {room?.roomNumber || booking.roomNumber || booking.room?.roomNumber || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280', fontSize: 14 }}>Loại phòng:</span>
                        <span style={{ marginLeft: 8, fontWeight: 600, color: '#1f2937' }}>
                          {room?.roomTypeName || booking.roomTypeName || booking.room?.roomTypeName || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280', fontSize: 14 }}>Mô tả phòng:</span>
                        <p style={{ margin: '4px 0 0 0', color: '#1f2937', fontSize: 14 }}>
                          {room?.description || booking.room?.description || 'Phòng sang trọng với đầy đủ tiện nghi hiện đại'}
                        </p>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280', fontSize: 14 }}>Sức chứa:</span>
                        <span style={{ marginLeft: 8, fontWeight: 600, color: '#1f2937' }}>
                          {room?.capacity || booking.room?.capacity || booking.roomCapacity || 'N/A'} khách
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280', fontSize: 14 }}>Giá phòng/đêm:</span>
                        <span style={{ marginLeft: 8, fontWeight: 600, color: themeAccent, fontSize: 16 }}>
                          {(room?.price || booking.room?.price || booking.price || 0).toLocaleString('vi-VN')} VND
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div 
                className="mb-4" 
                style={{ 
                  background: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: 12, 
                  padding: 24,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ margin: 0, color: '#1f2937', fontSize: 18, fontWeight: 700 }}>
                    Chi tiết đặt phòng
                  </h3>
                  {!isEditing && (booking.status?.toLowerCase() === 'pending' || booking.status?.toLowerCase() === 'confirmed') && (
                    <button
                      onClick={handleEdit}
                      style={{
                        background: themeColor,
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: 6,
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                    >
                      ✏️ Sửa thông tin
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div>
                    <div className="row" style={{ rowGap: 16 }}>
                      <div className="col-md-6">
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                          Họ và tên *
                        </label>
                        <input
                          type="text"
                          name="guestName"
                          value={editData.guestName}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: 6,
                            fontSize: 14
                          }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                          Email *
                        </label>
                        <input
                          type="email"
                          name="guestEmail"
                          value={editData.guestEmail}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: 6,
                            fontSize: 14
                          }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                          Số điện thoại *
                        </label>
                        <input
                          type="tel"
                          name="guestPhone"
                          value={editData.guestPhone}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: 6,
                            fontSize: 14
                          }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                          Số khách
                        </label>
                        <input
                          type="number"
                          value={booking.guests || 1}
                          disabled
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: 6,
                            fontSize: 14,
                            background: '#f9fafb'
                          }}
                        />
                      </div>
                      <div className="col-12">
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                          Ghi chú đặc biệt
                        </label>
                        <textarea
                          name="notes"
                          value={editData.notes}
                          onChange={handleInputChange}
                          rows={3}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: 6,
                            fontSize: 14,
                            resize: 'vertical'
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
                      <button
                        onClick={handleSaveEdit}
                        disabled={saving}
                        style={{
                          background: themeColor,
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: 6,
                          fontSize: 14,
                          fontWeight: 500,
                          cursor: saving ? 'not-allowed' : 'pointer',
                          opacity: saving ? 0.6 : 1
                        }}
                      >
                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={saving}
                        style={{
                          background: '#6b7280',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: 6,
                          fontSize: 14,
                          fontWeight: 500,
                          cursor: saving ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="row" style={{ rowGap: 16 }}>
                    <div className="col-md-6">
                      <div>
                        <span style={{ color: '#6b7280', fontSize: 14 }}>Họ và tên:</span>
                        <div style={{ fontWeight: 600, color: '#1f2937', marginTop: 4 }}>
                          {user?.name || booking.guestName || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div>
                        <span style={{ color: '#6b7280', fontSize: 14 }}>Email:</span>
                        <div style={{ fontWeight: 600, color: '#1f2937', marginTop: 4 }}>
                          {user?.email || booking.guestEmail || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div>
                        <span style={{ color: '#6b7280', fontSize: 14 }}>Số điện thoại:</span>
                        <div style={{ fontWeight: 600, color: '#1f2937', marginTop: 4 }}>
                          {user?.phone || booking.guestPhone || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div>
                        <span style={{ color: '#6b7280', fontSize: 14 }}>Số khách:</span>
                        <div style={{ fontWeight: 600, color: '#1f2937', marginTop: 4 }}>
                          {booking.guests || 'N/A'} người
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div>
                        <span style={{ color: '#6b7280', fontSize: 14 }}>Ngày nhận phòng:</span>
                        <div style={{ fontWeight: 600, color: '#1f2937', marginTop: 4 }}>
                          {formatDate(booking.checkIn)}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div>
                        <span style={{ color: '#6b7280', fontSize: 14 }}>Ngày trả phòng:</span>
                        <div style={{ fontWeight: 600, color: '#1f2937', marginTop: 4 }}>
                          {formatDate(booking.checkOut)}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div>
                        <span style={{ color: '#6b7280', fontSize: 14 }}>Số đêm ở:</span>
                        <div style={{ fontWeight: 600, color: '#1f2937', marginTop: 4 }}>
                          {calculateNights()} đêm
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div>
                        <span style={{ color: '#6b7280', fontSize: 14 }}>Tổng tiền:</span>
                        <div style={{ fontWeight: 600, color: themeAccent, marginTop: 4, fontSize: 18 }}>
                          {(booking.totalPrice || 0).toLocaleString('vi-VN')} VND
                        </div>
                      </div>
                    </div>
                    {booking.notes && (
                      <div className="col-12">
                        <div>
                          <span style={{ color: '#6b7280', fontSize: 14 }}>Ghi chú đặc biệt:</span>
                          <div style={{ 
                            fontWeight: 600, 
                            color: '#1f2937', 
                            marginTop: 4,
                            padding: 12,
                            background: '#f9fafb',
                            borderRadius: 6,
                            border: '1px solid #e5e7eb'
                          }}>
                            {booking.notes}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div 
                style={{ 
                  background: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: 12, 
                  padding: 24,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <h3 style={{ margin: '0 0 20px 0', color: '#1f2937', fontSize: 18, fontWeight: 700 }}>
                  Thao tác
                </h3>
                
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {(booking.status?.toLowerCase() === 'pending' || booking.status?.toLowerCase() === 'confirmed') && (
                    <button
                      onClick={handleCancelBooking}
                      disabled={cancelling}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: 6,
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: cancelling ? 'not-allowed' : 'pointer',
                        opacity: cancelling ? 0.6 : 1
                      }}
                    >
                      {cancelling ? '⏳ Đang hủy...' : '❌ Hủy đặt phòng'}
                    </button>
                  )}
                  
                  <Link
                    to="/my-bookings"
                    style={{
                      background: '#6b7280',
                      color: 'white',
                      textDecoration: 'none',
                      padding: '12px 24px',
                      borderRadius: 6,
                      fontSize: 14,
                      fontWeight: 500,
                      display: 'inline-block'
                    }}
                  >
                    📋 Danh sách đặt phòng
                  </Link>
                  
                  {isAdmin && booking.status?.toLowerCase() === 'pending' && (
                    <button
                      style={{
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: 6,
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                    >
                      ✅ Duyệt đặt phòng
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookingsDetail;
