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
import portfolioImg07 from '../assets/img/gallery/protfolio-img07.png';
import portfolioImg08 from '../assets/img/gallery/protfolio-img08.png';
import portfolioImg09 from '../assets/img/gallery/protfolio-img09.png';
import portfolioImg10 from '../assets/img/gallery/protfolio-img10.png';

const RoomImageShowcase = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const allImages = [
    { name: 'Phòng đơn tiện nghi', src: fallbackRoomImg, category: 'room' },
    { name: 'Góc nhìn phòng', src: roomImg02, category: 'room' },
    { name: 'Phòng đôi view thành phố', src: roomImg03, category: 'room' },
    { name: 'Suite cao cấp', src: roomImg04, category: 'room' },
    { name: 'Phòng family', src: roomImg05, category: 'room' },
    { name: 'Phòng deluxe', src: roomImg06, category: 'room' },
    { name: 'Không gian sang trọng', src: portfolioImg01, category: 'portfolio' },
    { name: 'Nội thất hiện đại', src: portfolioImg02, category: 'portfolio' },
    { name: 'View biển đẹp', src: portfolioImg03, category: 'portfolio' },
    { name: 'Tiện nghi cao cấp', src: portfolioImg04, category: 'portfolio' },
    { name: 'Phòng VIP', src: portfolioImg05, category: 'portfolio' },
    { name: 'Không gian rộng rãi', src: portfolioImg06, category: 'portfolio' },
    { name: 'Dịch vụ 5 sao', src: portfolioImg07, category: 'portfolio' },
    { name: 'Phòng honeymoon', src: portfolioImg08, category: 'portfolio' },
    { name: 'View thành phố', src: portfolioImg09, category: 'portfolio' },
    { name: 'Phòng business', src: portfolioImg10, category: 'portfolio' }
  ];

  const roomImages = allImages.filter(img => img.category === 'room');
  const portfolioImages = allImages.filter(img => img.category === 'portfolio');

  return (
    <div style={{ padding: 20, background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: '#644222', marginBottom: 30 }}>
          🏨 Bộ sưu tập ảnh phòng khách sạn
        </h1>
        
        {/* Main Image Display */}
        <div style={{ marginBottom: 30 }}>
          <div style={{
            width: '100%',
            height: 400,
            borderRadius: 16,
            overflow: 'hidden',
            position: 'relative',
            background: '#f5f5f5',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <img
              src={allImages[selectedImageIndex].src}
              alt={allImages[selectedImageIndex].name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              color: 'white',
              padding: 20
            }}>
              <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
                {allImages[selectedImageIndex].name}
              </h3>
              <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>
                {selectedImageIndex + 1} / {allImages.length} ảnh
              </p>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
            <button
              onClick={() => setSelectedImageIndex(0)}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                border: '2px solid #644222',
                background: selectedImageIndex < roomImages.length ? '#644222' : 'transparent',
                color: selectedImageIndex < roomImages.length ? 'white' : '#644222',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
            >
              🏠 Ảnh phòng ({roomImages.length})
            </button>
            <button
              onClick={() => setSelectedImageIndex(roomImages.length)}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                border: '2px solid #644222',
                background: selectedImageIndex >= roomImages.length ? '#644222' : 'transparent',
                color: selectedImageIndex >= roomImages.length ? 'white' : '#644222',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
            >
              🎨 Portfolio ({portfolioImages.length})
            </button>
          </div>
        </div>

        {/* Thumbnail Gallery */}
        <div style={{
          display: 'flex',
          gap: 12,
          overflowX: 'auto',
          paddingBottom: 8,
          scrollbarWidth: 'thin'
        }}>
          {allImages.map((image, index) => (
            <div
              key={index}
              style={{
                minWidth: 100,
                height: 80,
                borderRadius: 12,
                overflow: 'hidden',
                cursor: 'pointer',
                border: index === selectedImageIndex ? '3px solid #644222' : '2px solid transparent',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onClick={() => setSelectedImageIndex(index)}
              onMouseOver={(e) => {
                e.target.style.borderColor = '#644222';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.target.style.borderColor = index === selectedImageIndex ? '#644222' : 'transparent';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <img
                src={image.src}
                alt={image.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              />
              {/* Category indicator */}
              <div style={{
                position: 'absolute',
                top: 4,
                right: 4,
                background: image.category === 'room' ? '#4CAF50' : '#FF9800',
                color: 'white',
                fontSize: 10,
                padding: '2px 6px',
                borderRadius: 8,
                fontWeight: 600
              }}>
                {image.category === 'room' ? '🏠' : '🎨'}
              </div>
            </div>
          ))}
        </div>

        {/* Image Info */}
        <div style={{
          marginTop: 20,
          padding: 20,
          background: 'white',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#644222', marginBottom: 10 }}>
            Thông tin ảnh hiện tại
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15 }}>
            <div>
              <strong>Tên:</strong> {allImages[selectedImageIndex].name}
            </div>
            <div>
              <strong>Loại:</strong> {allImages[selectedImageIndex].category === 'room' ? 'Ảnh phòng' : 'Portfolio'}
            </div>
            <div>
              <strong>Vị trí:</strong> {selectedImageIndex + 1} / {allImages.length}
            </div>
            <div>
              <strong>Kích thước:</strong> 100x80px (thumbnail)
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
          marginTop: 20
        }}>
          <button
            onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
            disabled={selectedImageIndex === 0}
            style={{
              padding: '12px 24px',
              borderRadius: 25,
              border: '2px solid #644222',
              background: selectedImageIndex === 0 ? '#f5f5f5' : '#644222',
              color: selectedImageIndex === 0 ? '#999' : 'white',
              cursor: selectedImageIndex === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
          >
            ← Ảnh trước
          </button>
          <button
            onClick={() => setSelectedImageIndex(Math.min(allImages.length - 1, selectedImageIndex + 1))}
            disabled={selectedImageIndex === allImages.length - 1}
            style={{
              padding: '12px 24px',
              borderRadius: 25,
              border: '2px solid #644222',
              background: selectedImageIndex === allImages.length - 1 ? '#f5f5f5' : '#644222',
              color: selectedImageIndex === allImages.length - 1 ? '#999' : 'white',
              cursor: selectedImageIndex === allImages.length - 1 ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
          >
            Ảnh sau →
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomImageShowcase;

