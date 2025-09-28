package com.hotelhub.backend.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserBookingRequest {
    private Long roomId;
    private String checkIn;
    private String checkOut;
    private int guests;
    private String notes;
    private double totalPrice;
}
