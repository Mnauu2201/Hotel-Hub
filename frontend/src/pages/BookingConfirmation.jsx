import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import fallbackRoomImg from '../assets/img/gallery/room-img01.png';
import '../assets/fontawesome/css/all.min.css';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { bookingData, selectedRooms, isAuthenticated } = location.state || {};

  const themeColor = '#644222';
  const themeBgLight = '#faf7f2';
  const themeAccent = '#8a643f';
  const themeGradient = 'linear-gradient(135deg, #644222 0%, #8a643f 100%)';

  // Hiệu ứng fade-in khi trang được tải
  useEffect(() => {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('active');  
      }, 100 * index);
    });
  }, []);

  if (!bookingData || !selectedRooms) {
    return (
      <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
        {/* Hero / Breadcrumb-like header */}
        <section
          className="p-relative"
          style={{
            position: 'relative',
            paddingTop: 120,
            paddingBottom: 32,
            background: '#ffffff',
            borderBottom: '1px solid #e5e7eb'
          }}
        >
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12 text-center">
                <div style={{ maxWidth: 760, margin: '0 auto' }}>
                  <h1 className="mb-10" style={{ color: '#1f2937', fontWeight: 800, fontSize: 32, letterSpacing: .2 }}>Xác nhận đặt phòng</h1>
                  <p style={{ color: '#6b7280', fontSize: 15 }}>Không tìm thấy thông tin đặt phòng</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Main content */}
        <section className="booking pt-60 pb-120 p-relative">
          <div className="container" style={{ maxWidth: 1200 }}>
            <div className="row justify-content-center" style={{ gap: 24 }}>
              <div className="col-lg-8 col-md-10">
                <div className="contact-bg02" style={{ background: '#fff', border: '1px solid #ececec', borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
                  <div className="text-center fade-in" style={{ padding: '40px 0' }}>
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                         style={{ 
                           background: '#fee2e2',
                           boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.3)'
                         }}>
                      <i className="fas fa-exclamation-triangle text-red-500 text-3xl"></i>
                    </div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: themeColor }}>Không tìm thấy thông tin đặt phòng</h1>
                    <p className="text-gray-600 mb-6">Thông tin đặt phòng không tồn tại hoặc đã hết hạn</p>
                    <button 
                      onClick={() => navigate('/')}
                      className="btn ss-btn"
                      style={{ background: themeColor, borderColor: themeColor }}
                    >
                      <i className="fas fa-home mr-2"></i> Về trang chủ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Hero / Breadcrumb-like header */}
      <section
        className="p-relative"
        style={{
          position: 'relative',
          paddingTop: 120,
          paddingBottom: 32,
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb'
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 text-center">
              <div style={{ maxWidth: 760, margin: '0 auto' }}>
                <h1 className="mb-10" style={{ color: '#1f2937', fontWeight: 800, fontSize: 32, letterSpacing: .2 }}>Xác nhận đặt phòng</h1>
                <p style={{ color: '#6b7280', fontSize: 15 }}>Cảm ơn bạn đã chọn dịch vụ của chúng tôi</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main content */}
      <section className="booking pt-60 pb-120 p-relative">
        <div className="container" style={{ maxWidth: 1200 }}>
          <div className="row justify-content-center" style={{ gap: 24 }}>
            {/* Single column width */}
            <div className="col-lg-8 col-md-10">
              <div>
                {/* Success Header */}
                <div className="contact-bg02" style={{ background: '#fff', border: '1px solid #ececec', borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
                  <div className="text-center fade-in" style={{ padding: '20px 0' }}>
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                         style={{ 
                           background: themeGradient,
                           boxShadow: '0 10px 15px -3px rgba(100, 66, 34, 0.3)'
                         }}>
                      <i className="fas fa-check text-white text-3xl"></i>
                    </div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: themeColor }}>Đặt phòng thành công!</h1>
                    <p className="text-gray-600 mb-4">Cảm ơn bạn đã chọn dịch vụ của chúng tôi</p>
                    {bookingData.bookingReference && (
                      <div className="inline-block px-6 py-3 rounded-lg" 
                           style={{ 
                             backgroundColor: themeBgLight,
                             boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                             border: '2px dashed #d0b89c'
                           }}>
                        <span className="text-base font-medium">Mã đặt phòng: </span>
                        <span className="font-bold text-xl" style={{ color: themeColor }}>{bookingData.bookingReference}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected rooms card */}
                <div className="contact-bg02" style={{ background: '#fff', border: '1px solid #ececec', borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
                  <div className="d-flex align-items-center" style={{ marginBottom: 16 }}>
                    <i className="fas fa-bed mr-3 text-xl" style={{ color: themeColor }}></i>
                    <h3 style={{ margin: 0, color: '#374151', fontSize: 18, fontWeight: 700 }}>Phòng đã đặt</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {selectedRooms.map((room, index) => (
                      <div key={index} className="d-flex" style={{ gap: 16, border: '1px solid #f1f1f1', background: '#fcfcfc', padding: 14, borderRadius: 12 }}>
                        <div style={{ width: 96, height: 96, borderRadius: 8, overflow: 'hidden' }}>
                          <img 
                            src={(() => {
                              const imageUrl = room.images?.[0]?.imageUrl;
                              if (!imageUrl) return fallbackRoomImg;
                              
                              // Convert relative URLs to absolute backend URLs
                              if (typeof imageUrl === 'string' && !imageUrl.startsWith('http')) {
                                if (imageUrl.startsWith('/uploads/')) {
                                  return 'http://localhost:8080' + imageUrl;
                                } else if (!imageUrl.startsWith('/')) {
                                  return 'http://localhost:8080/uploads/' + imageUrl;
                                } else {
                                  return 'http://localhost:8080' + imageUrl;
                                }
                              }
                              return imageUrl;
                            })()} 
                            alt="Room" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              console.error('Image failed to load:', e.target.src);
                              e.target.src = fallbackRoomImg;
                            }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: 0, marginBottom: 6, color: themeColor, fontWeight: 700 }}>{room.roomTypeName || room.roomType?.name || 'Phòng'}</h4>
                          <p className="text-gray-600" style={{ marginBottom: 6 }}>Phòng {room.roomNumber || room.room_number}</p>
                          <div style={{ fontSize: 14, color: '#6b7280' }}>
                            <div style={{ fontWeight: 600, color: themeColor }}>{room.capacity || room.roomType?.capacity || 0} khách tối đa</div>
                            {room.roomDetail?.bedType && <div>Giường: {room.roomDetail.bedType}</div>}
                            {room.roomDetail?.roomSize && <div>Diện tích: {room.roomDetail.roomSize}m²</div>}
                            {room.roomDetail?.viewType && <div>Tầm nhìn: {room.roomDetail.viewType}</div>}
                          </div>
                          <div style={{ marginTop: 8 }}>
                            <span style={{ fontSize: 18, fontWeight: 800, color: themeAccent }}>{room.price?.toLocaleString?.() || room.price} VND/đêm</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking details & guest info */}
                <div className="contact-bg02" style={{ background: '#fff', border: '1px solid #ececec', borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ color: '#374151', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Chi tiết đặt phòng</h3>
                  
                  <div className="row" style={{ rowGap: 16 }}>
                    <div className="col-md-6">
                      <div className="p-3 rounded" style={{ backgroundColor: 'rgba(246, 241, 235, 0.5)' }}>
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-calendar-alt mr-2" style={{ color: themeAccent }}></i>
                          <span className="font-medium">Ngày nhận phòng:</span>
                        </div>
                        <div className="font-semibold">{new Date(bookingData.checkInDate).toLocaleDateString('vi-VN')}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 rounded" style={{ backgroundColor: 'rgba(246, 241, 235, 0.5)' }}>
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-calendar-alt mr-2" style={{ color: themeAccent }}></i>
                          <span className="font-medium">Ngày trả phòng:</span>
                        </div>
                        <div className="font-semibold">{new Date(bookingData.checkOutDate).toLocaleDateString('vi-VN')}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 rounded" style={{ backgroundColor: 'rgba(246, 241, 235, 0.5)' }}>
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-moon mr-2" style={{ color: themeAccent }}></i>
                          <span className="font-medium">Số đêm:</span>
                        </div>
                        <div className="font-semibold" style={{ color: themeColor }}>{bookingData.totalNights} đêm</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 rounded" style={{ backgroundColor: 'rgba(246, 241, 235, 0.5)' }}>
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-user-friends mr-2" style={{ color: themeAccent }}></i>
                          <span className="font-medium">Số khách:</span>
                        </div>
                        <div className="font-semibold">{bookingData.guestCount} khách</div>
                      </div>
                    </div>
                    {bookingData.specialRequests && (
                      <div className="col-12">
                        <div className="p-3 rounded" style={{ backgroundColor: 'rgba(246, 241, 235, 0.5)' }}>
                          <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-clipboard-list mr-2" style={{ color: themeAccent }}></i>
                            <span className="font-medium">Yêu cầu đặc biệt:</span>
                          </div>
                          <p className="text-gray-600 ml-4" style={{ fontSize: 14, margin: 0 }}>{bookingData.specialRequests}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Guest Information */}
                <div className="contact-bg02" style={{ background: '#fff', border: '1px solid #ececec', borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ color: '#374151', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Thông tin khách hàng</h3>
                  
                  <div className="row" style={{ rowGap: 16 }}>
                    <div className="col-md-6">
                      <div className="p-3 rounded" style={{ backgroundColor: 'rgba(246, 241, 235, 0.5)' }}>
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-user mr-2" style={{ color: themeAccent }}></i>
                          <span className="font-medium">Họ tên:</span>
                        </div>
                        <div className="font-semibold">{bookingData.guestName}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 rounded" style={{ backgroundColor: 'rgba(246, 241, 235, 0.5)' }}>
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-envelope mr-2" style={{ color: themeAccent }}></i>
                          <span className="font-medium">Email:</span>
                        </div>
                        <div className="font-semibold">{bookingData.guestEmail}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 rounded" style={{ backgroundColor: 'rgba(246, 241, 235, 0.5)' }}>
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-phone-alt mr-2" style={{ color: themeAccent }}></i>
                          <span className="font-medium">Số điện thoại:</span>
                        </div>
                        <div className="font-semibold">{bookingData.guestPhone}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 rounded" style={{ backgroundColor: 'rgba(246, 241, 235, 0.5)' }}>
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-id-card mr-2" style={{ color: themeAccent }}></i>
                          <span className="font-medium">Loại tài khoản:</span>
                        </div>
                        <div className="font-semibold">
                          {isAuthenticated ? (
                            <span className="d-flex align-items-center">
                              <i className="fas fa-user-check mr-2 text-success"></i> Đã đăng nhập
                            </span>
                          ) : 'Khách'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="contact-bg02" style={{ background: '#fff', border: '1px solid #ececec', borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ color: '#374151', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Tóm tắt thanh toán</h3>
                  
                  <div className="space-y-3">
                    <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'rgba(246, 241, 235, 0.5)' }}>
                      <div className="d-flex align-items-center">
                        <i className="fas fa-tag mr-2" style={{ color: themeAccent }}></i>
                        <span>Giá phòng/đêm:</span>
                      </div>
                      <span className="font-semibold">{selectedRooms.reduce((sum, room) => sum + (room.price || room.roomType?.price || 0), 0).toLocaleString('vi-VN')} VND</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'rgba(246, 241, 235, 0.5)' }}>
                      <div className="d-flex align-items-center">
                        <i className="fas fa-moon mr-2" style={{ color: themeAccent }}></i>
                        <span>Số đêm:</span>
                      </div>
                      <span className="font-semibold">{bookingData.totalNights} đêm</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: 'rgba(246, 241, 235, 0.5)' }}>
                      <div className="d-flex align-items-center">
                        <i className="fas fa-door-open mr-2" style={{ color: themeAccent }}></i>
                        <span>Số phòng:</span>
                      </div>
                      <span className="font-semibold">{selectedRooms.length} phòng</span>
                    </div>
                    <div className="mt-4 p-4 rounded-lg" style={{ 
                      background: themeGradient,
                      boxShadow: '0 4px 15px rgba(100, 66, 34, 0.2)'
                    }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-lg font-bold text-white">Tổng tiền:</span>
                        <span className="text-xl font-bold text-white">
                          {bookingData.totalPrice.toLocaleString('vi-VN')} VND
                        </span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center text-sm text-gray-600 mt-3 p-2 border border-dashed rounded-lg" style={{ borderColor: themeAccent }}>
                      <i className="fas fa-info-circle mr-2" style={{ color: themeAccent }}></i>
                      <span>Thanh toán tại khách sạn khi nhận phòng</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="text-center fade-in" style={{ marginBottom: 24 }}>
                  <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                    <button 
                      onClick={() => navigate('/')}
                      className="btn ss-btn px-4 py-3 rounded"
                      style={{ background: themeGradient }}
                    >
                      <i className="fas fa-home mr-2"></i> Về trang chủ
                    </button>
                    <button 
                      onClick={() => navigate('/room')}
                      className="btn px-4 py-3 rounded"
                      style={{ 
                        backgroundColor: 'transparent', 
                        color: themeColor, 
                        border: `2px solid ${themeColor}` 
                      }}
                    >
                      <i className="fas fa-plus-circle mr-2"></i> Đặt thêm phòng
                    </button>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="contact-bg02" style={{ background: '#fff', border: '1px solid #ececec', borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: '0 6px 18px rgba(0,0,0,0.06)', borderLeft: `4px solid ${themeColor}` }}>
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-info-circle mr-2 text-xl" style={{ color: themeColor }}></i>
                    <h3 style={{ margin: 0, color: '#374151', fontSize: 18, fontWeight: 700 }}>Thông tin quan trọng</h3>
                  </div>
                  <div className="space-y-3 text-sm text-gray-600 ml-6">
                    <p className="d-flex align-items-center" style={{ margin: '8px 0' }}>
                      <i className="fas fa-envelope mr-2" style={{ color: themeAccent }}></i>
                      Bạn sẽ nhận được email xác nhận đặt phòng trong vài phút tới
                    </p>
                    <p className="d-flex align-items-center" style={{ margin: '8px 0' }}>
                      <i className="fas fa-id-card mr-2" style={{ color: themeAccent }}></i>
                      Vui lòng mang theo giấy tờ tùy thân khi nhận phòng
                    </p>
                    <p className="d-flex align-items-center" style={{ margin: '8px 0' }}>
                      <i className="fas fa-clock mr-2" style={{ color: themeAccent }}></i>
                      Thời gian nhận phòng: 14:00 - 23:00
                    </p>
                    <p className="d-flex align-items-center" style={{ margin: '8px 0' }}>
                      <i className="fas fa-sign-out-alt mr-2" style={{ color: themeAccent }}></i>
                      Thời gian trả phòng: 07:00 - 12:00
                    </p>
                    <p className="d-flex align-items-center" style={{ margin: '8px 0' }}>
                      <i className="fas fa-phone-alt mr-2" style={{ color: themeAccent }}></i>
                      Liên hệ hotline: 1900-xxxx nếu cần hỗ trợ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <style>{`
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .fade-in.active {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default BookingConfirmation;
