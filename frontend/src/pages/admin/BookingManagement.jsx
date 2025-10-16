import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import bookingService from '../../services/bookingService';
import fallbackRoomImg from '../../assets/img/gallery/room-img01.png';

const BookingManagement = () => {
  const { isAdmin } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, cancelled, completed
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  const themeColor = '#644222';
  const themeBgLight = '#faf7f2';
  const themeAccent = '#8a643f';

  useEffect(() => {
    if (isAdmin) {
      fetchAllBookings();
    }
  }, [isAdmin]);

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Tạm thời sử dụng getUserBookings vì chưa có endpoint admin
      // Trong thực tế cần tạo endpoint /api/admin/bookings
      const response = await bookingService.getUserBookings();
      console.log('All bookings response:', response);
      
      let bookingsList = [];
      if (Array.isArray(response)) {
        bookingsList = response;
      } else if (response?.bookings && Array.isArray(response.bookings)) {
        bookingsList = response.bookings;
      } else if (response?.data?.bookings && Array.isArray(response.data.bookings)) {
        bookingsList = response.data.bookings;
      }
      
      setBookings(bookingsList);
    } catch (err) {
      console.error('Error fetching all bookings:', err);
      setError('Không thể tải danh sách đặt phòng. Vui lòng đảm bảo bạn đã đăng nhập với tài khoản admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setActionLoading(prev => ({ ...prev, [bookingId]: true }));
      
      // Tạm thời vô hiệu hóa vì chưa có endpoint admin
      alert(`Chức năng cập nhật trạng thái đặt phòng đang được phát triển. Cần tạo endpoint /api/admin/bookings/{id}/status`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state for demo
      setBookings(prev => prev.map(booking => 
        booking.bookingId === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ));
      
    } catch (err) {
      console.error('Error updating booking status:', err);
      alert('Cập nhật trạng thái thất bại. Vui lòng thử lại.');
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#10b981';
      case 'cancelled': return '#ef4444';
      case 'completed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'Chờ duyệt';
      case 'confirmed': return 'Đã xác nhận';
      case 'cancelled': return 'Đã hủy';
      case 'completed': return 'Hoàn thành';
      default: return status || 'N/A';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN');
    } catch {
      return dateStr;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status?.toLowerCase() === filter;
  });

  if (!isAdmin) {
    return (
      <div className="container" style={{ paddingTop: 120, paddingBottom: 40 }}>
        <div style={{ textAlign: 'center', color: '#ef4444' }}>
          <h2>Bạn không có quyền truy cập trang này</h2>
          <p>Chỉ admin mới có thể quản lý đặt phòng</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
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
            <div className="col-12">
              <h1 style={{ color: '#1f2937', fontWeight: 800, fontSize: 32, margin: 0 }}>
                Quản lý đặt phòng
              </h1>
              <p style={{ color: '#6b7280', fontSize: 15, margin: '8px 0 0 0' }}>
                Quản lý và duyệt các đặt phòng của khách hàng
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pt-60 pb-120">
        <div className="container" style={{ maxWidth: 1200 }}>
          {/* Filter */}
          <div 
            className="mb-4" 
            style={{ 
              background: '#fff', 
              border: '1px solid #e5e7eb', 
              borderRadius: 12, 
              padding: 20,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600, color: '#374151' }}>Lọc theo trạng thái:</span>
              {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 6,
                    border: '1px solid #d1d5db',
                    background: filter === status ? themeColor : '#fff',
                    color: filter === status ? '#fff' : '#374151',
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  {status === 'all' ? 'Tất cả' : getStatusText(status)}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div>Đang tải danh sách đặt phòng...</div>
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#ef4444' }}>
              <div>{error}</div>
            </div>
          )}

          {!loading && !error && filteredBookings.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div>Không có đặt phòng nào</div>
            </div>
          )}

          {!loading && !error && filteredBookings.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filteredBookings.map((booking, idx) => (
                <div
                  key={booking.bookingId || idx}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: 12,
                    padding: 20,
                    background: '#fff',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: '#1f2937', marginBottom: 4 }}>
                        Mã đặt phòng: {booking.bookingReference || booking.bookingId}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: 14 }}>
                        Khách hàng: {booking.guestName || booking.user?.name || 'N/A'}
                      </div>
                    </div>
                    <div 
                      style={{ 
                        padding: '6px 12px', 
                        borderRadius: 20, 
                        background: getStatusColor(booking.status) + '20',
                        color: getStatusColor(booking.status),
                        fontSize: 12,
                        fontWeight: 600
                      }}
                    >
                      {getStatusText(booking.status)}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
                    <div>
                      <div style={{ color: '#6b7280', fontSize: 14 }}>Phòng</div>
                      <div style={{ fontWeight: 600, color: '#1f2937' }}>
                        {booking.roomNumber || booking.room?.roomNumber || 'N/A'} - {booking.roomTypeName || booking.room?.roomTypeName || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#6b7280', fontSize: 14 }}>Ngày nhận phòng</div>
                      <div style={{ fontWeight: 600, color: '#1f2937' }}>{formatDate(booking.checkIn)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#6b7280', fontSize: 14 }}>Ngày trả phòng</div>
                      <div style={{ fontWeight: 600, color: '#1f2937' }}>{formatDate(booking.checkOut)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#6b7280', fontSize: 14 }}>Tổng tiền</div>
                      <div style={{ fontWeight: 600, color: themeAccent }}>
                        {(booking.totalPrice || 0).toLocaleString('vi-VN')} VND
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleViewDetails(booking)}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: 6,
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                    >
                      👁️ Xem chi tiết
                    </button>

                    {booking.status?.toLowerCase() === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(booking.bookingId, 'confirmed')}
                          disabled={actionLoading[booking.bookingId]}
                          style={{
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: 6,
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: actionLoading[booking.bookingId] ? 'not-allowed' : 'pointer',
                            opacity: actionLoading[booking.bookingId] ? 0.6 : 1
                          }}
                        >
                          {actionLoading[booking.bookingId] ? '⏳' : '✅'} Duyệt
                        </button>
                        <button
                          onClick={() => handleStatusChange(booking.bookingId, 'cancelled')}
                          disabled={actionLoading[booking.bookingId]}
                          style={{
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: 6,
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: actionLoading[booking.bookingId] ? 'not-allowed' : 'pointer',
                            opacity: actionLoading[booking.bookingId] ? 0.6 : 1
                          }}
                        >
                          {actionLoading[booking.bookingId] ? '⏳' : '❌'} Từ chối
                        </button>
                      </>
                    )}

                    {booking.status?.toLowerCase() === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(booking.bookingId, 'completed')}
                        disabled={actionLoading[booking.bookingId]}
                        style={{
                          background: '#6b7280',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: 6,
                          fontSize: 14,
                          fontWeight: 500,
                          cursor: actionLoading[booking.bookingId] ? 'not-allowed' : 'pointer',
                          opacity: actionLoading[booking.bookingId] ? 0.6 : 1
                        }}
                      >
                        {actionLoading[booking.bookingId] ? '⏳' : '🏁'} Hoàn thành
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {showModal && selectedBooking && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 24,
              maxWidth: 600,
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, color: '#1f2937' }}>Chi tiết đặt phòng</h3>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <strong>Mã đặt phòng:</strong> {selectedBooking.bookingReference || selectedBooking.bookingId}
              </div>
              <div>
                <strong>Khách hàng:</strong> {selectedBooking.guestName || selectedBooking.user?.name || 'N/A'}
              </div>
              <div>
                <strong>Email:</strong> {selectedBooking.guestEmail || selectedBooking.user?.email || 'N/A'}
              </div>
              <div>
                <strong>Số điện thoại:</strong> {selectedBooking.guestPhone || selectedBooking.user?.phone || 'N/A'}
              </div>
              <div>
                <strong>Phòng:</strong> {selectedBooking.roomNumber || selectedBooking.room?.roomNumber || 'N/A'} - {selectedBooking.roomTypeName || selectedBooking.room?.roomTypeName || 'N/A'}
              </div>
              <div>
                <strong>Giá phòng/đêm:</strong> {(selectedBooking.room?.price || selectedBooking.price || 0).toLocaleString('vi-VN')} VND
              </div>
              <div>
                <strong>Ngày nhận phòng:</strong> {formatDate(selectedBooking.checkIn)}
              </div>
              <div>
                <strong>Ngày trả phòng:</strong> {formatDate(selectedBooking.checkOut)}
              </div>
              <div>
                <strong>Số khách:</strong> {selectedBooking.guests || 'N/A'} người
              </div>
              <div>
                <strong>Tổng tiền:</strong> {(selectedBooking.totalPrice || 0).toLocaleString('vi-VN')} VND
              </div>
              <div>
                <strong>Trạng thái:</strong> {getStatusText(selectedBooking.status)}
              </div>
              {selectedBooking.notes && (
                <div>
                  <strong>Ghi chú:</strong> {selectedBooking.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
