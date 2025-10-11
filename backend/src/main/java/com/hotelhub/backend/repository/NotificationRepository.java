package com.hotelhub.backend.repository;

import com.hotelhub.backend.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    // Tìm notifications của user
    Page<Notification> findByRecipientIdOrderByCreatedAtDesc(Integer recipientId, Pageable pageable);
    
    // Tìm notifications chưa đọc
    Page<Notification> findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(Integer recipientId, Pageable pageable);
    
    // Tìm notifications đã đọc
    Page<Notification> findByRecipientIdAndIsReadTrueOrderByCreatedAtDesc(Integer recipientId, Pageable pageable);
    
    // Tìm notifications theo action
    Page<Notification> findByRecipientIdAndActionOrderByCreatedAtDesc(Integer recipientId, String action, Pageable pageable);
    
    // Đếm notifications chưa đọc
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipientId = :recipientId AND n.isRead = false")
    Long countUnreadByRecipientId(@Param("recipientId") Integer recipientId);
    
    // Đánh dấu tất cả notifications là đã đọc
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.recipientId = :recipientId")
    void markAllAsReadByRecipientId(@Param("recipientId") Integer recipientId);
    
    // Đánh dấu notification cụ thể là đã đọc
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.notificationId = :notificationId AND n.recipientId = :recipientId")
    void markAsReadByIdAndRecipientId(@Param("notificationId") Long notificationId, @Param("recipientId") Integer recipientId);
    
    // Tìm notifications theo khoảng thời gian
    @Query("SELECT n FROM Notification n WHERE n.recipientId = :recipientId AND n.createdAt BETWEEN :startDate AND :endDate ORDER BY n.createdAt DESC")
    Page<Notification> findByRecipientIdAndDateRange(@Param("recipientId") Integer recipientId,
                                                    @Param("startDate") LocalDateTime startDate,
                                                    @Param("endDate") LocalDateTime endDate,
                                                    Pageable pageable);
    
    // Tìm notifications gần đây nhất
    @Query("SELECT n FROM Notification n WHERE n.recipientId = :recipientId ORDER BY n.createdAt DESC")
    Page<Notification> findRecentByRecipientId(@Param("recipientId") Integer recipientId, Pageable pageable);
    
    // Xóa notifications cũ (cho cleanup)
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.createdAt < :cutoffDate")
    void deleteOldNotifications(@Param("cutoffDate") LocalDateTime cutoffDate);
}