package com.hotelhub.backend.repository;

import com.hotelhub.backend.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {
    
    Optional<RoomType> findByName(String name);
    
    List<RoomType> findByNameContainingIgnoreCase(String name);
    
    boolean existsByName(String name);

    
    /**
     * Đếm số phòng sử dụng loại phòng này
     */
    @Query("SELECT COUNT(r) FROM Room r WHERE r.roomType.typeId = :typeId")
    long countRoomsByTypeId(@Param("typeId") Long typeId);

}

