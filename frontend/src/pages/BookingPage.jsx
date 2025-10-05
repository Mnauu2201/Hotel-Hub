import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingPage = () => {
  const navigate = useNavigate();
  const [bookingReference, setBookingReference] = useState('');
  const [email, setEmail] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearchByReference = async () => {
    if (!bookingReference) {
      alert('Vui lòng nhập mã booking');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/bookings/guest/${bookingReference}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResult(data);
      } else {
        alert('Không tìm thấy booking với mã này');
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error);
      alert('Lỗi khi tìm kiếm booking');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByEmail = async () => {
    if (!email) {
      alert('Vui lòng nhập email');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/bookings/guest/email/${email}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResult(data);
      } else {
        alert('Không tìm thấy booking với email này');
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error);
      alert('Lỗi khi tìm kiếm booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
        🔍 Tra cứu booking
      </h1>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          Tìm kiếm theo mã booking
        </h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Nhập mã booking (VD: BK123456)"
            value={bookingReference}
            onChange={(e) => setBookingReference(e.target.value)}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px'
            }}
          />
          <button
            onClick={handleSearchByReference}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Đang tìm...' : 'Tìm kiếm'}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          Tìm kiếm theo email
        </h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px'
            }}
          />
          <button
            onClick={handleSearchByEmail}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Đang tìm...' : 'Tìm kiếm'}
          </button>
        </div>
      </div>

      {searchResult && (
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Kết quả tìm kiếm:</h3>
          {Array.isArray(searchResult.bookings) ? (
            <div>
              <p>Tìm thấy {searchResult.count} booking:</p>
              {searchResult.bookings.map((booking, index) => (
                <div key={index} style={{
                  backgroundColor: 'white',
                  padding: '1rem',
                  margin: '0.5rem 0',
                  borderRadius: '4px',
                  border: '1px solid #e5e7eb'
                }}>
                  <p><strong>Mã booking:</strong> {booking.bookingReference}</p>
                  <p><strong>Phòng:</strong> {booking.roomNumber}</p>
                  <p><strong>Ngày nhận:</strong> {booking.checkIn}</p>
                  <p><strong>Ngày trả:</strong> {booking.checkOut}</p>
                  <p><strong>Trạng thái:</strong> {booking.status}</p>
                  <p><strong>Tổng tiền:</strong> {booking.totalPrice?.toLocaleString()} VNĐ</p>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <p><strong>Mã booking:</strong> {searchResult.bookingReference}</p>
              <p><strong>Phòng:</strong> {searchResult.roomNumber}</p>
              <p><strong>Ngày nhận:</strong> {searchResult.checkIn}</p>
              <p><strong>Ngày trả:</strong> {searchResult.checkOut}</p>
              <p><strong>Trạng thái:</strong> {searchResult.status}</p>
              <p><strong>Tổng tiền:</strong> {searchResult.totalPrice?.toLocaleString()} VNĐ</p>
            </div>
          )}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button
          onClick={() => navigate('/rooms')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
        >
          Đặt phòng mới
        </button>
      </div>
    </div>
  );
};

export default BookingPage;