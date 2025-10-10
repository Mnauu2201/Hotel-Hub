import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import fallbackRoomImg from '../assets/img/gallery/room-img01.png';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { bookingData, selectedRooms, isAuthenticated } = location.state || {};

  const themeColor = '#644222';
  const themeBgLight = '#f6f1eb';
  const themeAccent = '#8a643f';

  if (!bookingData || !selectedRooms) {
    return (
      <div style={{ background: '#f5f5f5', paddingTop: '140px', minHeight: '100vh' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h1 className="text-2xl font-bold mb-4" style={{ color: themeColor }}>Không tìm thấy thông tin đặt phòng</h1>
              <button 
                onClick={() => navigate('/')}
                className="px-6 py-2 rounded text-white"
                style={{ backgroundColor: themeColor }}
              >
                Về trang chủ
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
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-green-600">✓</span>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: themeColor }}>Đặt phòng thành công!</h1>
            <p className="text-gray-600 mb-4">Cảm ơn bạn đã chọn dịch vụ của chúng tôi</p>
            {bookingData.bookingReference && (
              <div className="inline-block px-4 py-2 rounded" style={{ backgroundColor: themeBgLight }}>
                <span className="text-sm font-medium">Mã đặt phòng: </span>
                <span className="font-bold" style={{ color: themeColor }}>{bookingData.bookingReference}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column - Booking Details */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6" style={{ border: '1px solid #e0e0e0' }}>
                <h2 className="text-xl font-semibold mb-4" style={{ color: themeColor }}>Chi tiết đặt phòng</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Ngày nhận phòng:</span>
                    <span>{new Date(bookingData.checkInDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Ngày trả phòng:</span>
                    <span>{new Date(bookingData.checkOutDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Số đêm:</span>
                    <span className="font-bold" style={{ color: themeColor }}>{bookingData.totalNights} đêm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Số khách:</span>
                    <span>{bookingData.guestCount} khách</span>
                  </div>
                  {bookingData.specialRequests && (
                    <div>
                      <span className="font-medium">Yêu cầu đặc biệt:</span>
                      <p className="text-sm text-gray-600 mt-1">{bookingData.specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Guest Information */}
              <div className="bg-white rounded-lg shadow-sm p-6" style={{ border: '1px solid #e0e0e0' }}>
                <h2 className="text-xl font-semibold mb-4" style={{ color: themeColor }}>Thông tin khách hàng</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Họ tên:</span>
                    <span>{bookingData.guestName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span>{bookingData.guestEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Số điện thoại:</span>
                    <span>{bookingData.guestPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Loại tài khoản:</span>
                    <span>{isAuthenticated ? 'Đã đăng nhập' : 'Khách'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Room Details & Payment */}
            <div>
              {/* Room Details */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6" style={{ border: '1px solid #e0e0e0' }}>
                <h2 className="text-xl font-semibold mb-4" style={{ color: themeColor }}>Phòng đã đặt</h2>
                
                <div className="space-y-4">
                  {selectedRooms.map((room, index) => (
                    <div key={index} className="flex gap-4 p-4 rounded" style={{ backgroundColor: themeBgLight }}>
                      <div className="w-20 h-20 rounded overflow-hidden">
                        <img 
                          src={room.images?.[0]?.imageUrl || fallbackRoomImg} 
                          alt="Room" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold" style={{ color: themeColor }}>
                          {room.roomTypeName || room.roomType?.name || 'Phòng'}
                        </h3>
                        <p className="text-sm text-gray-600">Phòng {room.roomNumber || room.room_number}</p>
                        <p className="text-sm text-gray-500">
                          {room.capacity && `${room.capacity} khách`}
                          {room.roomDetail?.bedType && ` • ${room.roomDetail.bedType}`}
                          {room.roomDetail?.roomSize && ` • ${room.roomDetail.roomSize}m²`}
                        </p>
                        <div className="mt-1">
                          <span className="font-bold" style={{ color: themeAccent }}>
                            {room.price?.toLocaleString?.() || room.price} VND/đêm
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6" style={{ border: '1px solid #e0e0e0' }}>
                <h2 className="text-xl font-semibold mb-4" style={{ color: themeColor }}>Tóm tắt thanh toán</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Giá phòng/đêm:</span>
                    <span>{selectedRooms.reduce((sum, room) => sum + (room.price || room.roomType?.price || 0), 0).toLocaleString('vi-VN')} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Số đêm:</span>
                    <span>{bookingData.totalNights} đêm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Số phòng:</span>
                    <span>{selectedRooms.length} phòng</span>
                  </div>
                  <div className="border-t pt-3 mt-3" style={{ borderColor: themeColor }}>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Tổng tiền:</span>
                      <span className="text-xl font-bold" style={{ color: themeAccent }}>
                        {bookingData.totalPrice.toLocaleString('vi-VN')} VND
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    * Thanh toán tại khách sạn khi nhận phòng
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/')}
                className="px-6 py-3 rounded text-white font-medium"
                style={{ backgroundColor: themeColor }}
              >
                Về trang chủ
              </button>
              <button 
                onClick={() => navigate('/room')}
                className="px-6 py-3 rounded font-medium"
                style={{ backgroundColor: 'transparent', color: themeColor, border: `2px solid ${themeColor}` }}
              >
                Đặt thêm phòng
              </button>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6" style={{ border: '1px solid #e0e0e0' }}>
            <h3 className="font-semibold mb-3" style={{ color: themeColor }}>Thông tin quan trọng</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Bạn sẽ nhận được email xác nhận đặt phòng trong vài phút tới</p>
              <p>• Vui lòng mang theo giấy tờ tùy thân khi nhận phòng</p>
              <p>• Thời gian nhận phòng: 14:00 - 23:00</p>
              <p>• Thời gian trả phòng: 07:00 - 12:00</p>
              <p>• Liên hệ hotline: 1900-xxxx nếu cần hỗ trợ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
