package com.hotelhub.backend.repository;

import com.hotelhub.backend.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    // Bạn có thể thêm custom query ở đây nếu cần
}
