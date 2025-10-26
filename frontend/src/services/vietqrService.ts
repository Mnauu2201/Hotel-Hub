interface VietQRConfig {
  bankAccount: string;
  bankName: string;
  bankCode: string;
}

interface VietQRData {
  account: string;
  amount: number;
  content: string;
  bankCode?: string;
}

class VietQRService {
  private config: VietQRConfig = {
    bankAccount: "8322012005", // Số tài khoản ngân hàng của khách sạn
    bankName: "MB Bank",
    bankCode: "MB"
  };

  /**
   * Tạo VietQR string theo chuẩn VietQR thực tế
   */
  generateVietQR(data: VietQRData): string {
    const { account, amount, content, bankCode } = data;
    
    // Format chuẩn cho app ngân hàng Việt Nam
    const bankCodeParam = bankCode || this.config.bankCode;
    const accountParam = account || this.config.bankAccount;
    const amountParam = amount.toString();
    const contentParam = content;
    
    // Tạo QR string theo format chuẩn VietQR
    // Format: bank://transfer?account=ACCOUNT&amount=AMOUNT&content=CONTENT&bank=BANKCODE
    const qrString = `bank://transfer?account=${accountParam}&amount=${amountParam}&content=${encodeURIComponent(contentParam)}&bank=${bankCodeParam}`;
    
    console.log('VietQR String generated:', qrString); // Debug log
    
    return qrString;
  }

  /**
   * Tạo VietQR cho booking
   */
  generateBookingVietQR(_bookingId: string, amount: number, roomNumber: string, _checkInDate: string, _checkOutDate: string): string {
    const content = `HotelHub${roomNumber}`;
    
    return this.generateVietQR({
      account: this.config.bankAccount,
      amount: amount,
      content: content,
      bankCode: this.config.bankCode
    });
  }

  /**
   * Cập nhật cấu hình ngân hàng
   */
  updateConfig(config: Partial<VietQRConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Lấy thông tin ngân hàng hiện tại
   */
  getConfig(): VietQRConfig {
    return { ...this.config };
  }
}

export default new VietQRService();
