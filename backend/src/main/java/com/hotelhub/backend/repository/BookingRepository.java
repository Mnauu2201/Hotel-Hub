package com.hotelhub.backend.repository;

import com.hotelhub.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

        @Query("SELECT COUNT(b) FROM Booking b WHERE b.roomId = :roomId AND b.status IN :activeStatuses "
                        + "AND NOT (b.checkOut <= :checkIn OR b.checkIn >= :checkOut)")
        long countOverlapping(@Param("roomId") Long roomId,
                        @Param("checkIn") LocalDate checkIn,
                        @Param("checkOut") LocalDate checkOut,
                        @Param("activeStatuses") List<String> activeStatuses);

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
        
        // ========== ADMIN BOOKING MANAGEMENT METHODS ==========
        
        // Lấy booking theo trạng thái với phân trang
        Page<Booking> findByStatus(String status, Pageable pageable);
        
        // Lấy booking theo khoảng thời gian với phân trang
        Page<Booking> findByCheckInBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
        
        // Lấy booking theo khoảng thời gian với LocalDate
        @Query("SELECT b FROM Booking b WHERE b.checkIn BETWEEN :startDate AND :endDate")
        Page<Booking> findByCheckInDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, Pageable pageable);
        
        // Lấy booking theo thời gian tạo
        Page<Booking> findByCreatedAtBetween(LocalDateTime startDateTime, LocalDateTime endDateTime, Pageable pageable);
        
        // Lấy booking theo phòng
        List<Booking> findByRoomId(Long roomId);
        
        // Đếm booking theo phòng
        long countByRoomId(Long roomId);
        
        // Đếm booking còn hoạt động theo phòng (không bao gồm cancelled và completed)
        @Query("SELECT COUNT(b) FROM Booking b WHERE b.roomId = :roomId AND b.status NOT IN :statuses")
        long countByRoomIdAndStatusNotIn(@Param("roomId") Long roomId, @Param("statuses") List<String> statuses);
        
        // Lấy booking theo user (sử dụng custom query để tránh N+1)
        @Query("SELECT b FROM Booking b WHERE b.user.userId = :userId")
        List<Booking> findByUserId(@Param("userId") Long userId);
        
        // Đếm booking theo trạng thái
        long countByStatus(String status);
        
        // Đếm booking theo khoảng thời gian
        long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
        
        // Đếm booking theo trạng thái và khoảng thời gian
        long countByStatusAndCreatedAtBetween(String status, LocalDateTime startDate, LocalDateTime endDate);
        
        // Tính tổng doanh thu
        @Query("SELECT SUM(b.totalPrice) FROM Booking b WHERE b.status IN ('confirmed', 'paid')")
        BigDecimal getTotalRevenue();
        
        // Tính doanh thu theo khoảng thời gian - tính booking đã thanh toán
        @Query("SELECT SUM(b.totalPrice) FROM Booking b WHERE b.status = 'paid' AND b.checkIn BETWEEN :startDate AND :endDate")
        BigDecimal getRevenueByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
        
        // Doanh thu theo ngày
        @Query("SELECT DATE(b.createdAt) as date, SUM(b.totalPrice) as revenue FROM Booking b " +
               "WHERE b.status IN ('confirmed', 'paid') AND b.createdAt BETWEEN :startDate AND :endDate " +
               "GROUP BY DATE(b.createdAt) ORDER BY DATE(b.createdAt)")
        List<Object[]> getDailyRevenue(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
        
        // Doanh thu theo tháng
        @Query("SELECT YEAR(b.createdAt) as year, MONTH(b.createdAt) as month, SUM(b.totalPrice) as revenue FROM Booking b " +
               "WHERE b.status IN ('confirmed', 'paid') AND b.createdAt BETWEEN :startDate AND :endDate " +
               "GROUP BY YEAR(b.createdAt), MONTH(b.createdAt) ORDER BY YEAR(b.createdAt), MONTH(b.createdAt)")
        List<Object[]> getMonthlyRevenue(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
        
        // Tìm booking pending đã hết hạn
        List<Booking> findByStatusAndHoldUntilBefore(String status, LocalDateTime holdUntil);
        
        // Tìm booking theo room và status
        @Query("SELECT b FROM Booking b WHERE b.roomId = :roomId AND b.status IN :statuses")
        List<Booking> findByRoomIdAndStatusIn(@Param("roomId") Long roomId, @Param("statuses") List<String> statuses);
        
}
