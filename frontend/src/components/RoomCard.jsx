import React from 'react';
import sveIcon1 from '../assets/img/icon/sve-icon1.png';
import sveIcon2 from '../assets/img/icon/sve-icon2.png';
import sveIcon3 from '../assets/img/icon/sve-icon3.png';
import sveIcon4 from '../assets/img/icon/sve-icon4.png';
import sveIcon5 from '../assets/img/icon/sve-icon5.png';
import sveIcon6 from '../assets/img/icon/sve-icon6.png';

const RoomCard = ({ room, onBook }) => {
  return (
    <div style={{
      border: '1px solid #eee',
      borderRadius: 12,
      padding: '1rem',
      margin: '0.5rem',
      backgroundColor: 'white',
      boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
      height: '100%',
      minHeight: 480,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>
        Số phòng {room.roomNumber || room.room_number}
      </h3>
      <div style={{ flexGrow: 1 }}>
        {/* Room Image */}
        <div style={{ 
          width: '100%', 
          height: 200, 
          backgroundColor: '#f3f4f6', 
          borderRadius: 8, 
          marginBottom: '1rem',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <img 
            src={room.images?.[0]?.imageUrl?.startsWith('/uploads/') 
              ? `http://localhost:8080${room.images[0].imageUrl}` 
              : room.images?.[0]?.imageUrl || '/src/assets/img/gallery/room-img01.png'} 
            alt={`Phòng ${room.roomNumber}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.target.src = '/src/assets/img/gallery/room-img01.png';
            }}
          />
        </div><p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
          Loại phòng: {room.roomTypeName || room.type || room.roomType?.name || 'N/A'}
        </p>
        <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
          Sức chứa: {room.capacity} người
        </p>
        {room.roomDetail && (
          <div style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
            {room.roomDetail.bedType && (
              <div>Giường: {room.roomDetail.bedType}</div>
            )}
            {room.roomDetail.roomSize && (
              <div>Diện tích: {room.roomDetail.roomSize} m²</div>
            )}
            {room.roomDetail.viewType && (
              <div>Tầm nhìn: {room.roomDetail.viewType}</div>
            )}
          </div>
        )}
        <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
          Mô tả: {room.description}
        </p>
        {/* Clamp description to 3 lines for equal height */}
        <div style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          color: '#6b7280',
          marginBottom: '0.5rem'
        }}>
          {room.description}
        </div>
        {Array.isArray(room.amenities) && room.amenities.length > 0 && (
          <div style={{ margin: '0 0 0.5rem 0' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {room.amenities.slice(0, 8).map((a) => {
                const name = (a.name || '').toLowerCase();
                let icon = sveIcon1;
                if (name.includes('wifi')) icon = sveIcon3;
                else if (name.includes('điều hòa') || name.includes('air')) icon = sveIcon4;
                else if (name.includes('minibar')) icon = sveIcon5;
                else if (name.includes('ban công') || name.includes('balcony')) icon = sveIcon2;
                else if (name.includes('biển') || name.includes('ocean') || name.includes('sea')) icon = sveIcon6;
                else if (name.includes('thú cưng') || name.includes('pet')) icon = sveIcon1;
                else if (name.includes('hút thuốc') || name.includes('smok')) icon = sveIcon4;
                return (
                  <li key={a.amenityId || a.name} title={a.name} style={{ width: 28, height: 28 }}>
                    <img src={icon} alt={a.name} style={{ width: 28, height: 28 }} />
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#8a643f' }}>
          {(room.price?.toLocaleString?.() || room.price)?.toString()} VNĐ/đêm
        </span>
        <button
          onClick={() => onBook(room)}
          style={{
            backgroundColor: '#644222',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: 8,
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