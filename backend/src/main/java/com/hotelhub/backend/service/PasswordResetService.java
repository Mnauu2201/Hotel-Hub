package com.hotelhub.backend.service;

import com.hotelhub.backend.entity.PasswordResetToken;
import com.hotelhub.backend.entity.User;
import com.hotelhub.backend.repository.PasswordResetTokenRepository;
import com.hotelhub.backend.repository.UserRepository;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@Slf4j
public class PasswordResetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final SecureRandom random = new SecureRandom();

    /**
     * Gửi mã OTP 6 chữ số về email
     */
    @Transactional
    public void sendPasswordResetOTP(String email) {
        // Kiểm tra email có tồn tại không
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống"));

        // Tạo mã OTP 6 chữ số
        String otp = generateOTP();

        // Lưu OTP vào database
        PasswordResetToken token = new PasswordResetToken();
        token.setEmail(email);
        token.setOtp(otp);
        passwordResetTokenRepository.save(token);

        // Gửi email chứa mã OTP
        String subject = "Mã xác thực đặt lại mật khẩu - HotelHub";
        String htmlContent = buildEmailTemplate(user.getName(), otp);

        try {
            emailService.sendHtmlEmail(email, subject, htmlContent);
            log.info("Đã gửi OTP thành công đến email: {}", email);
        } catch (MessagingException e) {
            log.error("Lỗi khi gửi email OTP: ", e);
            throw new RuntimeException("Không thể gửi email. Vui lòng thử lại sau.");
        }
    }

    /**
     * Xác thực mã OTP
     */
    public boolean verifyOTP(String email, String otp) {
        return passwordResetTokenRepository.findByEmailAndOtpAndUsedFalse(email, otp)
                .map(token -> {
                    // Kiểm tra OTP có hết hạn không
                    if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
                        log.warn("OTP đã hết hạn cho email: {}", email);
                        return false;
                    }
                    log.info("OTP hợp lệ cho email: {}", email);
                    return true;
                })
                .orElse(false);
    }

    /**
     * Đặt lại mật khẩu mới
     */
    @Transactional
    public void resetPassword(String email, String otp, String newPassword) {
        // Tìm token OTP
        PasswordResetToken token = passwordResetTokenRepository.findByEmailAndOtpAndUsedFalse(email, otp)
                .orElseThrow(() -> new RuntimeException("Mã OTP không hợp lệ hoặc đã được sử dụng"));

        // Kiểm tra OTP có hết hạn không
        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.");
        }

        // Tìm user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Cập nhật mật khẩu mới
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Đánh dấu token đã sử dụng
        token.setUsed(true);
        passwordResetTokenRepository.save(token);

        log.info("Đã đặt lại mật khẩu thành công cho email: {}", email);
    }

    /**
     * Tạo mã OTP 6 chữ số ngẫu nhiên
     */
    private String generateOTP() {
        int otp = 100000 + random.nextInt(900000); // Tạo số từ 100000 đến 999999
        return String.valueOf(otp);
    }

    /**
     * Tạo template email HTML đẹp mắt
     */
    private String buildEmailTemplate(String userName, String otp) {
        return "<!DOCTYPE html>" +
                "<html lang='vi'>" +
                "<head>" +
                "    <meta charset='UTF-8'>" +
                "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "    <style>" +
                "        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }" +
                "        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow: hidden; }" +
                "        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }" +
                "        .header h1 { margin: 0; font-size: 28px; }" +
                "        .content { padding: 40px 30px; }" +
                "        .otp-box { background-color: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 25px; text-align: center; margin: 30px 0; }" +
                "        .otp-code { font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; margin: 10px 0; }" +
                "        .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }" +
                "        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }" +
                "        .btn { display: inline-block; background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class='container'>" +
                "        <div class='header'>" +
                "            <h1>🏨 HotelHub</h1>" +
                "            <p>Đặt lại mật khẩu</p>" +
                "        </div>" +
                "        <div class='content'>" +
                "            <h2>Xin chào " + userName + ",</h2>" +
                "            <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản HotelHub của mình. Vui lòng sử dụng mã xác thực dưới đây:</p>" +
                "            <div class='otp-box'>" +
                "                <p style='margin: 0; color: #6c757d;'>Mã xác thực của bạn</p>" +
                "                <div class='otp-code'>" + otp + "</div>" +
                "                <p style='margin: 0; color: #6c757d; font-size: 14px;'>Mã có hiệu lực trong 5 phút</p>" +
                "            </div>" +
                "            <div class='warning'>" +
                "                <strong>⚠️ Lưu ý:</strong> Không chia sẻ mã này với bất kỳ ai. Đội ngũ HotelHub sẽ không bao giờ yêu cầu mã xác thực của bạn." +
                "            </div>" +
                "            <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. Tài khoản của bạn vẫn an toàn.</p>" +
                "        </div>" +
                "        <div class='footer'>" +
                "            <p>© 2025 HotelHub. All rights reserved.</p>" +
                "            <p>Email này được gửi tự động, vui lòng không trả lời.</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }

    /**
     * Tự động xóa các token OTP đã hết hạn mỗi giờ
     */
    @Scheduled(fixedRate = 3600000) // Chạy mỗi 1 giờ
    @Transactional
    public void cleanupExpiredTokens() {
        passwordResetTokenRepository.deleteByExpiresAtBefore(LocalDateTime.now());
        log.info("Đã xóa các OTP token hết hạn");
    }
}