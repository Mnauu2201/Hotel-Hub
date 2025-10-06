package com.hotelhub.backend.repository;

import com.hotelhub.backend.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    
    /**
     * Tìm phòng theo số phòng
     */
    Optional<Room> findByRoomNumber(String roomNumber);
    
    /**
     * Lấy phòng trống trong khoảng thời gian
     */
    @Query("SELECT r FROM Room r WHERE r.status = 'available' " +
           "AND r.roomId NOT IN (" +
           "SELECT b.roomId FROM Booking b WHERE " +
           "b.status IN ('pending', 'confirmed') " +
           "AND ((b.checkIn <= :checkOut AND b.checkOut >= :checkIn) " +
           "OR (b.holdUntil IS NOT NULL AND b.holdUntil > CURRENT_TIMESTAMP))" +
           ")")
    List<Room> findAvailableRooms(@Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut);
    
    /**
     * Kiểm tra phòng có trống không
     */
    @Query("SELECT COUNT(b) = 0 FROM Booking b WHERE b.roomId = :roomId " +
           "AND b.status IN ('pending', 'confirmed') " +
           "AND ((b.checkIn <= :checkOut AND b.checkOut >= :checkIn) " +
           "OR (b.holdUntil IS NOT NULL AND b.holdUntil > CURRENT_TIMESTAMP))")
    boolean isRoomAvailable(@Param("roomId") Long roomId, @Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut);
}
