package com.hotelhub.backend.dto.response;

import com.hotelhub.backend.entity.Booking;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {
    private Long bookingId;
    private Long roomId;
    private Long userId;
    private String guestName;
    private String guestEmail;
    private String guestPhone;
    private LocalDate checkIn; // đồng bộ với entity
    private LocalDate checkOut;
    private BigDecimal totalPrice;
    private String status;

    public static BookingResponse fromEntity(Booking booking) {
        return BookingResponse.builder()
                .bookingId(booking.getBookingId())
                .roomId(booking.getRoomId())
                .userId(booking.getUser() != null ? booking.getUser().getUserId() : null)
                .guestName(booking.getGuestName())
                .guestEmail(booking.getGuestEmail())
                .guestPhone(booking.getGuestPhone())
                .checkIn(booking.getCheckIn())
                .checkOut(booking.getCheckOut())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus())
                .build();
    }
}
