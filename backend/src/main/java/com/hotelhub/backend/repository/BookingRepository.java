package com.hotelhub.backend.repository;

import com.hotelhub.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

        @Query("SELECT COUNT(b) FROM Booking b WHERE b.roomId = :roomId AND b.status IN :activeStatuses "
                        + "AND NOT (b.checkOut <= :checkIn OR b.checkIn >= :checkOut)")
        long countOverlapping(@Param("roomId") Long roomId,
                        @Param("checkIn") LocalDate checkIn,
                        @Param("checkOut") LocalDate checkOut,
                        @Param("activeStatuses") List<String> activeStatuses);

        // ✅ Lấy tất cả booking theo user
        @Query("SELECT b FROM Booking b WHERE b.user.userId = :userId")
        List<Booking> findByUserId(@Param("userId") Long userId);
        
        // ✅ Tìm booking theo mã booking
        Optional<Booking> findByBookingReference(String bookingReference);
        
        // ✅ Tìm booking theo email guest
        List<Booking> findByGuestEmail(String guestEmail);
        
        // ✅ Tìm booking theo email guest và user_id NULL
        List<Booking> findByGuestEmailAndUserIsNull(String guestEmail);
        
        // ✅ Hủy booking hết hạn
        @Modifying
        @Query("UPDATE Booking b SET b.status = 'cancelled' WHERE b.status = 'pending' AND b.holdUntil IS NOT NULL AND b.holdUntil < :now")
        int cancelExpiredBookings(@Param("now") java.time.LocalDateTime now);
        
        // ✅ Lấy tất cả booking (để debug)
        List<Booking> findAll();
}
