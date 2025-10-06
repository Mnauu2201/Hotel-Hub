package com.hotelhub.backend.controller;

import com.hotelhub.backend.dto.request.RoomTypeRequest;
import com.hotelhub.backend.dto.response.RoomTypeResponse;
import com.hotelhub.backend.service.RoomTypeCRUDService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/room-types")
public class RoomTypeCRUDController {

    @Autowired
    private RoomTypeCRUDService roomTypeCRUDService;

    /**
     * Tạo loại phòng mới (Admin only)
     */
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createRoomType(@Valid @RequestBody RoomTypeRequest request) {
        try {
            RoomTypeResponse roomType = roomTypeCRUDService.createRoomType(request);
            return ResponseEntity.ok(Map.of(
                    "message", "Tạo loại phòng thành công",
                    "roomType", roomType
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Tạo loại phòng thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Cập nhật loại phòng (Admin only)
     */
    @PutMapping("/{typeId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateRoomType(@PathVariable Long typeId, 
                                          @Valid @RequestBody RoomTypeRequest request) {
        try {
            RoomTypeResponse roomType = roomTypeCRUDService.updateRoomType(typeId, request);
            return ResponseEntity.ok(Map.of(
                    "message", "Cập nhật loại phòng thành công",
                    "roomType", roomType
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Cập nhật loại phòng thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Xóa loại phòng (Admin only)
     */
    @DeleteMapping("/{typeId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteRoomType(@PathVariable Long typeId) {
        try {
            roomTypeCRUDService.deleteRoomType(typeId);
            return ResponseEntity.ok(Map.of(
                    "message", "Xóa loại phòng thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Xóa loại phòng thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Lấy loại phòng theo ID (Public)
     */
    @GetMapping("/{typeId}")
    public ResponseEntity<?> getRoomTypeById(@PathVariable Long typeId) {
        try {
            RoomTypeResponse roomType = roomTypeCRUDService.getRoomTypeById(typeId);
            return ResponseEntity.ok(roomType);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy thông tin loại phòng thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Lấy tất cả loại phòng (Public)
     */
    @GetMapping
    public ResponseEntity<?> getAllRoomTypes() {
        try {
            List<RoomTypeResponse> roomTypes = roomTypeCRUDService.getAllRoomTypes();
            return ResponseEntity.ok(Map.of(
                    "roomTypes", roomTypes,
                    "count", roomTypes.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy danh sách loại phòng thất bại",
                    "message", e.getMessage()
            ));
        }
    }
}
