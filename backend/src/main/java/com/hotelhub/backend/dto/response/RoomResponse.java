package com.hotelhub.backend.dto.response;

import com.hotelhub.backend.entity.RoomStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomResponse {

    private Long roomId;
    private String roomNumber;
    private Long roomTypeId;
    private String roomTypeName;
    private BigDecimal price;
    private RoomStatus status;
    private Integer capacity;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Room Detail
    private RoomDetailResponse roomDetail;

    // Images
    private List<RoomImageResponse> images;

    // Amenities
    private List<AmenityResponse> amenities;

    // Backward compatibility
    public Boolean getAvailable() {
        return status == RoomStatus.AVAILABLE;
    }

    public String getType() {
        return roomTypeName;
    }

    public Double getPriceAsDouble() {
        return price != null ? price.doubleValue() : 0.0;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoomDetailResponse {
        private Double roomSize;
        private String viewType;
        private Boolean smokingAllowed;
        private Boolean petFriendly;
        private Boolean airConditioning;
        private Boolean minibar;
        private Boolean balcony;
        private Boolean oceanView;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoomImageResponse {
        private Long imageId;
        private String imageUrl;
        private String altText;
        private Boolean isPrimary;
        private Integer displayOrder;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AmenityResponse {
        private Long amenityId;
        private String name;
        private String description;
        private String icon;
    }
}