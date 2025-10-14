package com.hotelhub.backend.service;

import com.hotelhub.backend.entity.Notification;
import com.hotelhub.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    /**
     * Tạo notification cho user
     */
    public void createNotification(Integer recipientId, String action, String message, String url) {
        Notification notification = new Notification(recipientId, action, message, url);
        notificationRepository.save(notification);
    }
    
    /**
     * Tạo notification với actor (người thực hiện hành động)
     */
    public void createNotification(Integer recipientId, Integer actorId, String action, String message, String url) {
        Notification notification = new Notification(recipientId, actorId, action, message, url);
        notificationRepository.save(notification);
    }
    
    /**
     * Tạo notification cho booking
     */
    public void createBookingNotification(Integer recipientId, String action, String bookingReference, String roomNumber, String dates) {
        String message = String.format("Booking %s: %s for room %s (%s)", 
                                      bookingReference, action, roomNumber, dates);
        String url = String.format("/bookings/%s", bookingReference);
        createNotification(recipientId, action, message, url);
    }
    
    /**
     * Tạo notification cho payment
     */
    public void createPaymentNotification(Integer recipientId, String action, String paymentId, String amount, String method) {
        String message = String.format("Payment %s: %s - Amount: %s, Method: %s", 
                                      paymentId, action, amount, method);
        String url = String.format("/payments/%s", paymentId);
        createNotification(recipientId, action, message, url);
    }
    
    /**
     * Tạo notification cho room
     */
    public void createRoomNotification(Integer recipientId, String action, String roomNumber, String roomType, String status) {
        String message = String.format("Room %s (%s): %s - Status: %s", 
                                      roomNumber, roomType, action, status);
        String url = String.format("/rooms/%s", roomNumber);
        createNotification(recipientId, action, message, url);
    }
    
    /**
     * Tạo notification cho tất cả admin
     */
    public void createAdminNotification(String action, String message, String url) {
        // Lấy danh sách admin và tạo notification cho từng admin
        // TODO: Implement getAdminUsers() method
        // List<User> admins = userService.getAdminUsers();
        // for (User admin : admins) {
        //     createNotification(admin.getUserId(), action, message, url);
        // }
    }
    
    /**
     * Lấy notifications của user
     */
    @Transactional(readOnly = true)
    public Page<Notification> getUserNotifications(Integer recipientId, Pageable pageable) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(recipientId, pageable);
    }
    
    /**
     * Lấy notifications chưa đọc
     */
    @Transactional(readOnly = true)
    public Page<Notification> getUnreadNotifications(Integer recipientId, Pageable pageable) {
        return notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(recipientId, pageable);
    }
    
    /**
     * Lấy notifications đã đọc
     */
    @Transactional(readOnly = true)
    public Page<Notification> getReadNotifications(Integer recipientId, Pageable pageable) {
        return notificationRepository.findByRecipientIdAndIsReadTrueOrderByCreatedAtDesc(recipientId, pageable);
    }
    
    /**
     * Lấy notifications theo action
     */
    @Transactional(readOnly = true)
    public Page<Notification> getNotificationsByAction(Integer recipientId, String action, Pageable pageable) {
        return notificationRepository.findByRecipientIdAndActionOrderByCreatedAtDesc(recipientId, action, pageable);
    }
    
    /**
     * Đếm notifications chưa đọc
     */
    @Transactional(readOnly = true)
    public Long countUnreadNotifications(Integer recipientId) {
        return notificationRepository.countUnreadByRecipientId(recipientId);
    }
    
    /**
     * Đánh dấu tất cả notifications là đã đọc
     */
    public void markAllAsRead(Integer recipientId) {
        notificationRepository.markAllAsReadByRecipientId(recipientId);
    }
    
    /**
     * Đánh dấu notification cụ thể là đã đọc
     */
    public void markAsRead(Long notificationId, Integer recipientId) {
        notificationRepository.markAsReadByIdAndRecipientId(notificationId, recipientId);
    }
    
    /**
     * Lấy notifications theo khoảng thời gian
     */
    @Transactional(readOnly = true)
    public Page<Notification> getNotificationsByDateRange(Integer recipientId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return notificationRepository.findByRecipientIdAndDateRange(recipientId, startDate, endDate, pageable);
    }
    
    /**
     * Lấy notifications gần đây nhất
     */
    @Transactional(readOnly = true)
    public List<Notification> getRecentNotifications(Integer recipientId, int limit) {
        Pageable pageable = Pageable.ofSize(limit);
        return notificationRepository.findRecentByRecipientId(recipientId, pageable).getContent();
    }
    
    /**
     * Xóa notifications cũ (cleanup)
     */
    public void deleteOldNotifications(LocalDateTime cutoffDate) {
        notificationRepository.deleteOldNotifications(cutoffDate);
    }
    
}