package com.hotelhub.backend.service;

import com.hotelhub.backend.dto.response.BookingResponse;
import com.hotelhub.backend.entity.Booking;
import com.hotelhub.backend.entity.Room;
import com.hotelhub.backend.entity.RoomStatus;
import com.hotelhub.backend.repository.BookingRepository;
import com.hotelhub.backend.repository.RoomRepository;
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
    private RoomRepository roomRepository;

    @Autowired
    private ActivityLogService activityLogService;

    // Xem tất cả booking với phân trang và lọc theo ngày
    public Page<BookingResponse> getAllBookings(int page, int size, String sortBy, String sortDir, LocalDate startDate, LocalDate endDate) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Booking> bookings;
        
        if (startDate != null && endDate != null) {
            // Lọc theo khoảng thời gian check-in
            bookings = bookingRepository.findByCheckInBetween(startDate, endDate, pageable);
        } else if (startDate != null) {
            // Lọc từ ngày bắt đầu
            bookings = bookingRepository.findByCheckInGreaterThanEqual(startDate, pageable);
        } else if (endDate != null) {
            // Lọc đến ngày kết thúc
            bookings = bookingRepository.findByCheckInLessThanEqual(endDate, pageable);
        } else {
            // Không lọc
            bookings = bookingRepository.findAll(pageable);
        }
        
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
        List<String> validStatuses = List.of("pending", "confirmed", "cancelled", "paid", "refunded", "completed");
        if (!validStatuses.contains(newStatus)) {
            throw new RuntimeException("Trạng thái không hợp lệ: " + newStatus);
        }

        String oldStatus = booking.getStatus();
        booking.setStatus(newStatus);
        
        // Nếu chuyển sang confirmed, bỏ hold time
        if ("confirmed".equals(newStatus)) {
            booking.setHoldUntil(null);
        }
        
        // Cập nhật room status dựa trên booking status
        Room room = roomRepository.findById(booking.getRoomId()).orElse(null);
        if (room != null) {
            if ("confirmed".equals(newStatus) || "paid".equals(newStatus)) {
                // Booking được xác nhận hoặc thanh toán → phòng BOOKED
                room.setStatus(RoomStatus.BOOKED);
            } else if ("completed".equals(newStatus)) {
                // Booking hoàn thành → phòng AVAILABLE (khách đã trả phòng)
                room.setStatus(RoomStatus.AVAILABLE);
            } else if ("cancelled".equals(newStatus) || "refunded".equals(newStatus)) {
                // Booking bị hủy hoặc hoàn tiền → phòng AVAILABLE
                room.setStatus(RoomStatus.AVAILABLE);
            }
            roomRepository.save(room);
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

        // Cập nhật room status về AVAILABLE khi booking bị cancelled
        Room room = roomRepository.findById(booking.getRoomId()).orElse(null);
        if (room != null) {
            room.setStatus(RoomStatus.AVAILABLE);
            roomRepository.save(room);
        }

        // Ghi log thao tác
        activityLogService.logSystemActivity("ADMIN_CANCEL_BOOKING", 
            "Admin cancelled booking " + booking.getBookingReference() + ". Reason: " + reason + " by admin: " + adminEmail);

        return convertToResponse(booking);
    }

    // Admin cập nhật thông tin booking
    public BookingResponse updateBooking(Long bookingId, Map<String, Object> request, String adminEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));

        // Cập nhật các trường có thể sửa
        if (request.containsKey("status")) {
            String newStatus = (String) request.get("status");
            List<String> validStatuses = List.of("pending", "confirmed", "cancelled", "paid", "refunded", "completed");
            if (!validStatuses.contains(newStatus)) {
                throw new RuntimeException("Trạng thái không hợp lệ: " + newStatus);
            }
            booking.setStatus(newStatus);
            
            // Nếu chuyển sang confirmed, bỏ hold time
            if ("confirmed".equals(newStatus)) {
                booking.setHoldUntil(null);
            }
        }

        if (request.containsKey("guests")) {
            Integer guests = (Integer) request.get("guests");
            if (guests != null && guests > 0) {
                booking.setGuests(guests);
            }
        }

        if (request.containsKey("checkIn")) {
            String checkInStr = (String) request.get("checkIn");
            if (checkInStr != null && !checkInStr.isEmpty()) {
                booking.setCheckIn(LocalDate.parse(checkInStr));
            }
        }

        if (request.containsKey("checkOut")) {
            String checkOutStr = (String) request.get("checkOut");
            if (checkOutStr != null && !checkOutStr.isEmpty()) {
                booking.setCheckOut(LocalDate.parse(checkOutStr));
            }
        }

        if (request.containsKey("notes")) {
            String notes = (String) request.get("notes");
            booking.setNotes(notes);
        }

        booking = bookingRepository.save(booking);

        // Ghi log thao tác
        activityLogService.logSystemActivity("ADMIN_UPDATE_BOOKING", 
            "Admin updated booking " + booking.getBookingReference() + " by admin: " + adminEmail);

        return convertToResponse(booking);
    }

    // Convert Booking entity to BookingResponse
    private BookingResponse convertToResponse(Booking booking) {
        Room room = roomRepository.findById(booking.getRoomId()).orElse(null);
        
        BookingResponse response = new BookingResponse();
        response.setBookingId(booking.getBookingId());
        response.setBookingReference(booking.getBookingReference());
        response.setRoomId(booking.getRoomId());
        response.setRoomNumber(room != null ? room.getRoomNumber() : null);
        response.setRoomType(room != null ? room.getRoomType().getName() : null);
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
        
        response.setRoomDescription(room != null ? room.getDescription() : null);
        response.setRoomCapacity(room != null ? room.getCapacity() : null);
        response.setAmenities(null); // TODO: Implement amenities
        
        return response;
    }

    /**
     * Xác nhận booking (Admin only)
     */
    public BookingResponse confirmBooking(Long bookingId, String adminEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));

        // Kiểm tra booking có thể xác nhận không
        if (!"pending".equals(booking.getStatus())) {
            throw new RuntimeException("Booking không thể xác nhận. Trạng thái hiện tại: " + booking.getStatus());
        }

        // Cập nhật booking status
        booking.setStatus("confirmed");
        booking.setHoldUntil(null); // Bỏ hold time
        booking = bookingRepository.save(booking);

        // Cập nhật room status thành BOOKED
        Room room = roomRepository.findById(booking.getRoomId()).orElse(null);
        if (room != null) {
            room.setStatus(RoomStatus.BOOKED);
            roomRepository.save(room);
        }

        // Ghi log thao tác
        activityLogService.logSystemActivity("ADMIN_CONFIRM_BOOKING",
            "Admin " + adminEmail + " confirmed booking " + booking.getBookingReference());

        return convertToResponse(booking);
    }

}


