package com.hotelhub.backend.service;

import com.hotelhub.backend.dto.request.GuestBookingRequest;
import com.hotelhub.backend.dto.request.UserBookingRequest;
import com.hotelhub.backend.dto.response.BookingResponse;
import com.hotelhub.backend.entity.Booking;
import com.hotelhub.backend.entity.Room;
import com.hotelhub.backend.entity.User;
import com.hotelhub.backend.repository.BookingRepository;
import com.hotelhub.backend.repository.RoomRepository;
import com.hotelhub.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityLogService activityLogService;

    /**
     * Tạo booking cho guest (không cần login)
     */
    public BookingResponse createGuestBooking(GuestBookingRequest request) {
        // Kiểm tra phòng có trống không
        if (!roomRepository.isRoomAvailable(request.getRoomId(), request.getCheckIn(), request.getCheckOut())) {
            throw new RuntimeException("Phòng không còn trống trong khoảng thời gian này");
        }

        // Lấy thông tin phòng
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Phòng không tồn tại"));

        // Tính giá
        BigDecimal totalPrice = calculateTotalPrice(room, request.getCheckIn(), request.getCheckOut());

        // Tạo booking
        Booking booking = new Booking();
        booking.setRoomId(request.getRoomId());
        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());
        booking.setGuests(request.getGuests());
        booking.setNotes(request.getNotes());
        booking.setTotalPrice(totalPrice);
        booking.setStatus("pending");
        booking.setGuestName(request.getGuestName());
        booking.setGuestEmail(request.getGuestEmail());
        booking.setGuestPhone(request.getGuestPhone());
        booking.setHoldUntil(LocalDateTime.now().plusMinutes(5)); // Hold room 5 phút
        booking.setBookingReference(generateBookingReference());

        booking = bookingRepository.save(booking);

        return convertToResponse(booking);
    }

    /**
     * Tạo booking cho user đã login
     */
    public BookingResponse createUserBooking(UserBookingRequest request, String userEmail) {
        // Lấy user
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        // Kiểm tra phòng có trống không
        if (!roomRepository.isRoomAvailable(request.getRoomId(), request.getCheckIn(), request.getCheckOut())) {
            throw new RuntimeException("Phòng không còn trống trong khoảng thời gian này");
        }

        // Lấy thông tin phòng
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Phòng không tồn tại"));

        // Tính giá
        BigDecimal totalPrice = calculateTotalPrice(room, request.getCheckIn(), request.getCheckOut());

        // Tạo booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoomId(request.getRoomId());
        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());
        booking.setGuests(request.getGuests());
        booking.setNotes(request.getNotes());
        booking.setTotalPrice(totalPrice);
        booking.setStatus("pending");
        booking.setHoldUntil(LocalDateTime.now().plusMinutes(5)); // Hold 5 phút
        booking.setBookingReference(generateBookingReference());

        booking = bookingRepository.save(booking);

        // Ghi log thao tác
        activityLogService.logSystemActivity("CREATE_GUEST_BOOKING", 
            "Guest booking created: " + booking.getBookingReference() + 
            " for room " + booking.getRoomId() + 
            " from " + booking.getCheckIn() + " to " + booking.getCheckOut());

        return convertToResponse(booking);
    }

    /**
     * Tìm booking theo mã booking
     */
    public Optional<BookingResponse> findByReference(String bookingReference) {
        return bookingRepository.findByBookingReference(bookingReference)
                .map(this::convertToResponse);
    }

    /**
     * Tìm booking theo email (cho guest)
     */
    public List<BookingResponse> findByGuestEmail(String email) {
        return bookingRepository.findByGuestEmail(email)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lấy danh sách booking của user
     */
    public List<BookingResponse> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        return bookingRepository.findByUserId(user.getUserId())
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Hủy booking
     */
    public BookingResponse cancelBooking(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));

        // Kiểm tra quyền hủy booking
        if (booking.getUser() != null) {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User không tồn tại"));
            if (!booking.getUser().getUserId().equals(user.getUserId())) {
                throw new RuntimeException("Bạn không có quyền hủy booking này");
            }
        }

        booking.setStatus("cancelled");
        booking = bookingRepository.save(booking);

        // Ghi log thao tác
        activityLogService.logActivity(userEmail, "CANCEL_BOOKING", 
            "Booking " + booking.getBookingReference() + " cancelled by user");

        return convertToResponse(booking);
    }

    /**
     * Xác nhận booking
     */
    public BookingResponse confirmBooking(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));

        // Kiểm tra quyền xác nhận booking
        if (booking.getUser() != null) {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User không tồn tại"));
            if (!booking.getUser().getUserId().equals(user.getUserId())) {
                throw new RuntimeException("Bạn không có quyền xác nhận booking này");
            }
        }

        // Kiểm tra booking có thể xác nhận không
        if (!"pending".equals(booking.getStatus())) {
            throw new RuntimeException("Booking không thể xác nhận. Trạng thái hiện tại: " + booking.getStatus());
        }

        // Kiểm tra booking có hết hạn không
        if (booking.getHoldUntil() != null && booking.getHoldUntil().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Booking đã hết hạn, không thể xác nhận");
        }

        booking.setStatus("confirmed");
        booking.setHoldUntil(null); // Bỏ hold time
        booking = bookingRepository.save(booking);

        // Ghi log thao tác
        activityLogService.logActivity(userEmail, "CONFIRM_BOOKING", 
            "Booking " + booking.getBookingReference() + " confirmed by user");

        return convertToResponse(booking);
    }

    /**
     * Cập nhật trạng thái booking (Admin only)
     */
    public BookingResponse updateBookingStatus(Long bookingId, String newStatus, String adminEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));

        // Kiểm tra trạng thái hợp lệ
        List<String> validStatuses = List.of("pending", "confirmed", "cancelled", "paid");
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
        activityLogService.logActivity(adminEmail, "UPDATE_BOOKING_STATUS", 
            "Booking " + booking.getBookingReference() + " changed from " + oldStatus + " to " + newStatus);

        return convertToResponse(booking);
    }

    /**
     * Tính giá booking
     */
    private BigDecimal calculateTotalPrice(Room room, LocalDate checkIn, LocalDate checkOut) {
        long nights = checkIn.until(checkOut).getDays();
        BigDecimal roomPrice = room.getPrice(); // Room.getPrice() đã trả về BigDecimal
        BigDecimal totalPrice = roomPrice.multiply(BigDecimal.valueOf(nights));
        
        // Debug log
        System.out.println("=== DEBUG PRICE CALCULATION ===");
        System.out.println("Room ID: " + room.getRoomId());
        System.out.println("Room Price: " + room.getPrice());
        System.out.println("Check In: " + checkIn);
        System.out.println("Check Out: " + checkOut);
        System.out.println("Nights: " + nights);
        System.out.println("Total Price: " + totalPrice);
        System.out.println("===============================");
        
        return totalPrice;
    }

    /**
     * Tạo mã booking reference
     */
    private String generateBookingReference() {
        return "BK" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    /**
     * Convert Booking entity to BookingResponse
     */
    private BookingResponse convertToResponse(Booking booking) {
        Room room = roomRepository.findById(booking.getRoomId()).orElse(null);
        
        return BookingResponse.builder()
                .bookingId(booking.getBookingId())
                .bookingReference(booking.getBookingReference())
                .roomId(booking.getRoomId())
                .roomNumber(room != null ? room.getRoomNumber() : null)
                .roomType(room != null ? room.getType() : null)
                .checkIn(booking.getCheckIn())
                .checkOut(booking.getCheckOut())
                .guests(booking.getGuests())
                .notes(booking.getNotes())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus())
                .createdAt(booking.getCreatedAt())
                .holdUntil(booking.getHoldUntil())
                .guestName(booking.getGuestName())
                .guestEmail(booking.getGuestEmail())
                .guestPhone(booking.getGuestPhone())
                // Thêm thông tin user nếu có
                .userName(booking.getUser() != null ? booking.getUser().getName() : null)
                .userEmail(booking.getUser() != null ? booking.getUser().getEmail() : null)
                // Thêm thông tin phòng
                .roomDescription(room != null ? room.getDescription() : null)
                .roomCapacity(room != null ? room.getCapacity() : null)
                .amenities(new java.util.ArrayList<>()) // TODO: Implement amenities
                .build();
    }

    /**
     * Lấy booking theo ID với authorization check
     */
    public Optional<BookingResponse> getUserBookingById(Long bookingId, String userEmail) {
        try {
            // Tìm booking theo ID
            Optional<Booking> booking = bookingRepository.findById(bookingId);
            if (booking.isEmpty()) {
                return Optional.empty();
            }

            Booking b = booking.get();
            
            // Kiểm tra authorization: booking phải thuộc về user hoặc là guest booking
            if (b.getUser() != null) {
                // User booking - kiểm tra email
                if (!b.getUser().getEmail().equals(userEmail)) {
                    return Optional.empty(); // Không có quyền truy cập
                }
            } else {
                // Guest booking - không cho phép user truy cập
                return Optional.empty();
            }

            return Optional.of(convertToResponse(b));
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy booking: " + e.getMessage());
        }
    }
}