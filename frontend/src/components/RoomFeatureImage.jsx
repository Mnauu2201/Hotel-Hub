import React from 'react';

const RoomFeatureImage = ({ text, icon, backgroundColor = '#1e3a8a', textColor = 'white', imageUrl, isSelected = false, onClick }) => {
  return (
    <div
      style={{
        width: 80,
        height: 60,
        borderRadius: 8,
        background: imageUrl ? 'transparent' : backgroundColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: isSelected ? '2px solid #644222' : '2px solid transparent',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isSelected ? '0 2px 8px rgba(100, 66, 34, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
      }}
      onClick={onClick}
      onMouseOver={(e) => {
        e.target.style.borderColor = '#644222';
        e.target.style.transform = 'scale(1.05)';
        e.target.style.boxShadow = '0 4px 12px rgba(100, 66, 34, 0.4)';
      }}
      onMouseOut={(e) => {
        e.target.style.borderColor = isSelected ? '#644222' : 'transparent';
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = isSelected ? '0 2px 8px rgba(100, 66, 34, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)';
      }}
    >
      {/* Background Image */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={text}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            transition: 'transform 0.3s ease'
          }}
        />
      )}
    </div>
  );
};

export default RoomFeatureImage;
