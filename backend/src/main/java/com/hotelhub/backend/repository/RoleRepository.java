package com.hotelhub.backend.repository;

import com.hotelhub.backend.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);

    // Lấy role theo userId (dùng UserRole entity join)
    @Query("SELECT r FROM Role r, UserRole ur WHERE r.roleId = ur.roleId AND ur.userId = :userId")
    List<Role> findRolesByUserId(@Param("userId") Long userId);
}
