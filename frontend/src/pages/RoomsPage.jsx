import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import bookingService from '../services/bookingService';
import RoomCard from '../components/RoomCard';
import BookingForm from '../components/BookingForm';

const RoomsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState(null);
  const [isSearchResult, setIsSearchResult] = useState(false);
  
  // Lấy thông tin đặt phòng đang tiến hành (nếu có)
  const bookingInProgress = location.state?.bookingInProgress || false;
  const selectedRooms = location.state?.selectedRooms || [];

  useEffect(() => {
    // Check if this is a search result from homepage
    const searchData = location.state?.searchCriteria;
    const storedSearch = localStorage.getItem('searchCriteria');
    
    if (searchData) {
      setSearchCriteria(searchData);
      setIsSearchResult(true);
      fetchAvailableRooms(searchData);
    } else if (storedSearch) {
      const parsedSearch = JSON.parse(storedSearch);
      setSearchCriteria(parsedSearch);
      setIsSearchResult(true);
      fetchAvailableRooms(parsedSearch);
    } else {
      fetchRooms();
    }
  }, [location.state]);

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

  const fetchAvailableRooms = async (criteria) => {
    try {
      setLoading(true);
      const availableRooms = await bookingService.getAvailableRooms(criteria.checkIn, criteria.checkOut);
      
      // Filter rooms by guest capacity if specified
      let filteredRooms = availableRooms;
      if (criteria.guests) {
        filteredRooms = availableRooms.filter(room => 
          room.capacity >= criteria.guests
        );
      }
      
      setRooms(filteredRooms);
    } catch (error) {
      console.error('Lỗi khi tải phòng trống:', error);
      alert('Không thể tải danh sách phòng trống');
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
      // Nếu có thông tin tìm kiếm, truyền vào trang đặt phòng
      const bookingState = { room };
      if (searchCriteria) {
        bookingState.searchCriteria = searchCriteria;
      }
      navigate('/booking', { state: bookingState });
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
        {isSearchResult ? '🔍 Kết quả tìm kiếm phòng' : '🏨 Danh sách phòng'}
      </h1>
      
      {isSearchResult && searchCriteria && (
        <div style={{ 
          marginBottom: '2rem', 
          padding: '1.5rem', 
          backgroundColor: '#f0f9ff', 
          borderRadius: '0.5rem',
          border: '1px solid #0ea5e9'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#0369a1' }}>Thông tin tìm kiếm:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>Ngày nhận phòng:</strong> {formatDate(searchCriteria.checkIn)}
            </div>
            <div>
              <strong>Ngày trả phòng:</strong> {formatDate(searchCriteria.checkOut)}
            </div>
            <div>
              <strong>Số lượng khách:</strong> {searchCriteria.guests} người
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <button 
              onClick={() => {
                localStorage.removeItem('searchCriteria');
                navigate('/rooms');
              }}
              style={{
                backgroundColor: '#0ea5e9',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                marginRight: '1rem'
              }}
            >
              Xem tất cả phòng
            </button>
            <button 
              onClick={() => navigate('/')}
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
            >
              Tìm kiếm lại
            </button>
          </div>
        </div>
      )}
      
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

      {isSearchResult && rooms.length === 0 && !loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          backgroundColor: '#fef3c7', 
          borderRadius: '0.5rem',
          border: '1px solid #f59e0b'
        }}>
          <h3 style={{ color: '#92400e', marginBottom: '1rem' }}>Không tìm thấy phòng phù hợp</h3>
          <p style={{ color: '#92400e', marginBottom: '1.5rem' }}>
            Không có phòng trống phù hợp với tiêu chí tìm kiếm của bạn. 
            Vui lòng thử lại với ngày khác hoặc số lượng khách khác.
          </p>
          <button 
            onClick={() => navigate('/')}
            style={{
              backgroundColor: '#f59e0b',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Tìm kiếm lại
          </button>
        </div>
      )}
      
      {rooms.length > 0 && (
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
      )}

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