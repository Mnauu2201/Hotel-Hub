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
    bankAccount: "0975034306", // Số tài khoản ngân hàng của khách sạn
    bankName: "VietinBank Nam Phương",
    bankCode: "CTG"
  };

  /**
   * Tạo VietQR string theo chuẩn
   */
  generateVietQR(data: VietQRData): string {
    const { account, amount, content, bankCode } = data;
    
    // VietQR format: bank://transfer?account=ACCOUNT&amount=AMOUNT&content=CONTENT&bank=BANKCODE
    const params = new URLSearchParams({
      account: account || this.config.bankAccount,
      amount: amount.toString(),
      content: content
    });
    
    if (bankCode) {
      params.append('bank', bankCode);
    }
    
    return `bank://transfer?${params.toString()}`;
  }

  /**
   * Tạo VietQR cho booking
   */
  generateBookingVietQR(bookingId: string, amount: number, roomNumber: string, checkInDate: string, checkOutDate: string): string {
    const content = `Hotel Hub - Booking ${bookingId} - Room ${roomNumber} - ${checkInDate} to ${checkOutDate}`;
    
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
