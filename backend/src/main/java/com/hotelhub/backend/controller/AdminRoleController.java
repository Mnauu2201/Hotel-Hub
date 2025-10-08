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

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/roles")
public class AdminRoleController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;


    @Autowired
    private ActivityLogService activityLogService;

    /**
     * 1. Xem tất cả roles
     */
    @GetMapping
    public ResponseEntity<?> getAllRoles() {
        try {
            List<Role> roles = roleRepository.findAll();
            return ResponseEntity.ok(Map.of(
                    "message", "Lấy danh sách roles thành công",
                    "roles", roles
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy danh sách roles thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * 2. Xem roles của user cụ thể
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserRoles(@PathVariable Long userId) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "User không tồn tại",
                        "message", "Không tìm thấy user với ID: " + userId
                ));
            }

            User user = userOpt.get();
            return ResponseEntity.ok(Map.of(
                    "message", "Lấy roles của user thành công",
                    "userId", user.getUserId(),
                    "email", user.getEmail(),
                    "name", user.getName(),
                    "roles", user.getRoles()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy roles của user thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * 3. Thêm role cho user
     */
    @PostMapping("/user/{userId}/add")
    public ResponseEntity<?> addRoleToUser(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            String roleName = request.get("roleName");
            if (roleName == null || roleName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Thiếu thông tin role",
                        "message", "Vui lòng cung cấp roleName"
                ));
            }

            // Kiểm tra user tồn tại
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "User không tồn tại",
                        "message", "Không tìm thấy user với ID: " + userId
                ));
            }

            // Kiểm tra role tồn tại
            Optional<Role> roleOpt = roleRepository.findByName(roleName);
            if (roleOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Role không tồn tại",
                        "message", "Không tìm thấy role: " + roleName
                ));
            }

            User user = userOpt.get();
            Role role = roleOpt.get();

            // Kiểm tra user đã có role này chưa
            if (user.getRoles().contains(role)) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "User đã có role này",
                        "message", "User " + user.getEmail() + " đã có role " + roleName
                ));
            }

            // Thêm role cho user
            user.getRoles().add(role);
            userRepository.save(user);

            // Log activity
            String adminEmail = authentication.getName();
            activityLogService.logActivity(
                    adminEmail,
                    "ADD_ROLE_TO_USER",
                    "Thêm role " + roleName + " cho user " + user.getEmail() + " (User ID: " + userId + ")"
            );

            return ResponseEntity.ok(Map.of(
                    "message", "Thêm role thành công",
                    "userId", user.getUserId(),
                    "email", user.getEmail(),
                    "roleAdded", roleName,
                    "totalRoles", user.getRoles().size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Thêm role thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * 4. Xóa role khỏi user
     */
    @DeleteMapping("/user/{userId}/remove")
    public ResponseEntity<?> removeRoleFromUser(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            String roleName = request.get("roleName");
            if (roleName == null || roleName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Thiếu thông tin role",
                        "message", "Vui lòng cung cấp roleName"
                ));
            }

            // Kiểm tra user tồn tại
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "User không tồn tại",
                        "message", "Không tìm thấy user với ID: " + userId
                ));
            }

            User user = userOpt.get();

            // Kiểm tra user có role này không
            boolean hasRole = user.getRoles().stream()
                    .anyMatch(role -> role.getName().equals(roleName));

            if (!hasRole) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "User không có role này",
                        "message", "User " + user.getEmail() + " không có role " + roleName
                ));
            }

            // Xóa role khỏi user
            user.getRoles().removeIf(role -> role.getName().equals(roleName));
            userRepository.save(user);

            // Log activity
            String adminEmail = authentication.getName();
            activityLogService.logActivity(
                    adminEmail,
                    "REMOVE_ROLE_FROM_USER",
                    "Xóa role " + roleName + " khỏi user " + user.getEmail() + " (User ID: " + userId + ")"
            );

            return ResponseEntity.ok(Map.of(
                    "message", "Xóa role thành công",
                    "userId", user.getUserId(),
                    "email", user.getEmail(),
                    "roleRemoved", roleName,
                    "remainingRoles", user.getRoles().size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Xóa role thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * 5. Cập nhật roles của user (thay thế toàn bộ)
     */
    @PutMapping("/user/{userId}/update")
    public ResponseEntity<?> updateUserRoles(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        try {
            @SuppressWarnings("unchecked")
            List<String> roleNames = (List<String>) request.get("roleNames");
            if (roleNames == null || roleNames.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Thiếu thông tin roles",
                        "message", "Vui lòng cung cấp danh sách roleNames"
                ));
            }

            // Kiểm tra user tồn tại
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "User không tồn tại",
                        "message", "Không tìm thấy user với ID: " + userId
                ));
            }

            User user = userOpt.get();

            // Kiểm tra tất cả roles tồn tại
            List<Role> newRoles = roleNames.stream()
                    .map(roleName -> roleRepository.findByName(roleName)
                            .orElseThrow(() -> new RuntimeException("Role không tồn tại: " + roleName)))
                    .toList();

            // Lưu roles cũ để log
            String oldRoles = user.getRoles().stream()
                    .map(Role::getName)
                    .reduce((a, b) -> a + ", " + b)
                    .orElse("Không có");

            // Cập nhật roles
            user.getRoles().clear();
            user.getRoles().addAll(newRoles);
            userRepository.save(user);

            String newRolesStr = newRoles.stream()
                    .map(Role::getName)
                    .reduce((a, b) -> a + ", " + b)
                    .orElse("Không có");

            // Log activity
            String adminEmail = authentication.getName();
            activityLogService.logActivity(
                    adminEmail,
                    "UPDATE_USER_ROLES",
                    "Cập nhật roles cho user " + user.getEmail() + " (User ID: " + userId + ", Old: " + oldRoles + ", New: " + newRolesStr + ")"
            );

            return ResponseEntity.ok(Map.of(
                    "message", "Cập nhật roles thành công",
                    "userId", user.getUserId(),
                    "email", user.getEmail(),
                    "oldRoles", oldRoles,
                    "newRoles", newRolesStr,
                    "totalRoles", user.getRoles().size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Cập nhật roles thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * 6. Xem tất cả users và roles của họ
     */
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsersWithRoles() {
        try {
            List<User> users = userRepository.findAll();
            List<Map<String, Object>> userRoles = users.stream()
                    .map(user -> {
                        Map<String, Object> userInfo = new HashMap<>();
                        userInfo.put("userId", user.getUserId());
                        userInfo.put("email", user.getEmail());
                        userInfo.put("name", user.getName());
                        userInfo.put("phone", user.getPhone());
                        userInfo.put("enabled", user.getEnabled());
                        userInfo.put("roles", user.getRoles().stream()
                                .map(role -> Map.of(
                                        "roleId", role.getRoleId(),
                                        "name", role.getName(),
                                        "description", role.getDescription()
                                ))
                                .toList());
                        return userInfo;
                    })
                    .toList();

            return ResponseEntity.ok(Map.of(
                    "message", "Lấy danh sách users và roles thành công",
                    "totalUsers", users.size(),
                    "users", userRoles
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy danh sách users thất bại",
                    "message", e.getMessage()
            ));
        }
    }
}

