import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1f2937' }}>
        🏨 Chào mừng đến với HotelHub
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#6b7280' }}>
        Khách sạn hiện đại với dịch vụ tốt nhất
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link
          to="/rooms"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          Xem phòng
        </Link>
        <Link
          to="/booking"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#10b981',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          Đặt phòng ngay
        </Link>
      </div>
    </div>
  );
};

export default HomePage;