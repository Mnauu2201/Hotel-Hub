import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNotification } from '../hooks/useNotification';
import bookingService from '../services/bookingService';
import vietqrService from '../services/vietqrService';

interface BookingCountdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  totalAmount: number;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
}

const BookingCountdownModal: React.FC<BookingCountdownModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  totalAmount,
  roomNumber,
  checkInDate,
  checkOutDate
}) => {
  const { showSuccess, showError, NotificationContainer } = useNotification();
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 phút = 300 giây
  const [isExpired, setIsExpired] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Reset states when modal opens
    setIsExpired(false);
    setTimeLeft(5 * 60);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const generateVietQR = () => {
    return vietqrService.generateBookingVietQR(
      bookingId,
      totalAmount,
      roomNumber,
      checkInDate,
      checkOutDate
    );
  };

  const handleCancelBooking = async () => {
    if (isCancelling) return;
    
    setIsCancelling(true);
    try {
      // Kiểm tra xem user đã đăng nhập hay chưa
      const token = localStorage.getItem('accessToken');
      if (token) {
        // User đã đăng nhập
        await bookingService.cancelBooking(bookingId);
      } else {
        // Guest chưa đăng nhập
        await bookingService.cancelGuestBooking(bookingId);
      }
      showSuccess('Đã hủy đặt phòng thành công!');
      onClose();
    } catch (error: any) {
      console.error('Lỗi khi hủy booking:', error);
      showError('Không thể hủy đặt phòng: ' + (error.response?.data?.message || 'Lỗi không xác định'));
    } finally {
      setIsCancelling(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="booking-countdown-overlay">
      <div className="booking-countdown-modal">
        <div className="booking-countdown-header">
          <h3>Xác nhận thanh toán</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="booking-countdown-content">
          <div className="booking-info">
            <h4>Thông tin đặt phòng</h4>
            <p><strong>Mã đặt phòng:</strong> {bookingId}</p>
            <p><strong>Phòng:</strong> {roomNumber}</p>
            <p><strong>Nhận phòng:</strong> {checkInDate}</p>
            <p><strong>Trả phòng:</strong> {checkOutDate}</p>
            <p><strong>Tổng tiền:</strong> {totalAmount.toLocaleString('vi-VN')} VNĐ</p>
          </div>

          <div className="countdown-section">
            <h4>Thời gian giữ phòng</h4>
            <div className={`countdown-timer ${isExpired ? 'expired' : ''}`}>
              {isExpired ? 'HẾT THỜI GIAN' : formatTime(timeLeft)}
            </div>
            <p className="countdown-message">
              {isExpired 
                ? 'Đơn đặt phòng đã hết hạn. Vui lòng đặt lại.' 
                : 'Vui lòng thanh toán trong thời gian trên để giữ phòng.'
              }
            </p>
          </div>

          <div className="qr-section">
            <h4>Quét mã VietQR để thanh toán</h4>
            
            {/* VietQR Header */}
            <div className="vietqr-header">
              <div className="vietqr-logo">
                <span className="vietqr-text">VIETQR</span>
                <div className="vietqr-badges">
                  <span className="badge">napas 247</span>
                  <span className="badge bank-badge">{vietqrService.getConfig().bankName}</span>
                </div>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="qr-container">
              <div style={{ 
                width: '250px', 
                height: '250px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}>
                <QRCodeSVG 
                  value={generateVietQR()}
                  size={200}
                  level="M"
                  includeMargin={true}
                />
              </div>
            </div>

            {/* Bank Transfer Details */}
            <div className="bank-transfer-details">
              <div className="transfer-info">
                <p><strong>Nội dung CK:</strong> HotelHub{roomNumber}</p>
                <p><strong>Số tiền:</strong> {totalAmount.toLocaleString('vi-VN')} VND</p>
                <p><strong>Tên chủ TK:</strong> HOTEL HUB COMPANY</p>
                <p><strong>Số TK:</strong> {vietqrService.getConfig().bankAccount}</p>
                <p><strong>Ngân hàng:</strong> {vietqrService.getConfig().bankName}</p>
                <div style={{ 
                  marginTop: '12px', 
                  padding: '8px 12px', 
                  background: '#e8f5e8', 
                  borderRadius: '6px', 
                  border: '1px solid #4caf50',
                  fontSize: '12px',
                  color: '#2e7d32'
                }}>
                  <strong>💡 Hướng dẫn:</strong> Quét mã QR bằng app ngân hàng để tự động điền thông tin chuyển khoản
                </div>
              </div>
            </div>

            <p className="qr-instruction">
              Sử dụng ứng dụng ngân hàng để quét mã QR và thanh toán
            </p>
          </div>
        </div>

        <div className="booking-countdown-footer">
          <button 
            className="btn-secondary" 
            onClick={isExpired ? onClose : handleCancelBooking}
            disabled={isCancelling}
          >
            {isCancelling ? 'Đang hủy...' : (isExpired ? 'Đóng' : 'Hủy đặt phòng')}
          </button>
          <button 
            className="btn-primary" 
            onClick={() => {
              // Xử lý thanh toán thành công
              showSuccess('Thanh toán thành công! Đơn đặt phòng đã được xác nhận.');
              onClose();
            }}
            disabled={isExpired}
          >
            Đã thanh toán
          </button>
        </div>
      </div>
      
      <NotificationContainer />
    </div>
  );
};

export default BookingCountdownModal;
