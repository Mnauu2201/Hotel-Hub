package com.hotelhub.backend.service;

import com.hotelhub.backend.entity.ActivityLog;
import com.hotelhub.backend.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ActivityLogService {
    
    @Autowired
    private ActivityLogRepository activityLogRepository;
    
    /**
     * Ghi log hoạt động của user
     */
    public void logActivity(Integer userId, String action, String detail) {
        ActivityLog log = new ActivityLog(userId, action, detail);
        activityLogRepository.save(log);
    }
    
    /**
     * Ghi log hoạt động của system (không có user)
     */
    public void logSystemActivity(String action, String detail) {
        ActivityLog log = new ActivityLog(action, detail);
        activityLogRepository.save(log);
    }
    
    /**
     * Ghi log với format chuẩn cho booking
     */
    public void logBookingActivity(Integer userId, String action, String bookingReference, String roomNumber, String dates) {
        String detail = String.format("Booking %s: %s for room %s (%s)", 
                                     bookingReference, action, roomNumber, dates);
        logActivity(userId, action, detail);
    }
    
    /**
     * Ghi log với format chuẩn cho payment
     */
    public void logPaymentActivity(Integer userId, String action, String paymentId, String amount, String method) {
        String detail = String.format("Payment %s: %s - Amount: %s, Method: %s", 
                                     paymentId, action, amount, method);
        logActivity(userId, action, detail);
    }
    
    /**
     * Ghi log với format chuẩn cho room
     */
    public void logRoomActivity(Integer userId, String action, String roomNumber, String roomType, String status) {
        String detail = String.format("Room %s (%s): %s - Status: %s", 
                                     roomNumber, roomType, action, status);
        logActivity(userId, action, detail);
    }
    
    /**
     * Lấy tất cả logs (Admin only)
     */
    @Transactional(readOnly = true)
    public Page<ActivityLog> getAllLogs(Pageable pageable) {
        // Use a simple query without relationships to avoid lazy loading issues
        return activityLogRepository.findAll(pageable);
    }
    
    /**
     * Lấy logs của user cụ thể
     */
    @Transactional(readOnly = true)
    public Page<ActivityLog> getUserLogs(Integer userId, Pageable pageable) {
        return activityLogRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }
    
    /**
     * Lấy system logs
     */
    @Transactional(readOnly = true)
    public Page<ActivityLog> getSystemLogs(Pageable pageable) {
        return activityLogRepository.findSystemLogs(pageable);
    }
    
    /**
     * Lấy user logs (không phải system)
     */
    @Transactional(readOnly = true)
    public Page<ActivityLog> getUserActivityLogs(Pageable pageable) {
        return activityLogRepository.findUserLogs(pageable);
    }
    
    /**
     * Lấy logs theo action
     */
    @Transactional(readOnly = true)
    public Page<ActivityLog> getLogsByAction(String action, Pageable pageable) {
        return activityLogRepository.findByActionOrderByCreatedAtDesc(action, pageable);
    }
    
    /**
     * Lấy logs theo khoảng thời gian
     */
    @Transactional(readOnly = true)
    public Page<ActivityLog> getLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return activityLogRepository.findByDateRange(startDate, endDate, pageable);
    }
    
    /**
     * Lấy logs của user theo khoảng thời gian
     */
    @Transactional(readOnly = true)
    public Page<ActivityLog> getUserLogsByDateRange(Integer userId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return activityLogRepository.findByUserIdAndDateRange(userId, startDate, endDate, pageable);
    }
    
    /**
     * Đếm logs theo action
     */
    @Transactional(readOnly = true)
    public Long countLogsByAction(String action) {
        return activityLogRepository.countByAction(action);
    }
    
    /**
     * Lấy logs gần đây nhất
     */
    @Transactional(readOnly = true)
    public List<ActivityLog> getRecentLogs(int limit) {
        // Use repository method to avoid lazy loading issues
        Pageable pageable = Pageable.ofSize(limit);
        return activityLogRepository.findRecentLogs(pageable).getContent();
    }
}