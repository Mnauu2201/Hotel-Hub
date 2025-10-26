package com.hotelhub.backend.service;

import com.hotelhub.backend.dto.request.GuestBookingRequest;
import com.hotelhub.backend.dto.request.UserBookingRequest;
import com.hotelhub.backend.dto.response.BookingResponse;
import com.hotelhub.backend.entity.Booking;
import com.hotelhub.backend.entity.Room;
import com.hotelhub.backend.entity.RoomStatus;
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
    
    @Autowired
    private NotificationService notificationService;

    /**
     * Tạo booking cho guest (không cần login)
     */
    public BookingResponse createGuestBooking(GuestBookingRequest request) {
        // Kiểm tra phòng có trống không
        if (!roomRepository.isRoomAvailable(request.getRoomId(), request.getCheckIn(), request.getCheckOut())) {
            throw new RuntimeException("Phòng không còn trống trong khoảng thời gian này");
        }

        // Kiểm tra trùng lặp booking bổ sung
        List<Booking> existingBookings = bookingRepository.findByRoomIdAndStatusInAndDateRange(
            request.getRoomId(), 
            java.util.Arrays.asList("pending", "confirmed", "paid", "completed"),
            request.getCheckIn(), 
            request.getCheckOut()
        );
        
        if (!existingBookings.isEmpty()) {
            throw new RuntimeException("Phòng đã được đặt trong khoảng thời gian này. Vui lòng chọn phòng khác hoặc thời gian khác.");
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

        // Cập nhật room status khi có booking
        room.setStatus(RoomStatus.BOOKED);
        roomRepository.save(room);


        // Ghi log hoạt động
        activityLogService.logSystemActivity("CREATE_GUEST_BOOKING", 
            "Guest booking created: " + booking.getBookingReference() + 
            " for room " + booking.getRoomId() + 
            " from " + booking.getCheckIn() + " to " + booking.getCheckOut());

        // Tạo thông báo cho admin
        notificationService.createAdminNotification("GUEST_BOOKING_CREATED", 
            "New guest booking: " + booking.getBookingReference() + " for room " + room.getRoomNumber(), 
            "/admin/bookings/" + booking.getBookingId());



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

        // Kiểm tra trùng lặp booking bổ sung
        List<Booking> existingBookings = bookingRepository.findByRoomIdAndStatusInAndDateRange(
            request.getRoomId(), 
            java.util.Arrays.asList("pending", "confirmed", "paid", "completed"),
            request.getCheckIn(), 
            request.getCheckOut()
        );
        
        if (!existingBookings.isEmpty()) {
            throw new RuntimeException("Phòng đã được đặt trong khoảng thời gian này. Vui lòng chọn phòng khác hoặc thời gian khác.");
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

        // Cập nhật room status khi có booking
        room.setStatus(RoomStatus.BOOKED);
        roomRepository.save(room);

        // Ghi log thao tác
        activityLogService.logActivity(user.getUserId().intValue(), "CREATE_USER_BOOKING", 
            "User booking created: " + booking.getBookingReference() + 
            " for room " + booking.getRoomId() + 
            " from " + booking.getCheckIn() + " to " + booking.getCheckOut());

        // Tạo thông báo cho user
        String dates = String.format("%s to %s", request.getCheckIn(), request.getCheckOut());
        notificationService.createBookingNotification(user.getUserId().intValue(), "BOOKING_CREATED", 
            booking.getBookingReference(), room.getRoomNumber(), dates);

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
        activityLogService.logSystemActivity("CANCEL_BOOKING", 
            "Booking " + booking.getBookingReference() + " cancelled by user: " + userEmail);

        return convertToResponse(booking);
    }

    /**
     * Hủy booking cho guest (không cần login)
     */
    public BookingResponse cancelGuestBooking(Long bookingId) {
        try {
            System.out.println("Starting guest cancel booking for ID: " + bookingId);
            
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));

            System.out.println("Found booking: " + booking.getBookingReference() + ", status: " + booking.getStatus());

            // Chỉ cho phép hủy booking của guest (không có user)
            if (booking.getUser() != null) {
                throw new RuntimeException("Booking này thuộc về user đã đăng nhập, không thể hủy từ guest");
            }

            // Chỉ cho phép hủy booking trong trạng thái pending
            if (!"pending".equals(booking.getStatus())) {
                throw new RuntimeException("Chỉ có thể hủy booking đang chờ xử lý");
            }

            booking.setStatus("cancelled");
            booking = bookingRepository.save(booking);
            System.out.println("Booking status updated to cancelled");

            // Cập nhật trạng thái phòng về AVAILABLE
            Room room = roomRepository.findById(booking.getRoomId()).orElse(null);
            if (room != null) {
                room.setStatus(RoomStatus.AVAILABLE);
                roomRepository.save(room);
                System.out.println("Room status updated to AVAILABLE");
            }

            // Ghi log thao tác
            activityLogService.logSystemActivity("GUEST_CANCEL_BOOKING", 
                "Guest booking " + booking.getBookingReference() + " cancelled by guest");

            System.out.println("Converting to response...");
            BookingResponse response = convertToResponse(booking);
            System.out.println("Guest booking cancelled successfully: " + response.getBookingReference());
            return response;
        } catch (Exception e) {
            System.out.println("Error in cancelGuestBooking: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
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
        activityLogService.logSystemActivity("CONFIRM_BOOKING",
            "Booking " + booking.getBookingReference() + " confirmed by user: " + userEmail);

        return convertToResponse(booking);
    }

    /**
     * Cập nhật trạng thái booking (Admin only)
     */
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
        
        // Cập nhật room status dựa trên booking status
        Room room = roomRepository.findById(booking.getRoomId()).orElse(null);
        if (room != null) {
            if ("confirmed".equals(newStatus) || "paid".equals(newStatus)) {
                // Booking được xác nhận hoặc thanh toán → phòng BOOKED
                room.setStatus(RoomStatus.BOOKED);
            } else if ("cancelled".equals(newStatus) || "refunded".equals(newStatus)) {
                // Booking bị hủy hoặc hoàn tiền → phòng AVAILABLE
                room.setStatus(RoomStatus.AVAILABLE);
            }
            roomRepository.save(room);
        }
        
        booking = bookingRepository.save(booking);

        // Ghi log thao tác
        activityLogService.logSystemActivity("UPDATE_BOOKING_STATUS", 
            "Booking " + booking.getBookingReference() + " changed from " + oldStatus + " to " + newStatus + " by admin: " + adminEmail);

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