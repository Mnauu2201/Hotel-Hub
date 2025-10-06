package com.hotelhub.backend.dto.response;

import com.hotelhub.backend.entity.Role;
import com.hotelhub.backend.entity.User;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long userId;
    private String name;
    private String email;
    private String phone;
    private Boolean enabled;
    private Boolean emailVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<String> roles;

    public static UserResponse fromEntity(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .enabled(user.getEnabled())
                .emailVerified(user.getEmailVerified())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .roles(user.getRoles() == null ? null : user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
                .build();
    }
}
