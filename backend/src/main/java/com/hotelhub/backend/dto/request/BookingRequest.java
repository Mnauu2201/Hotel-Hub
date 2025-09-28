package com.hotelhub.backend.dto.request;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequest {
    private Long userId; // nếu null thì là guest
    private Long roomId;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private Integer guests;
    private String notes;
    private BigDecimal totalPrice;

    // guest info
    private String guestName;
    private String guestEmail;
    private String guestPhone;
}
