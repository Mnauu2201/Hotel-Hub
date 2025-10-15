import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import RoomCard from '../components/RoomCard';
import BookingForm from '../components/BookingForm';

const RoomsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  // Lấy thông tin đặt phòng đang tiến hành (nếu có)
  const bookingInProgress = location.state?.bookingInProgress || false;
  const selectedRooms = location.state?.selectedRooms || [];

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms');
      setRooms(response.data?.rooms || []);
    } catch (error) {
      console.error('Lỗi khi tải phòng:', error);
      alert('Không thể tải danh sách phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = (room) => {
    if (bookingInProgress) {
      // Nếu đang trong quá trình đặt nhiều phòng, thêm phòng vào danh sách và quay lại trang đặt phòng
      const updatedSelectedRooms = [...selectedRooms, room];
      navigate('/booking', { state: { selectedRooms: updatedSelectedRooms } });
    } else {
      // Chuyển đến trang đặt phòng với thông tin phòng đã chọn
      navigate('/booking', { state: { room } });
    }
  };

  const handleSubmitBooking = async (bookingData) => {
    try {
      const response = await api.post('/bookings/guest', bookingData);
      alert('Đặt phòng thành công! Mã booking: ' + response.data.booking.bookingReference);
      setShowBookingForm(false);
      setSelectedRoom(null);
    } catch (error) {
      console.error('Lỗi khi đặt phòng:', error);
      alert('Đặt phòng thất bại: ' + (error.response?.data?.message || 'Lỗi không xác định'));
    }
  };

  const handleCancelBooking = () => {
    setShowBookingForm(false);
    setSelectedRoom(null);
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Đang tải danh sách phòng...</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Hero / Breadcrumb-like header */}
      <section
        className="p-relative"
        style={{
          position: 'relative',
          paddingTop: 120,
          paddingBottom: 32,
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb'
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 text-center">
              <div style={{ maxWidth: 760, margin: '0 auto' }}>
                <h1 className="mb-10" style={{ color: '#1f2937', fontWeight: 800, fontSize: 32, letterSpacing: .2 }}>Phòng của chúng tôi</h1>
                <p style={{ color: '#6b7280', fontSize: 15 }}>Khám phá các phòng nghỉ sang trọng và tiện nghi</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main content */}
      <section className="booking pt-60 pb-120 p-relative">
        <div className="container" style={{ maxWidth: 1200 }}>
          <div className="row justify-content-center">
            <div className="col-12">
              {bookingInProgress && (
                <div className="contact-bg02" style={{ 
                  background: '#fff', 
                  border: '1px solid #ececec', 
                  borderRadius: 14, 
                  padding: 20, 
                  marginBottom: 24, 
                  boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
                  borderLeft: '4px solid #1890ff'
                }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h4 style={{ margin: 0, color: '#1890ff', fontSize: 18, fontWeight: 700 }}>
                        Đang chọn phòng để đặt ({selectedRooms.length} phòng đã chọn)
                      </h4>
                      <p style={{ margin: '8px 0 0 0', color: '#6b7280', fontSize: 14 }}>
                        Chọn thêm phòng hoặc quay lại trang đặt phòng để hoàn tất
                      </p>
                    </div>
                    <button 
                      onClick={() => navigate('/booking', { state: { selectedRooms } })}
                      className="btn ss-btn"
                      style={{ background: '#1890ff', borderColor: '#1890ff' }}
                    >
                      <i className="fas fa-arrow-left mr-2"></i> Quay lại trang đặt phòng
                    </button>
                  </div>
                </div>
              )}
              
              <div className="row" style={{ rowGap: 24 }}>
                {rooms.map(room => (
                  <div key={room.roomId || room.id} className="col-xl-4 col-md-6 col-lg-4">
                    <RoomCard
                      room={room}
                      onBook={handleBookRoom}
                    />
                  </div>
                ))}
              </div>
              
              {rooms.length === 0 && !loading && (
                <div className="text-center" style={{ padding: '60px 0' }}>
                  <div className="mx-auto mb-3" style={{ width: 80, height: 80, background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-bed" style={{ fontSize: 32, color: '#9ca3af' }}></i>
                  </div>
                  <h3 style={{ color: '#6b7280', marginBottom: 8 }}>Không có phòng nào</h3>
                  <p style={{ color: '#9ca3af' }}>Hiện tại không có phòng nào khả dụng</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {showBookingForm && selectedRoom && (
        <BookingForm
          room={selectedRoom}
          onSubmit={handleSubmitBooking}
          onCancel={handleCancelBooking}
        />
      )}
    </div>
  );
};

export default RoomsPage;