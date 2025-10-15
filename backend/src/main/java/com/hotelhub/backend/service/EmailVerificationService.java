package com.hotelhub.backend.service;

import com.hotelhub.backend.entity.EmailVerificationToken;
import com.hotelhub.backend.entity.User;
import com.hotelhub.backend.repository.EmailVerificationTokenRepository;
import com.hotelhub.backend.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class EmailVerificationService {

    @Autowired
    private EmailVerificationTokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    /**
     * Tạo token xác thực và gửi email
     */
    @Transactional
    public void createVerificationTokenAndSendEmail(User user) throws MessagingException {
        // Xóa token cũ nếu có
        tokenRepository.findByUser(user).ifPresent(tokenRepository::delete);

        // Tạo token mới
        String token = UUID.randomUUID().toString();

        EmailVerificationToken verificationToken = new EmailVerificationToken();
        verificationToken.setUser(user);
        verificationToken.setToken(token);
        verificationToken.setExpiresAt(LocalDateTime.now().plusHours(24)); // Hết hạn sau 24h

        tokenRepository.save(verificationToken);

        // Gửi email xác thực
        emailService.sendVerificationEmail(user.getEmail(), user.getName(), token);
    }

    /**
     * Xác thực token
     */
    @Transactional
    public boolean verifyEmail(String token) {
        EmailVerificationToken verificationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token không hợp lệ"));

        // Kiểm tra token đã được verify chưa
        if (verificationToken.isVerified()) {
            throw new RuntimeException("Email đã được xác thực trước đó");
        }

        // Kiểm tra token có hết hạn không
        if (verificationToken.isExpired()) {
            throw new RuntimeException("Token đã hết hạn. Vui lòng đăng ký lại");
        }

        // Cập nhật user
        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        user.setEnabled(true);
        userRepository.save(user);

        // Đánh dấu token đã verify
        verificationToken.setVerifiedAt(LocalDateTime.now());
        tokenRepository.save(verificationToken);

        return true;
    }

    /**
     * Gửi lại email xác thực
     */
    @Transactional
    public void resendVerificationEmail(String email) throws MessagingException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với email: " + email));

        if (user.getEmailVerified()) {
            throw new RuntimeException("Email đã được xác thực");
        }

        createVerificationTokenAndSendEmail(user);
    }

    /**
     * Tự động xóa token hết hạn (chạy mỗi ngày lúc 00:00)
     */
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void cleanupExpiredTokens() {
        tokenRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
}