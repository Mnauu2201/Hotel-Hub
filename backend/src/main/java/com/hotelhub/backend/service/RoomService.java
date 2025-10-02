package com.hotelhub.backend.service;

import com.hotelhub.backend.entity.Room;
import com.hotelhub.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    /**
     * Lấy tất cả phòng
     */
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    /**
     * Lấy phòng theo ID
     */
    public Optional<Room> getRoomById(Long roomId) {
        return roomRepository.findById(roomId);
    }

    /**
     * Lấy phòng trống trong khoảng thời gian
     */
    public List<Room> getAvailableRooms(LocalDate checkIn, LocalDate checkOut) {
        return roomRepository.findAvailableRooms(checkIn, checkOut);
    }

    /**
     * Kiểm tra phòng có trống không
     */
    public boolean isRoomAvailable(Long roomId, LocalDate checkIn, LocalDate checkOut) {
        return roomRepository.isRoomAvailable(roomId, checkIn, checkOut);
    }

    /**
     * Lấy phòng theo số phòng
     */
    public Optional<Room> getRoomByNumber(String roomNumber) {
        return roomRepository.findByRoomNumber(roomNumber);
    }
}