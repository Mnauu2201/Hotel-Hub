package com.hotelhub.backend.repository;

import com.hotelhub.backend.entity.UserRole;
import com.hotelhub.backend.entity.UserRoleId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRoleRepository extends JpaRepository<UserRole, UserRoleId> {
}
