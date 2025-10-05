import React, { useState, useEffect } from 'react';
import api from '../services/api';
import RoomCard from '../components/RoomCard';
import BookingForm from '../components/BookingForm';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/bookings/rooms');
      setRooms(response.data.rooms || []);
    } catch (error) {
      console.error('Lỗi khi tải phòng:', error);
      alert('Không thể tải danh sách phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = (room) => {
    setSelectedRoom(room);
    setShowBookingForm(true);
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
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '1rem' 
      }}>
        {rooms.map(room => (
          <RoomCard
            key={room.roomId}
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