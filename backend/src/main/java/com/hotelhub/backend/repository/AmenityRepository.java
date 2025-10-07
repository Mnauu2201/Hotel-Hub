package com.hotelhub.backend.repository;

import com.hotelhub.backend.entity.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AmenityRepository extends JpaRepository<Amenity, Long> {
    
    Optional<Amenity> findByName(String name);
    
    List<Amenity> findByNameContainingIgnoreCase(String name);
    
    boolean existsByName(String name);

    
    /**
     * Đếm số phòng sử dụng tiện ích này
     */
    @Query("SELECT COUNT(r) FROM Room r JOIN r.amenities a WHERE a.amenityId = :amenityId")
    long countRoomsByAmenityId(@Param("amenityId") Long amenityId);

}

