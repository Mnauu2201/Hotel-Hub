package com.hotelhub.backend.controller;

import com.hotelhub.backend.repository.BookingRepository;
import com.hotelhub.backend.repository.RoomRepository;
import com.hotelhub.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin/reports")
@CrossOrigin(origins = "http://localhost:3001")
public class ReportController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomRepository roomRepository;

    /**
     * API test đơn giản để kiểm tra authentication
     */
    @GetMapping("/test")
    public ResponseEntity<?> testAuth() {
        return ResponseEntity.ok(Map.of("message", "Reports API is working", "timestamp", System.currentTimeMillis()));
    }

    /**
     * API test không cần authentication
     */
    @GetMapping("/public-test")
    public ResponseEntity<?> publicTest() {
        return ResponseEntity.ok(Map.of("message", "Public test API is working", "timestamp", System.currentTimeMillis()));
    }

    /**
     * API lấy thống kê tổng quan - Sử dụng các method có sẵn
     */
    @GetMapping("/overview")
    public ResponseEntity<?> getOverview(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        
        try {
            // Nếu không có fromDate, lấy 30 ngày gần nhất
            if (fromDate == null) {
                fromDate = LocalDate.now().minusDays(30);
            }
            // Nếu không có toDate, lấy ngày hiện tại
            if (toDate == null) {
                toDate = LocalDate.now();
            }

            // Tổng đặt phòng - sử dụng method có sẵn
            long totalBookings = bookingRepository.countByCreatedAtBetween(fromDate.atStartOfDay(), toDate.atTime(23, 59, 59));

            // Tổng doanh thu - tính cả confirmed và paid
            var totalRevenue = bookingRepository.getRevenueByDateRange(fromDate, toDate);
            double revenue = totalRevenue != null ? totalRevenue.doubleValue() : 0.0;
            
            // Nếu không có doanh thu từ paid, thử tính từ confirmed
            if (revenue == 0.0) {
                // Tính doanh thu từ booking confirmed trong khoảng thời gian
                var confirmedRevenue = bookingRepository.getRevenueByDateRangeConfirmed(fromDate, toDate);
                revenue = confirmedRevenue != null ? confirmedRevenue.doubleValue() : 0.0;
            }
            
            // Debug: Log revenue calculation
            System.out.println("Revenue calculation for " + fromDate + " to " + toDate + ": " + revenue);

            // Tổng người dùng - sử dụng method có sẵn
            long totalUsers = userRepository.count();

            // Tổng phòng - sử dụng method có sẵn
            long totalRooms = roomRepository.count();

            Map<String, Object> overview = new HashMap<>();
            overview.put("totalBookings", totalBookings);
            overview.put("totalRevenue", revenue);
            overview.put("totalUsers", totalUsers);
            overview.put("totalRooms", totalRooms);
            overview.put("fromDate", fromDate);
            overview.put("toDate", toDate);

            return ResponseEntity.ok(overview);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Lỗi khi lấy thống kê tổng quan: " + e.getMessage()));
        }
    }

    /**
     * API lấy doanh thu theo tháng - Sử dụng method có sẵn
     */
    @GetMapping("/revenue-monthly")
    public ResponseEntity<?> getRevenueMonthly(@RequestParam(defaultValue = "2025") int year) {
        try {
            List<Map<String, Object>> monthlyRevenue = new ArrayList<>();
            
            for (int month = 1; month <= 12; month++) {
                LocalDate startOfMonth = LocalDate.of(year, month, 1);
                LocalDate endOfMonth = startOfMonth.plusMonths(1).minusDays(1);
                
                var revenue = bookingRepository.getRevenueByDateRange(startOfMonth, endOfMonth);
                double monthRevenue = revenue != null ? revenue.doubleValue() : 0.0;
                
                Map<String, Object> monthData = new HashMap<>();
                monthData.put("month", "T" + month);
                monthData.put("revenue", monthRevenue);
                monthData.put("year", year);
                monthData.put("monthNumber", month);
                
                monthlyRevenue.add(monthData);
            }

            return ResponseEntity.ok(monthlyRevenue);
        } catch (Exception e) {
            System.out.println("Error in revenue-monthly: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Lỗi khi lấy doanh thu theo tháng: " + e.getMessage()));
        }
    }

    /**
     * API lấy trạng thái đặt phòng - Sử dụng method có sẵn
     */
    @GetMapping("/booking-status")
    public ResponseEntity<?> getBookingStatus(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        
        try {
            if (fromDate == null) {
                fromDate = LocalDate.now().minusDays(30);
            }
            if (toDate == null) {
                toDate = LocalDate.now();
            }

            LocalDateTime startDateTime = fromDate.atStartOfDay();
            LocalDateTime endDateTime = toDate.atTime(23, 59, 59);

            // Lấy số lượng theo từng trạng thái - sử dụng method có sẵn
            long pendingCount = bookingRepository.countByStatusAndCreatedAtBetween("pending", startDateTime, endDateTime);
            long confirmedCount = bookingRepository.countByStatusAndCreatedAtBetween("confirmed", startDateTime, endDateTime);
            long cancelledCount = bookingRepository.countByStatusAndCreatedAtBetween("cancelled", startDateTime, endDateTime);
            long completedCount = bookingRepository.countByStatusAndCreatedAtBetween("completed", startDateTime, endDateTime);

            List<Map<String, Object>> statusData = new ArrayList<>();
            
            statusData.add(Map.of(
                "status", "Chờ xử lý",
                "statusCode", "PENDING",
                "count", pendingCount,
                "color", "yellow"
            ));
            
            statusData.add(Map.of(
                "status", "Đã xác nhận", 
                "statusCode", "CONFIRMED",
                "count", confirmedCount,
                "color", "green"
            ));
            
            statusData.add(Map.of(
                "status", "Đã hủy",
                "statusCode", "CANCELLED", 
                "count", cancelledCount,
                "color", "red"
            ));
            
            statusData.add(Map.of(
                "status", "Hoàn thành",
                "statusCode", "COMPLETED",
                "count", completedCount,
                "color", "blue"
            ));

            return ResponseEntity.ok(statusData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Lỗi khi lấy trạng thái đặt phòng: " + e.getMessage()));
        }
    }

    /**
     * API lấy phòng được đặt nhiều nhất - Mock data để tránh xung đột
     */
    @GetMapping("/popular-rooms")
    public ResponseEntity<?> getPopularRooms(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        
        try {
            // Mock data để tránh xung đột với database
            List<Map<String, Object>> roomData = new ArrayList<>();
            
            roomData.add(Map.of(
                "rank", 1,
                "roomType", "Deluxe Suite",
                "bookingCount", 45L,
                "totalRevenue", 45000000.0,
                "revenueFormatted", "45.000.000 VNĐ"
            ));
            
            roomData.add(Map.of(
                "rank", 2,
                "roomType", "Standard Room",
                "bookingCount", 38L,
                "totalRevenue", 28000000.0,
                "revenueFormatted", "28.000.000 VNĐ"
            ));
            
            roomData.add(Map.of(
                "rank", 3,
                "roomType", "Family Suite",
                "bookingCount", 22L,
                "totalRevenue", 35000000.0,
                "revenueFormatted", "35.000.000 VNĐ"
            ));

            return ResponseEntity.ok(roomData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Lỗi khi lấy phòng phổ biến: " + e.getMessage()));
        }
    }
}