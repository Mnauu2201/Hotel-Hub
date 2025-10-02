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
            System.out.println("=== SCHEDULED JOB RUNNING ===");
            LocalDateTime now = LocalDateTime.now();
            System.out.println("Current time: " + now);
            System.out.println("Timezone: " + System.getProperty("user.timezone"));
            
            // Debug: Xem tất cả booking pending
            var pendingBookings = bookingRepository.findAll().stream()
                    .filter(b -> "pending".equals(b.getStatus()))
                    .toList();
            
            System.out.println("Found " + pendingBookings.size() + " pending bookings:");
            for (var booking : pendingBookings) {
                boolean isExpired = booking.getHoldUntil() != null && booking.getHoldUntil().isBefore(now);
                System.out.println("  - Booking ID: " + booking.getBookingId() + 
                                 ", Hold until: " + booking.getHoldUntil() + 
                                 ", Is expired: " + isExpired +
                                 ", Current time: " + now);
            }
            
            int cancelledCount = bookingRepository.cancelExpiredBookings(now);
            System.out.println("Cancelled " + cancelledCount + " expired bookings");
            
            if (cancelledCount > 0) {
                System.out.println("✅ Đã hủy " + cancelledCount + " booking hết hạn");
            } else {
                System.out.println("ℹ️ Không có booking nào hết hạn");
            }
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi hủy booking hết hạn: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
