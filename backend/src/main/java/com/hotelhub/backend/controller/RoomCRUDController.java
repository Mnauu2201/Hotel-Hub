package com.hotelhub.backend.controller;

import com.hotelhub.backend.dto.request.RoomRequest;
import com.hotelhub.backend.dto.response.RoomResponse;
import com.hotelhub.backend.entity.RoomStatus;
import com.hotelhub.backend.entity.Booking;
import com.hotelhub.backend.service.RoomCRUDService;
import com.hotelhub.backend.service.RoomStatusSyncService;
import com.hotelhub.backend.repository.BookingRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rooms")
public class RoomCRUDController {

    @Autowired
    private RoomCRUDService roomCRUDService;

    @Autowired
    private RoomStatusSyncService roomStatusSyncService;

    @Autowired
    private BookingRepository bookingRepository;

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
                    "room", room));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Tạo phòng thất bại",
                    "message", e.getMessage()));
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
                    "room", room));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Cập nhật phòng thất bại",
                    "message", e.getMessage()));
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
                    "message", "Xóa phòng thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Xóa phòng thất bại",
                    "message", e.getMessage()));
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
                    "message", e.getMessage()));
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
                    "count", rooms.size()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy danh sách phòng thất bại",
                    "message", e.getMessage()));
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
                    "status", status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy danh sách phòng theo trạng thái thất bại",
                    "message", e.getMessage()));
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
                    "roomTypeId", roomTypeId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy danh sách phòng theo loại thất bại",
                    "message", e.getMessage()));
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
                    "status", "available"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy danh sách phòng trống thất bại",
                    "message", e.getMessage()));
        }
    }

    /**
     * Debug endpoint để kiểm tra booking của phòng
     */
    @GetMapping("/{roomId}/bookings")
    public ResponseEntity<?> getRoomBookings(@PathVariable Long roomId) {
        try {
            List<Booking> bookings = bookingRepository.findByRoomId(roomId);
            List<Map<String, Object>> bookingInfo = bookings.stream()
                .map(booking -> {
                    Map<String, Object> bookingMap = new java.util.HashMap<>();
                    bookingMap.put("bookingId", booking.getBookingId());
                    bookingMap.put("status", booking.getStatus());
                    bookingMap.put("checkIn", booking.getCheckIn());
                    bookingMap.put("checkOut", booking.getCheckOut());
                    bookingMap.put("guestEmail", booking.getGuestEmail() != null ? booking.getGuestEmail() : "N/A");
                    return bookingMap;
                })
                .collect(Collectors.toList());
            
            // Test query logic
            List<String> inactiveStatuses = Arrays.asList("cancelled", "paid", "refunded");
            long activeBookingCount = bookingRepository.countByRoomIdAndStatusNotIn(roomId, inactiveStatuses);
            
            return ResponseEntity.ok(Map.of(
                "roomId", roomId,
                "totalBookings", bookings.size(),
                "activeBookingCount", activeBookingCount,
                "inactiveStatuses", inactiveStatuses,
                "bookings", bookingInfo
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
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
                    "limit", limit));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy danh sách phòng gợi ý thất bại",
                    "message", e.getMessage()));

        }
    }

    /**
     * Sync room status với booking status (Admin only)
     */
    @PostMapping("/sync-status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> syncRoomStatuses() {
        try {
            int updatedCount = roomStatusSyncService.syncAllRoomStatuses();
            return ResponseEntity.ok(Map.of(
                    "message", "Sync room status thành công",
                    "updatedCount", updatedCount));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Sync room status thất bại",
                    "message", e.getMessage()));
        }
    }

    /**
     * Test sync room status (Public for testing)
     */
    @GetMapping("/test-sync")
    public ResponseEntity<?> testSyncRoomStatuses() {
        try {
            System.out.println("=== STARTING ROOM STATUS SYNC ===");
            int updatedCount = roomStatusSyncService.syncAllRoomStatuses();
            System.out.println("=== SYNC COMPLETED: " + updatedCount + " rooms updated ===");
            return ResponseEntity.ok(Map.of(
                    "message", "Test sync room status thành công",
                    "updatedCount", updatedCount));
        } catch (Exception e) {
            System.err.println("=== SYNC ERROR: " + e.getMessage() + " ===");
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Test sync room status thất bại",
                    "message", e.getMessage()));
        }
    }
}
