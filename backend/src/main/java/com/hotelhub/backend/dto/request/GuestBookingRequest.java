package com.hotelhub.backend.dto.request;

import lombok.*;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuestBookingRequest {

    @NotNull(message = "Room ID không được để trống")
    private Long roomId;

    @NotNull(message = "Ngày check-in không được để trống")
    @Future(message = "Ngày check-in phải là ngày tương lai")
    private LocalDate checkIn;

    @NotNull(message = "Ngày check-out không được để trống")
    @Future(message = "Ngày check-out phải là ngày tương lai")
    private LocalDate checkOut;

    @Min(value = 1, message = "Số khách phải ít nhất 1 người")
    @Max(value = 10, message = "Số khách không được quá 10 người")
    private Integer guests = 1;

    @NotBlank(message = "Tên khách hàng không được để trống")
    @Size(min = 2, max = 100, message = "Tên phải từ 2-100 ký tự")
    private String guestName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String guestEmail;

    @Pattern(regexp = "^[0-9]{10,11}$", message = "Số điện thoại phải có 10-11 chữ số")
    private String guestPhone;

    private String notes;
}