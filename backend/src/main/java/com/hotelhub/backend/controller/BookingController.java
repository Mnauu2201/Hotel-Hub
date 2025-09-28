package com.hotelhub.backend.controller;

import com.hotelhub.backend.dto.request.BookingRequest;
import com.hotelhub.backend.dto.response.BookingResponse;
import com.hotelhub.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // 1️⃣ Tạo booking (user login hoặc guest đều có thể)
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @RequestBody BookingRequest request,
            @AuthenticationPrincipal UserDetails principal) {

        String username = (principal != null) ? principal.getUsername() : null;

        BookingResponse booking = bookingService.createBooking(request, username);
        return ResponseEntity.ok(booking);
    }

    // 2️⃣ Lấy tất cả booking của 1 user (chỉ dùng khi user login)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponse>> getBookingsByUser(@PathVariable Long userId) {
        List<BookingResponse> bookings = bookingService.getBookingsByUser(userId);
        return ResponseEntity.ok(bookings);
    }

    // 3️⃣ Lấy chi tiết booking theo ID
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id) {
        BookingResponse booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }

    // 4️⃣ Hủy booking
    @PutMapping("/{id}/cancel")
    public ResponseEntity<String> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.ok("Booking has been cancelled successfully.");
    }
}
