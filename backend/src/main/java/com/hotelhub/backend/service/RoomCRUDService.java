package com.hotelhub.backend.service;

import com.hotelhub.backend.dto.request.RoomRequest;
import com.hotelhub.backend.dto.response.RoomResponse;
import com.hotelhub.backend.entity.*;
import com.hotelhub.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoomCRUDService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Autowired
    private AmenityRepository amenityRepository;

    @Autowired
    private RoomDetailRepository roomDetailRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomImageRepository roomImageRepository;

    /**
     * Tạo phòng mới
     */
    public RoomResponse createRoom(RoomRequest request) {
        // Kiểm tra room number đã tồn tại chưa
        if (roomRepository.findByRoomNumber(request.getRoomNumber()).isPresent()) {
            throw new RuntimeException("Số phòng đã tồn tại: " + request.getRoomNumber());
        }

        // Kiểm tra room type
        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> new RuntimeException("Loại phòng không tồn tại"));

        // Tạo room
        Room room = Room.builder()
                .roomNumber(request.getRoomNumber())
                .roomType(roomType)
                .price(request.getPrice())
                .status(request.getStatus())
                .capacity(request.getCapacity())
                .description(request.getDescription())
                .build();

        room = roomRepository.save(room);

        // Tạo room detail nếu có thông tin
        if (hasRoomDetailInfo(request)) {
            createRoomDetail(room, request);
        }

        // Thêm amenities
        if (request.getAmenityIds() != null && !request.getAmenityIds().isEmpty()) {
            addAmenitiesToRoom(room, request.getAmenityIds());
        }

        // Thêm images
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            addImagesToRoom(room, request.getImageUrls());
        }

        return convertToResponse(room);
    }

    /**
     * Cập nhật phòng
     */
    public RoomResponse updateRoom(Long roomId, RoomRequest request) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Phòng không tồn tại"));

        // Kiểm tra room number trùng lặp (trừ phòng hiện tại)
        if (!room.getRoomNumber().equals(request.getRoomNumber()) &&
            roomRepository.findByRoomNumber(request.getRoomNumber()).isPresent()) {
            throw new RuntimeException("Số phòng đã tồn tại: " + request.getRoomNumber());
        }

        // Cập nhật thông tin cơ bản
        room.setRoomNumber(request.getRoomNumber());
        room.setPrice(request.getPrice());
        room.setStatus(request.getStatus());
        room.setCapacity(request.getCapacity());
        room.setDescription(request.getDescription());

        // Cập nhật room type
        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> new RuntimeException("Loại phòng không tồn tại"));
        room.setRoomType(roomType);

        room = roomRepository.save(room);

        // Cập nhật room detail
        updateRoomDetail(room, request);

        // Cập nhật amenities
        updateRoomAmenities(room, request.getAmenityIds());

        // Cập nhật images
        updateRoomImages(room, request.getImageUrls());

        // Force refresh room from database để lấy images mới nhất
        room = roomRepository.findById(room.getRoomId()).orElse(room);
        
        // Force clear JPA cache and refresh again
        roomRepository.flush();
        room = roomRepository.findById(room.getRoomId()).orElse(room);
        
        return convertToResponse(room);
    }

    /**
     * Xóa phòng (Soft Delete với kiểm tra booking)
     */
    public void deleteRoom(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Phòng không tồn tại"));

        // Kiểm tra phòng có booking còn hoạt động không (không bao gồm cancelled, paid và refunded)
        List<String> inactiveStatuses = Arrays.asList("cancelled", "paid", "refunded");
        long activeBookingCount = bookingRepository.countByRoomIdAndStatusNotIn(roomId, inactiveStatuses);
        
        // Debug: In ra thông tin booking
        System.out.println("=== DEBUG DELETE ROOM ===");
        System.out.println("Room ID: " + roomId);
        System.out.println("Active booking count: " + activeBookingCount);
        System.out.println("Inactive statuses: " + inactiveStatuses);
        
        // Lấy tất cả booking của phòng để debug
        List<Booking> allBookings = bookingRepository.findByRoomId(roomId);
        System.out.println("All bookings for room " + roomId + ":");
        for (Booking booking : allBookings) {
            System.out.println("- Booking ID: " + booking.getBookingId() + ", Status: " + booking.getStatus());
        }
        
        // Debug: Test query trực tiếp
        long totalBookings = bookingRepository.countByRoomId(roomId);
        System.out.println("Total bookings for room: " + totalBookings);
        
        // Debug: Đếm booking theo từng status
        for (String status : inactiveStatuses) {
            long count = bookingRepository.countByRoomIdAndStatusNotIn(roomId, List.of(status));
            System.out.println("Bookings NOT " + status + ": " + count);
        }
        
        System.out.println("=== END DEBUG ===");
        
        if (activeBookingCount > 0) {
            // Nếu có booking còn hoạt động, chuyển sang soft delete (MAINTENANCE)
            room.setStatus(RoomStatus.MAINTENANCE);
            roomRepository.save(room);
            throw new RuntimeException("Không thể xóa phòng vì có " + activeBookingCount + " booking còn hoạt động. Đã chuyển status thành MAINTENANCE.");
        }
        
        // Nếu không có booking còn hoạt động, xóa tất cả booking trước khi xóa phòng
        if (!allBookings.isEmpty()) {
            System.out.println("Deleting " + allBookings.size() + " inactive bookings for room " + roomId);
            bookingRepository.deleteAll(allBookings);
        }
        
        // Bây giờ xóa phòng
        try {
            roomRepository.delete(room);
            System.out.println("Room " + roomId + " deleted successfully");
        } catch (Exception e) {
            // Nếu vẫn có lỗi, chuyển sang soft delete
            room.setStatus(RoomStatus.MAINTENANCE);
            roomRepository.save(room);
            throw new RuntimeException("Không thể xóa phòng vì có dữ liệu liên quan. Đã chuyển status thành MAINTENANCE.");
        }
    }

    /**
     * Lấy phòng theo ID
     */
    public RoomResponse getRoomById(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Phòng không tồn tại"));
        return convertToResponse(room);
    }

    /**
     * Lấy tất cả phòng
     */
    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lấy phòng theo trạng thái
     */
    public List<RoomResponse> getRoomsByStatus(RoomStatus status) {
        return roomRepository.findByStatus(status).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lấy phòng theo loại
     */
    public List<RoomResponse> getRoomsByType(Long roomTypeId) {
        return roomRepository.findByRoomType_TypeId(roomTypeId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Helper methods
    private boolean hasRoomDetailInfo(RoomRequest request) {
        return request.getBedType() != null || request.getRoomSize() != null ||
               request.getFloor() != null || request.getViewType() != null ||
               request.getSmokingAllowed() != null || request.getPetFriendly() != null ||
               request.getWifiSpeed() != null || request.getAirConditioning() != null ||
               request.getMinibar() != null || request.getBalcony() != null ||
               request.getOceanView() != null;
    }

    private void createRoomDetail(Room room, RoomRequest request) {
        RoomDetail roomDetail = RoomDetail.builder()
                .room(room)
                .bedType(request.getBedType())
                .roomSize(request.getRoomSize())
                .floor(request.getFloor())
                .viewType(request.getViewType())
                .smokingAllowed(request.getSmokingAllowed())
                .petFriendly(request.getPetFriendly())
                .wifiSpeed(request.getWifiSpeed())
                .airConditioning(request.getAirConditioning())
                .minibar(request.getMinibar())
                .balcony(request.getBalcony())
                .oceanView(request.getOceanView())
                .build();

        roomDetailRepository.save(roomDetail);
    }

    private void updateRoomDetail(Room room, RoomRequest request) {
        Optional<RoomDetail> existingDetail = roomDetailRepository.findByRoom_RoomId(room.getRoomId());
        
        if (hasRoomDetailInfo(request)) {
            RoomDetail roomDetail = existingDetail.orElseGet(() -> RoomDetail.builder().room(room).build());
            
            roomDetail.setBedType(request.getBedType());
            roomDetail.setRoomSize(request.getRoomSize());
            roomDetail.setFloor(request.getFloor());
            roomDetail.setViewType(request.getViewType());
            roomDetail.setSmokingAllowed(request.getSmokingAllowed());
            roomDetail.setPetFriendly(request.getPetFriendly());
            roomDetail.setWifiSpeed(request.getWifiSpeed());
            roomDetail.setAirConditioning(request.getAirConditioning());
            roomDetail.setMinibar(request.getMinibar());
            roomDetail.setBalcony(request.getBalcony());
            roomDetail.setOceanView(request.getOceanView());
            
            roomDetailRepository.save(roomDetail);
        } else if (existingDetail.isPresent()) {
            roomDetailRepository.delete(existingDetail.get());
        }
    }

    private void addAmenitiesToRoom(Room room, List<Long> amenityIds) {
        List<Amenity> amenities = amenityRepository.findAllById(amenityIds);
        // Đảm bảo amenities list không null
        if (room.getAmenities() == null) {
            room.setAmenities(new java.util.ArrayList<>());
        }
        room.getAmenities().clear();
        room.getAmenities().addAll(amenities);
        roomRepository.save(room);
    }

    private void updateRoomAmenities(Room room, List<Long> amenityIds) {
        if (amenityIds != null) {
            List<Amenity> amenities = amenityRepository.findAllById(amenityIds);
            // Đảm bảo amenities list không null
            if (room.getAmenities() == null) {
                room.setAmenities(new java.util.ArrayList<>());
            }
            room.getAmenities().clear();
            room.getAmenities().addAll(amenities);
            roomRepository.save(room);
        }
    }

    private void addImagesToRoom(Room room, List<String> imageUrls) {
        for (int i = 0; i < imageUrls.size(); i++) {
            RoomImage image = RoomImage.builder()
                    .room(room)
                    .imageUrl(imageUrls.get(i))
                    .isPrimary(i == 0)
                    .displayOrder(i)
                    .build();
            roomImageRepository.save(image);
        }
    }

    private void updateRoomImages(Room room, List<String> imageUrls) {
        // Luôn xóa images cũ trước
        roomImageRepository.deleteByRoom_RoomId(room.getRoomId());
        
        // Chỉ thêm images mới nếu có
        if (imageUrls != null && !imageUrls.isEmpty()) {
            addImagesToRoom(room, imageUrls);
        }
    }

    private RoomResponse convertToResponse(Room room) {
        return RoomResponse.builder()
                .roomId(room.getRoomId())
                .roomNumber(room.getRoomNumber())
                .roomTypeId(room.getRoomType().getTypeId())
                .roomTypeName(room.getRoomType().getName())
                .price(room.getPrice())
                .status(room.getStatus())
                .capacity(room.getCapacity())
                .description(room.getDescription())
                .createdAt(room.getCreatedAt())
                .updatedAt(room.getUpdatedAt())
                .roomDetail(convertRoomDetailToResponse(room.getRoomDetail()))
                .images(convertImagesToResponse(room.getImages()))
                .amenities(convertAmenitiesToResponse(room.getAmenities()))
                .build();
    }

    private RoomResponse.RoomDetailResponse convertRoomDetailToResponse(RoomDetail roomDetail) {
        if (roomDetail == null) return null;
        
        return RoomResponse.RoomDetailResponse.builder()
                .bedType(roomDetail.getBedType())
                .roomSize(roomDetail.getRoomSize())
                .floor(roomDetail.getFloor())
                .viewType(roomDetail.getViewType())
                .smokingAllowed(roomDetail.getSmokingAllowed())
                .petFriendly(roomDetail.getPetFriendly())
                .wifiSpeed(roomDetail.getWifiSpeed())
                .airConditioning(roomDetail.getAirConditioning())
                .minibar(roomDetail.getMinibar())
                .balcony(roomDetail.getBalcony())
                .oceanView(roomDetail.getOceanView())
                .build();
    }

    private List<RoomResponse.RoomImageResponse> convertImagesToResponse(List<RoomImage> images) {
        if (images == null) return List.of();
        
        return images.stream()
                .map(image -> RoomResponse.RoomImageResponse.builder()
                        .imageId(image.getImageId())
                        .imageUrl(image.getImageUrl())
                        .altText(image.getAltText())
                        .isPrimary(image.getIsPrimary())
                        .displayOrder(image.getDisplayOrder())
                        .build())
                .collect(Collectors.toList());
    }

    private List<RoomResponse.AmenityResponse> convertAmenitiesToResponse(List<Amenity> amenities) {
        if (amenities == null) return List.of();
        
        return amenities.stream()
                .map(amenity -> RoomResponse.AmenityResponse.builder()
                        .amenityId(amenity.getAmenityId())
                        .name(amenity.getName())
                        .description(amenity.getDescription())
                        .icon(amenity.getIcon())
                        .build())
                .collect(Collectors.toList());
    }
}

