package com.hotelhub.backend.dto.request;

import com.hotelhub.backend.entity.RoomStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomRequest {

    @NotBlank(message = "Số phòng không được để trống")
    @Size(max = 20, message = "Số phòng không được quá 20 ký tự")
    private String roomNumber;

    @NotNull(message = "Loại phòng không được để trống")
    private Long roomTypeId;

    @NotNull(message = "Giá phòng không được để trống")
    @DecimalMin(value = "0.0", message = "Giá phòng phải lớn hơn hoặc bằng 0")
    private BigDecimal price;

    @NotNull(message = "Trạng thái phòng không được để trống")
    private RoomStatus status;

    @NotNull(message = "Sức chứa không được để trống")
    @Min(value = 1, message = "Sức chứa phải lớn hơn 0")
    @Max(value = 10, message = "Sức chứa không được quá 10 người")
    private Integer capacity;

    @Size(max = 1000, message = "Mô tả không được quá 1000 ký tự")
    private String description;

    // Room Detail fields
    private String bedType;
    private Double roomSize;
    private Integer floor;
    private String viewType;
    @Builder.Default
    private Boolean smokingAllowed = false;
    @Builder.Default
    private Boolean petFriendly = false;
    private String wifiSpeed;
    @Builder.Default
    private Boolean airConditioning = true;
    @Builder.Default
    private Boolean minibar = false;
    @Builder.Default
    private Boolean balcony = false;
    @Builder.Default
    private Boolean oceanView = false;

    // Amenity IDs
    private List<Long> amenityIds;

    // Image URLs
    private List<String> imageUrls;
}
