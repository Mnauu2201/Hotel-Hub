// src/main/java/com/hotelhub/backend/repository/RoleRepository.java
package com.hotelhub.backend.repository;

import com.hotelhub.backend.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);

    boolean existsByName(String name);
}