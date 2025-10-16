import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminPages.css';

interface Booking {
  bookingId: number; // Changed from 'id' to 'bookingId' to match backend
  bookingReference?: string;
  userEmail: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  // Additional fields for guest information
  guestName?: string;
  guestPhone?: string;
  roomNumber?: string;
  guests?: number;
  notes?: string;
  roomId?: number;
  roomType?: string;
  roomDescription?: string;
}

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [roomInfo, setRoomInfo] = useState<any>(null);
  const [roomsData, setRoomsData] = useState<{[key: number]: any}>({});
  
  // Notification states
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'info';
    message: string;
  }>({
    show: false,
    type: 'info',
    message: ''
  });

  // Helper function for dark mode styles
  const getDarkModeStyles = () => {
    const isDark = document.body.classList.contains('dark-mode');
    return {
      backgroundColor: isDark ? '#2d3748' : 'white',
      color: isDark ? '#e2e8f0' : '#2d3748',
      borderColor: isDark ? '#4a5568' : '#e2e8f0',
      labelColor: isDark ? '#a0aec0' : '#4a5568',
      inputBg: isDark ? '#4a5568' : 'white',
      inputColor: isDark ? '#e2e8f0' : '#2d3748'
    };
  };

  // Show notification function
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({
      show: true,
      type,
      message
    });
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  useEffect(() => {
    fetchBookings();
    fetchAllRooms();
  }, [currentPage, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      if (!token) {
        showNotification('error', 'Vui lòng đăng nhập để tiếp tục');
        setTimeout(() => window.location.href = '/login', 2000);
        return;
      }
      
      // Gọi API backend thật
      const url = statusFilter === 'ALL' 
        ? `/api/admin/bookings?page=${currentPage}&size=10`
        : `/api/admin/bookings/status/${statusFilter}?page=${currentPage}&size=10`;
      
      
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
        setTotalPages(data.totalPages || 0);
      } else {
        if (response.status === 403) {
          showNotification('error', 'Token không hợp lệ hoặc hết hạn. Vui lòng đăng nhập lại.');
          setTimeout(() => window.location.href = '/login', 2000);
        } else if (response.status === 401) {
          showNotification('error', 'Không có quyền truy cập. Vui lòng đăng nhập lại.');
          setTimeout(() => window.location.href = '/login', 2000);
        } else {
          showNotification('error', `Lỗi API: ${response.status} - ${response.statusText}`);
        }
        setBookings([]);
        setTotalPages(0);
      }
      
    } catch (error: any) {
      showNotification('error', `Lỗi kết nối: ${error.message || 'Unknown error'}`);
      setBookings([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { class: string; text: string } } = {
      'pending': { class: 'status-pending', text: 'Chờ xử lý' },
      'confirmed': { class: 'status-confirmed', text: 'Đã xác nhận' },
      'cancelled': { class: 'status-cancelled', text: 'Đã hủy' },
      'paid': { class: 'status-completed', text: 'Đã thanh toán' },
      'refunded': { class: 'status-cancelled', text: 'Đã hoàn tiền' },
      // Backward compatibility
      'PENDING': { class: 'status-pending', text: 'Chờ xử lý' },
      'CONFIRMED': { class: 'status-confirmed', text: 'Đã xác nhận' },
      'CANCELLED': { class: 'status-cancelled', text: 'Đã hủy' },
      'COMPLETED': { class: 'status-completed', text: 'Hoàn thành' },
      'PAID': { class: 'status-completed', text: 'Đã thanh toán' }
    };
    
    const statusInfo = statusMap[status] || { class: 'status-default', text: status };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const filteredBookings = bookings.filter(booking => {
    // Filter by status
    const statusMatch = statusFilter === 'ALL' || booking.status === statusFilter;
    
    // Filter by search term - tìm kiếm trong nhiều trường
    const searchMatch = (() => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      
      // Tìm trong email khách hàng
      const emailMatch = (booking.userEmail?.toLowerCase() || '').includes(searchLower);
      
      // Tìm trong tên phòng
      const roomNameMatch = (booking.roomName?.toLowerCase() || '').includes(searchLower);
      
      // Tìm trong số phòng từ roomId
      const roomId = (booking as any)?.roomId;
      const roomData = roomId ? roomsData[roomId] : null;
      const roomNumberMatch = roomData?.roomNumber?.toString().includes(searchTerm) || 
                             (booking as any)?.roomNumber?.toString().includes(searchTerm) ||
                             (booking as any)?.roomId?.toString().includes(searchTerm);
      
      // Tìm trong ID booking
      const bookingIdMatch = booking.id?.toString().includes(searchTerm) ||
                            (booking as any)?.bookingId?.toString().includes(searchTerm);
      
      return emailMatch || roomNameMatch || roomNumberMatch || bookingIdMatch;
    })();
    
    return statusMatch && searchMatch;
  });

  // Fetch room info
  const fetchRoomInfo = async (roomId: number) => {
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      const response = await fetch(`/api/rooms/${roomId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const roomData = await response.json();
        setRoomInfo(roomData);
      }
    } catch (error) {
    }
  };

  // Fetch all rooms data
  const fetchAllRooms = async () => {
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      const response = await fetch('/api/rooms', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const roomsMap: {[key: number]: any} = {};
        if (data.rooms) {
          data.rooms.forEach((room: any) => {
            roomsMap[room.roomId] = room;
          });
        }
        setRoomsData(roomsMap);
      }
    } catch (error) {
    }
  };

  // Modal handlers
  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowViewModal(true);
    
    // Fetch room info if roomId exists
    const roomId = (booking as any)?.roomId;
    if (roomId) {
      fetchRoomInfo(roomId);
    }
  };

  const handleEditBooking = (booking: Booking) => {
    const bookingExists = bookings.find(b => b.bookingId === booking.bookingId);
    
    if (!bookingExists) {
      showNotification('error', 'Booking không tồn tại trong danh sách hiện tại!');
      return;
    }
    
    setSelectedBooking(booking);
    setShowEditModal(true);
    
    // Fetch room info if roomId exists
    const roomId = (booking as any)?.roomId;
    if (roomId) {
      fetchRoomInfo(roomId);
    }
  };

  const handleDeleteBooking = async (bookingId: number) => {
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      const response = await fetch(`/api/admin/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: 'Hủy bởi admin'
        })
      });

      if (response.ok) {
        // Cập nhật trạng thái booking thành CANCELLED
        setBookings(bookings.map(booking => 
          booking.bookingId === bookingId 
            ? { ...booking, status: 'CANCELLED' }
            : booking
        ));
        // Không hiển thị thông báo success
      } else {
        const errorData = await response.json();
        showNotification('error', `Lỗi khi hủy booking: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      showNotification('error', 'Lỗi khi hủy booking!');
    }
  };

  const handleConfirmBooking = async (bookingId: number) => {
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      if (!token) {
        showNotification('error', 'Vui lòng đăng nhập để tiếp tục');
        return;
      }

      const response = await fetch(`/api/admin/bookings/${bookingId}/confirm`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        showNotification('success', 'Xác nhận booking thành công! Phòng đã chuyển sang trạng thái BOOKED');
        fetchBookings(); // Refresh the list
        fetchAllRooms(); // Refresh room data
      } else {
        const errorData = await response.json();
        showNotification('error', `Lỗi xác nhận booking: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error: any) {
      showNotification('error', `Lỗi kết nối: ${error.message || 'Unknown error'}`);
    }
  };

  const handleUpdateBooking = async (updatedBooking: Booking) => {
    try {
      // Kiểm tra bookingId có tồn tại không
      const bookingId = updatedBooking.bookingId;
      if (!bookingId) {
        showNotification('error', 'Không tìm thấy ID booking!');
        return;
      }

      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      
      // Kiểm tra token có hợp lệ không
      if (!token) {
        showNotification('error', 'Không tìm thấy token xác thực! Vui lòng đăng nhập lại.');
        setTimeout(() => window.location.href = '/login', 2000);
        return;
      }
      
      const url = `/api/admin/bookings/${bookingId}/update`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          guestName: updatedBooking.guestName,
          guestEmail: updatedBooking.guestEmail || updatedBooking.userEmail,
          guestPhone: updatedBooking.guestPhone,
          guests: updatedBooking.guests,
          notes: updatedBooking.notes,
          checkIn: updatedBooking.checkIn,
          checkOut: updatedBooking.checkOut
        })
      });

      
      if (response.ok) {
        showNotification('success', 'Cập nhật thông tin booking thành công!');
        setShowEditModal(false);
        setSelectedBooking(null);
        fetchBookings(); // Refresh the list
      } else {
        let errorMessage = 'Unknown error';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || 'Unknown error';
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || 'Unknown error';
        }
        
        if (response.status === 403) {
          showNotification('error', 'Token không hợp lệ hoặc hết hạn. Vui lòng đăng nhập lại.');
          setTimeout(() => window.location.href = '/login', 2000);
        } else if (response.status === 401) {
          showNotification('error', 'Không có quyền truy cập. Vui lòng đăng nhập lại.');
          setTimeout(() => window.location.href = '/login', 2000);
        } else {
          showNotification('error', `Lỗi khi cập nhật booking: ${errorMessage}`);
        }
      }
    } catch (error) {
      showNotification('error', 'Lỗi khi cập nhật booking!');
    }
  };

  return (
    <AdminLayout title="Quản lý đặt phòng" breadcrumb="Quản lý đặt phòng">
      <div className="admin-page">
        {/* Filters */}
        <div className="admin-filters">
          <div className="filter-group">
            <label>Trạng thái:</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
                    <option value="ALL">Tất cả</option>
                    <option value="pending">Chờ xử lý</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="cancelled">Đã hủy</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="refunded">Đã hoàn tiền</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Tìm kiếm:</label>
            <input
              type="text"
              placeholder="Email, tên phòng, số phòng, ID booking..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>
        </div>

        {/* Bookings Table */}
        <div className="admin-table-container">
          {loading ? (
            <div className="loading">Đang tải...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email khách hàng</th>
                  <th>Phòng</th>
                  <th>Ngày nhận</th>
                  <th>Ngày trả</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.bookingId}>
                    <td>{booking.bookingId}</td>
                    <td>{booking.guestEmail || booking.userEmail || 'N/A'}</td>
                    <td>
                      {(() => {
                        const roomId = (booking as any)?.roomId;
                        const roomData = roomId ? roomsData[roomId] : null;
                        return roomData?.roomNumber || (booking as any)?.roomNumber || (booking as any)?.roomId || booking.roomName || 'N/A';
                      })()}
                    </td>
                    <td>{new Date(booking.checkIn).toLocaleDateString('vi-VN')}</td>
                    <td>{new Date(booking.checkOut).toLocaleDateString('vi-VN')}</td>
                    <td>{booking.totalPrice.toLocaleString('vi-VN')} VNĐ</td>
                    <td>{getStatusBadge(booking.status)}</td>
                    <td>{new Date(booking.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <button 
                        className="btn-action btn-view"
                        onClick={(e) => {
                          e.preventDefault();
                          handleViewBooking(booking);
                        }}
                      >
                        Xem
                      </button>
                      <button 
                        className="btn-action btn-edit"
                        onClick={(e) => {
                          e.preventDefault();
                          handleEditBooking(booking);
                        }}
                      >
                        Sửa
                      </button>
                      {booking.status === 'pending' && (
                        <button 
                          className="btn-action btn-confirm"
                          onClick={() => handleConfirmBooking(booking.bookingId)}
                          style={{
                            backgroundColor: '#48bb78',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginLeft: '5px'
                          }}
                        >
                          Xác nhận
                        </button>
                      )}
                      <button 
                        className="btn-action btn-delete"
                        onClick={() => handleDeleteBooking(booking.bookingId)}
                      >
                        Hủy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="pagination-btn"
            >
              Trước
            </button>
            <span className="pagination-info">
              Trang {currentPage + 1} / {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="pagination-btn"
            >
              Sau
            </button>
          </div>
        )}


        {/* Simple Test Modal */}
        {showViewModal && selectedBooking && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              zIndex: 999999,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onClick={() => setShowViewModal(false)} // Close modal when clicking outside
          >
            <div 
              style={{
                backgroundColor: getDarkModeStyles().backgroundColor,
                color: getDarkModeStyles().color,
                padding: '30px',
                border: '2px solid #3182ce',
                borderRadius: '8px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto'
              }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <h2 style={{ margin: '0 0 20px 0', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Chi tiết đặt phòng</h2>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0' }}>
                  <strong>ID Booking:</strong>
                  <span>{selectedBooking.id || (selectedBooking as any)?.bookingId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0' }}>
                  <strong>Mã đặt phòng:</strong>
                  <span>{(selectedBooking as any)?.bookingReference || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0' }}>
                  <strong>Tên khách:</strong>
                  <span>{(selectedBooking as any)?.guestName || (selectedBooking as any)?.userName || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0' }}>
                  <strong>Email khách hàng:</strong>
                  <span>{selectedBooking.userEmail || (selectedBooking as any)?.guestEmail}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0' }}>
                  <strong>Số điện thoại:</strong>
                  <span>{(selectedBooking as any)?.guestPhone || (selectedBooking as any)?.phone || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0' }}>
                  <strong>Tên phòng:</strong>
                  <span>{roomInfo?.roomNumber || (selectedBooking as any)?.roomNumber || (selectedBooking as any)?.roomId || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0' }}>
                  <strong>Số phòng:</strong>
                  <span>{roomInfo?.roomNumber || (selectedBooking as any)?.roomNumber || (selectedBooking as any)?.roomId || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0' }}>
                  <strong>Số khách:</strong>
                  <span>{(selectedBooking as any)?.guests || (selectedBooking as any)?.guestCount || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0' }}>
                  <strong>Mô tả phòng:</strong>
                  <span>{roomInfo?.description || (selectedBooking as any)?.roomDescription || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0' }}>
                  <strong>Loại phòng:</strong>
                  <span>{roomInfo?.roomType?.name || (selectedBooking as any)?.roomType || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0' }}>
                  <strong>Giá phòng:</strong>
                  <span>{roomInfo?.price ? `${roomInfo.price.toLocaleString('vi-VN')} VNĐ/đêm` : 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0' }}>
                  <strong>Ngày nhận phòng:</strong>
                  <span>{new Date(selectedBooking.checkIn).toLocaleDateString('vi-VN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0' }}>
                  <strong>Ngày trả phòng:</strong>
                  <span>{new Date(selectedBooking.checkOut).toLocaleDateString('vi-VN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0' }}>
                  <strong>Tổng tiền:</strong>
                  <span>{selectedBooking.totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0' }}>
                  <strong>Trạng thái:</strong>
                  <span>{getStatusBadge(selectedBooking.status)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong>Ngày tạo:</strong>
                  <span>{new Date(selectedBooking.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  onClick={() => setShowViewModal(false)}
                  style={{ 
                    padding: '10px 20px', 
                    fontSize: '16px',
                    backgroundColor: '#e2e8f0',
                    color: '#4a5568',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Edit Modal */}
        {showEditModal && selectedBooking && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              zIndex: 999999,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onClick={() => setShowEditModal(false)} // Close modal when clicking outside
          >
            <div 
              style={{
                backgroundColor: getDarkModeStyles().backgroundColor,
                color: getDarkModeStyles().color,
                padding: '30px',
                border: '2px solid #3182ce',
                borderRadius: '8px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto'
              }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <h2 style={{ margin: '0 0 20px 0', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Chỉnh sửa đặt phòng</h2>
              
              
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateBooking(selectedBooking);
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Tên khách:</label>
                  <input 
                    type="text" 
                    value={(selectedBooking as any)?.guestName || (selectedBooking as any)?.userName || ''}
                    onChange={(e) => setSelectedBooking({
                      ...selectedBooking,
                      guestName: e.target.value
                    })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : 'white',
                      color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Email khách hàng:</label>
                  <input 
                    type="email" 
                    value={selectedBooking.userEmail || (selectedBooking as any)?.guestEmail || ''}
                    onChange={(e) => setSelectedBooking({
                      ...selectedBooking,
                      userEmail: e.target.value
                    })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : 'white',
                      color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Số điện thoại:</label>
                  <input 
                    type="tel" 
                    value={(selectedBooking as any)?.guestPhone || (selectedBooking as any)?.phone || ''}
                    onChange={(e) => setSelectedBooking({
                      ...selectedBooking,
                      guestPhone: e.target.value
                    })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : 'white',
                      color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Tên phòng:</label>
                  <input 
                    type="text" 
                    value={roomInfo?.roomNumber || (selectedBooking as any)?.roomNumber || ''}
                    onChange={(e) => setSelectedBooking({
                      ...selectedBooking,
                      roomNumber: e.target.value
                    })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : 'white',
                      color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Số phòng:</label>
                  <input 
                    type="text" 
                    value={roomInfo?.roomNumber || (selectedBooking as any)?.roomNumber || (selectedBooking as any)?.roomId || ''}
                    onChange={(e) => setSelectedBooking({
                      ...selectedBooking,
                      roomNumber: e.target.value
                    })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : 'white',
                      color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Số khách:</label>
                  <input 
                    type="number" 
                    value={(selectedBooking as any)?.guests || (selectedBooking as any)?.guestCount || ''}
                    onChange={(e) => setSelectedBooking({
                      ...selectedBooking,
                      guests: parseInt(e.target.value)
                    })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : 'white',
                      color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Loại phòng:</label>
                  <input 
                    type="text" 
                    value={roomInfo?.roomType?.name || (selectedBooking as any)?.roomType || ''}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#2d3748' : '#f7fafc',
                      color: document.body.classList.contains('dark-mode') ? '#a0aec0' : '#718096'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Giá phòng (VNĐ/đêm):</label>
                  <input 
                    type="number" 
                    value={roomInfo?.price || ''}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#2d3748' : '#f7fafc',
                      color: document.body.classList.contains('dark-mode') ? '#a0aec0' : '#718096'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Ngày nhận phòng:</label>
                  <input 
                    type="date" 
                    value={selectedBooking.checkIn}
                    onChange={(e) => setSelectedBooking({
                      ...selectedBooking,
                      checkIn: e.target.value
                    })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : 'white',
                      color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Ngày trả phòng:</label>
                  <input 
                    type="date" 
                    value={selectedBooking.checkOut}
                    onChange={(e) => setSelectedBooking({
                      ...selectedBooking,
                      checkOut: e.target.value
                    })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : 'white',
                      color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Tổng tiền:</label>
                  <input 
                    type="number" 
                    value={selectedBooking.totalPrice}
                    onChange={(e) => setSelectedBooking({
                      ...selectedBooking,
                      totalPrice: parseInt(e.target.value)
                    })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : 'white',
                      color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Ghi chú:</label>
                  <textarea 
                    value={(selectedBooking as any)?.notes || ''}
                    onChange={(e) => setSelectedBooking({
                      ...selectedBooking,
                      notes: e.target.value
                    })}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : 'white',
                      color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748',
                      resize: 'vertical'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748' }}>Trạng thái:</label>
                  <select 
                    value={selectedBooking.status}
                    onChange={(e) => setSelectedBooking({
                      ...selectedBooking,
                      status: e.target.value
                    })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: document.body.classList.contains('dark-mode') ? '1px solid #4a5568' : '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#4a5568' : 'white',
                      color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#2d3748'
                    }}
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="cancelled">Đã hủy</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="refunded">Đã hoàn tiền</option>
                  </select>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button 
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    style={{ 
                      padding: '10px 20px', 
                      fontSize: '16px',
                      backgroundColor: '#e2e8f0',
                      color: '#4a5568',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit"
                    style={{ 
                      padding: '10px 20px', 
                      fontSize: '16px',
                      backgroundColor: '#3182ce',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Notification Component */}
        {notification.show && (
          <div 
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              backgroundColor: notification.type === 'success' ? '#10b981' : 
                              notification.type === 'error' ? '#ef4444' : '#3b82f6',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              zIndex: 1000000,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '300px',
              maxWidth: '500px',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            <div style={{ fontSize: '20px' }}>
              {notification.type === 'success' ? '✅' : 
               notification.type === 'error' ? '❌' : 'ℹ️'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                {notification.type === 'success' ? 'Thành công' : 
                 notification.type === 'error' ? 'Lỗi' : 'Thông báo'}
              </div>
              <div style={{ fontSize: '14px' }}>
                {notification.message}
              </div>
            </div>
            <button
              onClick={() => setNotification(prev => ({ ...prev, show: false }))}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BookingManagement;

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
