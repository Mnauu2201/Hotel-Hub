package com.hotelhub.backend.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GuestBookingRequest {
    private Long roomId;
    private String checkIn;
    private String checkOut;
    private int guests;
    private String notes;
    private double totalPrice;

    // Thông tin khách
    private String guestName;
    private String guestEmail;
    private String guestPhone;
}
