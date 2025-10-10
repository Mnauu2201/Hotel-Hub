package com.hotelhub.backend.controller;

import com.hotelhub.backend.entity.Booking;
import com.hotelhub.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/bookings")
public class AdminBookingController {

    @Autowired
    private BookingRepository bookingRepository;

    /**
     * Admin: Lấy tất cả bookings
     */
    @GetMapping
    public ResponseEntity<?> getAllBookings(Authentication authentication) {
        try {
            List<Booking> bookings = bookingRepository.findAll();
            return ResponseEntity.ok(Map.of(
                    "bookings", bookings,
                    "count", bookings.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lỗi khi lấy bookings",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Admin: Lấy booking theo ID
     */
    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getBookingById(@PathVariable Long bookingId, Authentication authentication) {
        try {
            Optional<Booking> booking = bookingRepository.findById(bookingId);
            if (booking.isPresent()) {
                Booking b = booking.get();
                Map<String, Object> response = new java.util.HashMap<>();
                response.put("bookingId", b.getBookingId());
                response.put("bookingReference", b.getBookingReference());
                response.put("roomId", b.getRoomId());
                response.put("checkIn", b.getCheckIn());
                response.put("checkOut", b.getCheckOut());
                response.put("status", b.getStatus());
                response.put("totalPrice", b.getTotalPrice());
                
                if (b.getUser() != null) {
                    Map<String, Object> userInfo = new java.util.HashMap<>();
                    userInfo.put("userId", b.getUser().getUserId());
                    userInfo.put("email", b.getUser().getEmail());
                    response.put("user", userInfo);
                } else {
                    response.put("user", null);
                }
                
                response.put("guestName", b.getGuestName());
                response.put("guestEmail", b.getGuestEmail());
                response.put("guestPhone", b.getGuestPhone());
                response.put("isGuestBooking", b.getUser() == null);
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lỗi khi lấy booking",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Admin: Lấy booking theo reference
     */
    @GetMapping("/reference/{bookingReference}")
    public ResponseEntity<?> getBookingByReference(@PathVariable String bookingReference, Authentication authentication) {
        try {
            Optional<Booking> booking = bookingRepository.findByBookingReference(bookingReference);
            if (booking.isPresent()) {
                Booking b = booking.get();
                Map<String, Object> response = new java.util.HashMap<>();
                response.put("bookingId", b.getBookingId());
                response.put("bookingReference", b.getBookingReference());
                response.put("roomId", b.getRoomId());
                response.put("checkIn", b.getCheckIn());
                response.put("checkOut", b.getCheckOut());
                response.put("status", b.getStatus());
                response.put("totalPrice", b.getTotalPrice());
                
                if (b.getUser() != null) {
                    Map<String, Object> userInfo = new java.util.HashMap<>();
                    userInfo.put("userId", b.getUser().getUserId());
                    userInfo.put("email", b.getUser().getEmail());
                    response.put("user", userInfo);
                } else {
                    response.put("user", null);
                }
                
                response.put("guestName", b.getGuestName());
                response.put("guestEmail", b.getGuestEmail());
                response.put("guestPhone", b.getGuestPhone());
                response.put("isGuestBooking", b.getUser() == null);
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lỗi khi lấy booking",
                    "message", e.getMessage()
            ));
        }
    }
}