import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminPages.css';

interface Booking {
  id: number;
  bookingId?: number;
  userEmail?: string;
  guestEmail?: string;
  roomNumber?: string;
  roomType?: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [currentPage, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const url = statusFilter === 'ALL' 
        ? `/api/admin/bookings?page=${currentPage}&size=10`
        : `/api/admin/bookings/status/${statusFilter}?page=${currentPage}&size=10`;
      
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
      'COMPLETED': { class: 'status-completed', text: 'Hoàn thành' }
    };
    
    const statusInfo = statusMap[status] || { class: 'status-default', text: status };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const filteredBookings = bookings.filter(booking => {
    const customerEmail = booking.userEmail || booking.guestEmail || '';
    return customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (booking.roomNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase());
  });

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
                      <button className="btn-action btn-view">Xem</button>
                      <button className="btn-action btn-edit">Sửa</button>
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
      </div>
    </AdminLayout>
  );
};

export default BookingManagement;
