package com.hotelhub.backend.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {

    private Long bookingId;
    private String bookingReference;
    private Long roomId;
    private String roomNumber;
    private String roomType;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private Integer guests;
    private String notes;
    private BigDecimal totalPrice;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime holdUntil;

    // Guest information (for guest bookings)
    private String guestName;
    private String guestEmail;
    private String guestPhone;

    // User information (for authenticated bookings)
    private String userName;
    private String userEmail;

    // Room details
    private String roomDescription;
    private Integer roomCapacity;
    private List<String> amenities;
}