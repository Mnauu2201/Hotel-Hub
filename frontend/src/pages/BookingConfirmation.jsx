import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import fallbackRoomImg from '../assets/img/gallery/room-img01.png';
import '../assets/fontawesome/css/all.min.css';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { bookingData, selectedRooms, isAuthenticated } = location.state || {};

  const themeColor = '#644222';
  const themeBgLight = '#f6f1eb';
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
      <div style={{ background: '#f5f5f5', paddingTop: '140px', minHeight: '100vh' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center fade-in">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
              </div>
              <h1 className="text-2xl font-bold mb-4" style={{ color: themeColor }}>Không tìm thấy thông tin đặt phòng</h1>
              <p className="text-gray-600 mb-6">Thông tin đặt phòng không tồn tại hoặc đã hết hạn</p>
              <button 
                onClick={() => navigate('/')}
                className="px-6 py-3 rounded text-white transition-all hover:shadow-lg"
                style={{ background: themeGradient }}
              >
                <i className="fas fa-home mr-2"></i> Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f5f5', paddingTop: '140px', minHeight: '100vh' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Success Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6 text-center fade-in" 
               style={{ 
                 borderTop: `5px solid ${themeColor}`,
                 animation: 'fadeInDown 0.6s ease-out'
               }}>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column - Booking Details */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6 fade-in" 
                   style={{ 
                     border: '1px solid #e0e0e0',
                     transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                   }}
                   onMouseOver={(e) => {
                     e.currentTarget.style.transform = 'translateY(-5px)';
                     e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                   }}
                   onMouseOut={(e) => {
                     e.currentTarget.style.transform = 'translateY(0)';
                     e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                   }}>
                <div className="flex items-center mb-6">
                  <i className="fas fa-calendar-check mr-4 text-3xl" style={{ color: themeColor }}></i>
                  <h2 className="text-3xl font-bold" style={{ color: themeColor }}>Chi tiết đặt phòng</h2>
                </div>
                
                <div className="space-y-5">
                  <div className="flex justify-between items-center p-4 rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(246, 241, 235, 0.8)' }}>
                    <div className="flex items-center">
                      <i className="fas fa-calendar-alt mr-4 text-2xl" style={{ color: themeAccent }}></i>
                      <span className="font-medium text-xl">Ngày nhận phòng:</span>
                    </div>
                    <span className="font-bold text-xl">{new Date(bookingData.checkInDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(246, 241, 235, 0.8)' }}>
                    <div className="flex items-center">
                      <i className="fas fa-calendar-alt mr-4 text-2xl" style={{ color: themeAccent }}></i>
                      <span className="font-medium text-xl">Ngày trả phòng:</span>
                    </div>
                    <span className="font-bold text-xl">{new Date(bookingData.checkOutDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(246, 241, 235, 0.8)' }}>
                    <div className="flex items-center">
                      <i className="fas fa-moon mr-4 text-2xl" style={{ color: themeAccent }}></i>
                      <span className="font-medium text-xl">Số đêm:</span>
                    </div>
                    <span className="font-bold text-xl" style={{ color: themeColor }}>{bookingData.totalNights} đêm</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(246, 241, 235, 0.8)' }}>
                    <div className="flex items-center">
                      <i className="fas fa-user-friends mr-4 text-2xl" style={{ color: themeAccent }}></i>
                      <span className="font-medium text-xl">Số khách:</span>
                    </div>
                    <span className="font-bold text-xl">{bookingData.guestCount} khách</span>
                  </div>
                  {bookingData.specialRequests && (
                    <div className="p-2 rounded" style={{ backgroundColor: 'rgba(246, 241, 235, 0.5)' }}>
                      <div className="flex items-center mb-2">
                        <i className="fas fa-clipboard-list mr-2" style={{ color: themeAccent }}></i>
                        <span className="font-medium">Yêu cầu đặc biệt:</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">{bookingData.specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Guest Information */}
              <div className="bg-white rounded-lg shadow-sm p-6 fade-in" 
                   style={{ 
                     border: '1px solid #e0e0e0',
                     transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                   }}
                   onMouseOver={(e) => {
                     e.currentTarget.style.transform = 'translateY(-5px)';
                     e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                   }}
                   onMouseOut={(e) => {
                     e.currentTarget.style.transform = 'translateY(0)';
                     e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                   }}>
                <div className="flex items-center mb-6">
                  <i className="fas fa-user-circle mr-4 text-3xl" style={{ color: themeColor }}></i>
                  <h2 className="text-3xl font-bold" style={{ color: themeColor }}>Thông tin khách hàng</h2>
                </div>
                
                <div className="space-y-5">
                  <div className="flex justify-between items-center p-4 rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(246, 241, 235, 0.8)' }}>
                    <div className="flex items-center">
                      <i className="fas fa-user mr-4 text-2xl" style={{ color: themeAccent }}></i>
                      <span className="font-medium text-xl">Họ tên:</span>
                    </div>
                    <span className="font-bold text-xl">{bookingData.guestName}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(246, 241, 235, 0.8)' }}>
                    <div className="flex items-center">
                      <i className="fas fa-envelope mr-4 text-2xl" style={{ color: themeAccent }}></i>
                      <span className="font-medium text-xl">Email:</span>
                    </div>
                    <span className="font-bold text-xl">{bookingData.guestEmail}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(246, 241, 235, 0.8)' }}>
                    <div className="flex items-center">
                      <i className="fas fa-phone-alt mr-4 text-2xl" style={{ color: themeAccent }}></i>
                      <span className="font-medium text-xl">Số điện thoại:</span>
                    </div>
                    <span className="font-bold text-xl">{bookingData.guestPhone}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(246, 241, 235, 0.8)' }}>
                    <div className="flex items-center">
                      <i className="fas fa-id-card mr-4 text-2xl" style={{ color: themeAccent }}></i>
                      <span className="font-medium text-xl">Loại tài khoản:</span>
                    </div>
                    <span className="font-bold text-xl">
                      {isAuthenticated ? (
                        <span className="flex items-center">
                          <i className="fas fa-user-check mr-2 text-xl text-green-600"></i> Đã đăng nhập
                        </span>
                      ) : 'Khách'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Room Details & Payment */}
            <div>
              {/* Room Details */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6 fade-in" 
                   style={{ 
                     border: '1px solid #e0e0e0',
                     transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                   }}
                   onMouseOver={(e) => {
                     e.currentTarget.style.transform = 'translateY(-5px)';
                     e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                   }}
                   onMouseOut={(e) => {
                     e.currentTarget.style.transform = 'translateY(0)';
                     e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                   }}>
                <div className="flex items-center mb-6">
                  <i className="fas fa-bed mr-4 text-3xl" style={{ color: themeColor }}></i>
                  <h2 className="text-3xl font-bold" style={{ color: themeColor }}>Phòng đã đặt</h2>
                </div>
                
                <div className="space-y-5">
                  {selectedRooms.map((room, index) => (
                    <div key={index} className="flex gap-5 p-5 rounded-lg transition-all hover:shadow-md" 
                         style={{ 
                           backgroundColor: themeBgLight,
                           border: '1px solid #e9e1d6'
                         }}>
                      <div className="w-32 h-32 rounded-lg overflow-hidden shadow-md">
                        <img 
                          src={room.images?.[0]?.imageUrl || fallbackRoomImg} 
                          alt="Room" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-2xl" style={{ color: themeColor }}>
                          {room.roomTypeName || room.roomType?.name || 'Phòng'}
                        </h3>
                        <div className="flex items-center text-lg text-gray-600 mt-2">
                          <i className="fas fa-door-open mr-2 text-xl" style={{ color: themeAccent }}></i>
                          <p>Phòng {room.roomNumber || room.room_number}</p>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-3">
                          {room.capacity && (
                            <span className="inline-flex items-center text-base bg-gray-100 px-3 py-2 rounded-lg">
                              <i className="fas fa-user-friends mr-2 text-lg" style={{ color: themeAccent }}></i>
                              {room.capacity} khách
                            </span>
                          )}
                          {room.roomDetail?.bedType && (
                            <span className="inline-flex items-center text-base bg-gray-100 px-3 py-2 rounded-lg">
                              <i className="fas fa-bed mr-2 text-lg" style={{ color: themeAccent }}></i>
                              {room.roomDetail.bedType}
                            </span>
                          )}
                          {room.roomDetail?.roomSize && (
                            <span className="inline-flex items-center text-base bg-gray-100 px-3 py-2 rounded-lg">
                              <i className="fas fa-ruler-combined mr-2 text-lg" style={{ color: themeAccent }}></i>
                              {room.roomDetail.roomSize}m²
                            </span>
                          )}
                        </div>
                        <div className="mt-3">
                          <span className="font-bold text-xl" style={{ color: themeAccent }}>
                            {room.price?.toLocaleString?.() || room.price} VND/đêm
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6 fade-in" 
                   style={{ 
                     border: '1px solid #e0e0e0',
                     transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                   }}
                   onMouseOver={(e) => {
                     e.currentTarget.style.transform = 'translateY(-5px)';
                     e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                   }}
                   onMouseOut={(e) => {
                     e.currentTarget.style.transform = 'translateY(0)';
                     e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                   }}>
                <div className="flex items-center mb-6">
                  <i className="fas fa-receipt mr-4 text-3xl" style={{ color: themeColor }}></i>
                  <h2 className="text-3xl font-bold" style={{ color: themeColor }}>Tóm tắt thanh toán</h2>
                </div>
                
                <div className="space-y-5">
                  <div className="flex justify-between items-center p-4 rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(246, 241, 235, 0.8)' }}>
                    <div className="flex items-center">
                      <i className="fas fa-tag mr-4 text-2xl" style={{ color: themeAccent }}></i>
                      <span className="font-medium text-xl">Giá phòng/đêm:</span>
                    </div>
                    <span className="font-bold text-xl">{selectedRooms.reduce((sum, room) => sum + (room.price || room.roomType?.price || 0), 0).toLocaleString('vi-VN')} VND</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(246, 241, 235, 0.8)' }}>
                    <div className="flex items-center">
                      <i className="fas fa-moon mr-4 text-2xl" style={{ color: themeAccent }}></i>
                      <span className="font-medium text-xl">Số đêm:</span>
                    </div>
                    <span className="font-bold text-xl">{bookingData.totalNights} đêm</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(246, 241, 235, 0.8)' }}>
                    <div className="flex items-center">
                      <i className="fas fa-door-open mr-4 text-2xl" style={{ color: themeAccent }}></i>
                      <span className="font-medium text-xl">Số phòng:</span>
                    </div>
                    <span className="font-bold text-xl">{selectedRooms.length} phòng</span>
                  </div>
                  <div className="mt-6 p-5 rounded-lg" style={{ 
                    background: themeGradient,
                    boxShadow: '0 6px 20px rgba(100, 66, 34, 0.3)'
                  }}>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-white">Tổng tiền:</span>
                      <span className="text-3xl font-bold text-white">
                        {bookingData.totalPrice.toLocaleString('vi-VN')} VND
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-lg text-gray-700 mt-4 p-4 border-2 border-dashed rounded-lg" style={{ borderColor: themeAccent, backgroundColor: 'rgba(246, 241, 235, 0.5)' }}>
                    <i className="fas fa-info-circle mr-3 text-xl" style={{ color: themeAccent }}></i>
                    <span className="font-medium">Thanh toán tại khách sạn khi nhận phòng</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 text-center fade-in">
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => navigate('/')}
                className="px-8 py-4 rounded-lg text-white font-bold text-lg transition-all hover:shadow-xl flex items-center justify-center"
                style={{ 
                  background: themeGradient,
                  boxShadow: '0 4px 15px rgba(100, 66, 34, 0.2)'
                }}
              >
                <i className="fas fa-home mr-3 text-xl"></i> Về trang chủ
              </button>
              <button 
                onClick={() => navigate('/room')}
                className="px-8 py-4 rounded-lg font-bold text-lg transition-all hover:shadow-xl flex items-center justify-center"
                style={{ 
                  backgroundColor: 'white', 
                  color: themeColor, 
                  border: `2px solid ${themeColor}`,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                }}
              >
                <i className="fas fa-plus-circle mr-3 text-xl"></i> Đặt thêm phòng
              </button>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-10 bg-white rounded-lg shadow-sm p-8 fade-in" 
               style={{ 
                 border: '1px solid #e0e0e0',
                 borderLeft: `6px solid ${themeColor}`
               }}>
            <div className="flex items-center mb-5">
              <i className="fas fa-info-circle mr-3 text-2xl" style={{ color: themeColor }}></i>
              <h3 className="text-2xl font-bold" style={{ color: themeColor }}>Thông tin quan trọng</h3>
            </div>
            <div className="space-y-4 text-lg text-gray-700 ml-8">
              <p className="flex items-center">
                <i className="fas fa-envelope mr-3 text-xl" style={{ color: themeAccent }}></i>
                Bạn sẽ nhận được email xác nhận đặt phòng trong vài phút tới
              </p>
              <p className="flex items-center">
                <i className="fas fa-id-card mr-2" style={{ color: themeAccent }}></i>
                Vui lòng mang theo giấy tờ tùy thân khi nhận phòng
              </p>
              <p className="flex items-center">
                <i className="fas fa-clock mr-2" style={{ color: themeAccent }}></i>
                Thời gian nhận phòng: 14:00 - 23:00
              </p>
              <p className="flex items-center">
                <i className="fas fa-sign-out-alt mr-2" style={{ color: themeAccent }}></i>
                Thời gian trả phòng: 07:00 - 12:00
              </p>
              <p className="flex items-center">
                <i className="fas fa-phone-alt mr-2" style={{ color: themeAccent }}></i>
                Liên hệ hotline: 1900-xxxx nếu cần hỗ trợ
              </p>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .fade-in.active {
          opacity: 1;
          transform: translateY(0);
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
