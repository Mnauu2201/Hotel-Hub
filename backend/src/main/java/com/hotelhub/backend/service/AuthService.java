package com.hotelhub.backend.service;

import com.hotelhub.backend.dto.request.RegisterRequest;
import com.hotelhub.backend.entity.Role;
import com.hotelhub.backend.entity.User;
import com.hotelhub.backend.repository.RoleRepository;
import com.hotelhub.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    /**
     * Đăng ký user mới với role mặc định = ROLE_CUSTOMER
     */
    public User register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }

        // Log để debug
        System.out.println("Registering user with phone: " + request.getPhone());

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setEnabled(true);

        // Gán role mặc định
        Role customerRole = roleRepository.findByName("ROLE_CUSTOMER")
                .orElseThrow(() -> new RuntimeException("ROLE_CUSTOMER not found. Please seed roles in DB."));

        Set<Role> roles = new HashSet<>();
        roles.add(customerRole);
        user.setRoles(roles);

        User savedUser = userRepository.save(user);
        
        // Log để debug - kiểm tra phone đã được lưu chưa
        System.out.println("User saved with phone: " + savedUser.getPhone());
        
        return savedUser;
    }

    /**
     * Tạo user với role cụ thể (dành cho Admin)
     */
    public User createUserWithRole(User user, String roleName) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists: " + user.getEmail());
        }

        // Hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(true);

        // Gán role cụ thể
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);

        return userRepository.save(user);
    }
}
