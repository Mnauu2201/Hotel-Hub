package com.hotelhub.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tokenId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 512)
    private String token;

    private LocalDateTime issuedAt;
    private LocalDateTime expiresAt;

    private Boolean revoked = false;

    private String ipAddress;
    private String userAgent;

    @PrePersist
    protected void onCreate() {
        issuedAt = LocalDateTime.now();
    }
}
