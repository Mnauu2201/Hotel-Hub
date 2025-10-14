package com.hotelhub.backend.service;

import com.hotelhub.backend.dto.response.BookingResponse;
import com.hotelhub.backend.entity.Booking;
import com.hotelhub.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminBookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ActivityLogService activityLogService;

    // Xem tất cả booking với phân trang
    public Page<BookingResponse> getAllBookings(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Booking> bookings = bookingRepository.findAll(pageable);
        
        return bookings.map(this::convertToResponse);
    }

    // Xem booking theo trạng thái
    public Page<BookingResponse> getBookingsByStatus(String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Booking> bookings = bookingRepository.findByStatus(status, pageable);
        
        return bookings.map(this::convertToResponse);
    }

    // Xem booking theo khoảng thời gian
    public Page<BookingResponse> getBookingsByDateRange(LocalDate startDate, LocalDate endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        // Sử dụng method mới với LocalDate
        Page<Booking> bookings = bookingRepository.findByCheckInDateRange(startDate, endDate, pageable);
        
        return bookings.map(this::convertToResponse);
    }

    // Xem booking được tạo hôm nay
    public Page<BookingResponse> getBookingsCreatedToday(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        // Tìm booking được tạo hôm nay
        LocalDate today = LocalDate.now();
        Page<Booking> bookings = bookingRepository.findByCreatedAtBetween(
            today.atStartOfDay(),
            today.atTime(23, 59, 59),
            pageable
        );
        
        return bookings.map(this::convertToResponse);
    }

    // Xem booking theo phòng
    public List<BookingResponse> getBookingsByRoom(Long roomId) {
        List<Booking> bookings = bookingRepository.findByRoomId(roomId);
        return bookings.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    // Xem booking theo user
    public List<BookingResponse> getBookingsByUser(Long userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        return bookings.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    // Thống kê tổng quan
    public Map<String, Object> getBookingStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Tổng số booking
        long totalBookings = bookingRepository.count();
        stats.put("totalBookings", totalBookings);
        
        // Booking theo trạng thái
        Map<String, Long> statusCounts = new HashMap<>();
        statusCounts.put("pending", bookingRepository.countByStatus("pending"));
        statusCounts.put("confirmed", bookingRepository.countByStatus("confirmed"));
        statusCounts.put("cancelled", bookingRepository.countByStatus("cancelled"));
        statusCounts.put("paid", bookingRepository.countByStatus("paid"));
        stats.put("statusCounts", statusCounts);
        
        // Doanh thu tổng
        BigDecimal totalRevenue = bookingRepository.getTotalRevenue();
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        
        // Doanh thu hôm nay
        LocalDate today = LocalDate.now();
        BigDecimal todayRevenue = bookingRepository.getRevenueByDateRange(today, today);
        stats.put("todayRevenue", todayRevenue != null ? todayRevenue : BigDecimal.ZERO);
        
        // Booking hôm nay
        long todayBookings = bookingRepository.countByCreatedAtBetween(
            today.atStartOfDay(), 
            today.atTime(23, 59, 59)
        );
        stats.put("todayBookings", todayBookings);
        
        return stats;
    }

    // Doanh thu theo khoảng thời gian
    public Map<String, Object> getRevenueByPeriod(String period, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> revenue = new HashMap<>();
        
        if ("daily".equals(period)) {
            // Doanh thu theo ngày
            List<Object[]> dailyRevenue = bookingRepository.getDailyRevenue(startDate, endDate);
            revenue.put("dailyRevenue", dailyRevenue);
        } else if ("monthly".equals(period)) {
            // Doanh thu theo tháng
            List<Object[]> monthlyRevenue = bookingRepository.getMonthlyRevenue(startDate, endDate);
            revenue.put("monthlyRevenue", monthlyRevenue);
        }
        
        // Tổng doanh thu trong khoảng thời gian
        BigDecimal totalRevenue = bookingRepository.getRevenueByDateRange(startDate, endDate);
        revenue.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        
        return revenue;
    }

    // Tỷ lệ hủy booking
    public Map<String, Object> getCancellationRate(LocalDate startDate, LocalDate endDate) {
        Map<String, Object> cancellation = new HashMap<>();
        
        // Tổng booking trong khoảng thời gian
        long totalBookings = bookingRepository.countByCreatedAtBetween(
            startDate.atStartOfDay(), 
            endDate.atTime(23, 59, 59)
        );
        
        // Số booking bị hủy
        long cancelledBookings = bookingRepository.countByStatusAndCreatedAtBetween(
            "cancelled", 
            startDate.atStartOfDay(), 
            endDate.atTime(23, 59, 59)
        );
        
        // Tỷ lệ hủy
        double cancellationRate = totalBookings > 0 ? 
            (double) cancelledBookings / totalBookings * 100 : 0;
        
        cancellation.put("totalBookings", totalBookings);
        cancellation.put("cancelledBookings", cancelledBookings);
        cancellation.put("cancellationRate", Math.round(cancellationRate * 100.0) / 100.0);
        
        return cancellation;
    }

    // Admin cập nhật trạng thái booking
    public BookingResponse updateBookingStatus(Long bookingId, String newStatus, String adminEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));

        // Kiểm tra trạng thái hợp lệ
        List<String> validStatuses = List.of("pending", "confirmed", "cancelled", "paid", "refunded");
        if (!validStatuses.contains(newStatus)) {
            throw new RuntimeException("Trạng thái không hợp lệ: " + newStatus);
        }

        String oldStatus = booking.getStatus();
        booking.setStatus(newStatus);
        
        // Nếu chuyển sang confirmed, bỏ hold time
        if ("confirmed".equals(newStatus)) {
            booking.setHoldUntil(null);
        }
        
        booking = bookingRepository.save(booking);

        // Ghi log thao tác
        activityLogService.logSystemActivity("ADMIN_UPDATE_BOOKING_STATUS", 
            "Admin updated booking " + booking.getBookingReference() + " from " + oldStatus + " to " + newStatus + " by admin: " + adminEmail);

        return convertToResponse(booking);
    }

    // Admin hủy booking
    public BookingResponse cancelBooking(Long bookingId, String reason, String adminEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));

        if ("cancelled".equals(booking.getStatus())) {
            throw new RuntimeException("Booking đã bị hủy trước đó");
        }

        booking.setStatus("cancelled");
        booking.setHoldUntil(null);
        booking = bookingRepository.save(booking);

        // Ghi log thao tác
        activityLogService.logSystemActivity("ADMIN_CANCEL_BOOKING", 
            "Admin cancelled booking " + booking.getBookingReference() + ". Reason: " + reason + " by admin: " + adminEmail);

        return convertToResponse(booking);
    }

    // Convert Booking entity to BookingResponse
    private BookingResponse convertToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setBookingId(booking.getBookingId());
        response.setBookingReference(booking.getBookingReference());
        response.setRoomId(booking.getRoomId());
        // Note: These fields need to be fetched from Room entity if needed
        // For now, set to null as they're not directly available in Booking entity
        response.setRoomNumber(null);
        response.setRoomType(null);
        response.setCheckIn(booking.getCheckIn());
        response.setCheckOut(booking.getCheckOut());
        response.setGuests(booking.getGuests());
        response.setNotes(booking.getNotes());
        response.setTotalPrice(booking.getTotalPrice());
        response.setStatus(booking.getStatus());
        response.setCreatedAt(booking.getCreatedAt());
        response.setHoldUntil(booking.getHoldUntil());
        response.setGuestName(booking.getGuestName());
        response.setGuestEmail(booking.getGuestEmail());
        response.setGuestPhone(booking.getGuestPhone());
        
        if (booking.getUser() != null) {
            response.setUserName(booking.getUser().getName());
            response.setUserEmail(booking.getUser().getEmail());
        }
        
        // Note: These fields need to be fetched from Room entity if needed
        // For now, set to null as they're not directly available in Booking entity
        response.setRoomDescription(null);
        response.setRoomCapacity(null);
        response.setAmenities(null);
        
        return response;
    }
}


