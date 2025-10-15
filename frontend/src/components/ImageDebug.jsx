import React from 'react';
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

const ImageDebug = () => {
  const images = [
    { name: 'room-img01.png', src: fallbackRoomImg },
    { name: 'room-img02.png', src: roomImg02 },
    { name: 'room-img03.png', src: roomImg03 },
    { name: 'room-img04.png', src: roomImg04 },
    { name: 'room-img05.png', src: roomImg05 },
    { name: 'room-img06.png', src: roomImg06 },
    { name: 'protfolio-img01.png', src: portfolioImg01 },
    { name: 'protfolio-img02.png', src: portfolioImg02 },
    { name: 'protfolio-img03.png', src: portfolioImg03 },
    { name: 'protfolio-img04.png', src: portfolioImg04 },
    { name: 'protfolio-img05.png', src: portfolioImg05 },
    { name: 'protfolio-img06.png', src: portfolioImg06 },
    { name: 'protfolio-img07.png', src: portfolioImg07 },
    { name: 'protfolio-img08.png', src: portfolioImg08 },
    { name: 'protfolio-img09.png', src: portfolioImg09 },
    { name: 'protfolio-img10.png', src: portfolioImg10 }
  ];

  return (
    <div style={{ padding: 20, background: '#f5f5f5' }}>
      <h2>Debug: Kiểm tra tất cả ảnh phòng</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginTop: 20 }}>
        {images.map((image, index) => (
          <div key={index} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 10, background: 'white' }}>
            <div style={{ height: 150, borderRadius: 8, overflow: 'hidden', marginBottom: 10 }}>
              <img 
                src={image.src} 
                alt={image.name}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }}
                onError={(e) => {
                  console.error(`Lỗi load ảnh: ${image.name}`);
                  e.target.style.background = '#ff0000';
                  e.target.style.color = 'white';
                  e.target.style.display = 'flex';
                  e.target.style.alignItems = 'center';
                  e.target.style.justifyContent = 'center';
                  e.target.textContent = 'Lỗi load ảnh';
                }}
                onLoad={() => {
                  console.log(`✅ Load thành công: ${image.name}`);
                }}
              />
            </div>
            <div style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
              {image.name}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: 20, padding: 15, background: '#e8f5e8', borderRadius: 8 }}>
        <h3>Hướng dẫn kiểm tra:</h3>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>✅ Nếu ảnh hiển thị bình thường = OK</li>
          <li>❌ Nếu ảnh hiển thị "Lỗi load ảnh" = Có vấn đề</li>
          <li>🔍 Mở Developer Tools (F12) để xem console log</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageDebug;
