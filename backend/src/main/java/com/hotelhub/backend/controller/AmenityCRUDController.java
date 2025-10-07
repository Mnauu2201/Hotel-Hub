package com.hotelhub.backend.controller;

import com.hotelhub.backend.dto.request.AmenityRequest;
import com.hotelhub.backend.dto.response.AmenityResponse;
import com.hotelhub.backend.service.AmenityCRUDService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/amenities")
public class AmenityCRUDController {

    @Autowired
    private AmenityCRUDService amenityCRUDService;

    /**
     * Tạo tiện ích mới (Admin only)
     */
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createAmenity(@Valid @RequestBody AmenityRequest request) {
        try {
            AmenityResponse amenity = amenityCRUDService.createAmenity(request);
            return ResponseEntity.ok(Map.of(
                    "message", "Tạo tiện ích thành công",
                    "amenity", amenity
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Tạo tiện ích thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Cập nhật tiện ích (Admin only)
     */
    @PutMapping("/{amenityId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateAmenity(@PathVariable Long amenityId, 
                                        @Valid @RequestBody AmenityRequest request) {
        try {
            AmenityResponse amenity = amenityCRUDService.updateAmenity(amenityId, request);
            return ResponseEntity.ok(Map.of(
                    "message", "Cập nhật tiện ích thành công",
                    "amenity", amenity
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Cập nhật tiện ích thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Xóa tiện ích (Admin only)
     */
    @DeleteMapping("/{amenityId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteAmenity(@PathVariable Long amenityId) {
        try {
            amenityCRUDService.deleteAmenity(amenityId);
            return ResponseEntity.ok(Map.of(
                    "message", "Xóa tiện ích thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Xóa tiện ích thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Lấy tiện ích theo ID (Public)
     */
    @GetMapping("/{amenityId}")
    public ResponseEntity<?> getAmenityById(@PathVariable Long amenityId) {
        try {
            AmenityResponse amenity = amenityCRUDService.getAmenityById(amenityId);
            return ResponseEntity.ok(amenity);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy thông tin tiện ích thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Lấy tất cả tiện ích (Public)
     */
    @GetMapping
    public ResponseEntity<?> getAllAmenities() {
        try {
            List<AmenityResponse> amenities = amenityCRUDService.getAllAmenities();
            return ResponseEntity.ok(Map.of(
                    "amenities", amenities,
                    "count", amenities.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy danh sách tiện ích thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Tìm kiếm tiện ích theo tên (Public)
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchAmenities(@RequestParam String name) {
        try {
            List<AmenityResponse> amenities = amenityCRUDService.searchAmenitiesByName(name);
            return ResponseEntity.ok(Map.of(
                    "amenities", amenities,
                    "count", amenities.size(),
                    "searchTerm", name
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Tìm kiếm tiện ích thất bại",
                    "message", e.getMessage()
            ));
        }
    }
}
