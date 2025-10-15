package com.hotelhub.backend.service;

import com.hotelhub.backend.dto.request.RegisterRequest;
import com.hotelhub.backend.entity.Role;
import com.hotelhub.backend.entity.User;
import com.hotelhub.backend.repository.RoleRepository;
import com.hotelhub.backend.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailVerificationService emailVerificationService;

    /**
     * Đăng ký user mới với role mặc định = ROLE_CUSTOMER
     * User sẽ bị disabled cho đến khi xác thực email
     */
    @Transactional
    public User register(RegisterRequest request) throws MessagingException {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã tồn tại: " + request.getEmail());
        }

        // Log để debug
        System.out.println("Registering user with phone: " + request.getPhone());

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setEnabled(false); // ❌ Chưa cho phép đăng nhập
        user.setEmailVerified(false); // ❌ Chưa xác thực email

        // Gán role mặc định
        Role customerRole = roleRepository.findByName("ROLE_CUSTOMER")
                .orElseThrow(() -> new RuntimeException("ROLE_CUSTOMER not found. Please seed roles in DB."));

        Set<Role> roles = new HashSet<>();
        roles.add(customerRole);
        user.setRoles(roles);

        User savedUser = userRepository.save(user);

        // Log để debug - kiểm tra phone đã được lưu chưa
        System.out.println("User saved with phone: " + savedUser.getPhone());

        // 📧 Gửi email xác thực
        emailVerificationService.createVerificationTokenAndSendEmail(savedUser);

        return savedUser;
    }

    /**
     * Tạo user với role cụ thể (dành cho Admin)
     */
    @Transactional
    public User createUserWithRole(User user, String roleName) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã tồn tại: " + user.getEmail());
        }

        // Hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(true); // Admin tạo thì enable luôn
        user.setEmailVerified(true); // Admin tạo thì verify luôn

        // Gán role cụ thể
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role không tồn tại: " + roleName));

        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);

        return userRepository.save(user);
    }
}