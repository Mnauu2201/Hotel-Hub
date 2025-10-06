package com.hotelhub.backend.service;

import com.hotelhub.backend.dto.request.AmenityRequest;
import com.hotelhub.backend.dto.response.AmenityResponse;
import com.hotelhub.backend.entity.Amenity;
import com.hotelhub.backend.repository.AmenityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AmenityCRUDService {

    @Autowired
    private AmenityRepository amenityRepository;

    /**
     * Tạo tiện ích mới
     */
    public AmenityResponse createAmenity(AmenityRequest request) {
        // Kiểm tra tên tiện ích đã tồn tại chưa
        if (amenityRepository.findByName(request.getName()).isPresent()) {
            throw new RuntimeException("Tên tiện ích đã tồn tại: " + request.getName());
        }

        Amenity amenity = Amenity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .icon(request.getIcon())
                .build();

        amenity = amenityRepository.save(amenity);
        return convertToResponse(amenity);
    }

    /**
     * Cập nhật tiện ích
     */
    public AmenityResponse updateAmenity(Long amenityId, AmenityRequest request) {
        Amenity amenity = amenityRepository.findById(amenityId)
                .orElseThrow(() -> new RuntimeException("Tiện ích không tồn tại"));

        // Kiểm tra tên tiện ích trùng lặp (trừ tiện ích hiện tại)
        if (!amenity.getName().equals(request.getName()) &&
            amenityRepository.findByName(request.getName()).isPresent()) {
            throw new RuntimeException("Tên tiện ích đã tồn tại: " + request.getName());
        }

        amenity.setName(request.getName());
        amenity.setDescription(request.getDescription());
        amenity.setIcon(request.getIcon());

        amenity = amenityRepository.save(amenity);
        return convertToResponse(amenity);
    }

    /**
     * Xóa tiện ích
     */
    public void deleteAmenity(Long amenityId) {
        Amenity amenity = amenityRepository.findById(amenityId)
                .orElseThrow(() -> new RuntimeException("Tiện ích không tồn tại"));

        // Kiểm tra tiện ích có phòng nào sử dụng không
        if (amenityRepository.countRoomsByAmenityId(amenityId) > 0) {
            throw new RuntimeException("Không thể xóa tiện ích vì đang có phòng sử dụng tiện ích này");
        }

        amenityRepository.delete(amenity);
    }

    /**
     * Lấy tiện ích theo ID
     */
    public AmenityResponse getAmenityById(Long amenityId) {
        Amenity amenity = amenityRepository.findById(amenityId)
                .orElseThrow(() -> new RuntimeException("Tiện ích không tồn tại"));
        return convertToResponse(amenity);
    }

    /**
     * Lấy tất cả tiện ích
     */
    public List<AmenityResponse> getAllAmenities() {
        return amenityRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Tìm kiếm tiện ích theo tên
     */
    public List<AmenityResponse> searchAmenitiesByName(String name) {
        return amenityRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Convert Amenity entity to AmenityResponse
     */
    private AmenityResponse convertToResponse(Amenity amenity) {
        return AmenityResponse.builder()
                .amenityId(amenity.getAmenityId())
                .name(amenity.getName())
                .description(amenity.getDescription())
                .icon(amenity.getIcon())
                .build();
    }
}
