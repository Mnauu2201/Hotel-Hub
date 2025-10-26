package com.hotelhub.backend.controller;

import com.hotelhub.backend.entity.Notification;
import com.hotelhub.backend.entity.User;
import com.hotelhub.backend.repository.NotificationRepository;
import com.hotelhub.backend.repository.UserRepository;
import com.hotelhub.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/notifications")
@PreAuthorize("hasRole('ADMIN')")
public class AdminNotificationController {

    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;
    
    /**
     * Lấy tất cả notifications (Admin only) với filtering
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Notification> notifications;
        
        // Apply filtering
        if (type != null && !type.equals("ALL")) {
            if (status != null && !status.equals("ALL")) {
                // Filter by both type and status
                if (status.equals("SENT")) {
                    notifications = notificationRepository.findByActionAndIsRead(type, true, pageable);
                } else if (status.equals("PENDING")) {
                    notifications = notificationRepository.findByActionAndIsRead(type, false, pageable);
                } else if (status.equals("DRAFT")) {
                    // For draft status, we need to check if notification is not sent and not failed
                    notifications = notificationRepository.findByActionAndIsRead(type, false, pageable);
                } else if (status.equals("FAILED")) {
                    // For failed status, we need to check if notification failed to send
                    notifications = notificationRepository.findByActionAndIsRead(type, false, pageable);
                } else {
                    notifications = notificationRepository.findByAction(type, pageable);
                }
            } else {
                // Filter by type only
                notifications = notificationRepository.findByAction(type, pageable);
            }
        } else if (status != null && !status.equals("ALL")) {
            // Filter by status only
            if (status.equals("SENT")) {
                notifications = notificationRepository.findByIsRead(true, pageable);
            } else if (status.equals("PENDING")) {
                notifications = notificationRepository.findByIsRead(false, pageable);
            } else if (status.equals("DRAFT")) {
                notifications = notificationRepository.findByIsRead(false, pageable);
            } else if (status.equals("FAILED")) {
                notifications = notificationRepository.findByIsRead(false, pageable);
            } else {
                notifications = notificationRepository.findAll(pageable);
            }
        } else {
            // No filtering
            notifications = notificationRepository.findAll(pageable);
        }
        
        // Transform notifications to include user information
        List<Map<String, Object>> transformedNotifications = notifications.getContent().stream()
            .map(notification -> {
                Map<String, Object> notificationMap = new HashMap<>();
                notificationMap.put("id", notification.getNotificationId().intValue());
                notificationMap.put("title", getNotificationTitle(notification.getAction()));
                notificationMap.put("message", notification.getMessage());
                notificationMap.put("type", mapActionToType(notification.getAction()));
                notificationMap.put("recipient", getRecipientEmail(notification.getRecipientId()));
                // Map status based on isRead and other conditions
                String notificationStatus;
                if (notification.getIsRead()) {
                    notificationStatus = "SENT";
                } else {
                    // For now, all unread notifications are PENDING
                    // In the future, we can add more logic to determine DRAFT vs FAILED
                    notificationStatus = "PENDING";
                }
                notificationMap.put("status", notificationStatus);
                notificationMap.put("createdAt", notification.getCreatedAt());
                notificationMap.put("sentAt", notification.getIsRead() ? notification.getCreatedAt() : null);
                notificationMap.put("url", notification.getUrl());
                
                return notificationMap;
            })
            .collect(java.util.stream.Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("notifications", transformedNotifications);
        response.put("currentPage", notifications.getNumber());
        response.put("totalItems", notifications.getTotalElements());
        response.put("totalPages", notifications.getTotalPages());
        response.put("hasNext", notifications.hasNext());
        response.put("hasPrevious", notifications.hasPrevious());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Tạo notification mới (Admin only)
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createNotification(@RequestBody Map<String, Object> notificationData) {
        try {
            String message = (String) notificationData.get("message");
            String type = (String) notificationData.get("type");
            String recipient = (String) notificationData.get("recipient");
            
            // Map type to action
            String action = mapTypeToAction(type);
            
            // Find recipient user
            Integer recipientId = null;
            if (recipient != null && !recipient.equals("all@hotelhub.com")) {
                Optional<User> user = userRepository.findByEmail(recipient);
                if (user.isPresent()) {
                    recipientId = user.get().getUserId().intValue();
                }
            }
            
            // Create notification
            Notification notification = new Notification();
            notification.setRecipientId(recipientId);
            notification.setAction(action);
            notification.setMessage(message);
            notification.setUrl("/notifications");
            notification.setIsRead(false);
            
            Notification savedNotification = notificationRepository.save(notification);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Thông báo đã được tạo thành công");
            response.put("notificationId", savedNotification.getNotificationId().intValue());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi tạo thông báo: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Gửi notification (Admin only) - tích hợp gửi email
     */
    @PostMapping("/{notificationId}/send")
    public ResponseEntity<Map<String, Object>> sendNotification(@PathVariable Long notificationId) {
        try {
            Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
            
            if (!notificationOpt.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Không tìm thấy thông báo");
                return ResponseEntity.notFound().build();
            }
            
            Notification notification = notificationOpt.get();
            
            // Lấy thông tin người nhận
            Optional<User> recipientOpt = userRepository.findById(notification.getRecipientId().longValue());
            if (!recipientOpt.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Không tìm thấy người nhận thông báo");
                return ResponseEntity.badRequest().body(response);
            }
            
            User recipient = recipientOpt.get();
            
            // Gửi email thông báo
            try {
                String subject = getEmailSubject(notification.getAction());
                String htmlContent = buildEmailContent(notification, recipient);
                
                emailService.sendHtmlEmail(recipient.getEmail(), subject, htmlContent);
                
                // Cập nhật trạng thái notification
                notification.setIsRead(true);
                notificationRepository.save(notification);
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Thông báo đã được gửi thành công đến " + recipient.getEmail());
                
                return ResponseEntity.ok(response);
                
            } catch (Exception emailError) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Lỗi khi gửi email: " + emailError.getMessage());
                return ResponseEntity.badRequest().body(response);
            }
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi gửi thông báo: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Xóa notification (Admin only)
     */
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Map<String, Object>> deleteNotification(@PathVariable Long notificationId) {
        try {
            if (!notificationRepository.existsById(notificationId)) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Không tìm thấy thông báo");
                return ResponseEntity.notFound().build();
            }
            
            notificationRepository.deleteById(notificationId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Thông báo đã được xóa thành công");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi xóa thông báo: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // Helper methods
    private String getNotificationTitle(String action) {
        Map<String, String> actionTitles = new HashMap<>();
        actionTitles.put("WELCOME", "Chào mừng khách hàng mới");
        actionTitles.put("BOOKING_CONFIRMATION", "Xác nhận đặt phòng");
        actionTitles.put("PAYMENT_REMINDER", "Nhắc nhở thanh toán");
        actionTitles.put("SYSTEM_MAINTENANCE", "Thông báo bảo trì hệ thống");
        actionTitles.put("PROMOTION", "Khuyến mãi đặc biệt");
        actionTitles.put("ADMIN_ALERT", "Cảnh báo Admin");
        actionTitles.put("STAFF_TASK", "Nhiệm vụ Staff");
        
        return actionTitles.getOrDefault(action, action);
    }
    
    private String mapActionToType(String action) {
        Map<String, String> actionTypes = new HashMap<>();
        actionTypes.put("WELCOME", "WELCOME");
        actionTypes.put("BOOKING_CONFIRMATION", "BOOKING_CONFIRMATION");
        actionTypes.put("PAYMENT_REMINDER", "PAYMENT_REMINDER");
        actionTypes.put("SYSTEM_MAINTENANCE", "SYSTEM_MAINTENANCE");
        actionTypes.put("PROMOTION", "PROMOTION");
        actionTypes.put("ADMIN_ALERT", "ADMIN_ALERT");
        actionTypes.put("STAFF_TASK", "STAFF_TASK");
        actionTypes.put("BOOKING_CREATED", "BOOKING_CREATED");
        actionTypes.put("PAYMENT_SUCCESS", "PAYMENT_SUCCESS");
        actionTypes.put("PAYMENT_FAILED", "PAYMENT_FAILED");
        
        return actionTypes.getOrDefault(action, "OTHER");
    }
    
    private String mapTypeToAction(String type) {
        Map<String, String> typeActions = new HashMap<>();
        typeActions.put("WELCOME", "WELCOME");
        typeActions.put("BOOKING_CONFIRMATION", "BOOKING_CONFIRMATION");
        typeActions.put("PAYMENT_REMINDER", "PAYMENT_REMINDER");
        typeActions.put("SYSTEM_MAINTENANCE", "SYSTEM_MAINTENANCE");
        typeActions.put("PROMOTION", "PROMOTION");
        typeActions.put("ADMIN_ALERT", "ADMIN_ALERT");
        typeActions.put("STAFF_TASK", "STAFF_TASK");
        typeActions.put("BOOKING_CREATED", "BOOKING_CREATED");
        typeActions.put("PAYMENT_SUCCESS", "PAYMENT_SUCCESS");
        typeActions.put("PAYMENT_FAILED", "PAYMENT_FAILED");
        typeActions.put("OTHER", "OTHER");
        
        return typeActions.getOrDefault(type, "OTHER");
    }
    
    private String getRecipientEmail(Integer recipientId) {
        if (recipientId == null) {
            return "all@hotelhub.com";
        }
        
        Optional<User> user = userRepository.findById(recipientId.longValue());
        return user.map(User::getEmail).orElse("Unknown");
    }
    
    private String getEmailSubject(String action) {
        Map<String, String> subjects = new HashMap<>();
        subjects.put("WELCOME", "Chào mừng đến với HotelHub");
        subjects.put("BOOKING_CONFIRMATION", "Xác nhận đặt phòng - HotelHub");
        subjects.put("PAYMENT_REMINDER", "Nhắc nhở thanh toán - HotelHub");
        subjects.put("SYSTEM_MAINTENANCE", "Thông báo bảo trì hệ thống - HotelHub");
        subjects.put("PROMOTION", "Khuyến mãi đặc biệt - HotelHub");
        subjects.put("ADMIN_ALERT", "Cảnh báo Admin - HotelHub");
        subjects.put("STAFF_TASK", "Nhiệm vụ Staff - HotelHub");
        subjects.put("BOOKING_CREATED", "Đặt phòng mới - HotelHub");
        subjects.put("PAYMENT_SUCCESS", "Thanh toán thành công - HotelHub");
        subjects.put("PAYMENT_FAILED", "Thanh toán thất bại - HotelHub");
        
        return subjects.getOrDefault(action, "Thông báo từ HotelHub");
    }
    
    private String buildEmailContent(Notification notification, User recipient) {
        String action = notification.getAction();
        String message = notification.getMessage();
        String recipientName = recipient.getName();
        
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                    .message { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
                    .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🏨 HotelHub</h1>
                        <p>Thông báo hệ thống</p>
                    </div>
                    <div class="content">
                        <h2>Xin chào %s!</h2>
                        <div class="message">
                            <h3>%s</h3>
                            <p>%s</p>
                        </div>
                        <p>Cảm ơn bạn đã sử dụng dịch vụ của HotelHub!</p>
                        <div class="footer">
                            <p>Đây là email tự động từ hệ thống HotelHub</p>
                            <p>Vui lòng không trả lời email này</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            """, recipientName, getEmailSubject(action), message);
    }
}
