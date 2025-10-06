package com.hotelhub.backend.service;

import com.hotelhub.backend.dto.request.RoomImageRequest;
import com.hotelhub.backend.dto.response.RoomImageResponse;
import com.hotelhub.backend.entity.Room;
import com.hotelhub.backend.entity.RoomImage;
import com.hotelhub.backend.repository.RoomImageRepository;
import com.hotelhub.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoomImageCRUDService {

    @Autowired
    private RoomImageRepository roomImageRepository;

    @Autowired
    private RoomRepository roomRepository;

    /**
     * Thêm ảnh cho phòng
     */
    public RoomImageResponse addImageToRoom(Long roomId, RoomImageRequest request) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Phòng không tồn tại"));

        // Nếu đây là ảnh chính, bỏ ảnh chính cũ
        if (request.getIsPrimary()) {
            roomImageRepository.clearPrimaryImage(roomId);
        }

        RoomImage roomImage = RoomImage.builder()
                .room(room)
                .imageUrl(request.getImageUrl())
                .altText(request.getAltText())
                .isPrimary(request.getIsPrimary())
                .displayOrder(request.getDisplayOrder())
                .build();

        roomImage = roomImageRepository.save(roomImage);
        return convertToResponse(roomImage);
    }

    /**
     * Cập nhật ảnh phòng
     */
    public RoomImageResponse updateRoomImage(Long imageId, RoomImageRequest request) {
        RoomImage roomImage = roomImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Ảnh không tồn tại"));

        // Nếu đây là ảnh chính, bỏ ảnh chính cũ
        if (request.getIsPrimary() && !roomImage.getIsPrimary()) {
            roomImageRepository.clearPrimaryImage(roomImage.getRoom().getRoomId());
        }

        roomImage.setImageUrl(request.getImageUrl());
        roomImage.setAltText(request.getAltText());
        roomImage.setIsPrimary(request.getIsPrimary());
        roomImage.setDisplayOrder(request.getDisplayOrder());

        roomImage = roomImageRepository.save(roomImage);
        return convertToResponse(roomImage);
    }

    /**
     * Xóa ảnh phòng
     */
    public void deleteRoomImage(Long imageId) {
        RoomImage roomImage = roomImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Ảnh không tồn tại"));

        roomImageRepository.delete(roomImage);
    }

    /**
     * Lấy ảnh theo ID
     */
    public RoomImageResponse getRoomImageById(Long imageId) {
        RoomImage roomImage = roomImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Ảnh không tồn tại"));
        return convertToResponse(roomImage);
    }

    /**
     * Lấy tất cả ảnh của phòng
     */
    public List<RoomImageResponse> getRoomImages(Long roomId) {
        // Kiểm tra phòng tồn tại
        if (!roomRepository.existsById(roomId)) {
            throw new RuntimeException("Phòng không tồn tại");
        }

        return roomImageRepository.findByRoom_RoomIdOrderByDisplayOrder(roomId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lấy ảnh chính của phòng
     */
    public RoomImageResponse getPrimaryRoomImage(Long roomId) {
        // Kiểm tra phòng tồn tại
        if (!roomRepository.existsById(roomId)) {
            throw new RuntimeException("Phòng không tồn tại");
        }

        return roomImageRepository.findByRoom_RoomIdAndIsPrimaryTrue(roomId)
                .map(this::convertToResponse)
                .orElse(null);
    }

    /**
     * Đặt ảnh làm ảnh chính
     */
    public RoomImageResponse setPrimaryImage(Long imageId) {
        RoomImage roomImage = roomImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Ảnh không tồn tại"));

        // Bỏ ảnh chính cũ
        roomImageRepository.clearPrimaryImage(roomImage.getRoom().getRoomId());

        // Đặt ảnh này làm ảnh chính
        roomImage.setIsPrimary(true);
        roomImage = roomImageRepository.save(roomImage);

        return convertToResponse(roomImage);
    }

    /**
     * Convert RoomImage entity to RoomImageResponse
     */
    private RoomImageResponse convertToResponse(RoomImage roomImage) {
        return RoomImageResponse.builder()
                .imageId(roomImage.getImageId())
                .roomId(roomImage.getRoom().getRoomId())
                .imageUrl(roomImage.getImageUrl())
                .altText(roomImage.getAltText())
                .isPrimary(roomImage.getIsPrimary())
                .displayOrder(roomImage.getDisplayOrder())
                .fileSize(roomImage.getFileSize())
                .mimeType(roomImage.getMimeType())
                .build();
    }
}
