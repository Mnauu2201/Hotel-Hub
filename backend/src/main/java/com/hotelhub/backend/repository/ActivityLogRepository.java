package com.hotelhub.backend.repository;

import com.hotelhub.backend.entity.ActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    
    // Tìm logs theo user
    Page<ActivityLog> findByUserIdOrderByCreatedAtDesc(Integer userId, Pageable pageable);
    
    // Tìm logs theo action
    Page<ActivityLog> findByActionOrderByCreatedAtDesc(String action, Pageable pageable);
    
    // Tìm logs theo khoảng thời gian
    @Query("SELECT al FROM ActivityLog al WHERE al.createdAt BETWEEN :startDate AND :endDate ORDER BY al.createdAt DESC")
    Page<ActivityLog> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                     @Param("endDate") LocalDateTime endDate, 
                                     Pageable pageable);
    
    // Tìm logs theo user và khoảng thời gian
    @Query("SELECT al FROM ActivityLog al WHERE al.userId = :userId AND al.createdAt BETWEEN :startDate AND :endDate ORDER BY al.createdAt DESC")
    Page<ActivityLog> findByUserIdAndDateRange(@Param("userId") Integer userId,
                                              @Param("startDate") LocalDateTime startDate,
                                              @Param("endDate") LocalDateTime endDate,
                                              Pageable pageable);
    
    // Tìm system logs (user_id = null)
    @Query("SELECT al FROM ActivityLog al WHERE al.userId IS NULL ORDER BY al.createdAt DESC")
    Page<ActivityLog> findSystemLogs(Pageable pageable);
    
    // Tìm user logs (user_id != null)
    @Query("SELECT al FROM ActivityLog al WHERE al.userId IS NOT NULL ORDER BY al.createdAt DESC")
    Page<ActivityLog> findUserLogs(Pageable pageable);
    
    // Đếm logs theo action
    @Query("SELECT COUNT(al) FROM ActivityLog al WHERE al.action = :action")
    Long countByAction(@Param("action") String action);
    
    // Tìm logs gần đây nhất
    @Query("SELECT al FROM ActivityLog al ORDER BY al.createdAt DESC")
    Page<ActivityLog> findRecentLogs(Pageable pageable);
    
    // Lấy logs với sort
    List<ActivityLog> findAll(Sort sort);
}