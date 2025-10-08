package com.hotelhub.backend.service;

import com.hotelhub.backend.entity.ActivityLog;
import com.hotelhub.backend.entity.User;
import com.hotelhub.backend.repository.ActivityLogRepository;
import com.hotelhub.backend.repository.UserRepository;
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

    @Autowired
    private UserRepository userRepository;

    /**
     * Ghi log thao tác
     */
    public void logActivity(String userEmail, String action, String detail) {
        User user = null;
        if (userEmail != null) {
            user = userRepository.findByEmail(userEmail).orElse(null);
        }

        ActivityLog activityLog = ActivityLog.builder()
                .user(user)
                .action(action)
                .detail(detail)
                .build();

        activityLogRepository.save(activityLog);
    }

    /**
     * Ghi log thao tác của system
     */
    public void logSystemActivity(String action, String detail) {
        logActivity(null, action, detail);
    }

    /**
     * Lấy tất cả log với phân trang
     */
    public Page<ActivityLog> getAllLogs(Pageable pageable) {
        return activityLogRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    /**
     * Lấy log theo user
     */
    public List<ActivityLog> getLogsByUser(Long userId) {
        return activityLogRepository.findByUser_UserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Lấy log theo action
     */
    public List<ActivityLog> getLogsByAction(String action) {
        return activityLogRepository.findByActionOrderByCreatedAtDesc(action);
    }

    /**
     * Lấy log trong khoảng thời gian
     */
    public List<ActivityLog> getLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return activityLogRepository.findByDateRange(startDate, endDate);
    }
}

