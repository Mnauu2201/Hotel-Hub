package com.hotelhub.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long notificationId;
    
    @Column(name = "recipient_id", nullable = false)
    private Integer recipientId;
    
    @Column(name = "actor_id")
    private Integer actorId;
    
    @Column(name = "action", nullable = false, length = 100)
    private String action;
    
    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;
    
    @Column(name = "url", length = 255)
    private String url;
    
    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Relationship với User (recipient)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User recipient;
    
    // Relationship với User (actor)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User actor;
    
    // Constructor cho system notifications
    public Notification(Integer recipientId, String action, String message, String url) {
        this.recipientId = recipientId;
        this.action = action;
        this.message = message;
        this.url = url;
        this.actorId = null;
        this.isRead = false;
    }
    
    // Constructor cho user notifications
    public Notification(Integer recipientId, Integer actorId, String action, String message, String url) {
        this.recipientId = recipientId;
        this.actorId = actorId;
        this.action = action;
        this.message = message;
        this.url = url;
        this.isRead = false;
    }
}