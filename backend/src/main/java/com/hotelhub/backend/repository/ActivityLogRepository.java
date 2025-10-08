package com.hotelhub.backend.repository;

import com.hotelhub.backend.entity.ActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    /**
     * Lấy log theo user
     */
    List<ActivityLog> findByUser_UserIdOrderByCreatedAtDesc(Long userId);

    /**
     * Lấy log theo action
     */
    List<ActivityLog> findByActionOrderByCreatedAtDesc(String action);

    /**
     * Lấy log trong khoảng thời gian
     */
    @Query("SELECT al FROM ActivityLog al WHERE al.createdAt BETWEEN :startDate AND :endDate ORDER BY al.createdAt DESC")
    List<ActivityLog> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                   @Param("endDate") LocalDateTime endDate);

    /**
     * Lấy log với phân trang
     */
    Page<ActivityLog> findAllByOrderByCreatedAtDesc(Pageable pageable);

    /**
     * Lấy log theo user với phân trang
     */
    Page<ActivityLog> findByUser_UserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}