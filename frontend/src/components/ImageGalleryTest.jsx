import React, { useState } from 'react';
import fallbackRoomImg from '../assets/img/gallery/room-img01.png';
import roomImg02 from '../assets/img/gallery/room-img02.png';
import roomImg03 from '../assets/img/gallery/room-img03.png';
import roomImg04 from '../assets/img/gallery/room-img04.png';
import roomImg05 from '../assets/img/gallery/room-img05.png';
import roomImg06 from '../assets/img/gallery/room-img06.png';
import portfolioImg01 from '../assets/img/gallery/protfolio-img01.png';
import portfolioImg02 from '../assets/img/gallery/protfolio-img02.png';
import portfolioImg03 from '../assets/img/gallery/protfolio-img03.png';
import portfolioImg04 from '../assets/img/gallery/protfolio-img04.png';
import portfolioImg05 from '../assets/img/gallery/protfolio-img05.png';
import portfolioImg06 from '../assets/img/gallery/protfolio-img06.png';

const ImageGalleryTest = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Test images - using different images for each
  const testImages = [
    { imageUrl: fallbackRoomImg },
    { imageUrl: roomImg02 },
    { imageUrl: roomImg03 },
    { imageUrl: roomImg04 }
  ];

  return (
    <div style={{ padding: 20, background: '#f5f5f5' }}>
      <h2>Test Gallery Ảnh Phòng</h2>
      
      {/* Main Image */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ 
          width: '100%', 
          height: 300, 
          borderRadius: 12, 
          overflow: 'hidden',
          position: 'relative',
          background: '#f5f5f5'
        }}>
          <img 
            src={testImages[selectedImageIndex]?.imageUrl || fallbackRoomImg} 
            alt="Room main" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
          />
          <div style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: 16,
            fontSize: 12,
            fontWeight: 600
          }}>
            {testImages.length} ảnh
          </div>
        </div>
      </div>
      
      {/* Thumbnail Gallery */}
      <div style={{ 
        display: 'flex', 
        gap: 8, 
        overflowX: 'auto',
        paddingBottom: 4,
        scrollbarWidth: 'thin'
      }}>
        {testImages.map((image, imgIndex) => (
          <div 
            key={imgIndex}
            style={{ 
              minWidth: 80, 
              height: 60, 
              borderRadius: 8, 
              overflow: 'hidden',
              cursor: 'pointer',
              border: imgIndex === selectedImageIndex ? '2px solid #644222' : '2px solid transparent',
              transition: 'border-color 0.2s ease'
            }}
            onClick={() => setSelectedImageIndex(imgIndex)}
            onMouseOver={(e) => e.target.style.borderColor = '#644222'}
            onMouseOut={(e) => e.target.style.borderColor = imgIndex === selectedImageIndex ? '#644222' : 'transparent'}
          >
            <img 
              src={image.imageUrl || fallbackRoomImg} 
              alt={`Room ${imgIndex + 1}`}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transition: 'transform 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            />
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: 20, fontSize: 14, color: '#666' }}>
        <p>✅ Ảnh chính: {selectedImageIndex + 1}</p>
        <p>✅ Click thumbnail để thay đổi ảnh chính</p>
        <p>✅ Hover để xem hiệu ứng</p>
      </div>
    </div>
  );
};

export default ImageGalleryTest;
