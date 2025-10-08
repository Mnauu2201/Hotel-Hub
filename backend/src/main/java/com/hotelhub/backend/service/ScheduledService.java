package com.hotelhub.backend.service;

import com.hotelhub.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ScheduledService {

    @Autowired
    private BookingRepository bookingRepository;

    /**
     * Tự động hủy booking hết hạn mỗi 30 giây
     */
    @Scheduled(fixedRate = 30000) // Chạy mỗi 30 giây
    @Transactional
    public void cancelExpiredBookings() {
        try {
            LocalDateTime now = LocalDateTime.now();
            int cancelledCount = bookingRepository.cancelExpiredBookings(now);
            
            if (cancelledCount > 0) {
                System.out.println("✅ Đã hủy " + cancelledCount + " booking hết hạn");
            }
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi hủy booking hết hạn: " + e.getMessage());
        }
    }
}
