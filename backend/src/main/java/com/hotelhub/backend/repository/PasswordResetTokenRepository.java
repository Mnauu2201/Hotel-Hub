package com.hotelhub.backend.repository;

import com.hotelhub.backend.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByEmailAndOtpAndUsedFalse(String email, String otp);

    Optional<PasswordResetToken> findTopByEmailOrderByCreatedAtDesc(String email);

    void deleteByExpiresAtBefore(LocalDateTime now);
}