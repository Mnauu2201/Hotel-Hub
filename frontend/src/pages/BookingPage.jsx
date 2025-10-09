import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import bookingService from '../services/bookingService';
import fallbackRoomImg from '../assets/img/gallery/room-img01.png';

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const themeColor = '#644222';
  const themeBgLight = '#f6f1eb';
  const themeAccent = '#8a643f';

  const [selectedRooms, setSelectedRooms] = useState([]);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    notes: '',
    guestName: '',
    guestEmail: '',
    guestPhone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Tính số đêm
  const getNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const diffMs = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  };

  // Tính tổng tiền
  const getTotalPrice = () => {
    const nights = getNights();
    if (nights === 0 || selectedRooms.length === 0) return 0;
    
    const totalRoomPrice = selectedRooms.reduce((sum, room) => {
      const roomPrice = room.price || room.roomType?.price || 0;
      return sum + roomPrice;
    }, 0);
    
    return totalRoomPrice * nights;
  };

  useEffect(() => {
    if (location.state?.selectedRooms && Array.isArray(location.state.selectedRooms)) {
      setSelectedRooms(location.state.selectedRooms);
    } else if (location.state?.room) {
      setSelectedRooms([location.state.room]);
    }
    
    // Prefill form data if user is authenticated
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        guestName: user.name || '',
        guestEmail: user.email || '',
        guestPhone: ''
      }));
    }
  }, [location.state, isAuthenticated, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Lấy ngày tối thiểu (ngày mai)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Lấy ngày tối thiểu cho check-out (ngày sau check-in)
  const getMinCheckOutDate = () => {
    if (!formData.checkIn) return getMinDate();
    const checkInDate = new Date(formData.checkIn);
    const nextDay = new Date(checkInDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay.toISOString().split('T')[0];
  };

  // Kiểm tra số khách có vượt quá capacity của phòng không
  const validateGuestCount = () => {
    if (selectedRooms.length === 0) return true;
    
    const maxCapacity = selectedRooms.reduce((max, room) => {
      const capacity = room.capacity || room.roomType?.capacity || 0;
      return Math.max(max, capacity);
    }, 0);
    
    return formData.guests <= maxCapacity;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedRooms.length === 0) {
      setError('Vui lòng chọn ít nhất một phòng');
      return;
    }
    
    if (selectedRooms.length > 1) {
      setError('Hiện tại hệ thống chỉ hỗ trợ đặt 1 phòng mỗi lần. Vui lòng chọn lại.');
      return;
    }
    
    if (!formData.checkIn || !formData.checkOut) {
      setError('Vui lòng chọn ngày check-in và check-out');
      return;
    }
    
    if (getNights() === 0) {
      setError('Ngày check-out phải sau ngày check-in');
      return;
    }

    if (!validateGuestCount()) {
      const maxCapacity = selectedRooms.reduce((max, room) => {
        const capacity = room.capacity || room.roomType?.capacity || 0;
        return Math.max(max, capacity);
      }, 0);
      setError(`Số lượng khách không được vượt quá ${maxCapacity} người (sức chứa tối đa của phòng)`);
      return;
    }
    
    if (!formData.guestName || !formData.guestEmail || !formData.guestPhone) {
      setError('Vui lòng điền đầy đủ thông tin khách hàng');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const nights = getNights();
      const totalPrice = getTotalPrice();
      
      let response;
      if (isAuthenticated) {
        // User booking - gửi API cho user đã đăng nhập
        // Chỉ gửi 1 phòng đầu tiên (backend chỉ hỗ trợ 1 phòng/booking)
        const firstRoom = selectedRooms[0];
        const userBookingData = {
          roomId: firstRoom.roomId || firstRoom.id,
            checkIn: formData.checkIn,
            checkOut: formData.checkOut,
            guests: formData.guests,
            notes: formData.notes
          };
        response = await bookingService.createUserBooking(userBookingData);
      } else {
        // Guest booking - gửi API cho khách chưa đăng nhập
        // Chỉ gửi 1 phòng đầu tiên (backend chỉ hỗ trợ 1 phòng/booking)
        const firstRoom = selectedRooms[0];
        const guestData = {
          roomId: firstRoom.roomId || firstRoom.id,
            checkIn: formData.checkIn,
            checkOut: formData.checkOut,
            guests: formData.guests,
            guestName: formData.guestName,
            guestEmail: formData.guestEmail,
            guestPhone: formData.guestPhone,
            notes: formData.notes
          };
        response = await bookingService.createGuestBooking(guestData);
      }

      setSuccess('Đặt phòng thành công!');
      
      // Chuyển sang trang xác nhận với dữ liệu từ API
      setTimeout(() => {
        const bookingInfo = response.booking || response;
        navigate('/booking-confirmation', { 
          state: { 
            bookingData: {
              checkInDate: formData.checkIn,
              checkOutDate: formData.checkOut,
              totalNights: nights,
              totalPrice: totalPrice,
              guestCount: formData.guests,
              specialRequests: formData.notes,
              guestName: formData.guestName,
              guestEmail: formData.guestEmail,
              guestPhone: formData.guestPhone,
              bookingReference: bookingInfo.bookingReference || 'BK' + Date.now()
            },
            selectedRooms,
            isAuthenticated
          } 
        });
      }, 1500);

    } catch (error) {
      console.error('Booking error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Đặt phòng thất bại. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f5f5f5', paddingTop: '140px', minHeight: '100vh' }}>
    <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: themeColor }}>Đặt phòng khách sạn</h1>
            <p className="text-gray-600">Hoàn tất thông tin để đặt phòng của bạn</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Room Information */}
            <div className="lg:col-span-2">
              
              {/* Selected Rooms Section */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6" style={{ border: '1px solid #e0e0e0' }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold" style={{ color: themeColor }}>Phòng đã chọn</h2>
                  {selectedRooms.length === 0 && (
          <button 
                      type="button"
                      onClick={() => navigate('/room', { state: { bookingInProgress: true, selectedRooms } })}
                      className="px-4 py-2 rounded text-white font-medium hover:opacity-90"
                      style={{ backgroundColor: themeColor }}
                    >
                      + Chọn phòng
          </button>
                  )}
      </div>

                {selectedRooms.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                    ℹ️ Hiện tại hệ thống chỉ hỗ trợ đặt 1 phòng mỗi lần. Nếu muốn đặt nhiều phòng, vui lòng thực hiện nhiều lần đặt phòng.
                  </div>
                )}
          
          {selectedRooms.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl text-gray-400">🏨</span>
                    </div>
                    <p className="text-gray-500 mb-4">Bạn chưa chọn phòng nào</p>
              <button 
                      onClick={() => navigate('/room')}
                      className="px-6 py-3 rounded text-white font-medium"
                      style={{ backgroundColor: themeColor }}
              >
                      Chọn phòng ngay
              </button>
            </div>
          ) : (
                  <div className="space-y-4">
                    {selectedRooms.map((room, index) => (
                      <div key={index} className="flex gap-4 p-4 rounded-lg border" style={{ borderColor: themeBgLight, backgroundColor: '#fafafa' }}>
                        <div className="w-24 h-24 rounded-lg overflow-hidden">
                          <img 
                            src={room.images?.[0]?.imageUrl || fallbackRoomImg} 
                            alt="Room" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1" style={{ color: themeColor }}>
                            {room.roomTypeName || room.roomType?.name || 'Phòng'}
                          </h3>
                          <p className="text-gray-600 text-sm mb-1">Phòng {room.roomNumber || room.room_number}</p>
                          <div className="text-sm text-gray-500 space-y-1">
                            <p className="font-medium" style={{ color: themeColor }}>
                              {room.capacity || room.roomType?.capacity || 0} khách tối đa
                            </p>
                            {room.roomDetail?.bedType && <p>Giường: {room.roomDetail.bedType}</p>}
                            {room.roomDetail?.roomSize && <p>Diện tích: {room.roomDetail.roomSize}m²</p>}
                            {room.roomDetail?.viewType && <p>Tầm nhìn: {room.roomDetail.viewType}</p>}
                          </div>
                          <div className="mt-2">
                            <span className="text-lg font-bold" style={{ color: themeAccent }}>
                              {room.price?.toLocaleString?.() || room.price} VND/đêm
                            </span>
                          </div>
                      </div>
                      <button 
                          onClick={() => {
                            const updatedRooms = selectedRooms.filter((_, i) => i !== index);
                            setSelectedRooms(updatedRooms);
                          }}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded"
                          title="Xóa phòng này"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                      </button>
                    </div>
                  ))}
                </div>
                )}
              </div>

              {/* Date Selection Section */}
              <div className="bg-white rounded-lg shadow-sm p-6" style={{ border: '1px solid #e0e0e0' }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: themeColor }}>Chọn thời gian lưu trú</h3>
                <p className="text-sm text-gray-600 mb-4">
                  ⚠️ Ngày nhận phòng phải từ ngày mai trở đi. Ngày trả phòng phải sau ngày nhận phòng.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ngày nhận phòng *</label>
                    <input
                      type="date"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleChange}
                      min={getMinDate()}
                      className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2"
                      style={{ borderColor: '#ccc' }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Ngày trả phòng *</label>
                    <input
                      type="date"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleChange}
                      min={getMinCheckOutDate()}
                      className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2"
                      style={{ borderColor: '#ccc' }}
                      required
                    />
                  </div>
                </div>

                {/* Price Summary */}
                {getNights() > 0 && selectedRooms.length > 0 && (
                  <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: themeBgLight }}>
                    <h4 className="font-semibold mb-3" style={{ color: themeColor }}>Tóm tắt giá</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Số đêm:</span>
                        <span className="font-medium">{getNights()} đêm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Số phòng:</span>
                        <span className="font-medium">{selectedRooms.length} phòng</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Giá phòng/đêm:</span>
                        <span className="font-medium">
                          {selectedRooms.reduce((sum, room) => sum + (room.price || room.roomType?.price || 0), 0).toLocaleString('vi-VN')} VND
                        </span>
                      </div>
                      <div className="border-t pt-2 mt-3" style={{ borderColor: themeColor }}>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold">Tổng tiền:</span>
                          <span className="text-xl font-bold" style={{ color: themeAccent }}>
                            {getTotalPrice().toLocaleString('vi-VN')} VND
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
                </div>

            {/* Right Column - User Information */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky" style={{ top: 120, border: '1px solid #e0e0e0' }}>
                <h2 className="text-xl font-semibold mb-4" style={{ color: themeColor }}>Thông tin khách hàng</h2>
                
                {success && (
                  <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    {success}
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}

                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: themeBgLight }}>
                      <h3 className="font-semibold mb-3" style={{ color: themeColor }}>Thông tin đã đăng nhập</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">Tên:</span>
                          <span>{user?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Email:</span>
                          <span>{user?.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">SĐT:</span>
                          <span>Chưa cập nhật</span>
                        </div>
                  </div>
                </div>

                <div>
                      <label className="block text-sm font-medium mb-2">
                        Số lượng khách *
                        {selectedRooms.length > 0 && (
                          <span className="text-sm text-gray-500 ml-2">
                            (Tối đa: {selectedRooms.reduce((max, room) => {
                              const capacity = room.capacity || room.roomType?.capacity || 0;
                              return Math.max(max, capacity);
                            }, 0)} người)
                          </span>
                        )}
                      </label>
                  <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    min="1"
                        max={selectedRooms.length > 0 ? selectedRooms.reduce((max, room) => {
                          const capacity = room.capacity || room.roomType?.capacity || 0;
                          return Math.max(max, capacity);
                        }, 0) : undefined}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                          !validateGuestCount() && selectedRooms.length > 0 ? 'border-red-500' : ''
                        }`}
                        style={{ 
                          borderColor: !validateGuestCount() && selectedRooms.length > 0 ? '#ef4444' : '#ccc' 
                        }}
                    required
                  />
                      {!validateGuestCount() && selectedRooms.length > 0 && (
                        <p className="text-red-500 text-sm mt-1">
                          Số lượng khách vượt quá sức chứa của phòng
                        </p>
                      )}
                </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Yêu cầu đặc biệt (tùy chọn)</label>
                      <textarea 
                        name="notes" 
                        value={formData.notes} 
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 h-20 focus:outline-none focus:ring-2"
                        style={{ borderColor: '#ccc' }}
                        placeholder="Nhập yêu cầu đặc biệt của bạn..."
                  />
                </div>

                    <div className="mt-6">
                      <button 
                        onClick={handleSubmit}
                        disabled={loading || selectedRooms.length === 0 || selectedRooms.length > 1 || !formData.checkIn || !formData.checkOut || !validateGuestCount()}
                        className="w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200"
                        style={{ 
                          backgroundColor: (loading || selectedRooms.length === 0 || selectedRooms.length > 1 || !formData.checkIn || !formData.checkOut || !validateGuestCount()) ? '#ccc' : themeColor,
                          cursor: (loading || selectedRooms.length === 0 || selectedRooms.length > 1 || !formData.checkIn || !formData.checkOut || !validateGuestCount()) ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang xử lý...
                          </div>
                        ) : (
                          'Xác nhận đặt phòng'
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium mb-2">Họ và tên *</label>
                      <input
                        type="text"
                        name="guestName"
                        value={formData.guestName}
                        onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                      style={{ borderColor: '#ccc' }}
                        required
                      />
                    </div>
                  
                    <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        name="guestEmail"
                        value={formData.guestEmail}
                        onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                      style={{ borderColor: '#ccc' }}
                        required
                      />
                    </div>
                  
                    <div>
                    <label className="block text-sm font-medium mb-2">Số điện thoại *</label>
                      <input
                        type="tel"
                        name="guestPhone"
                        value={formData.guestPhone}
                        onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                      style={{ borderColor: '#ccc' }}
                        required
                      />
                    </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Số lượng khách *
                      {selectedRooms.length > 0 && (
                        <span className="text-sm text-gray-500 ml-2">
                          (Tối đa: {selectedRooms.reduce((max, room) => {
                            const capacity = room.capacity || room.roomType?.capacity || 0;
                            return Math.max(max, capacity);
                          }, 0)} người)
                        </span>
                      )}
                    </label>
                    <input 
                      type="number" 
                      name="guests" 
                      value={formData.guests} 
                      onChange={handleChange}
                      min="1" 
                      max={selectedRooms.length > 0 ? selectedRooms.reduce((max, room) => {
                        const capacity = room.capacity || room.roomType?.capacity || 0;
                        return Math.max(max, capacity);
                      }, 0) : undefined}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                        !validateGuestCount() && selectedRooms.length > 0 ? 'border-red-500' : ''
                      }`}
                      style={{ 
                        borderColor: !validateGuestCount() && selectedRooms.length > 0 ? '#ef4444' : '#ccc' 
                      }}
                      required 
                    />
                    {!validateGuestCount() && selectedRooms.length > 0 && (
                      <p className="text-red-500 text-sm mt-1">
                        Số lượng khách vượt quá sức chứa của phòng
                      </p>
                    )}
                  </div>

                <div>
                      <label className="block text-sm font-medium mb-2">Yêu cầu đặc biệt (tùy chọn)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 h-20 focus:outline-none focus:ring-2"
                        style={{ borderColor: '#ccc' }}
                        placeholder="Nhập yêu cầu đặc biệt của bạn..."
                      />
                </div>

                    <div className="mt-6">
                <button
                  type="submit"
                        disabled={loading || selectedRooms.length === 0 || selectedRooms.length > 1 || !formData.checkIn || !formData.checkOut || !validateGuestCount()}
                        className="w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200"
                        style={{ 
                          backgroundColor: (loading || selectedRooms.length === 0 || selectedRooms.length > 1 || !formData.checkIn || !formData.checkOut || !validateGuestCount()) ? '#ccc' : themeColor,
                          cursor: (loading || selectedRooms.length === 0 || selectedRooms.length > 1 || !formData.checkIn || !formData.checkOut || !validateGuestCount()) ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang xử lý...
        </div>
      ) : (
                          'Xác nhận đặt phòng'
                        )}
              </button>
            </div>
                  </form>
      )}
    </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;