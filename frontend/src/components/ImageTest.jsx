import React from 'react';
import fallbackRoomImg from '../assets/img/gallery/room-img01.png';
import roomImg02 from '../assets/img/gallery/room-img02.png';
import roomImg03 from '../assets/img/gallery/room-img03.png';

const ImageTest = () => {
  const testImages = [
    { src: fallbackRoomImg, alt: 'Room 1' },
    { src: roomImg02, alt: 'Room 2' },
    { src: roomImg03, alt: 'Room 3' }
  ];

  return (
    <div style={{ padding: 20, background: '#f5f5f5' }}>
      <h2>Test Ảnh</h2>
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        {testImages.map((image, index) => (
          <div key={index} style={{ width: 100, height: 80, border: '1px solid #ccc' }}>
            <img 
              src={image.src} 
              alt={image.alt}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageTest;
