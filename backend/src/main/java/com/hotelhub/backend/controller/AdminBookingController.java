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
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminBookingController {

    @Autowired
    private AdminBookingService adminBookingService;

    // Xem tất cả booking với phân trang
    @GetMapping("/bookings")
    public ResponseEntity<?> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            Page<BookingResponse> bookings = adminBookingService.getAllBookings(page, size, sortBy, sortDir);
            return ResponseEntity.ok(Map.of(
                    "bookings", bookings.getContent(),
                    "totalElements", bookings.getTotalElements(),
                    "totalPages", bookings.getTotalPages(),
                    "currentPage", bookings.getNumber(),
                    "size", bookings.getSize()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lỗi lấy danh sách booking",
                    "message", e.getMessage()
            ));
        }
    }

    // Xem booking theo trạng thái
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
                    "size", bookings.getSize()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lỗi lấy booking theo trạng thái",
                    "message", e.getMessage()
            ));
        }
    }

    // Xem booking theo khoảng thời gian
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

    // Xem booking theo phòng
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

    // Xem booking theo user
    @GetMapping("/bookings/user/{userId}")
    public ResponseEntity<?> getBookingsByUser(@PathVariable Long userId) {
        try {
            List<BookingResponse> bookings = adminBookingService.getBookingsByUser(userId);
            return ResponseEntity.ok(Map.of(
                    "bookings", bookings,
                    "userId", userId,
                    "count", bookings.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lỗi lấy booking theo user",
                    "message", e.getMessage()
            ));
        }
    }

    // Thống kê tổng quan
    @GetMapping("/bookings/statistics")
    public ResponseEntity<?> getBookingStatistics() {
        try {
            Map<String, Object> statistics = adminBookingService.getBookingStatistics();
            return ResponseEntity.ok(Map.of(
                    "message", "Thống kê booking thành công",
                    "statistics", statistics
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lỗi lấy thống kê",
                    "message", e.getMessage()
            ));
        }
    }

    // Doanh thu theo khoảng thời gian
    @GetMapping("/bookings/revenue")
    public ResponseEntity<?> getRevenueByPeriod(
            @RequestParam String period,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            Map<String, Object> revenue = adminBookingService.getRevenueByPeriod(period, startDate, endDate);
            return ResponseEntity.ok(Map.of(
                    "message", "Lấy doanh thu thành công",
                    "revenue", revenue,
                    "period", period,
                    "startDate", startDate,
                    "endDate", endDate
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lỗi lấy doanh thu",
                    "message", e.getMessage()
            ));
        }
    }

    // Tỷ lệ hủy booking
    @GetMapping("/bookings/cancellation-rate")
    public ResponseEntity<?> getCancellationRate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            Map<String, Object> cancellation = adminBookingService.getCancellationRate(startDate, endDate);
            return ResponseEntity.ok(Map.of(
                    "message", "Lấy tỷ lệ hủy thành công",
                    "cancellation", cancellation,
                    "startDate", startDate,
                    "endDate", endDate
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lỗi lấy tỷ lệ hủy",
                    "message", e.getMessage()
            ));
        }
    }

    // Admin cập nhật trạng thái booking
    @PutMapping("/bookings/{bookingId}/status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            String newStatus = request.get("status");
            String adminEmail = authentication.getName();
            
            BookingResponse booking = adminBookingService.updateBookingStatus(bookingId, newStatus, adminEmail);
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

    // Admin hủy booking
    @PutMapping("/bookings/{bookingId}/cancel")
    public ResponseEntity<?> cancelBooking(
            @PathVariable Long bookingId,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            String reason = request.get("reason");
            String adminEmail = authentication.getName();
            
            BookingResponse booking = adminBookingService.cancelBooking(bookingId, reason, adminEmail);
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
}






