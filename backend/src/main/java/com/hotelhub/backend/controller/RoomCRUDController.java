package com.hotelhub.backend.controller;

import com.hotelhub.backend.dto.request.RoomRequest;
import com.hotelhub.backend.dto.response.RoomResponse;
import com.hotelhub.backend.entity.RoomStatus;
import com.hotelhub.backend.service.RoomCRUDService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
public class RoomCRUDController {

    @Autowired
    private RoomCRUDService roomCRUDService;

    /**
     * Tạo phòng mới (Admin only)
     */
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createRoom(@Valid @RequestBody RoomRequest request) {
        try {
            RoomResponse room = roomCRUDService.createRoom(request);
            return ResponseEntity.ok(Map.of(
                    "message", "Tạo phòng thành công",
                    "room", room
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Tạo phòng thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Cập nhật phòng (Admin only)
     */
    @PutMapping("/{roomId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateRoom(@PathVariable Long roomId, 
                                      @Valid @RequestBody RoomRequest request) {
        try {
            RoomResponse room = roomCRUDService.updateRoom(roomId, request);
            return ResponseEntity.ok(Map.of(
                    "message", "Cập nhật phòng thành công",
                    "room", room
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Cập nhật phòng thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Xóa phòng (Admin only)
     */
    @DeleteMapping("/{roomId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteRoom(@PathVariable Long roomId) {
        try {
            roomCRUDService.deleteRoom(roomId);
            return ResponseEntity.ok(Map.of(
                    "message", "Xóa phòng thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Xóa phòng thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Lấy phòng theo ID (Public)
     */
    @GetMapping("/{roomId}")
    public ResponseEntity<?> getRoomById(@PathVariable Long roomId) {
        try {
            RoomResponse room = roomCRUDService.getRoomById(roomId);
            return ResponseEntity.ok(room);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy thông tin phòng thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Lấy tất cả phòng (Public)
     */
    @GetMapping
    public ResponseEntity<?> getAllRooms() {
        try {
            List<RoomResponse> rooms = roomCRUDService.getAllRooms();
            return ResponseEntity.ok(Map.of(
                    "rooms", rooms,
                    "count", rooms.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy danh sách phòng thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Lấy phòng theo trạng thái (Public)
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getRoomsByStatus(@PathVariable RoomStatus status) {
        try {
            List<RoomResponse> rooms = roomCRUDService.getRoomsByStatus(status);
            return ResponseEntity.ok(Map.of(
                    "rooms", rooms,
                    "count", rooms.size(),
                    "status", status
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy danh sách phòng theo trạng thái thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Lấy phòng theo loại (Public)
     */
    @GetMapping("/type/{roomTypeId}")
    public ResponseEntity<?> getRoomsByType(@PathVariable Long roomTypeId) {
        try {
            List<RoomResponse> rooms = roomCRUDService.getRoomsByType(roomTypeId);
            return ResponseEntity.ok(Map.of(
                    "rooms", rooms,
                    "count", rooms.size(),
                    "roomTypeId", roomTypeId
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy danh sách phòng theo loại thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Lấy phòng available (Public)
     */
    @GetMapping("/available")
    public ResponseEntity<?> getAvailableRooms() {
        try {
            List<RoomResponse> rooms = roomCRUDService.getRoomsByStatus(RoomStatus.AVAILABLE);
            return ResponseEntity.ok(Map.of(
                    "rooms", rooms,
                    "count", rooms.size(),
                    "status", "available"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy danh sách phòng trống thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Lấy phòng gợi ý (loại trừ phòng hiện tại) (Public)
     */
    @GetMapping("/suggested")
    public ResponseEntity<?> getSuggestedRooms(@RequestParam(required = false) Long excludeRoomId,
                                             @RequestParam(defaultValue = "3") int limit) {
        try {
            List<RoomResponse> rooms = roomCRUDService.getSuggestedRooms(excludeRoomId, limit);
            return ResponseEntity.ok(Map.of(
                    "rooms", rooms,
                    "count", rooms.size(),
                    "excludeRoomId", excludeRoomId,
                    "limit", limit
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy danh sách phòng gợi ý thất bại",
                    "message", e.getMessage()
            ));
        }
    }
}

