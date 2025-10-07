package com.hotelhub.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AmenityRequest {

    @NotBlank(message = "Tên tiện ích không được để trống")
    @Size(max = 100, message = "Tên tiện ích không được quá 100 ký tự")
    private String name;

    @Size(max = 500, message = "Mô tả không được quá 500 ký tự")
    private String description;

    @Size(max = 50, message = "Icon không được quá 50 ký tự")
    private String icon;
}
