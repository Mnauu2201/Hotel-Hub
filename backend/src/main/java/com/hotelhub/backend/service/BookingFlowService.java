package com.hotelhub.backend.service;

import com.hotelhub.backend.entity.Booking;
import com.hotelhub.backend.entity.Room;
import com.hotelhub.backend.entity.RoomStatus;
import com.hotelhub.backend.repository.BookingRepository;
import com.hotelhub.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class BookingFlowService {

    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private RoomRepository roomRepository;
    
    @Autowired
    private NotificationService notificationService;

    /**
     * Tạo booking và khóa phòng (10 phút)
     */
    @Transactional
    public Booking createBookingAndLockRoom(Booking booking) {
        try {
            // 1. Lưu booking
        Booking savedBooking = bookingRepository.save(booking);
        
            // 2. Khóa phòng trong 10 phút
            Room room = roomRepository.findById(booking.getRoomId())
                .orElseThrow(() -> new RuntimeException("Phòng không tồn tại"));
            
        room.setStatus(RoomStatus.LOCKED);
        roomRepository.save(room);
        
            // 3. Gửi thông báo cho admin
        createNotificationForAdmin(savedBooking);
        
        return savedBooking;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi tạo booking và khóa phòng: " + e.getMessage());
        }
    }

    /**
     * Tạo thông báo cho admin khi có booking mới
     */
    private void createNotificationForAdmin(Booking booking) {
        try {
            // Tạo thông báo cho admin
            notificationService.createAdminNotification(
                "BOOKING_NEW",
                "Có booking mới từ " + (booking.getGuestName() != null ? booking.getGuestName() : "khách vãng lai"),
                "Booking " + booking.getBookingReference() + " đang chờ xác nhận"
            );
            
        } catch (Exception e) {
            // Log error silently
        }
    }

    /**
     * Xác nhận booking và chuyển phòng sang BOOKED
     */
    @Transactional
    public void confirmBooking(Long bookingId) {
        try {
            Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));
            
            // Cập nhật trạng thái booking
            booking.setStatus("confirmed");
            bookingRepository.save(booking);
            
            // Chuyển phòng sang BOOKED
            Room room = roomRepository.findById(booking.getRoomId())
                .orElseThrow(() -> new RuntimeException("Phòng không tồn tại"));
            
            room.setStatus(RoomStatus.BOOKED);
            roomRepository.save(room);
            
        } catch (Exception e) {
            throw new RuntimeException("Lỗi xác nhận booking: " + e.getMessage());
        }
    }
    
    /**
     * Hủy booking và chuyển phòng về AVAILABLE
     */
    @Transactional
    public void cancelBooking(Long bookingId) {
        try {
            Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));
            
            // Cập nhật trạng thái booking
            booking.setStatus("cancelled");
            bookingRepository.save(booking);
            
            // Chuyển phòng về AVAILABLE
            Room room = roomRepository.findById(booking.getRoomId())
                .orElseThrow(() -> new RuntimeException("Phòng không tồn tại"));
            
            room.setStatus(RoomStatus.AVAILABLE);
            roomRepository.save(room);
            
        } catch (Exception e) {
            throw new RuntimeException("Lỗi hủy booking: " + e.getMessage());
        }
    }
}
