package com.hotelhub.backend.service;

import com.hotelhub.backend.entity.Booking;
import com.hotelhub.backend.entity.Room;
import com.hotelhub.backend.entity.RoomStatus;
import com.hotelhub.backend.repository.BookingRepository;
import com.hotelhub.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class RoomStatusSyncService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ActivityLogService activityLogService;

    /**
     * Sync room status với booking status hiện tại
     */
    public int syncAllRoomStatuses() {
        int updatedCount = 0;
        
        try {
            // Lấy tất cả phòng
            List<Room> allRooms = roomRepository.findAll();
            
            for (Room room : allRooms) {
                // Kiểm tra booking còn hoạt động cho phòng này
                List<Booking> activeBookings = bookingRepository.findByRoomIdAndStatusIn(
                    room.getRoomId(), 
                    List.of("pending", "confirmed", "paid")
                );
                
                // Kiểm tra xem có booking nào thực sự còn "active" không
                boolean hasActiveBooking = false;
                for (Booking booking : activeBookings) {
                    if ("pending".equals(booking.getStatus())) {
                        // Pending booking: kiểm tra hold time
                        if (booking.getHoldUntil() != null && booking.getHoldUntil().isAfter(LocalDateTime.now())) {
                            hasActiveBooking = true;
                            break;
                        }
                    } else if ("confirmed".equals(booking.getStatus()) || "paid".equals(booking.getStatus())) {
                        // Confirmed/Paid booking: kiểm tra check-out date
                        if (booking.getCheckOut() != null) {
                            boolean isCheckOutInFuture = booking.getCheckOut().isAfter(LocalDate.now());
                            System.out.println("Room " + room.getRoomNumber() + " - Booking " + booking.getBookingId() + 
                                " (status: " + booking.getStatus() + ") - checkOut: " + booking.getCheckOut() + 
                                " - isAfter today: " + isCheckOutInFuture);
                            if (isCheckOutInFuture) {
                                hasActiveBooking = true;
                                break;
                            }
                        }
                    }
                }
                
                RoomStatus expectedStatus;
                if (hasActiveBooking) {
                    // Có booking còn hoạt động → phòng BOOKED
                    expectedStatus = RoomStatus.BOOKED;
                } else {
                    // Không có booking còn hoạt động → phòng AVAILABLE
                    expectedStatus = RoomStatus.AVAILABLE;
                }
                
                // Cập nhật nếu status khác nhau
                if (!room.getStatus().equals(expectedStatus)) {
                    room.setStatus(expectedStatus);
                    roomRepository.save(room);
                    updatedCount++;
                    
                    System.out.println("Room " + room.getRoomNumber() + " status updated from " + 
                        room.getStatus() + " to " + expectedStatus);
                }
            }
            
            // Ghi log
            activityLogService.logSystemActivity("SYNC_ROOM_STATUS", 
                "Synced " + updatedCount + " room statuses with booking data");
            
            System.out.println("Room status sync completed. Updated " + updatedCount + " rooms.");
            
        } catch (Exception e) {
            System.err.println("Error syncing room statuses: " + e.getMessage());
            throw new RuntimeException("Lỗi khi sync room status: " + e.getMessage());
        }
        
        return updatedCount;
    }
}
