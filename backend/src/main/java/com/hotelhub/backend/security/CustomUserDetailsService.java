package com.hotelhub.backend.security;

import com.hotelhub.backend.entity.Role;
import com.hotelhub.backend.entity.User;
import com.hotelhub.backend.repository.RoleRepository;
import com.hotelhub.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
        List<Role> roles = roleRepository.findRolesByUserId(user.getUserId());
        return new CustomUserDetails(user, roles);
    }
}
