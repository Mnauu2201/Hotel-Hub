import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useNotification } from '../../hooks/useNotification';
import './AdminPages.css';

interface Booking {
  id: number;
  bookingId?: number;
  bookingReference?: string;
  userEmail?: string;
  guestEmail?: string;
  guestName?: string;
  guestPhone?: string;
  roomNumber?: string;
  roomType?: string;
  roomId?: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  notes?: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  holdUntil?: string;
}

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Booking>>({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [latestBooking, setLatestBooking] = useState<Booking | null>(null);
  const { showSuccess, showError, NotificationContainer } = useNotification();

  useEffect(() => {
    fetchBookings();
  }, [currentPage, statusFilter, startDate, endDate]);

  useEffect(() => {
    // Check if dark mode is enabled
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark-mode') || 
                    window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };
    
    checkDarkMode();
    
    // Listen for changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);
    
    return () => mediaQuery.removeEventListener('change', checkDarkMode);
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      // Tạo URL với tham số lọc theo ngày
      let url = statusFilter === 'ALL' 
        ? `/api/admin/bookings?page=${currentPage}&size=10`
        : `/api/admin/bookings/status/${statusFilter}?page=${currentPage}&size=10`;
      
      // Thêm tham số lọc theo ngày nếu có
      if (startDate) {
        url += `&startDate=${startDate}`;
      }
      if (endDate) {
        url += `&endDate=${endDate}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
        setTotalPages(data.totalPages || 0);
        
        // Lấy booking mới nhất (PENDING status)
        const latestPendingBooking = data.bookings.find((booking: Booking) => 
          booking.status === 'PENDING'
        );
        setLatestBooking(latestPendingBooking || null);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { class: string; text: string } } = {
      'PENDING': { class: 'status-pending', text: 'Chờ xử lý' },
      'CONFIRMED': { class: 'status-confirmed', text: 'Đã xác nhận' },
      'CANCELLED': { class: 'status-cancelled', text: 'Đã hủy' },
      'PAID': { class: 'status-paid', text: 'Đã thanh toán' },
      'REFUNDED': { class: 'status-refunded', text: 'Đã hoàn tiền' },
      'COMPLETED': { class: 'status-completed', text: 'Hoàn thành' },
      'pending': { class: 'status-pending', text: 'Chờ xử lý' },
      'confirmed': { class: 'status-confirmed', text: 'Đã xác nhận' },
      'cancelled': { class: 'status-cancelled', text: 'Đã hủy' },
      'paid': { class: 'status-paid', text: 'Đã thanh toán' },
      'refunded': { class: 'status-refunded', text: 'Đã hoàn tiền' },
      'completed': { class: 'status-completed', text: 'Hoàn thành' }
    };
    
    const statusInfo = statusMap[status] || { class: 'status-default', text: status };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowViewModal(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditFormData({
      status: booking.status,
      notes: booking.notes || '',
      guests: booking.guests,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut
    });
    setShowEditModal(true);
  };

  const handleUpdateBooking = async () => {
    if (!selectedBooking) return;

    const bookingId = selectedBooking.bookingId || selectedBooking.id;
    if (!bookingId) {
      showError('Lỗi: Không tìm thấy ID booking để cập nhật');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      console.log('Updating booking with ID:', bookingId);
      console.log('Form data:', editFormData);
      
      // Convert status to backend-compatible format
      const statusMapping: { [key: string]: string } = {
        'Chờ xử lý': 'pending',
        'Đã xác nhận': 'confirmed', 
        'Đã hủy': 'cancelled',
        'Đã thanh toán': 'paid',
        'Đã hoàn tiền': 'refunded',
        'Hoàn thành': 'completed'
      };
      
      const submitData = {
        ...editFormData,
        status: statusMapping[editFormData.status || ''] || editFormData.status?.toLowerCase()
      };
      
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        showSuccess('Cập nhật booking thành công!');
        setShowEditModal(false);
        setSelectedBooking(null);
        fetchBookings(); // Refresh the list
      } else {
        const errorData = await response.json();
        showError('Lỗi: ' + (errorData.message || 'Không thể cập nhật booking'));
      }
    } catch (error) {
      showError('Lỗi kết nối: ' + (error as Error).message);
    }
  };

  const handleConfirmBooking = async (bookingId: number) => {
    if (!bookingId) {
      showError('Lỗi: Không tìm thấy ID booking để xác nhận');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn xác nhận booking này?')) {
      try {
        const token = localStorage.getItem('accessToken');
        
        const response = await fetch(`http://localhost:8080/api/admin/bookings/${bookingId}/confirm`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          showSuccess('Xác nhận booking thành công!');
          fetchBookings(); // Refresh danh sách
        } else {
          const errorData = await response.json();
          showError('Lỗi: ' + (errorData.message || 'Không thể xác nhận booking'));
        }
      } catch (error) {
        showError('Lỗi kết nối: ' + (error as Error).message);
      }
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!bookingId) {
      showError('Lỗi: Không tìm thấy ID booking để hủy');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn hủy booking này?')) {
      try {
        const token = localStorage.getItem('accessToken');
        
        const response = await fetch(`http://localhost:8080/api/admin/bookings/${bookingId}/cancel`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          showSuccess('Hủy booking thành công!');
          fetchBookings(); // Refresh danh sách
        } else {
          const errorData = await response.json();
          showError('Lỗi: ' + (errorData.message || 'Không thể hủy booking'));
        }
      } catch (error) {
        showError('Lỗi kết nối: ' + (error as Error).message);
      }
    }
  };

  const handleDateFilter = () => {
    setCurrentPage(0); // Reset về trang đầu
    fetchBookings();
  };

  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
    setCurrentPage(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? Number(value) : value
    }));
  };



  // Get modal styles based on dark mode
  const getModalStyles = () => {
    if (isDarkMode) {
      return {
        modalContent: {
          background: '#1a202c',
          color: '#ffffff',
          border: '1px solid #4a5568'
        },
        modalHeader: {
          background: '#1a202c',
          borderBottom: '1px solid #4a5568'
        },
        modalFooter: {
          borderTop: '1px solid #4a5568',
          background: '#1a202c'
        },
        textWhite: { color: '#ffffff' },
        textLight: { color: '#e2e8f0' },
        borderBottom: { borderBottom: '1px solid #4a5568' },
        inputStyle: {
          background: '#2d3748',
          color: '#ffffff',
          border: '1px solid #4a5568'
        },
        buttonSecondary: {
          background: '#4a5568',
          color: '#ffffff',
          border: '1px solid #718096'
        },
        buttonPrimary: {
          background: '#3182ce',
          color: '#ffffff',
          border: '1px solid #3182ce'
        }
      };
    } else {
      return {
        modalContent: {
          background: '#ffffff',
          color: '#000000',
          border: '1px solid #e2e8f0'
        },
        modalHeader: {
          background: '#f8f9fa',
          borderBottom: '1px solid #e2e8f0'
        },
        modalFooter: {
          borderTop: '1px solid #e2e8f0',
          background: '#f8f9fa'
        },
        textWhite: { color: '#000000' },
        textLight: { color: '#666666' },
        borderBottom: { borderBottom: '1px solid #e2e8f0' },
        inputStyle: {
          background: '#ffffff',
          color: '#000000',
          border: '1px solid #d1d5db'
        },
        buttonSecondary: {
          background: '#6b7280',
          color: '#ffffff',
          border: '1px solid #6b7280'
        },
        buttonPrimary: {
          background: '#3b82f6',
          color: '#ffffff',
          border: '1px solid #3b82f6'
        }
      };
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const customerEmail = booking.userEmail || booking.guestEmail || '';
    return customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (booking.roomNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase());
  });

  return (
    <AdminLayout title="Quản lý đặt phòng" breadcrumb="Quản lý đặt phòng">
      <NotificationContainer />
      <div className="admin-page dark-mode">
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
              <option value="PENDING">Chờ xử lý</option>
              <option value="CONFIRMED">Đã xác nhận</option>
              <option value="CANCELLED">Đã hủy</option>
              <option value="COMPLETED">Hoàn thành</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Tìm kiếm:</label>
            <input
              type="text"
              placeholder="Email hoặc số phòng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label>Lọc theo ngày:</label>
            <div className="date-filter-container">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="filter-input"
                placeholder="Từ ngày"
              />
              <span className="date-separator">đến</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="filter-input"
                placeholder="Đến ngày"
              />
              <button 
                onClick={handleDateFilter}
                className="btn-filter"
                style={{ backgroundColor: '#007bff', color: 'white', marginLeft: '10px' }}
              >
                Lọc
              </button>
              <button 
                onClick={clearDateFilter}
                className="btn-clear"
                style={{ backgroundColor: '#6c757d', color: 'white', marginLeft: '5px' }}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>

        {/* Latest Booking Section */}
        {latestBooking && (
          <div className="latest-booking-section">
            <div className="latest-booking-card">
              <div className="latest-booking-header">
                <h3>📋 Đặt phòng mới nhất cần xử lý</h3>
                <span className="urgent-badge">URGENT</span>
              </div>
              <div className="latest-booking-content">
                <div className="booking-info-grid">
                  <div className="info-item">
                    <label>Mã đặt phòng:</label>
                    <span>{latestBooking.bookingReference || `#${latestBooking.id}`}</span>
                  </div>
                  <div className="info-item">
                    <label>Email khách hàng:</label>
                    <span>{latestBooking.userEmail || latestBooking.guestEmail}</span>
                  </div>
                  <div className="info-item">
                    <label>Phòng:</label>
                    <span>{latestBooking.roomNumber} ({latestBooking.roomType})</span>
                  </div>
                  <div className="info-item">
                    <label>Ngày nhận:</label>
                    <span>{new Date(latestBooking.checkIn).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="info-item">
                    <label>Ngày trả:</label>
                    <span>{new Date(latestBooking.checkOut).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="info-item">
                    <label>Tổng tiền:</label>
                    <span className="price">{latestBooking.totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  <div className="info-item">
                    <label>Trạng thái:</label>
                    <span className="status-pending">Chờ xác nhận</span>
                  </div>
                </div>
                <div className="booking-actions">
                  <button 
                    className="btn-confirm"
                    onClick={() => handleConfirmBooking(latestBooking.id)}
                  >
                    ✅ Xác nhận
                  </button>
                  <button 
                    className="btn-cancel"
                    onClick={() => handleCancelBooking(latestBooking.id)}
                  >
                    ❌ Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
                  <tr key={booking.id}>
                    <td>{booking.bookingId || booking.id}</td>
                    <td>{booking.userEmail || booking.guestEmail || '-'}</td>
                    <td>
                      {booking.roomNumber || '-'}
                      {booking.roomType && (
                        <span className="room-type-info"> ({booking.roomType})</span>
                      )}
                    </td>
                    <td>{new Date(booking.checkIn).toLocaleDateString('vi-VN')}</td>
                    <td>{new Date(booking.checkOut).toLocaleDateString('vi-VN')}</td>
                    <td>{booking.totalPrice.toLocaleString('vi-VN')} VNĐ</td>
                    <td>{getStatusBadge(booking.status)}</td>
                    <td>{new Date(booking.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <button 
                        className="btn-action btn-view"
                        onClick={() => handleViewBooking(booking)}
                      >
                        Xem
                      </button>
                      <button 
                        className="btn-action btn-edit"
                        onClick={() => handleEditBooking(booking)}
                      >
                        Sửa
                      </button>
                      {booking.status === 'pending' && (
                        <>
                          <button 
                            className="btn-action btn-confirm"
                            onClick={() => handleConfirmBooking(booking.bookingId || booking.id)}
                            style={{ backgroundColor: '#28a745', color: 'white', marginLeft: '5px' }}
                          >
                            Xác nhận
                          </button>
                          <button 
                            className="btn-action btn-cancel"
                            onClick={() => handleCancelBooking(booking.bookingId || booking.id)}
                            style={{ backgroundColor: '#dc3545', color: 'white', marginLeft: '5px' }}
                          >
                            Hủy
                          </button>
                        </>
                      )}
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

        {/* View Booking Modal */}
        {showViewModal && selectedBooking && (
          <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={getModalStyles().modalContent}>
              <div className="modal-header" style={getModalStyles().modalHeader}>
                <h3 style={getModalStyles().textWhite}>Chi tiết Booking</h3>
                <button className="modal-close" onClick={() => setShowViewModal(false)} style={getModalStyles().textWhite}>×</button>
              </div>
              <div className="modal-body">
                <div className="booking-details">
                  <div className="detail-row" style={getModalStyles().borderBottom}>
                    <label style={getModalStyles().textWhite}>ID Booking:</label>
                    <span style={getModalStyles().textLight}>{selectedBooking.bookingId || selectedBooking.id}</span>
                  </div>
                  <div className="detail-row" style={getModalStyles().borderBottom}>
                    <label style={getModalStyles().textWhite}>Mã tham chiếu:</label>
                    <span style={getModalStyles().textLight}>{selectedBooking.bookingReference || '-'}</span>
                  </div>
                  <div className="detail-row" style={getModalStyles().borderBottom}>
                    <label style={getModalStyles().textWhite}>Email khách hàng:</label>
                    <span style={getModalStyles().textLight}>{selectedBooking.userEmail || selectedBooking.guestEmail || '-'}</span>
                  </div>
                  <div className="detail-row" style={getModalStyles().borderBottom}>
                    <label style={getModalStyles().textWhite}>Tên khách:</label>
                    <span style={getModalStyles().textLight}>{selectedBooking.guestName || '-'}</span>
                  </div>
                  <div className="detail-row" style={getModalStyles().borderBottom}>
                    <label style={getModalStyles().textWhite}>Số điện thoại:</label>
                    <span style={getModalStyles().textLight}>{selectedBooking.guestPhone || '-'}</span>
                  </div>
                  <div className="detail-row" style={getModalStyles().borderBottom}>
                    <label style={getModalStyles().textWhite}>Phòng:</label>
                    <span style={getModalStyles().textLight}>{selectedBooking.roomNumber || '-'} ({selectedBooking.roomType || '-'})</span>
                  </div>
                  <div className="detail-row" style={getModalStyles().borderBottom}>
                    <label style={getModalStyles().textWhite}>Ngày nhận phòng:</label>
                    <span style={getModalStyles().textLight}>{new Date(selectedBooking.checkIn).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="detail-row" style={getModalStyles().borderBottom}>
                    <label style={getModalStyles().textWhite}>Ngày trả phòng:</label>
                    <span style={getModalStyles().textLight}>{new Date(selectedBooking.checkOut).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="detail-row" style={getModalStyles().borderBottom}>
                    <label style={getModalStyles().textWhite}>Số khách:</label>
                    <span style={getModalStyles().textLight}>{selectedBooking.guests}</span>
                  </div>
                  <div className="detail-row" style={getModalStyles().borderBottom}>
                    <label style={getModalStyles().textWhite}>Tổng tiền:</label>
                    <span style={getModalStyles().textLight}>{selectedBooking.totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  <div className="detail-row" style={getModalStyles().borderBottom}>
                    <label style={getModalStyles().textWhite}>Trạng thái:</label>
                    <span style={getModalStyles().textWhite}>{getStatusBadge(selectedBooking.status)}</span>
                  </div>
                  <div className="detail-row" style={getModalStyles().borderBottom}>
                    <label style={getModalStyles().textWhite}>Ghi chú:</label>
                    <span style={getModalStyles().textLight}>{selectedBooking.notes || '-'}</span>
                  </div>
                  <div className="detail-row" style={getModalStyles().borderBottom}>
                    <label style={getModalStyles().textWhite}>Ngày tạo:</label>
                    <span style={getModalStyles().textLight}>{new Date(selectedBooking.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={getModalStyles().modalFooter}>
                <button className="btn-secondary" onClick={() => setShowViewModal(false)} style={getModalStyles().buttonSecondary}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Booking Modal */}
        {showEditModal && selectedBooking && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={getModalStyles().modalContent}>
              <div className="modal-header" style={getModalStyles().modalHeader}>
                <h3 style={getModalStyles().textWhite}>Sửa Booking</h3>
                <button className="modal-close" onClick={() => setShowEditModal(false)} style={getModalStyles().textWhite}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label style={getModalStyles().textWhite}>Trạng thái:</label>
                  <select
                    name="status"
                    value={editFormData.status || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    style={getModalStyles().inputStyle}
                  >
                    <option value="PENDING" style={getModalStyles().inputStyle}>Chờ xử lý</option>
                    <option value="CONFIRMED" style={getModalStyles().inputStyle}>Đã xác nhận</option>
                    <option value="CANCELLED" style={getModalStyles().inputStyle}>Đã hủy</option>
                    <option value="COMPLETED" style={getModalStyles().inputStyle}>Hoàn thành</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={getModalStyles().textWhite}>Số khách:</label>
                  <input
                    type="number"
                    name="guests"
                    value={editFormData.guests || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    min="1"
                    style={getModalStyles().inputStyle}
                  />
                </div>
                <div className="form-group">
                  <label style={getModalStyles().textWhite}>Ngày nhận phòng:</label>
                  <input
                    type="date"
                    name="checkIn"
                    value={editFormData.checkIn || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    style={getModalStyles().inputStyle}
                  />
                </div>
                <div className="form-group">
                  <label style={getModalStyles().textWhite}>Ngày trả phòng:</label>
                  <input
                    type="date"
                    name="checkOut"
                    value={editFormData.checkOut || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    style={getModalStyles().inputStyle}
                  />
                </div>
                <div className="form-group">
                  <label style={getModalStyles().textWhite}>Ghi chú:</label>
                  <textarea
                    name="notes"
                    value={editFormData.notes || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    rows={3}
                    style={getModalStyles().inputStyle}
                  />
                </div>
              </div>
              <div className="modal-footer" style={getModalStyles().modalFooter}>
                <button className="btn-secondary" onClick={() => setShowEditModal(false)} style={getModalStyles().buttonSecondary}>
                  Hủy
                </button>
                <button className="btn-primary" onClick={handleUpdateBooking} style={getModalStyles().buttonPrimary}>
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BookingManagement;
