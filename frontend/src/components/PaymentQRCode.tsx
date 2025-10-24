import React from 'react';
import './PaymentQRCode.css';

interface PaymentQRCodeProps {
  amount: number;
  bookingReference: string;
}

const PaymentQRCode: React.FC<PaymentQRCodeProps> = ({ amount, bookingReference }) => {
  return (
    <div className="payment-qr-container">
      <div className="payment-qr-header">
        <h3>Thanh toán qua QR Code</h3>
        <p>Quét mã QR để thanh toán</p>
      </div>
      
      <div className="payment-qr-content">
        <div className="qr-code-section">
          <div className="qr-code-wrapper">
            <img 
              src="https://img.vietqr.io/image/970422-1234567890-qr-only.png" 
              alt="QR Code thanh toán"
              className="qr-code-image"
            />
          </div>
        </div>
        
        <div className="payment-info">
          <div className="bank-info">
            <h4>Thông tin ngân hàng</h4>
            <div className="bank-details">
              <p><strong>Ngân hàng:</strong> Vietcombank</p>
              <p><strong>Số tài khoản:</strong> 1234567890</p>
              <p><strong>Tên tài khoản:</strong> HOTEL HUB</p>
            </div>
          </div>
          
          <div className="amount-info">
            <h4>Thông tin thanh toán</h4>
            <div className="amount-details">
              <p><strong>Số tiền:</strong> {amount.toLocaleString('vi-VN')} VNĐ</p>
              <p><strong>Mã booking:</strong> {bookingReference}</p>
              <p><strong>Nội dung:</strong> Thanh toan booking {bookingReference}</p>
            </div>
          </div>
        </div>
        
        <div className="payment-methods">
          <div className="payment-method">
            <img src="https://img.vietqr.io/image/logo/vietqr.png" alt="VietQR" className="method-logo" />
            <span>VietQR</span>
          </div>
          <div className="payment-method">
            <img src="https://img.vietqr.io/image/logo/napas.png" alt="Napas" className="method-logo" />
            <span>Napas</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentQRCode;




