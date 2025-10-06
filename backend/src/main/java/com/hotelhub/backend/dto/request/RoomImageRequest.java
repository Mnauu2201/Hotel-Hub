package com.hotelhub.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RoomImageRequest {

    @NotBlank(message = "URL ảnh không được để trống")
    @Size(max = 500, message = "URL ảnh không được quá 500 ký tự")
    private String imageUrl;

    @Size(max = 200, message = "Alt text không được quá 200 ký tự")
    private String altText;

    @NotNull(message = "Trạng thái ảnh chính không được để trống")
    private Boolean isPrimary = false;

    @NotNull(message = "Thứ tự hiển thị không được để trống")
    private Integer displayOrder = 0;
}
