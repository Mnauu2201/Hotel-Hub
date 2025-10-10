package com.hotelhub.backend.dto.request;

import com.hotelhub.backend.entity.Payment;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePaymentStatusRequest {

    @NotNull(message = "Trạng thái thanh toán không được để trống")
    private Payment.PaymentStatus status;

    private String notes; // Ghi chú về việc cập nhật trạng thái
}
