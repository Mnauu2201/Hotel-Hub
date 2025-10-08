package com.hotelhub.backend.controller;

import com.hotelhub.backend.dto.response.BookingResponse;
import com.hotelhub.backend.service.AdminBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/staff")
@PreAuthorize("hasAuthority('ROLE_STAFF') or hasAuthority('ROLE_ADMIN')")
public class StaffBookingController {

    @Autowired
    private AdminBookingService adminBookingService;

    // Staff xem booking hôm nay (booking được tạo hôm nay)
    @GetMapping("/bookings/today")
    public ResponseEntity<?> getTodayBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<BookingResponse> bookings = adminBookingService.getBookingsCreatedToday(page, size);
            return ResponseEntity.ok(Map.of(
                    "bookings", bookings.getContent(),
                    "totalElements", bookings.getTotalElements(),
                    "totalPages", bookings.getTotalPages(),
                    "currentPage", bookings.getNumber(),
                    "size", bookings.getSize(),
                    "date", LocalDate.now(),
                    "description", "Booking được tạo hôm nay"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lỗi lấy booking hôm nay",
                    "message", e.getMessage()
            ));
        }
    }

    // Staff xem booking theo trạng thái
    @GetMapping("/bookings/status/{status}")
    public ResponseEntity<?> getBookingsByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<BookingResponse> bookings = adminBookingService.getBookingsByStatus(status, page, size);
            return ResponseEntity.ok(Map.of(
                    "bookings", bookings.getContent(),
                    "totalElements", bookings.getTotalElements(),
                    "totalPages", bookings.getTotalPages(),
                    "currentPage", bookings.getNumber(),
                    "size", bookings.getSize(),
                    "status", status
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lỗi lấy booking theo trạng thái",
                    "message", e.getMessage()
            ));
        }
    }

    // Staff xem booking theo khoảng thời gian
    @GetMapping("/bookings/date-range")
    public ResponseEntity<?> getBookingsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<BookingResponse> bookings = adminBookingService.getBookingsByDateRange(startDate, endDate, page, size);
            return ResponseEntity.ok(Map.of(
                    "bookings", bookings.getContent(),
                    "totalElements", bookings.getTotalElements(),
                    "totalPages", bookings.getTotalPages(),
                    "currentPage", bookings.getNumber(),
                    "size", bookings.getSize(),
                    "startDate", startDate,
                    "endDate", endDate
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lỗi lấy booking theo ngày",
                    "message", e.getMessage()
            ));
        }
    }

    // Staff xem booking theo phòng
    @GetMapping("/bookings/room/{roomId}")
    public ResponseEntity<?> getBookingsByRoom(@PathVariable Long roomId) {
        try {
            List<BookingResponse> bookings = adminBookingService.getBookingsByRoom(roomId);
            return ResponseEntity.ok(Map.of(
                    "bookings", bookings,
                    "roomId", roomId,
                    "count", bookings.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lỗi lấy booking theo phòng",
                    "message", e.getMessage()
            ));
        }
    }

    // Staff cập nhật trạng thái booking (chỉ confirm/cancel)
    @PutMapping("/bookings/{bookingId}/status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            String newStatus = request.get("status");
            String staffEmail = authentication.getName();
            
            // Staff chỉ được confirm hoặc cancel
            if (!"confirmed".equals(newStatus) && !"cancelled".equals(newStatus)) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Staff chỉ được confirm hoặc cancel booking",
                        "message", "Trạng thái không hợp lệ: " + newStatus
                ));
            }
            
            BookingResponse booking = adminBookingService.updateBookingStatus(bookingId, newStatus, staffEmail);
            return ResponseEntity.ok(Map.of(
                    "message", "Cập nhật trạng thái booking thành công",
                    "booking", booking
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Cập nhật trạng thái thất bại",
                    "message", e.getMessage()
            ));
        }
    }

    // Staff hủy booking
    @PutMapping("/bookings/{bookingId}/cancel")
    public ResponseEntity<?> cancelBooking(
            @PathVariable Long bookingId,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            String reason = request.get("reason");
            String staffEmail = authentication.getName();
            
            BookingResponse booking = adminBookingService.cancelBooking(bookingId, reason, staffEmail);
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

    // Staff xem thống kê cơ bản
    @GetMapping("/bookings/statistics")
    public ResponseEntity<?> getBasicStatistics() {
        try {
            Map<String, Object> statistics = adminBookingService.getBookingStatistics();
            return ResponseEntity.ok(Map.of(
                    "message", "Thống kê cơ bản thành công",
                    "statistics", statistics
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lỗi lấy thống kê",
                    "message", e.getMessage()
            ));
        }
    }
}






