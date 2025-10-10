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
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
        🏨 Danh sách phòng
      </h1>
      
      {bookingInProgress && (
        <div style={{ 
          marginBottom: '1.5rem', 
          padding: '1rem', 
          backgroundColor: '#e6f7ff', 
          borderRadius: '0.5rem',
          border: '1px solid #91d5ff'
        }}>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Đang chọn phòng để đặt ({selectedRooms.length} phòng đã chọn)</strong>
          </p>
          <button 
            onClick={() => navigate('/booking', { state: { selectedRooms } })}
            style={{
              backgroundColor: '#1890ff',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Quay lại trang đặt phòng
          </button>
        </div>
      )}
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '1rem' 
      }}>
        {rooms.map(room => (
          <RoomCard
            key={room.roomId || room.id}
            room={room}
            onBook={handleBookRoom}
          />
        ))}
      </div>

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