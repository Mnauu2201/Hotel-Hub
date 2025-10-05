package com.hotelhub.backend.controller;

import com.hotelhub.backend.dto.request.ForgotPasswordRequest;
import com.hotelhub.backend.dto.request.ResetPasswordRequest;
import com.hotelhub.backend.dto.request.VerifyOTPRequest;
import com.hotelhub.backend.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/password")
@Slf4j
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    /**
     * API gửi mã OTP về email khi quên mật khẩu
     */
    @PostMapping("/forgot")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            passwordResetService.sendPasswordResetOTP(request.getEmail());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Mã xác thực đã được gửi đến email của bạn",
                    "email", maskEmail(request.getEmail())
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "error", "Email không tồn tại",
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            log.error("Lỗi khi gửi OTP: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "error", "Không thể gửi email",
                    "message", "Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau."
            ));
        }
    }

    /**
     * API xác thực mã OTP
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOTP(@Valid @RequestBody VerifyOTPRequest request) {
        try {
            boolean isValid = passwordResetService.verifyOTP(request.getEmail(), request.getOtp());

            if (isValid) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Mã OTP hợp lệ",
                        "canResetPassword", true
                ));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                        "success", false,
                        "error", "Mã OTP không hợp lệ",
                        "message", "Mã xác thực không đúng hoặc đã hết hạn"
                ));
            }
        } catch (Exception e) {
            log.error("Lỗi khi xác thực OTP: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "error", "Lỗi xác thực",
                    "message", "Có lỗi xảy ra khi xác thực mã OTP"
            ));
        }
    }

    /**
     * API đặt lại mật khẩu mới
     */
    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            // Kiểm tra mật khẩu khớp
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                        "success", false,
                        "error", "Mật khẩu không khớp",
                        "message", "Mật khẩu mới và xác nhận mật khẩu không giống nhau"
                ));
            }

            // Kiểm tra độ mạnh mật khẩu
            if (!isPasswordStrong(request.getNewPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                        "success", false,
                        "error", "Mật khẩu yếu",
                        "message", "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số"
                ));
            }

            passwordResetService.resetPassword(
                    request.getEmail(),
                    request.getOtp(),
                    request.getNewPassword()
            );

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Mật khẩu đã được đặt lại thành công",
                    "redirectTo", "/login"
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "error", "Đặt lại mật khẩu thất bại",
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            log.error("Lỗi khi đặt lại mật khẩu: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "error", "Lỗi hệ thống",
                    "message", "Có lỗi xảy ra khi đặt lại mật khẩu"
            ));
        }
    }

    /**
     * API gửi lại mã OTP
     */
    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOTP(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            passwordResetService.sendPasswordResetOTP(request.getEmail());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Mã xác thực mới đã được gửi đến email của bạn",
                    "email", maskEmail(request.getEmail())
            ));
        } catch (Exception e) {
            log.error("Lỗi khi gửi lại OTP: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "error", "Không thể gửi lại mã",
                    "message", "Có lỗi xảy ra. Vui lòng thử lại sau."
            ));
        }
    }

    /**
     * Che giấu một phần email để bảo mật
     */
    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return email;
        }

        String[] parts = email.split("@");
        String username = parts[0];
        String domain = parts[1];

        if (username.length() <= 3) {
            return "***@" + domain;
        }

        return username.substring(0, 3) + "***@" + domain;
    }

    /**
     * Kiểm tra độ mạnh của mật khẩu
     */
    private boolean isPasswordStrong(String password) {
        if (password == null || password.length() < 6) {
            return false;
        }

        boolean hasUpper = false;
        boolean hasLower = false;
        boolean hasDigit = false;

        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpper = true;
            if (Character.isLowerCase(c)) hasLower = true;
            if (Character.isDigit(c)) hasDigit = true;
        }

        return hasUpper && hasLower && hasDigit;
    }
}