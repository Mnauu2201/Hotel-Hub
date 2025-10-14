package com.hotelhub.backend.controller;

import com.hotelhub.backend.dto.request.UpdateProfileRequest;
import com.hotelhub.backend.dto.response.UserResponse;
import com.hotelhub.backend.entity.User;
import com.hotelhub.backend.repository.UserRepository;
import com.hotelhub.backend.security.JwtTokenProvider;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Date;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/test-jwt")
    public ResponseEntity<?> testJwt(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> result = new HashMap<>();
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            result.put("error", "No Authorization header or invalid format");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
        
        String token = authHeader.substring(7);
        result.put("tokenLength", token.length());
        result.put("tokenStart", token.substring(0, Math.min(50, token.length())) + "...");
        
        try {
            // Test JWT provider directly
            boolean isValid = jwtTokenProvider.validateToken(token);
            result.put("jwtValidation", isValid);
            
            if (isValid) {
                String username = jwtTokenProvider.getUsernameFromToken(token);
                result.put("username", username);
                
                List<String> roles = jwtTokenProvider.getRolesFromToken(token);
                result.put("roles", roles);
            }
        } catch (Exception e) {
            result.put("jwtError", e.getMessage());
        }
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/debug")
    public ResponseEntity<?> debugAuth(@AuthenticationPrincipal UserDetails principal) {
        Map<String, Object> debugInfo = new HashMap<>();
        debugInfo.put("principal", principal != null ? "present" : "null");
        debugInfo.put("username", principal != null ? principal.getUsername() : "N/A");
        debugInfo.put("authorities", principal != null ? principal.getAuthorities() : "N/A");
        debugInfo.put("timestamp", new Date().toString());
        
        logger.info("Debug auth endpoint called. Principal: {}, Username: {}", 
                   principal != null ? "present" : "null",
                   principal != null ? principal.getUsername() : "N/A");
        
        return ResponseEntity.ok(debugInfo);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Người dùng chưa đăng nhập");
        }
        
        try {
            java.util.Optional<User> userOpt = userRepository.findByEmail(principal.getUsername());
            if (userOpt.isPresent()) {
                return ResponseEntity.ok(UserResponse.fromEntity(userOpt.get()));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy người dùng");
        } catch (Exception e) {
            logger.error("Lỗi khi lấy thông tin người dùng", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi lấy thông tin người dùng");
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal UserDetails principal,
                                          @RequestBody Map<String, String> request) {
        logger.info("Change password request received. Principal: {}, Email: {}", 
                   principal != null ? "present" : "null", 
                   principal != null ? principal.getUsername() : "N/A");
        
        if (principal == null) {
            logger.warn("Change password failed: Principal is null");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Người dùng chưa đăng nhập");
        }
        
        try {
            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");
            
            if (currentPassword == null || currentPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Mật khẩu hiện tại không được để trống"));
            }
            
            if (newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Mật khẩu mới không được để trống"));
            }
            
            if (newPassword.length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("error", "Mật khẩu mới phải có ít nhất 6 ký tự"));
            }
            
            return userRepository.findByEmail(principal.getUsername())
                    .map(user -> {
                        // Kiểm tra mật khẩu hiện tại
                        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                            logger.warn("Change password failed: Incorrect current password for user: {}", user.getEmail());
                            return ResponseEntity.badRequest().body(Map.of("error", "Mật khẩu hiện tại không đúng"));
                        }
                        
                        // Cập nhật mật khẩu mới
                        user.setPassword(passwordEncoder.encode(newPassword));
                        userRepository.save(user);
                        
                        logger.info("Password changed successfully for user: {}", user.getEmail());
                        return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công"));
                    })
                    .orElseGet(() -> {
                        logger.warn("Change password failed: User not found with email: {}", principal.getUsername());
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Không tìm thấy người dùng"));
                    });
        } catch (Exception e) {
            logger.error("Error changing password for user: {}", principal.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Đã xảy ra lỗi khi đổi mật khẩu"));
        }
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMe(@AuthenticationPrincipal UserDetails principal,
                                      @Validated @RequestBody UpdateProfileRequest req) {
        logger.info("Update profile request received. Principal: {}, Email: {}", 
                   principal != null ? "present" : "null", 
                   principal != null ? principal.getUsername() : "N/A");
        
        if (principal == null) {
            logger.warn("Update profile failed: Principal is null");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Người dùng chưa đăng nhập");
        }
        
        try {
            return userRepository.findByEmail(principal.getUsername())
                    .map(u -> {
                        if (req.getName() != null && !req.getName().trim().isEmpty()) {
                            u.setName(req.getName().trim());
                        }
                        
                        if (req.getEmail() != null && !req.getEmail().trim().isEmpty()) {
                            String newEmail = req.getEmail().trim();
                            // Kiểm tra định dạng email
                            if (!newEmail.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
                                Map<String, String> errors = new HashMap<>();
                                errors.put("email", "Email không hợp lệ");
                                return ResponseEntity.badRequest().body(errors);
                            }
                            
                            // Kiểm tra email có trùng với user khác không
                            if (!newEmail.equals(u.getEmail())) {
                                if (userRepository.findByEmail(newEmail).isPresent()) {
                                    Map<String, String> errors = new HashMap<>();
                                    errors.put("email", "Email này đã được sử dụng bởi tài khoản khác");
                                    return ResponseEntity.badRequest().body(errors);
                                }
                                u.setEmail(newEmail);
                            }
                        }
                        
                        if (req.getPhone() != null && !req.getPhone().trim().isEmpty()) {
                            // Kiểm tra định dạng số điện thoại
                            if (!req.getPhone().matches("^[0-9]{10,11}$")) {
                                Map<String, String> errors = new HashMap<>();
                                errors.put("phone", "Số điện thoại không hợp lệ. Vui lòng nhập 10-11 chữ số");
                                return ResponseEntity.badRequest().body(errors);
                            }
                            u.setPhone(req.getPhone().trim());
                        }
                        
                        User saved = userRepository.save(u);
                        logger.info("Cập nhật thông tin người dùng thành công: {} -> {}", principal.getUsername(), saved.getEmail());
                        return ResponseEntity.ok(UserResponse.fromEntity(saved));
                    })
                    .orElseGet(() -> {
                        logger.warn("Không tìm thấy người dùng với email: {}", principal.getUsername());
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy người dùng");
                    });
        } catch (Exception e) {
            logger.error("Lỗi khi cập nhật thông tin người dùng", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi cập nhật thông tin người dùng");
        }
    }


    // ✅ Admin: Lấy danh sách tất cả users (cho admin panel)
    @GetMapping("/public")
    public ResponseEntity<?> getAllUsersPublic() {
        try {
            List<User> users = userRepository.findAll();
            List<Map<String, Object>> userData = users.stream()
                    .map(user -> {
                        Map<String, Object> data = new HashMap<>();
                        data.put("userId", user.getUserId());
                        data.put("name", user.getName());
                        data.put("email", user.getEmail());
                        data.put("phone", user.getPhone());
                        data.put("enabled", user.getEnabled());
                        data.put("emailVerified", user.getEmailVerified() != null ? user.getEmailVerified() : false);
                        data.put("roles", user.getRoles() != null ? 
                            user.getRoles().stream().map(role -> role.getName()).collect(Collectors.toList()) : 
                            List.of("ROLE_CUSTOMER"));
                        data.put("createdAt", user.getCreatedAt());
                        return data;
                    })
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(Map.of(
                "message", "Danh sách users",
                "count", users.size(),
                "users", userData
            ));
        } catch (Exception e) {
            logger.error("Lỗi khi lấy danh sách users", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi lấy danh sách users");
        }
    }

    // ✅ Admin: Cập nhật thông tin user (cho admin panel)
    @PutMapping("/{userId}/public")
    public ResponseEntity<?> updateUserPublic(@PathVariable Long userId, @RequestBody Map<String, Object> request) {
        try {
            return userRepository.findById(userId)
                    .map(user -> {
                        if (request.containsKey("name")) {
                            user.setName((String) request.get("name"));
                        }
                        if (request.containsKey("phone")) {
                            user.setPhone((String) request.get("phone"));
                        }
                        
                        User saved = userRepository.save(user);
                        logger.info("Admin cập nhật thông tin user thành công: {}", saved.getEmail());
                        
                        Map<String, Object> response = new HashMap<>();
                        response.put("message", "Cập nhật thông tin người dùng thành công");
                        response.put("user", Map.of(
                            "userId", saved.getUserId(),
                            "name", saved.getName(),
                            "email", saved.getEmail(),
                            "phone", saved.getPhone(),
                            "enabled", saved.getEnabled()
                        ));
                        return ResponseEntity.ok(response);
                    })
                    .orElseGet(() -> {
                        logger.warn("Không tìm thấy user với ID: {}", userId);
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Không tìm thấy người dùng"));
                    });
        } catch (Exception e) {
            logger.error("Lỗi khi cập nhật thông tin user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi cập nhật thông tin người dùng");
        }
    }

    // ✅ Admin: Khóa/mở khóa tài khoản user
    @PutMapping("/{userId}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long userId, @RequestBody Map<String, Object> request) {
        try {
            return userRepository.findById(userId)
                    .map(user -> {
                        Boolean enabled = (Boolean) request.get("enabled");
                        if (enabled != null) {
                            user.setEnabled(enabled);
                            User saved = userRepository.save(user);
                            logger.info("Admin {} tài khoản user: {}", enabled ? "mở khóa" : "khóa", saved.getEmail());
                            
                            Map<String, Object> response = new HashMap<>();
                            response.put("message", enabled ? "Đã mở khóa tài khoản" : "Đã khóa tài khoản");
                            response.put("user", Map.of(
                                "userId", saved.getUserId(),
                                "name", saved.getName(),
                                "email", saved.getEmail(),
                                "enabled", saved.getEnabled()
                            ));
                            return ResponseEntity.ok(response);
                        } else {
                            return ResponseEntity.badRequest().body("Thiếu thông tin trạng thái");
                        }
                    })
                    .orElseGet(() -> {
                        logger.warn("Không tìm thấy user với ID: {}", userId);
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Không tìm thấy người dùng"));
                    });
        } catch (Exception e) {
            logger.error("Lỗi khi thay đổi trạng thái user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi thay đổi trạng thái tài khoản");
        }
    }
}
