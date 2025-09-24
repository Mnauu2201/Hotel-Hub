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
    private Long tokenId; // PK auto increment

    @ManyToOne(fetch = FetchType.LAZY) // mỗi token gắn với 1 user
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 512)
    private String token;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime issuedAt;

    @Column(nullable = false)
    private Boolean revoked = false;

    private String ipAddress;
    private String userAgent;

    @PrePersist
    protected void onCreate() {
        issuedAt = LocalDateTime.now();
    }
}
