package com.hotelhub.backend.repository;

import com.hotelhub.backend.entity.RoomDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomDetailRepository extends JpaRepository<RoomDetail, Long> {
    
    Optional<RoomDetail> findByRoom_RoomId(Long roomId);
    
    void deleteByRoom_RoomId(Long roomId);
}

