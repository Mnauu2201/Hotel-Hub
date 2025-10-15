import React from 'react';
import sveIcon1 from '../assets/img/icon/sve-icon1.png';
import sveIcon2 from '../assets/img/icon/sve-icon2.png';
import sveIcon3 from '../assets/img/icon/sve-icon3.png';
import sveIcon4 from '../assets/img/icon/sve-icon4.png';
import sveIcon5 from '../assets/img/icon/sve-icon5.png';
import sveIcon6 from '../assets/img/icon/sve-icon6.png';
import fallbackRoomImg from '../assets/img/gallery/room-img01.png';
// Import tất cả hình ảnh phòng có sẵn
import roomImg01 from '../assets/img/gallery/room-img01.png';
import roomImg02 from '../assets/img/gallery/room-img02.png';
import roomImg03 from '../assets/img/gallery/room-img03.png';
import roomImg04 from '../assets/img/gallery/room-img04.png';
import roomImg05 from '../assets/img/gallery/room-img05.png';
import roomImg06 from '../assets/img/gallery/room-img06.png';

const RoomCard = ({ room, onBook }) => {
  // Lấy hình ảnh chính của phòng
  const primaryImg = room.images?.find((i) => i.isPrimary)?.imageUrl || room.images?.[0]?.imageUrl;
  
  // Mảng chứa tất cả hình ảnh phòng
  const roomImages = [
    roomImg01, roomImg02, roomImg03, roomImg04, roomImg05, roomImg06
  ];
  
  // Chọn hình ảnh fallback dựa trên số phòng hoặc ID phòng
  const getFallbackImage = (room) => {
    // Ưu tiên dựa trên số phòng
    const roomNumber = room.roomNumber || room.room_number;
    if (roomNumber) {
      // Lấy số cuối của phòng để chọn hình ảnh
      const lastDigit = parseInt(roomNumber.toString().slice(-1));
      return roomImages[lastDigit % roomImages.length];
    }
    
    // Fallback dựa trên ID phòng
    const roomId = room.roomId || room.id;
    if (roomId) {
      const idNumber = parseInt(roomId.toString().slice(-1));
      return roomImages[idNumber % roomImages.length];
    }
    
    // Fallback dựa trên loại phòng
    const roomType = (room.roomTypeName || room.roomType?.name || '').toLowerCase();
    if (roomType.includes('single') || roomType.includes('đơn')) return roomImg01;
    if (roomType.includes('double') || roomType.includes('đôi')) return roomImg02;
    if (roomType.includes('suite') || roomType.includes('sang trọng')) return roomImg03;
    
    return fallbackRoomImg;
  };
  
  const finalImage = primaryImg || getFallbackImage(room);
  
  return (
    <div style={{
      border: '1px solid #eee',
      borderRadius: 12,
      padding: '1rem',
      margin: '0.5rem',
      backgroundColor: 'white',
      boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
      height: '100%',
      minHeight: 520,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Hình ảnh phòng */}
      <div style={{ 
        width: '100%', 
        height: 200, 
        borderRadius: 8, 
        overflow: 'hidden', 
        marginBottom: '1rem',
        position: 'relative'
      }}>
        <img 
          src={finalImage} 
          alt={room.roomTypeName || 'room'} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onError={(e) => {
            e.target.src = getFallbackImage(room);
          }}
        />
        {/* Overlay với giá phòng */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          color: 'white',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
            {(room.price?.toLocaleString?.() || room.price)?.toString()} VNĐ/đêm
          </span>
          <button
            onClick={() => onBook(room)}
            style={{
              backgroundColor: '#644222',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}
          >
            Đặt ngay
          </button>
        </div>
      </div>
      
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>
        Số phòng {room.roomNumber || room.room_number}
      </h3>
      <div style={{ flexGrow: 1 }}>
        <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
          Loại phòng: {room.roomTypeName || room.type || room.roomType?.name || 'N/A'}
        </p>
        <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
          Sức chứa: {room.capacity || room.roomType?.capacity || 'N/A'} người
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
        {/* Clamp description to 2 lines for equal height */}
        <div style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          color: '#6b7280',
          marginBottom: '0.5rem',
          fontSize: '0.9rem',
          lineHeight: '1.4'
        }}>
          {room.description || 'Trải nghiệm không gian sang trọng và tiện nghi.'}
        </div>
        {Array.isArray(room.amenities) && room.amenities.length > 0 && (
          <div style={{ margin: '0 0 0.5rem 0' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {room.amenities.slice(0, 6).map((a) => {
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
                  <li key={a.amenityId || a.name} title={a.name} style={{ width: 24, height: 24 }}>
                    <img src={icon} alt={a.name} style={{ width: 24, height: 24 }} />
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCard;