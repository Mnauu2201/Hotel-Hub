package com.hotelhub.backend.entity;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class UserRoleId {
    private Long userId;
    private Long roleId;
}
