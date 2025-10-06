package com.hotelhub.backend.controller;

import com.hotelhub.backend.dto.request.RoomImageRequest;
import com.hotelhub.backend.dto.response.RoomImageResponse;
import com.hotelhub.backend.service.RoomImageCRUDService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms/{roomId}/images")
public class RoomImageCRUDController {

    @Autowired
    private RoomImageCRUDService roomImageCRUDService;

    /**
     * Thêm ảnh cho phòng (Admin only)
     */
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> addImageToRoom(@PathVariable Long roomId, 
                                          @Valid @RequestBody RoomImageRequest request) {
        try {
            RoomImageResponse image = roomImageCRUDService.addImageToRoom(roomId, request);
            return ResponseEntity.ok(Map.of(
                    "message", "Thêm ảnh thành công",
                    "image", image
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Thêm ảnh thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Cập nhật ảnh phòng (Admin only)
     */
    @PutMapping("/{imageId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateRoomImage(@PathVariable Long roomId,
                                           @PathVariable Long imageId,
                                           @Valid @RequestBody RoomImageRequest request) {
        try {
            RoomImageResponse image = roomImageCRUDService.updateRoomImage(imageId, request);
            return ResponseEntity.ok(Map.of(
                    "message", "Cập nhật ảnh thành công",
                    "image", image
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Cập nhật ảnh thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Xóa ảnh phòng (Admin only)
     */
    @DeleteMapping("/{imageId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteRoomImage(@PathVariable Long roomId,
                                           @PathVariable Long imageId) {
        try {
            roomImageCRUDService.deleteRoomImage(imageId);
            return ResponseEntity.ok(Map.of(
                    "message", "Xóa ảnh thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Xóa ảnh thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Lấy ảnh theo ID (Public)
     */
    @GetMapping("/{imageId}")
    public ResponseEntity<?> getRoomImageById(@PathVariable Long roomId,
                                            @PathVariable Long imageId) {
        try {
            RoomImageResponse image = roomImageCRUDService.getRoomImageById(imageId);
            return ResponseEntity.ok(image);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy thông tin ảnh thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Lấy tất cả ảnh của phòng (Public)
     */
    @GetMapping
    public ResponseEntity<?> getRoomImages(@PathVariable Long roomId) {
        try {
            List<RoomImageResponse> images = roomImageCRUDService.getRoomImages(roomId);
            return ResponseEntity.ok(Map.of(
                    "images", images,
                    "count", images.size(),
                    "roomId", roomId
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy danh sách ảnh thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Lấy ảnh chính của phòng (Public)
     */
    @GetMapping("/primary")
    public ResponseEntity<?> getPrimaryRoomImage(@PathVariable Long roomId) {
        try {
            RoomImageResponse image = roomImageCRUDService.getPrimaryRoomImage(roomId);
            return ResponseEntity.ok(Map.of(
                    "image", image,
                    "roomId", roomId
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy ảnh chính thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Đặt ảnh làm ảnh chính (Admin only)
     */
    @PutMapping("/{imageId}/set-primary")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> setPrimaryImage(@PathVariable Long roomId,
                                           @PathVariable Long imageId) {
        try {
            RoomImageResponse image = roomImageCRUDService.setPrimaryImage(imageId);
            return ResponseEntity.ok(Map.of(
                    "message", "Đặt ảnh chính thành công",
                    "image", image
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Đặt ảnh chính thất bại",
                    "message", e.getMessage()
            ));
        }
    }
}
