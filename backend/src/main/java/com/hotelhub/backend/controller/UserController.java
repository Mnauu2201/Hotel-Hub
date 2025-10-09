package com.hotelhub.backend.controller;

import com.hotelhub.backend.dto.request.UpdateProfileRequest;
import com.hotelhub.backend.dto.response.UserResponse;
import com.hotelhub.backend.entity.User;
import com.hotelhub.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
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

    @PutMapping("/me")
    public ResponseEntity<?> updateMe(@AuthenticationPrincipal UserDetails principal,
                                      @Validated @RequestBody UpdateProfileRequest req) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Người dùng chưa đăng nhập");
        }
        
        try {
            return userRepository.findByEmail(principal.getUsername())
                    .map(u -> {
                        if (req.getName() != null && !req.getName().trim().isEmpty()) {
                            u.setName(req.getName().trim());
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
                        logger.info("Cập nhật thông tin người dùng thành công: {}", saved.getEmail());
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

    // Endpoint để test - lấy danh sách users (chỉ để debug)
    @GetMapping("/debug")
    public ResponseEntity<?> getAllUsers() {
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
}
