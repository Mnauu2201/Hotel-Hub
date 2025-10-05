import React from 'react';

const RoomCard = ({ room, onBook }) => {
  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '1rem',
      margin: '0.5rem',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>
        Phòng {room.roomNumber}
      </h3>
      <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
        Loại: {room.roomType?.name || 'N/A'}
      </p>
      <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
        Sức chứa: {room.capacity} người
      </p>
      <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
        Mô tả: {room.description}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#059669' }}>
          {room.price?.toLocaleString()} VNĐ/đêm
        </span>
        <button
          onClick={() => onBook(room)}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Đặt phòng
        </button>
      </div>
    </div>
  );
};

export default RoomCard;