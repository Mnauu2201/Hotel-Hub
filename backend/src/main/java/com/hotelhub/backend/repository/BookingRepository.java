package com.hotelhub.backend.repository;

import com.hotelhub.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

        @Query("SELECT COUNT(b) FROM Booking b WHERE b.roomId = :roomId AND b.status IN :activeStatuses "
                        + "AND NOT (b.checkOut <= :checkIn OR b.checkIn >= :checkOut)")
        long countOverlapping(@Param("roomId") Long roomId,
                        @Param("checkIn") LocalDate checkIn,
                        @Param("checkOut") LocalDate checkOut,
                        @Param("activeStatuses") List<String> activeStatuses);

        // ✅ Lấy tất cả booking theo user
        List<Booking> findByUser_UserId(Long userId);
}
