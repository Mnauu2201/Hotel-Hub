package com.hotelhub.backend.controller;

import com.hotelhub.backend.entity.User;
import com.hotelhub.backend.entity.Role;
import com.hotelhub.backend.repository.UserRepository;
import com.hotelhub.backend.repository.RoleRepository;
import com.hotelhub.backend.service.ActivityLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ActivityLogService activityLogService;

    /**
     * Lấy danh sách tất cả users
     */
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            List<Map<String, Object>> userData = users.stream()
                    .map(user -> {
                        Map<String, Object> data = new HashMap<>();
                        data.put("id", user.getUserId());
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
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Lấy danh sách users thất bại",
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Cập nhật thông tin user
     */
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        try {
            String adminEmail = authentication.getName();
            
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "User không tồn tại",
                    "message", "Không tìm thấy user với ID: " + userId
                ));
            }

            User user = userOpt.get();

            // Cập nhật thông tin cơ bản
            if (request.containsKey("name")) {
                user.setName((String) request.get("name"));
            }
            if (request.containsKey("email")) {
                user.setEmail((String) request.get("email"));
            }
            if (request.containsKey("phone")) {
                user.setPhone((String) request.get("phone"));
            }
            if (request.containsKey("enabled")) {
                user.setEnabled((Boolean) request.get("enabled"));
            }

            // Cập nhật role nếu có
            if (request.containsKey("roles")) {
                @SuppressWarnings("unchecked")
                List<String> roleNames = (List<String>) request.get("roles");
                if (roleNames != null && !roleNames.isEmpty()) {
                    // Xóa roles cũ
                    user.getRoles().clear();
                    
                    // Thêm roles mới
                    for (String roleName : roleNames) {
                        Optional<Role> roleOpt = roleRepository.findByName(roleName);
                        if (roleOpt.isPresent()) {
                            user.getRoles().add(roleOpt.get());
                        }
                    }
                }
            }

            user = userRepository.save(user);

            // Ghi log thao tác
            activityLogService.logSystemActivity("ADMIN_UPDATE_USER", 
                "Admin updated user " + user.getEmail() + " by admin: " + adminEmail);

            return ResponseEntity.ok(Map.of(
                "message", "Cập nhật thông tin user thành công",
                "user", Map.of(
                    "id", user.getUserId(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "phone", user.getPhone(),
                    "enabled", user.getEnabled(),
                    "roles", user.getRoles().stream().map(Role::getName).collect(Collectors.toList())
                )
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Cập nhật user thất bại",
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Toggle trạng thái user (enable/disable)
     */
    @PutMapping("/{userId}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        try {
            String adminEmail = authentication.getName();
            
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "User không tồn tại",
                    "message", "Không tìm thấy user với ID: " + userId
                ));
            }

            User user = userOpt.get();
            Boolean newStatus = (Boolean) request.get("enabled");
            
            if (newStatus != null) {
                user.setEnabled(newStatus);
                user = userRepository.save(user);

                // Ghi log thao tác
                String action = newStatus ? "enabled" : "disabled";
                activityLogService.logSystemActivity("ADMIN_TOGGLE_USER", 
                    "Admin " + action + " user " + user.getEmail() + " by admin: " + adminEmail);

                return ResponseEntity.ok(Map.of(
                    "message", newStatus ? "Đã kích hoạt user" : "Đã vô hiệu hóa user",
                    "user", Map.of(
                        "id", user.getUserId(),
                        "email", user.getEmail(),
                        "enabled", user.getEnabled()
                    )
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Dữ liệu không hợp lệ",
                    "message", "Trường 'enabled' là bắt buộc"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Thay đổi trạng thái user thất bại",
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Xem chi tiết user
     */
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserDetails(@PathVariable Long userId) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "User không tồn tại",
                    "message", "Không tìm thấy user với ID: " + userId
                ));
            }

            User user = userOpt.get();
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getUserId());
            userData.put("name", user.getName());
            userData.put("email", user.getEmail());
            userData.put("phone", user.getPhone());
            userData.put("enabled", user.getEnabled());
            userData.put("emailVerified", user.getEmailVerified() != null ? user.getEmailVerified() : false);
            userData.put("roles", user.getRoles().stream().map(Role::getName).collect(Collectors.toList()));
            userData.put("createdAt", user.getCreatedAt());

            return ResponseEntity.ok(Map.of(
                "message", "Thông tin user",
                "user", userData
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Lấy thông tin user thất bại",
                "message", e.getMessage()
            ));
        }
    }
}
