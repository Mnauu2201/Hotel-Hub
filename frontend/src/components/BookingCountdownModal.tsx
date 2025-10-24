import React, { useState, useEffect } from 'react';
import PaymentQRCode from './PaymentQRCode';

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
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 phút = 300 giây
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

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

  const [showPaymentQR, setShowPaymentQR] = useState(false);

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

          {showPaymentQR ? (
            <PaymentQRCode 
              amount={totalAmount} 
              bookingReference={bookingId} 
            />
          ) : (
            <div className="payment-section">
              <h4>Thanh toán</h4>
              <p>Nhấn nút bên dưới để hiển thị QR code thanh toán</p>
              <button 
                className="btn-primary"
                onClick={() => setShowPaymentQR(true)}
              >
                Thanh toán ngay
              </button>
            </div>
          )}
        </div>

        <div className="booking-countdown-footer">
          <button 
            className="btn-secondary" 
            onClick={onClose}
            disabled={isExpired}
          >
            {isExpired ? 'Đóng' : 'Hủy đặt phòng'}
          </button>
          <button 
            className="btn-primary" 
            onClick={() => {
              // Xử lý thanh toán thành công
              onClose();
            }}
            disabled={isExpired}
          >
            Đã thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCountdownModal;
