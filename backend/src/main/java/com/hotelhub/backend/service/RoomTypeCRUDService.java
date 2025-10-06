package com.hotelhub.backend.service;

import com.hotelhub.backend.dto.request.RoomTypeRequest;
import com.hotelhub.backend.dto.response.RoomTypeResponse;
import com.hotelhub.backend.entity.RoomType;
import com.hotelhub.backend.repository.RoomTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoomTypeCRUDService {

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    /**
     * Tạo loại phòng mới
     */
    public RoomTypeResponse createRoomType(RoomTypeRequest request) {
        // Kiểm tra tên loại phòng đã tồn tại chưa
        if (roomTypeRepository.findByName(request.getName()).isPresent()) {
            throw new RuntimeException("Tên loại phòng đã tồn tại: " + request.getName());
        }

        RoomType roomType = RoomType.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        roomType = roomTypeRepository.save(roomType);
        return convertToResponse(roomType);
    }

    /**
     * Cập nhật loại phòng
     */
    public RoomTypeResponse updateRoomType(Long typeId, RoomTypeRequest request) {
        RoomType roomType = roomTypeRepository.findById(typeId)
                .orElseThrow(() -> new RuntimeException("Loại phòng không tồn tại"));

        // Kiểm tra tên loại phòng trùng lặp (trừ loại phòng hiện tại)
        if (!roomType.getName().equals(request.getName()) &&
            roomTypeRepository.findByName(request.getName()).isPresent()) {
            throw new RuntimeException("Tên loại phòng đã tồn tại: " + request.getName());
        }

        roomType.setName(request.getName());
        roomType.setDescription(request.getDescription());

        roomType = roomTypeRepository.save(roomType);
        return convertToResponse(roomType);
    }

    /**
     * Xóa loại phòng
     */
    public void deleteRoomType(Long typeId) {
        RoomType roomType = roomTypeRepository.findById(typeId)
                .orElseThrow(() -> new RuntimeException("Loại phòng không tồn tại"));

        // Kiểm tra loại phòng có phòng nào sử dụng không
        if (roomTypeRepository.countRoomsByTypeId(typeId) > 0) {
            throw new RuntimeException("Không thể xóa loại phòng vì đang có phòng sử dụng loại này");
        }

        roomTypeRepository.delete(roomType);
    }

    /**
     * Lấy loại phòng theo ID
     */
    public RoomTypeResponse getRoomTypeById(Long typeId) {
        RoomType roomType = roomTypeRepository.findById(typeId)
                .orElseThrow(() -> new RuntimeException("Loại phòng không tồn tại"));
        return convertToResponse(roomType);
    }

    /**
     * Lấy tất cả loại phòng
     */
    public List<RoomTypeResponse> getAllRoomTypes() {
        return roomTypeRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Convert RoomType entity to RoomTypeResponse
     */
    private RoomTypeResponse convertToResponse(RoomType roomType) {
        return RoomTypeResponse.builder()
                .typeId(roomType.getTypeId())
                .name(roomType.getName())
                .description(roomType.getDescription())
                .createdAt(roomType.getCreatedAt())
                .build();
    }
}
