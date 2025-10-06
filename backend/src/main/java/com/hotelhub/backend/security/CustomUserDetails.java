package com.hotelhub.backend.security;

import com.hotelhub.backend.entity.Role;
import com.hotelhub.backend.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;
import java.util.stream.Collectors;

public class CustomUserDetails implements UserDetails {

    private final User user;
    private final Set<Role> roles;

    public CustomUserDetails(User user, Set<Role> roles) {
        this.user = user;
        this.roles = roles;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (roles == null) {
            return Collections.emptyList();
        }

        return roles.stream()
                .map(role -> {
                    String roleName = role.getName();
                    // ✅ Đảm bảo luôn có prefix ROLE_
                    if (!roleName.startsWith("ROLE_")) {
                        roleName = "ROLE_" + roleName;
                    }
                    return new SimpleGrantedAuthority(roleName);
                })
                .collect(Collectors.toSet());
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail(); // dùng email làm username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // có thể thay đổi tùy logic
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // có thể thay đổi tùy logic
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // có thể thay đổi tùy logic
    }

    @Override
    public boolean isEnabled() {
        return Boolean.TRUE.equals(user.getEnabled());
    }

    // 👉 Getter bổ sung nếu bạn cần lấy dữ liệu User gốc
    public User getUser() {
        return user;
    }
}
