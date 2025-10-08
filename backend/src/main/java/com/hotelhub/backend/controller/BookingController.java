package com.hotelhub.backend.controller;

import com.hotelhub.backend.dto.request.GuestBookingRequest;
import com.hotelhub.backend.dto.request.UserBookingRequest;
import com.hotelhub.backend.dto.response.BookingResponse;
import com.hotelhub.backend.service.BookingService;
import com.hotelhub.backend.service.RoomService;
import com.hotelhub.backend.entity.Room;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private RoomService roomService;

    // ==================== GUEST BOOKING APIs ====================

    /**
     * Tạo booking cho guest (không cần login)
     */
    @PostMapping("/guest")
    public ResponseEntity<?> createGuestBooking(@Valid @RequestBody GuestBookingRequest request) {
        try {
            BookingResponse booking = bookingService.createGuestBooking(request);
            return ResponseEntity.ok(Map.of(
                    "message", "Tạo booking thành công",
                    "booking", booking
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Tạo booking thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Tra cứu booking theo mã booking (cho guest)
     */
    @GetMapping("/guest/{bookingReference}")
    public ResponseEntity<?> getGuestBookingByReference(@PathVariable String bookingReference) {
        try {
            Optional<BookingResponse> booking = bookingService.findByReference(bookingReference);
            if (booking.isPresent()) {
                return ResponseEntity.ok(booking.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Tra cứu booking thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Tra cứu booking theo email (cho guest)
     */
    @GetMapping("/guest/email/{email}")
    public ResponseEntity<?> getGuestBookingsByEmail(@PathVariable String email) {
        try {
            List<BookingResponse> bookings = bookingService.findByGuestEmail(email);
            return ResponseEntity.ok(Map.of(
                    "bookings", bookings,
                    "count", bookings.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Tra cứu booking thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    // ==================== USER BOOKING APIs ====================

    /**
     * Tạo booking cho user đã login
     */
    @PostMapping
    public ResponseEntity<?> createUserBooking(@Valid @RequestBody UserBookingRequest request, 
                                             Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            BookingResponse booking = bookingService.createUserBooking(request, userEmail);
            return ResponseEntity.ok(Map.of(
                    "message", "Tạo booking thành công",
                    "booking", booking
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Tạo booking thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Lấy danh sách booking của user
     */
    @GetMapping
    public ResponseEntity<?> getUserBookings(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<BookingResponse> bookings = bookingService.getUserBookings(userEmail);
            return ResponseEntity.ok(Map.of(
                    "bookings", bookings,
                    "count", bookings.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy danh sách booking thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Lấy chi tiết booking của user
     */
    @GetMapping("/user/{bookingId}")
    public ResponseEntity<?> getUserBooking(@PathVariable Long bookingId, 
                                          Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            Optional<BookingResponse> booking = bookingService.getUserBookingById(bookingId, userEmail);
            if (booking.isPresent()) {
                return ResponseEntity.ok(booking.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy chi tiết booking thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Hủy booking
     */
    @PutMapping("/user/{bookingId}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long bookingId, 
                                        Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            BookingResponse booking = bookingService.cancelBooking(bookingId, userEmail);
            return ResponseEntity.ok(Map.of(
                    "message", "Hủy booking thành công",
                    "booking", booking
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Hủy booking thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Xác nhận booking
     */
    @PutMapping("/user/{bookingId}/confirm")
    public ResponseEntity<?> confirmBooking(@PathVariable Long bookingId, 
                                          Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            BookingResponse booking = bookingService.confirmBooking(bookingId, userEmail);
            return ResponseEntity.ok(Map.of(
                    "message", "Xác nhận booking thành công",
                    "booking", booking
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Xác nhận booking thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    // ==================== ROOM APIs ====================

    /**
     * Lấy danh sách phòng
     */
    @GetMapping("/rooms")
    public ResponseEntity<?> getAllRooms() {
        try {
            List<Room> rooms = roomService.getAllRooms();
            return ResponseEntity.ok(Map.of(
                    "rooms", rooms,
                    "count", rooms.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy danh sách phòng thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Lấy phòng trống trong khoảng thời gian
     */
    @GetMapping("/rooms/available")
    public ResponseEntity<?> getAvailableRooms(@RequestParam LocalDate checkIn, 
                                            @RequestParam LocalDate checkOut) {
        try {
            List<Room> rooms = roomService.getAvailableRooms(checkIn, checkOut);
            return ResponseEntity.ok(Map.of(
                    "rooms", rooms,
                    "count", rooms.size(),
                    "checkIn", checkIn,
                    "checkOut", checkOut
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy phòng trống thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Lấy chi tiết phòng
     */
    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<?> getRoomDetails(@PathVariable Long roomId) {
        try {
            Optional<Room> room = roomService.getRoomById(roomId);
            if (room.isPresent()) {
                return ResponseEntity.ok(room.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lấy chi tiết phòng thất bại",
                    "message", e.getMessage()
            ));
        }
    }
}