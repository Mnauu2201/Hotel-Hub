package com.hotelhub.backend.controller;

import com.hotelhub.backend.dto.request.PaymentRequest;
import com.hotelhub.backend.dto.request.UpdatePaymentStatusRequest;
import com.hotelhub.backend.dto.response.PaymentResponse;
import com.hotelhub.backend.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // ==================== USER PAYMENT APIs ====================

    /**
     * Tạo payment cho user booking
     */
    @PostMapping
    public ResponseEntity<?> createPayment(@Valid @RequestBody PaymentRequest request, 
                                         Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            PaymentResponse payment = paymentService.createPayment(request, userEmail);
            return ResponseEntity.ok(Map.of(
                    "message", "Tạo payment thành công",
                    "payment", payment
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Tạo payment thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Tạo payment cho guest booking (không cần authentication)
     */
    @PostMapping("/guest")
    public ResponseEntity<?> createGuestPayment(@Valid @RequestBody PaymentRequest request,
                                             @RequestParam String guestEmail) {
        try {
            PaymentResponse payment = paymentService.createGuestPayment(request, guestEmail);
            return ResponseEntity.ok(Map.of(
                    "message", "Tạo payment thành công",
                    "payment", payment
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Tạo payment thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Lấy payment theo booking ID
     */
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getPaymentByBookingId(@PathVariable Long bookingId,
                                                 Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            Optional<PaymentResponse> payment = paymentService.getPaymentByBookingId(bookingId, userEmail);
            if (payment.isPresent()) {
                return ResponseEntity.ok(payment.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy payment thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Lấy payment theo booking reference
     */
    @GetMapping("/booking/reference/{bookingReference}")
    public ResponseEntity<?> getPaymentByBookingReference(@PathVariable String bookingReference,
                                                        Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            Optional<PaymentResponse> payment = paymentService.getPaymentByBookingReference(bookingReference, userEmail);
            if (payment.isPresent()) {
                return ResponseEntity.ok(payment.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy payment thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Lấy danh sách payments của user
     */
    @GetMapping("/user")
    public ResponseEntity<?> getUserPayments(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<PaymentResponse> payments = paymentService.getUserPayments(userEmail);
            return ResponseEntity.ok(Map.of(
                    "payments", payments,
                    "count", payments.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy danh sách payment thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Lấy danh sách payments của guest
     */
    @GetMapping("/guest")
    public ResponseEntity<?> getGuestPayments(@RequestParam String guestEmail) {
        try {
            List<PaymentResponse> payments = paymentService.getGuestPayments(guestEmail);
            return ResponseEntity.ok(Map.of(
                    "payments", payments,
                    "count", payments.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy danh sách payment thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Lấy payment theo booking reference cho guest
     */
    @GetMapping("/guest/booking/reference/{bookingReference}")
    public ResponseEntity<?> getGuestPaymentByBookingReference(@PathVariable String bookingReference,
                                                             @RequestParam String guestEmail) {
        try {
            Optional<PaymentResponse> payment = paymentService.getGuestPaymentByBookingReference(bookingReference, guestEmail);
            if (payment.isPresent()) {
                return ResponseEntity.ok(payment.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy payment thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Cập nhật trạng thái payment
     */
    @PutMapping("/{paymentId}/status")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long paymentId,
                                            @Valid @RequestBody UpdatePaymentStatusRequest request,
                                            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            PaymentResponse payment = paymentService.updatePaymentStatus(paymentId, request, userEmail);
            return ResponseEntity.ok(Map.of(
                    "message", "Cập nhật trạng thái payment thành công",
                    "payment", payment
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Cập nhật trạng thái payment thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Xử lý thanh toán
     */
    @PostMapping("/{paymentId}/process")
    public ResponseEntity<?> processPayment(@PathVariable Long paymentId,
                                          Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            PaymentResponse payment = paymentService.processPayment(paymentId, userEmail);
            return ResponseEntity.ok(Map.of(
                    "message", "Xử lý thanh toán thành công",
                    "payment", payment
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Xử lý thanh toán thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Xử lý thanh toán cho guest (không cần authentication)
     */
    @PostMapping("/guest/{paymentId}/process")
    public ResponseEntity<?> processGuestPayment(@PathVariable Long paymentId,
                                              @RequestParam String guestEmail) {
        try {
            PaymentResponse payment = paymentService.processGuestPayment(paymentId, guestEmail);
            return ResponseEntity.ok(Map.of(
                    "message", "Xử lý thanh toán thành công",
                    "payment", payment
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Xử lý thanh toán thất bại",
                    "message", e.getMessage()
            ));
        }
    }
}