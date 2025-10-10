package com.hotelhub.backend.repository;

import com.hotelhub.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Tìm payment theo booking ID
    Optional<Payment> findByBookingBookingId(Long bookingId);
    
    // Tìm payment theo booking reference
    @Query("SELECT p FROM Payment p WHERE p.booking.bookingReference = :bookingReference")
    Optional<Payment> findByBookingReference(@Param("bookingReference") String bookingReference);
    
    // Tìm payments theo user ID (thông qua booking)
    @Query("SELECT p FROM Payment p WHERE p.booking.user.userId = :userId")
    List<Payment> findByUserId(@Param("userId") Long userId);
    
    // Tìm payments theo user email (thông qua booking)
    @Query("SELECT p FROM Payment p WHERE p.booking.user.email = :email")
    List<Payment> findByUserEmail(@Param("email") String email);
    
    // Tìm payments theo guest email (thông qua booking)
    @Query("SELECT p FROM Payment p WHERE p.booking.guestEmail = :guestEmail")
    List<Payment> findByGuestEmail(@Param("guestEmail") String guestEmail);
    
    // Tìm payments theo trạng thái
    List<Payment> findByStatus(Payment.PaymentStatus status);
    
    // Tìm payments theo phương thức thanh toán
    List<Payment> findByMethod(Payment.PaymentMethod method);
    
    // Tìm payments theo khoảng thời gian
    @Query("SELECT p FROM Payment p WHERE p.createdAt BETWEEN :startDate AND :endDate")
    List<Payment> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Tính tổng doanh thu từ payments thành công
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'success'")
    BigDecimal getTotalRevenue();
    
    // Tính doanh thu theo khoảng thời gian
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'success' AND p.paidAt BETWEEN :startDate AND :endDate")
    BigDecimal getRevenueByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Đếm payments theo trạng thái
    long countByStatus(Payment.PaymentStatus status);
    
    // Đếm payments theo phương thức thanh toán
    long countByMethod(Payment.PaymentMethod method);
    
    // Tìm payments chưa được xử lý (pending) và đã quá thời gian timeout
    @Query("SELECT p FROM Payment p WHERE p.status = 'pending' AND p.createdAt < :timeoutDate")
    List<Payment> findPendingPaymentsBefore(@Param("timeoutDate") LocalDateTime timeoutDate);
}
