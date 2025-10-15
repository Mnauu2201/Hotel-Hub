import React from 'react';
import RoomFeatureImage from './RoomFeatureImage';
import roomImg03 from '../assets/img/gallery/room-img03.png';
import roomImg04 from '../assets/img/gallery/room-img04.png';
import roomImg05 from '../assets/img/gallery/room-img05.png';

const RoomImageDemo = () => {
  return (
    <div style={{ padding: 20, background: '#f5f5f5' }}>
      <h2>Demo Gallery Ảnh Phòng</h2>
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <RoomFeatureImage 
          text="KÉO DÀI THỜI GIAN" 
          icon="⏰"
          backgroundColor="#1e3a8a"
          imageUrl={roomImg03}
          isSelected={false}
        />
        <RoomFeatureImage 
          text="SIÊU CHÂN THẬT" 
          icon="✨"
          backgroundColor="#059669"
          imageUrl={roomImg04}
          isSelected={true}
        />
        <RoomFeatureImage 
          text="TIỆN NGHI CAO CẤP" 
          icon="🏨"
          backgroundColor="#dc2626"
          imageUrl={roomImg05}
          isSelected={false}
        />
      </div>
    </div>
  );
};

export default RoomImageDemo;

