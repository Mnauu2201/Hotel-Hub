package com.hotelhub.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;
    
    @Column(name = "user_id")
    private Integer userId;
    
    @Column(name = "action", nullable = false, length = 100)
    private String action;
    
    @Column(name = "detail", columnDefinition = "TEXT")
    private String detail;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Relationship với User (optional)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;
    
    // Constructor cho system logs (không có user)
    public ActivityLog(String action, String detail) {
        this.action = action;
        this.detail = detail;
        this.userId = null;
    }
    
    // Constructor cho user logs
    public ActivityLog(Integer userId, String action, String detail) {
        this.userId = userId;
        this.action = action;
        this.detail = detail;
    }
}