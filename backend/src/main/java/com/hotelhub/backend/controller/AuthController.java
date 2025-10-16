package com.hotelhub.backend.controller;

import com.hotelhub.backend.dto.request.LoginRequest;
import com.hotelhub.backend.dto.request.RegisterRequest;
import com.hotelhub.backend.dto.response.JwtResponse;
import com.hotelhub.backend.entity.User;
import com.hotelhub.backend.repository.UserRepository;
import com.hotelhub.backend.security.JwtTokenProvider;
import com.hotelhub.backend.service.AuthService;
import com.hotelhub.backend.service.EmailVerificationService;
import com.hotelhub.backend.service.RefreshTokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

        @Autowired
        private AuthenticationManager authenticationManager;

        @Autowired
        private JwtTokenProvider jwtTokenProvider;

        @Autowired
        private AuthService authService;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private RefreshTokenService refreshTokenService;

        @Autowired
        private EmailVerificationService emailVerificationService;

        // ✅ Register
        @PostMapping("/register")
        public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
                try {
                        User u = authService.register(req);
                        return ResponseEntity.ok(Map.of(
                                "message", "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
                                "email", u.getEmail(),
                                "name", u.getName(),
                                "emailVerified", false
                        ));
                } catch (Exception e) {
                        return ResponseEntity.badRequest().body(Map.of(
                                "error", "Đăng ký thất bại",
                                "message", e.getMessage()
                        ));
                }
        }

        // ✅ Verify Email
        @GetMapping("/verify-email")
        public ResponseEntity<?> verifyEmail(@RequestParam String token) {
                try {
                        emailVerificationService.verifyEmail(token);
                        return ResponseEntity.ok(Map.of(
                                "message", "Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ."
                        ));
                } catch (Exception e) {
                        return ResponseEntity.badRequest().body(Map.of(
                                "error", "Xác thực thất bại",
                                "message", e.getMessage()
                        ));
                }
        }

        // ✅ Resend Verification Email
        @PostMapping("/resend-verification")
        public ResponseEntity<?> resendVerification(@RequestBody Map<String, String> request) {
                try {
                        String email = request.get("email");
                        emailVerificationService.resendVerificationEmail(email);
                        return ResponseEntity.ok(Map.of(
                                "message", "Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư."
                        ));
                } catch (Exception e) {
                        return ResponseEntity.badRequest().body(Map.of(
                                "error", "Gửi lại email thất bại",
                                "message", e.getMessage()
                        ));
                }
        }

        // ✅ Login
        @PostMapping("/login")
        public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
                try {
                        // Kiểm tra user có tồn tại không
                        User user = userRepository.findByEmail(req.getEmail())
                                .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không đúng"));

                        // Kiểm tra email đã được xác thực chưa (TẠM THỜI TẮT ĐỂ TEST)
                        // if (!user.getEmailVerified()) {
                        //         return ResponseEntity.badRequest().body(Map.of(
                        //                 "error", "Email chưa được xác thực",
                        //                 "message", "Vui lòng kiểm tra email và xác thực tài khoản trước khi đăng nhập",
                        //                 "emailVerified", false
                        //         ));
                        // }

                        // Xác thực user
                        Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

                        // Sinh access token có roles
                        String accessToken = jwtTokenProvider.generateToken(authentication);

                        // Tạo refresh token
                        var rt = refreshTokenService.createRefreshToken(user.getUserId());

                        // Lấy roles từ user
                        List<String> roles = user.getRoles().stream()
                                .map(role -> role.getName())
                                .toList();

                        // ✅ Kiểm tra nếu user có role ADMIN hoặc STAFF thì token không hết hạn
                        boolean isAdminOrStaff = roles.contains("ROLE_ADMIN") || roles.contains("ROLE_STAFF");
                        long expiresIn = isAdminOrStaff ? -1 : 3600; // -1 = không hết hạn

                        JwtResponse response = JwtResponse.builder()
                                .accessToken(accessToken)
                                .refreshToken(rt.getToken())
                                .email(user.getEmail())
                                .name(user.getName())
                                .roles(roles)
                                .expiresIn(expiresIn) // -1 cho admin/staff, 3600 cho customer
                                .build();

                        return ResponseEntity.ok(response);
                } catch (DisabledException e) {
                        return ResponseEntity.badRequest().body(Map.of(
                                "error", "Tài khoản bị vô hiệu hóa",
                                "message", "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên."
                        ));
                } catch (BadCredentialsException e) {
                        return ResponseEntity.badRequest().body(Map.of(
                                "error", "Đăng nhập thất bại",
                                "message", "Email hoặc mật khẩu không đúng"
                        ));
                } catch (Exception e) {
                        return ResponseEntity.badRequest().body(Map.of(
                                "error", "Đăng nhập thất bại",
                                "message", e.getMessage()
                        ));
                }
        }

        // ✅ Refresh token
        @PostMapping("/refresh")
        public ResponseEntity<?> refresh(@RequestBody Map<String, String> request) {
                String refreshToken = request.get("refreshToken");
                return refreshTokenService.findByToken(refreshToken)
                        .map(rt -> {
                                if (rt.getExpiresAt().isBefore(java.time.LocalDateTime.now()) ||
                                        Boolean.TRUE.equals(rt.getRevoked())) {
                                        return ResponseEntity.badRequest()
                                                .body("Refresh token expired or revoked");
                                }

                                // Lấy user từ refresh token
                                User user = rt.getUser();

                                // ⚠️ Ở đây cần convert roles sang GrantedAuthority
                                var authorities = user.getRoles().stream()
                                        .map(role -> (org.springframework.security.core.GrantedAuthority) new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                role.getName()))
                                        .toList();

                                // Tạo access token mới
                                String newAccess = jwtTokenProvider.generateTokenFromUsername(
                                        user.getEmail(), authorities);

                                JwtResponse res = JwtResponse.builder()
                                        .accessToken(newAccess)
                                        .refreshToken(refreshToken)
                                        .build();

                                return ResponseEntity.ok(res);
                        })
                        .orElseGet(() -> ResponseEntity.badRequest().body("Invalid refresh token"));
        }

        // ✅ Logout
        @PostMapping("/logout")
        public ResponseEntity<?> logout(@RequestBody Map<String, String> request) {
                String refreshToken = request.get("refreshToken");
                try {
                        refreshTokenService.revokeToken(refreshToken);
                        return ResponseEntity.ok(Map.of(
                                "message", "Đăng xuất thành công"
                        ));
                } catch (Exception e) {
                        return ResponseEntity.badRequest().body(Map.of(
                                "error", "Đăng xuất thất bại",
                                "message", e.getMessage()
                        ));
                }
        }

        // ✅ Admin: Tạo user với role cụ thể
        @PostMapping("/admin/create-user")
        public ResponseEntity<?> createUserWithRole(@RequestBody Map<String, Object> request) {
                try {
                        String email = (String) request.get("email");
                        String password = (String) request.get("password");
                        String name = (String) request.get("name");
                        String phone = (String) request.get("phone");
                        String roleName = (String) request.get("role"); // ROLE_STAFF, ROLE_CUSTOMER, etc.

                        // Tạo user mới
                        User newUser = new User();
                        newUser.setEmail(email);
                        newUser.setPassword(password); // AuthService sẽ hash password
                        newUser.setName(name);
                        newUser.setPhone(phone);

                        // Gọi AuthService để tạo user với role
                        User createdUser = authService.createUserWithRole(newUser, roleName);

                        return ResponseEntity.ok(Map.of(
                                "message", "Tạo user thành công",
                                "userId", createdUser.getUserId(),
                                "email", createdUser.getEmail(),
                                "name", createdUser.getName(),
                                "role", roleName
                        ));
                } catch (Exception e) {
                        return ResponseEntity.badRequest().body(Map.of(
                                "error", "Tạo user thất bại",
                                "message", e.getMessage()
                        ));
                }
        }
}
