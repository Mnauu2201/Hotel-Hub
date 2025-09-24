package com.hotelhub.backend.service;

import com.hotelhub.backend.dto.request.RegisterRequest;
import com.hotelhub.backend.entity.*;
import com.hotelhub.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private UserRoleRepository userRoleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;

    public User register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .enabled(true)
                .emailVerified(false)
                .build();
        User saved = userRepository.save(user);

        // gán role CUSTOMER mặc định
        Role role = roleRepository.findByName("ROLE_CUSTOMER")
                .orElseGet(() -> roleRepository
                        .save(Role.builder().name("ROLE_CUSTOMER").description("Khách hàng").build()));
        UserRole ur = UserRole.builder().userId(saved.getUserId()).roleId(role.getRoleId()).build();
        userRoleRepository.save(ur);
        return saved;
    }

    public void authenticate(String email, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow();
    }

}
