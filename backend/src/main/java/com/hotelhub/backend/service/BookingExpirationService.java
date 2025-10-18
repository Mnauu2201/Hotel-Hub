package com.hotelhub.backend.service;

import com.hotelhub.backend.entity.Booking;
import com.hotelhub.backend.entity.Room;
import com.hotelhub.backend.entity.RoomStatus;
import com.hotelhub.backend.repository.BookingRepository;
import com.hotelhub.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class BookingExpirationService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ActivityLogService activityLogService;

    /**
     * Kiểm tra và cập nhật booking hết hạn mỗi phút
     */
    @Scheduled(fixedRate = 60000) // Chạy mỗi 60 giây
    public void checkExpiredBookings() {
        try {
            LocalDateTime now = LocalDateTime.now();
            
            // Tìm các booking pending đã hết hạn
            List<Booking> expiredBookings = bookingRepository.findByStatusAndHoldUntilBefore("pending", now);
            
            for (Booking booking : expiredBookings) {
                // Cập nhật booking status thành cancelled
                booking.setStatus("cancelled");
                bookingRepository.save(booking);
                
                // Cập nhật room status về AVAILABLE
                Room room = roomRepository.findById(booking.getRoomId()).orElse(null);
                if (room != null) {
                    room.setStatus(RoomStatus.AVAILABLE);
                    roomRepository.save(room);
                }
                
                // Ghi log
                activityLogService.logSystemActivity("BOOKING_EXPIRED", 
                    "Booking " + booking.getBookingReference() + " expired and cancelled automatically");
                
                System.out.println("Booking " + booking.getBookingReference() + " expired and room " + 
                    booking.getRoomId() + " status updated to AVAILABLE");
            }
            
            if (!expiredBookings.isEmpty()) {
                System.out.println("Processed " + expiredBookings.size() + " expired bookings");
            }
            
        } catch (Exception e) {
            System.err.println("Error processing expired bookings: " + e.getMessage());
        }
    }
}
