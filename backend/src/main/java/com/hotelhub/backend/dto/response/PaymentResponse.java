package com.hotelhub.backend.dto.response;

import com.hotelhub.backend.entity.Payment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    private Long paymentId;
    private Long bookingId;
    private String bookingReference;
    private BigDecimal amount;
    private Payment.PaymentMethod method;
    private Payment.PaymentStatus status;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
    
    // Thông tin booking liên quan
    private String guestName;
    private String guestEmail;
    private String roomNumber;
    private String roomType;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    private Integer guests;
}
