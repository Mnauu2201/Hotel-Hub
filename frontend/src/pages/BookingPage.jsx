import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import userApi from '../services/userApi';
import bookingService from '../services/bookingService';
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

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const themeColor = '#644222';
  const themeBgLight = '#faf7f2';
  const themeAccent = '#8a643f';

  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
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
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loadingAvailable, setLoadingAvailable] = useState(false);

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
      setSelectedImageIndex(0);
    } else if (location.state?.room) {
      setSelectedRooms([location.state.room]);
      setSelectedImageIndex(0);
    }

    // Prefill form data if user is authenticated
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        guestName: user.name || '',
        guestEmail: user.email || '',
        guestPhone: ''
      }));

      // Fetch profile to get phone
      const token = localStorage.getItem('accessToken');
      if (token) {
        userApi.getUserProfile(token)
          .then(profile => {
            const phone = profile?.phone || '';
            if (phone) {
              setFormData(prev => ({
                ...prev,
                guestPhone: phone
              }));
            }
          })
          .catch(() => {
            // ignore profile fetch errors in booking flow
          });
      }
    }
  }, [location.state, isAuthenticated, user]);

  // Fetch rooms when dates are selected
  useEffect(() => {
    const canSearch = !!formData.checkIn && !!formData.checkOut;
    if (!canSearch) return;

    const fetchRooms = async () => {
      setLoadingAvailable(true);
      try {
        const rooms = await bookingService.getAvailableRooms(formData.checkIn, formData.checkOut);
        setAvailableRooms(Array.isArray(rooms) ? rooms : []);
      } catch (e) {
        // Silent fail to not block booking form
        console.error('Fetch available rooms failed', e);
        setAvailableRooms([]);
      } finally {
        setLoadingAvailable(false);
      }
    };

    fetchRooms();
  }, [formData.checkIn, formData.checkOut]);

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

    if (!isAuthenticated) {
      if (!formData.guestName || !formData.guestEmail || !formData.guestPhone) {
        setError('Vui lòng điền đầy đủ thông tin khách hàng');
        return;
      }
    } else {
      // With logged-in user, ensure phone exists; if missing, ask to fill
      if (!formData.guestPhone) {
        setError('Vui lòng cập nhật số điện thoại trong hồ sơ hoặc nhập tại đây');
        return;
      }
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
                <h1 className="mb-10" style={{ color: '#1f2937', fontWeight: 800, fontSize: 32, letterSpacing: .2 }}>Đặt phòng khách sạn</h1>
                <p style={{ color: '#6b7280', fontSize: 15 }}>Hoàn tất thông tin để xác nhận đặt phòng của bạn</p>
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
                {/* Selected rooms card */}
                <div className="contact-bg02" style={{ background: '#fff', border: '1px solid #ececec', borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
                  <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: 16 }}>
                    <h3 style={{ margin: 0, color: '#374151', fontSize: 18, fontWeight: 700 }}>Phòng đã chọn</h3>
                    {selectedRooms.length === 0 && (
                      <button
                        type="button"
                        onClick={() => navigate('/room', { state: { bookingInProgress: true, selectedRooms } })}
                        className="btn ss-btn"
                        style={{ background: themeColor, borderColor: themeColor }}
                      >
                        + Chọn phòng
                      </button>
                    )}
                  </div>

                  {selectedRooms.length > 0 && (
                    <div className="mb-3 p-3" style={{ background: '#eef6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', borderRadius: 8, fontSize: 14 }}>
                      ℹ️ Hiện tại hệ thống chỉ hỗ trợ đặt 1 phòng mỗi lần.
                    </div>
                  )}

                  {selectedRooms.length === 0 ? (
                    <div className="text-center" style={{ padding: '48px 0' }}>
                      <div className="mx-auto mb-3" style={{ width: 64, height: 64, background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏨</div>
                      <p className="text-gray-500 mb-3">Bạn chưa chọn phòng nào</p>
                      <button onClick={() => navigate('/room')} className="btn ss-btn" style={{ background: themeColor, borderColor: themeColor }}>Chọn phòng ngay</button>
                      {/* Inline search suggestion */}
                      <div className="mt-4" style={{ fontSize: 14 }}>
                        {(!formData.checkIn || !formData.checkOut) && (
                          <div>Chọn ngày nhận/trả phòng để gợi ý phòng trống tự động.</div>
                        )}
                        {formData.checkIn && formData.checkOut && (
                          <div>
                            <div className="mb-2" style={{ fontWeight: 600, color: themeColor }}>Gợi ý phòng trống</div>
                            {loadingAvailable ? (
                              <div>Đang tìm phòng trống...</div>
                            ) : (
                              <div className="row">
                                {availableRooms.slice(0, 4).map((room, idx) => (
                                  <div className="col-md-6" key={idx}>
                                    <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, marginBottom: 12 }}>
                                      {/* Room image */}
                                      <div style={{ width: '100%', height: 120, borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
                                        <img 
                                          src={room.images?.[0]?.imageUrl || fallbackRoomImg} 
                                          alt="Room" 
                                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                          onError={(e) => {
                                            e.target.src = fallbackRoomImg;
                                          }}
                                        />
                                      </div>
                                      <div style={{ fontWeight: 700, color: themeColor }}>{room.roomTypeName || room.roomType?.name || 'Phòng'}</div>
                                      <div className="text-gray-600" style={{ fontSize: 14 }}>Phòng {room.roomNumber || room.room_number}</div>
                                      <div style={{ fontSize: 14, marginTop: 4 }}>{(room.capacity || room.roomType?.capacity || 0)} khách</div>
                                      <div style={{ fontWeight: 800, color: themeAccent, marginTop: 6 }}>{(room.price || room.roomType?.price || 0).toLocaleString('vi-VN')} VND/đêm</div>
                                      <button
                                        className="btn ss-btn w-100 mt-2"
                                        style={{ background: themeColor, borderColor: themeColor }}
                                        onClick={() => {
                                          setSelectedRooms([room]);
                                          setSelectedImageIndex(0);
                                        }}
                                      >
                                        Chọn phòng này
                                      </button>
                                    </div>
                                  </div>
                                ))}
                                {availableRooms.length === 0 && (
                                  <div className="col-12 text-gray-600">Không tìm thấy phòng trống cho ngày đã chọn</div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedRooms.map((room, index) => (
                        <div key={index} style={{ border: '1px solid #f1f1f1', background: '#fcfcfc', padding: 16, borderRadius: 12 }}>
                          {/* Room Image Gallery */}
                          <div style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                              {/* Main Image */}
                              <div style={{ flex: 1, maxWidth: '60%' }}>
                                <div style={{ 
                                  width: '100%', 
                                  height: 200, 
                                  borderRadius: 12, 
                                  overflow: 'hidden',
                                  position: 'relative',
                                  background: '#f5f5f5'
                                }}>
                                  <img 
                                    src={room.images?.[selectedImageIndex]?.imageUrl || [fallbackRoomImg, roomImg02, roomImg03, roomImg04][selectedImageIndex] || fallbackRoomImg} 
                                    alt="Room main" 
                                    style={{ 
                                      width: '100%', 
                                      height: '100%', 
                                      objectFit: 'cover',
                                      transition: 'transform 0.3s ease'
                                    }}
                                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                    onError={(e) => {
                                      e.target.src = fallbackRoomImg;
                                    }}
                                  />
                                  {/* Image counter */}
                                  {room.images && room.images.length > 1 && (
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
                                      {room.images.length} ảnh
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Room Info */}
                              <div style={{ flex: 1, paddingLeft: 8 }}>
                                <h4 style={{ margin: 0, marginBottom: 8, color: themeColor, fontWeight: 700, fontSize: 18 }}>
                                  {room.roomTypeName || room.roomType?.name || 'Phòng'}
                                </h4>
                                <p className="text-gray-600" style={{ marginBottom: 8, fontSize: 14 }}>
                                  Phòng {room.roomNumber || room.room_number}
                                </p>
                                <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
                                  <div style={{ fontWeight: 600, color: themeColor, marginBottom: 4 }}>
                                    {room.capacity || room.roomType?.capacity || 0} khách tối đa
                                  </div>
                                  {room.roomDetail?.bedType && <div style={{ marginBottom: 2 }}>Giường: {room.roomDetail.bedType}</div>}
                                  {room.roomDetail?.roomSize && <div style={{ marginBottom: 2 }}>Diện tích: {room.roomDetail.roomSize}m²</div>}
                                  {room.roomDetail?.viewType && <div style={{ marginBottom: 2 }}>Tầm nhìn: {room.roomDetail.viewType}</div>}
                                </div>
                                <div style={{ marginTop: 12 }}>
                                  <span style={{ fontSize: 20, fontWeight: 800, color: themeAccent }}>
                                    {room.price?.toLocaleString?.() || room.price} VND/đêm
                                  </span>
                                </div>
                          </div>
                            </div>
                            
                            {/* Thumbnail Gallery */}
                            <div style={{ marginTop: 12 }}>
                              <div style={{ 
                                display: 'flex', 
                                gap: 8, 
                                overflowX: 'auto',
                                paddingBottom: 4,
                                scrollbarWidth: 'thin'
                              }}>
                                {/* Show 4 different thumbnail images */}
                                {[0, 1, 2, 3].map((imgIndex) => {
                                  const image = room.images?.[imgIndex];
                                  // Use different fallback images for variety
                                  const fallbackImages = [
                                    fallbackRoomImg,
                                    roomImg02,
                                    roomImg03,
                                    roomImg04
                                  ];
                                  
                                  return (
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
                                        src={image?.imageUrl || fallbackImages[imgIndex]} 
                                        alt={`Room ${imgIndex + 1}`}
                                        style={{ 
                                          width: '100%', 
                                          height: '100%', 
                                          objectFit: 'cover',
                                          transition: 'transform 0.2s ease'
                                        }}
                                        onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                        onError={(e) => {
                                          e.target.src = fallbackImages[imgIndex];
                                        }}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          
                          {/* Remove button */}
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => {
                              const updatedRooms = selectedRooms.filter((_, i) => i !== index);
                              setSelectedRooms(updatedRooms);
                            }}
                            className="btn"
                            title="Xóa phòng này"
                              style={{ 
                                color: '#ef4444',
                                background: 'transparent',
                                border: '1px solid #ef4444',
                                padding: '6px 12px',
                                borderRadius: 6,
                                fontSize: 14
                              }}
                            >
                              ✕ Xóa phòng
                          </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Date selection & price summary */}
                <div className="contact-bg02" style={{ background: '#fff', border: '1px solid #ececec', borderRadius: 14, padding: 20, boxShadow: '0 6px 18px rgba(0,0,0,0.06)', width: '100%' }}>
                  <h3 style={{ color: '#374151', fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Chọn thời gian lưu trú</h3>
                  <p className="text-gray-600" style={{ fontSize: 13, marginBottom: 14 }}>⚠️ Ngày nhận phòng phải từ ngày mai trở đi. Ngày trả phòng phải sau ngày nhận phòng.</p>

                  <div className="row" style={{ rowGap: 16 }}>
                    <div className="col-md-6">
                      <label className="block text-sm font-medium mb-2">Ngày nhận phòng *</label>
                      <input
                        type="date"
                        name="checkIn"
                        value={formData.checkIn}
                        onChange={handleChange}
                        min={getMinDate()}
                        className="form-control"
                        style={{ borderColor: '#ccc', padding: '16px 18px', width: '100%', boxSizing: 'border-box', height: 54, fontSize: 16 }}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="block text-sm font-medium mb-2">Ngày trả phòng *</label>
                      <input
                        type="date"
                        name="checkOut"
                        value={formData.checkOut}
                        onChange={handleChange}
                        min={getMinCheckOutDate()}
                        className="form-control"
                        style={{ borderColor: '#ccc', padding: '16px 18px', width: '100%', boxSizing: 'border-box', height: 54, fontSize: 16 }}
                        required
                      />
                    </div>
                  </div>

                  {getNights() > 0 && selectedRooms.length > 0 && (
                    <div className="mt-3 p-3" style={{ background: themeBgLight, borderRadius: 12, border: '1px dashed #e6decf' }}>
                      <h4 style={{ color: themeColor, fontWeight: 700, marginBottom: 8, fontSize: 15 }}>Tóm tắt giá</h4>
                      <div className="d-flex justify-content-between"><span>Số đêm:</span><span className="font-medium">{getNights()} đêm</span></div>
                      <div className="d-flex justify-content-between"><span>Số phòng:</span><span className="font-medium">{selectedRooms.length} phòng</span></div>
                      <div className="d-flex justify-content-between"><span>Giá phòng/đêm:</span><span className="font-medium">{selectedRooms.reduce((sum, room) => sum + (room.price || room.roomType?.price || 0), 0).toLocaleString('vi-VN')} VND</span></div>
                      <div style={{ borderTop: `1px solid ${themeColor}`, marginTop: 8, paddingTop: 8 }} className="d-flex justify-content-between align-items-center">
                        <span className="text-lg" style={{ fontWeight: 700 }}>Tổng tiền:</span>
                        <span style={{ fontSize: 20, fontWeight: 800, color: themeAccent }}>{getTotalPrice().toLocaleString('vi-VN')} VND</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Customer info same width as above cards */}
            <div className="col-lg-8 col-md-10">
              <div style={{ background: '#fff', border: '1px solid #ececec', borderRadius: 14, padding: 24, boxShadow: '0 6px 18px rgba(0,0,0,0.06)', width: '100%' }}>
                <h3 style={{ color: '#374151', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Thông tin khách hàng</h3>
                <p style={{ color: '#6b7280', marginBottom: 16, fontSize: 13 }}>Điền các trường bắt buộc (*) để tiếp tục</p>

                {success && (<div className="mb-3 p-3" style={{ background: '#ecfdf5', border: '1px solid #34d399', color: '#065f46', borderRadius: 8 }}>{success}</div>)}
                {error && (<div className="mb-3 p-3" style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: 8 }}>{error}</div>)}

                {isAuthenticated ? (
                  <div>
                    <div className="p-3 mb-3" style={{ background: themeBgLight, borderRadius: 8 }}>
                      <h4 style={{ color: themeColor, fontWeight: 700, marginBottom: 8 }}>Thông tin đã đăng nhập</h4>
                      <div className="d-flex justify-content-between"><span className="font-medium">Tên:</span><span>{user?.name}</span></div>
                      <div className="d-flex justify-content-between"><span className="font-medium">Email:</span><span>{user?.email}</span></div>
                      <div className="d-flex justify-content-between"><span className="font-medium">SĐT:</span><span>{formData.guestPhone || 'Chưa cập nhật'}</span></div>
                    </div>

                    {/* Two-column layout */}
                    <div className="row" style={{ rowGap: 12 }}>
                      <div className="col-md-6">
                        <label className="block text-sm font-medium mb-2">Số lượng khách *</label>
                        <input type="number" name="guests" value={formData.guests} onChange={handleChange} min="1" max={selectedRooms.length > 0 ? selectedRooms.reduce((max, room) => { const capacity = room.capacity || room.roomType?.capacity || 0; return Math.max(max, capacity); }, 0) : undefined} className="form-control" style={{ borderColor: !validateGuestCount() && selectedRooms.length > 0 ? '#ef4444' : '#ccc' }} required />
                        {!validateGuestCount() && selectedRooms.length > 0 && (<p className="text-danger mt-1" style={{ fontSize: 14 }}>Số lượng khách vượt quá sức chứa của phòng</p>)}
                      </div>
                      <div className="col-md-6">
                        <label className="block text-sm font-medium mb-2">Yêu cầu đặc biệt (tùy chọn)</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange} className="form-control" style={{ borderColor: '#ccc', minHeight: 80 }} placeholder="Nhập yêu cầu đặc biệt của bạn..." />
                      </div>
                    </div>

                    <button onClick={handleSubmit} disabled={loading || selectedRooms.length === 0 || selectedRooms.length > 1 || !formData.checkIn || !formData.checkOut || !validateGuestCount()} className="btn ss-btn w-100 mt-3" style={{ background: (loading || selectedRooms.length === 0 || selectedRooms.length > 1 || !formData.checkIn || !formData.checkOut || !validateGuestCount()) ? '#ccc' : themeColor, borderColor: (loading || selectedRooms.length === 0 || selectedRooms.length > 1 || !formData.checkIn || !formData.checkOut || !validateGuestCount()) ? '#ccc' : themeColor }}>
                      {loading ? 'Đang xử lý...' : 'Xác nhận đặt phòng'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {/* Row 1: Name - Email */}
                    <div className="row" style={{ rowGap: 12 }}>
                      <div className="col-md-6">
                        <label className="block text-sm font-medium mb-2">Họ và tên *</label>
                        <input type="text" name="guestName" value={formData.guestName} onChange={handleChange} className="form-control" style={{ borderColor: '#ccc' }} required />
                      </div>
                      <div className="col-md-6">
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <input type="email" name="guestEmail" value={formData.guestEmail} onChange={handleChange} className="form-control" style={{ borderColor: '#ccc' }} required />
                      </div>
                    </div>

                    {/* Row 2: Phone - Guests */}
                    <div className="row" style={{ rowGap: 12, marginTop: 8 }}>
                      <div className="col-md-6">
                        <label className="block text-sm font-medium mb-2">Số điện thoại *</label>
                        <input type="tel" name="guestPhone" value={formData.guestPhone} onChange={handleChange} className="form-control" style={{ borderColor: '#ccc' }} required />
                      </div>
                      <div className="col-md-6">
                        <label className="block text-sm font-medium mb-2">Số lượng khách *</label>
                        <input type="number" name="guests" value={formData.guests} onChange={handleChange} min="1" max={selectedRooms.length > 0 ? selectedRooms.reduce((max, room) => { const capacity = room.capacity || room.roomType?.capacity || 0; return Math.max(max, capacity); }, 0) : undefined} className="form-control" style={{ borderColor: !validateGuestCount() && selectedRooms.length > 0 ? '#ef4444' : '#ccc' }} required />
                        {!validateGuestCount() && selectedRooms.length > 0 && (<p className="text-danger" style={{ fontSize: 14 }}>Số lượng khách vượt quá sức chứa của phòng</p>)}
                      </div>
                    </div>

                    {/* Row 3: Notes full width */}
                    <div className="row" style={{ marginTop: 8 }}>
                      <div className="col-12">
                        <label className="block text-sm font-medium mb-2">Yêu cầu đặc biệt (tùy chọn)</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange} className="form-control" style={{ borderColor: '#ccc', minHeight: 80 }} placeholder="Nhập yêu cầu đặc biệt của bạn..." />
                      </div>
                    </div>

                    <button type="submit" disabled={loading || selectedRooms.length === 0 || selectedRooms.length > 1 || !formData.checkIn || !formData.checkOut || !validateGuestCount()} className="btn ss-btn w-100 mt-3" style={{ background: (loading || selectedRooms.length === 0 || selectedRooms.length > 1 || !formData.checkIn || !formData.checkOut || !validateGuestCount()) ? '#ccc' : themeColor, borderColor: (loading || selectedRooms.length === 0 || selectedRooms.length > 1 || !formData.checkIn || !formData.checkOut || !validateGuestCount()) ? '#ccc' : themeColor }}>
                      {loading ? 'Đang xử lý...' : 'Xác nhận đặt phòng'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookingPage;