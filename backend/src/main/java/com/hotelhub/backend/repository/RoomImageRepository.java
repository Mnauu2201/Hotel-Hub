package com.hotelhub.backend.repository;

import com.hotelhub.backend.entity.RoomImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomImageRepository extends JpaRepository<RoomImage, Long> {
    
    List<RoomImage> findByRoom_RoomIdOrderByDisplayOrderAsc(Long roomId);
    
    Optional<RoomImage> findByRoom_RoomIdAndIsPrimaryTrue(Long roomId);
    
    List<RoomImage> findByRoom_RoomId(Long roomId);
    
    void deleteByRoom_RoomId(Long roomId);
}

