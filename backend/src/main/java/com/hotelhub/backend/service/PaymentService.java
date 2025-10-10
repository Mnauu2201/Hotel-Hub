package com.hotelhub.backend.service;

import com.hotelhub.backend.dto.request.PaymentRequest;
import com.hotelhub.backend.dto.request.UpdatePaymentStatusRequest;
import com.hotelhub.backend.dto.response.PaymentResponse;
import com.hotelhub.backend.entity.Booking;
import com.hotelhub.backend.entity.Payment;
import com.hotelhub.backend.entity.Room;
import com.hotelhub.backend.entity.User;
import com.hotelhub.backend.repository.BookingRepository;
import com.hotelhub.backend.repository.PaymentRepository;
import com.hotelhub.backend.repository.RoomRepository;
import com.hotelhub.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityLogService activityLogService;

    /**
     * Tạo payment cho booking
     */
    public PaymentResponse createPayment(PaymentRequest request, String userEmail) {
        // Lấy booking
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));

        // Kiểm tra quyền truy cập booking - chỉ cho phép user booking
        if (booking.getUser() == null) {
            throw new RuntimeException("Booking này là guest booking, vui lòng sử dụng API guest payment");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
        
        // Cho phép user tạo payment cho chính mình hoặc Admin tạo payment cho bất kỳ ai
        boolean isOwner = booking.getUser().getUserId().equals(user.getUserId());
        boolean isAdmin = user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_ADMIN"));
        
        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Bạn không có quyền tạo payment cho booking này");
        }

        // Kiểm tra booking có thể thanh toán không
        if (!"confirmed".equals(booking.getStatus()) && !"pending".equals(booking.getStatus())) {
            throw new RuntimeException("Booking không thể thanh toán. Trạng thái hiện tại: " + booking.getStatus());
        }

        // Kiểm tra đã có payment chưa
        Optional<Payment> existingPayment = paymentRepository.findByBookingBookingId(booking.getBookingId());
        if (existingPayment.isPresent()) {
            throw new RuntimeException("Booking này đã có payment");
        }

        // Kiểm tra số tiền
        if (request.getAmount().compareTo(booking.getTotalPrice()) != 0) {
            throw new RuntimeException("Số tiền thanh toán không khớp với tổng tiền booking");
        }

        // Tạo payment
        Payment payment = Payment.builder()
                .booking(booking)
                .amount(request.getAmount())
                .method(request.getMethod())
                .status(Payment.PaymentStatus.pending)
                .build();

        payment = paymentRepository.save(payment);

        // Ghi log
        activityLogService.logActivity(userEmail, "CREATE_PAYMENT", 
            "Payment created for booking " + booking.getBookingReference() + 
            " with amount " + request.getAmount() + 
            " using method " + request.getMethod());

        return convertToResponse(payment);
    }

    /**
     * Tạo payment cho guest booking (không cần authentication)
     */
    public PaymentResponse createGuestPayment(PaymentRequest request, String guestEmail) {
        // Lấy booking
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));

        // Kiểm tra quyền truy cập (guest booking)
        if (booking.getUser() != null) {
            throw new RuntimeException("Booking này thuộc về user, không phải guest booking");
        }

        if (!booking.getGuestEmail().equals(guestEmail)) {
            throw new RuntimeException("Bạn không có quyền tạo payment cho booking này");
        }

        // Kiểm tra booking có thể thanh toán không
        if (!"confirmed".equals(booking.getStatus()) && !"pending".equals(booking.getStatus())) {
            throw new RuntimeException("Booking không thể thanh toán. Trạng thái hiện tại: " + booking.getStatus());
        }

        // Kiểm tra đã có payment chưa
        Optional<Payment> existingPayment = paymentRepository.findByBookingBookingId(booking.getBookingId());
        if (existingPayment.isPresent()) {
            throw new RuntimeException("Booking này đã có payment");
        }

        // Kiểm tra số tiền
        if (request.getAmount().compareTo(booking.getTotalPrice()) != 0) {
            throw new RuntimeException("Số tiền thanh toán không khớp với tổng tiền booking");
        }

        // Tạo payment
        Payment payment = Payment.builder()
                .booking(booking)
                .amount(request.getAmount())
                .method(request.getMethod())
                .status(Payment.PaymentStatus.pending)
                .build();

        payment = paymentRepository.save(payment);

        // Ghi log
        activityLogService.logSystemActivity("CREATE_GUEST_PAYMENT", 
            "Guest payment created for booking " + booking.getBookingReference() + 
            " with amount " + request.getAmount() + 
            " using method " + request.getMethod());

        return convertToResponse(payment);
    }

    /**
     * Lấy payment theo booking ID
     */
    public Optional<PaymentResponse> getPaymentByBookingId(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));

        // Kiểm tra quyền truy cập - chỉ cho phép user booking
        if (booking.getUser() == null) {
            return Optional.empty(); // Guest booking không được truy cập qua user API
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
        if (!booking.getUser().getUserId().equals(user.getUserId())) {
            return Optional.empty();
        }

        return paymentRepository.findByBookingBookingId(bookingId)
                .map(this::convertToResponse);
    }

    /**
     * Lấy payment theo booking reference
     */
    public Optional<PaymentResponse> getPaymentByBookingReference(String bookingReference, String userEmail) {
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));

        // Kiểm tra quyền truy cập - chỉ cho phép user booking
        if (booking.getUser() == null) {
            return Optional.empty(); // Guest booking không được truy cập qua user API
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
        if (!booking.getUser().getUserId().equals(user.getUserId())) {
            return Optional.empty();
        }

        return paymentRepository.findByBookingReference(bookingReference)
                .map(this::convertToResponse);
    }

    /**
     * Lấy payment theo booking reference cho guest
     */
    public Optional<PaymentResponse> getGuestPaymentByBookingReference(String bookingReference, String guestEmail) {
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));

        // Kiểm tra quyền truy cập - chỉ cho phép guest booking
        if (booking.getUser() != null) {
            return Optional.empty(); // User booking không được truy cập qua guest API
        }

        if (!booking.getGuestEmail().equals(guestEmail)) {
            return Optional.empty();
        }

        return paymentRepository.findByBookingReference(bookingReference)
                .map(this::convertToResponse);
    }

    /**
     * Lấy danh sách payments của user
     */
    public List<PaymentResponse> getUserPayments(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        return paymentRepository.findByUserId(user.getUserId())
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lấy danh sách payments của guest
     */
    public List<PaymentResponse> getGuestPayments(String guestEmail) {
        return paymentRepository.findByGuestEmail(guestEmail)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Cập nhật trạng thái payment
     */
    public PaymentResponse updatePaymentStatus(Long paymentId, UpdatePaymentStatusRequest request, String userEmail) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment không tồn tại"));

        // Kiểm tra quyền truy cập - chỉ cho phép user payment
        if (payment.getBooking().getUser() == null) {
            throw new RuntimeException("Payment này thuộc về guest booking, vui lòng sử dụng API guest payment");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
        
        // Cho phép user cập nhật payment của chính mình hoặc Staff/Admin cập nhật payment của bất kỳ ai
        boolean isOwner = payment.getBooking().getUser().getUserId().equals(user.getUserId());
        boolean isStaffOrAdmin = user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_STAFF") || role.getName().equals("ROLE_ADMIN"));
        
        if (!isOwner && !isStaffOrAdmin) {
            throw new RuntimeException("Bạn không có quyền cập nhật payment này");
        }

        Payment.PaymentStatus oldStatus = payment.getStatus();
        payment.setStatus(request.getStatus());

        // Nếu chuyển sang SUCCESS, cập nhật paidAt và booking status
        if (request.getStatus() == Payment.PaymentStatus.success) {
            payment.setPaidAt(LocalDateTime.now());
            
            // Cập nhật booking status thành "paid"
            Booking booking = payment.getBooking();
            booking.setStatus("paid");
            bookingRepository.save(booking);
        }

        payment = paymentRepository.save(payment);

        // Ghi log
        activityLogService.logActivity(userEmail, "UPDATE_PAYMENT_STATUS", 
            "Payment " + payment.getPaymentId() + " status changed from " + oldStatus + " to " + request.getStatus());

        return convertToResponse(payment);
    }

    /**
     * Xử lý thanh toán (simulate payment processing)
     */
    public PaymentResponse processPayment(Long paymentId, String userEmail) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment không tồn tại"));

        // Kiểm tra quyền truy cập - chỉ cho phép user payment
        if (payment.getBooking().getUser() == null) {
            throw new RuntimeException("Payment này thuộc về guest booking, vui lòng sử dụng API guest payment");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
        
        // Cho phép user xử lý payment của chính mình hoặc Staff/Admin xử lý payment của bất kỳ ai
        boolean isOwner = payment.getBooking().getUser().getUserId().equals(user.getUserId());
        boolean isStaffOrAdmin = user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_STAFF") || role.getName().equals("ROLE_ADMIN"));
        
        if (!isOwner && !isStaffOrAdmin) {
            throw new RuntimeException("Bạn không có quyền xử lý payment này");
        }

        // Kiểm tra payment có thể xử lý không
        if (payment.getStatus() != Payment.PaymentStatus.pending) {
            throw new RuntimeException("Payment không thể xử lý. Trạng thái hiện tại: " + payment.getStatus());
        }

        // Simulate payment processing
        // Trong thực tế, đây sẽ là nơi tích hợp với payment gateway
        boolean paymentSuccess = simulatePaymentProcessing(payment);

        if (paymentSuccess) {
            payment.setStatus(Payment.PaymentStatus.success);
            payment.setPaidAt(LocalDateTime.now());
            
            // Cập nhật booking status
            Booking booking = payment.getBooking();
            booking.setStatus("paid");
            bookingRepository.save(booking);
        } else {
            payment.setStatus(Payment.PaymentStatus.failed);
        }

        payment = paymentRepository.save(payment);

        // Ghi log
        activityLogService.logActivity(userEmail, "PROCESS_PAYMENT", 
            "Payment " + payment.getPaymentId() + " processed with result: " + payment.getStatus());

        return convertToResponse(payment);
    }

    /**
     * Xử lý thanh toán cho guest (không cần authentication)
     */
    public PaymentResponse processGuestPayment(Long paymentId, String guestEmail) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment không tồn tại"));

        // Kiểm tra quyền truy cập - chỉ cho phép guest payment
        if (payment.getBooking().getUser() != null) {
            throw new RuntimeException("Payment này thuộc về user booking, vui lòng sử dụng API user payment");
        }

        if (!payment.getBooking().getGuestEmail().equals(guestEmail)) {
            throw new RuntimeException("Bạn không có quyền xử lý payment này");
        }

        // Kiểm tra payment có thể xử lý không
        if (payment.getStatus() != Payment.PaymentStatus.pending) {
            throw new RuntimeException("Payment không thể xử lý. Trạng thái hiện tại: " + payment.getStatus());
        }

        // Simulate payment processing
        boolean paymentSuccess = simulatePaymentProcessing(payment);

        if (paymentSuccess) {
            payment.setStatus(Payment.PaymentStatus.success);
            payment.setPaidAt(LocalDateTime.now());
            
            // Cập nhật booking status
            Booking booking = payment.getBooking();
            booking.setStatus("paid");
            bookingRepository.save(booking);
        } else {
            payment.setStatus(Payment.PaymentStatus.failed);
        }

        payment = paymentRepository.save(payment);

        // Ghi log
        activityLogService.logSystemActivity("PROCESS_GUEST_PAYMENT", 
            "Guest payment " + payment.getPaymentId() + " processed with result: " + payment.getStatus());

        return convertToResponse(payment);
    }

    /**
     * Simulate payment processing
     * Trong thực tế, đây sẽ là nơi tích hợp với payment gateway như Stripe, PayPal, MoMo, etc.
     */
    private boolean simulatePaymentProcessing(Payment payment) {
        // Simulate 90% success rate
        return Math.random() > 0.1;
    }

    /**
     * Convert Payment entity to PaymentResponse
     */
    private PaymentResponse convertToResponse(Payment payment) {
        Booking booking = payment.getBooking();
        Room room = roomRepository.findById(booking.getRoomId()).orElse(null);

        return PaymentResponse.builder()
                .paymentId(payment.getPaymentId())
                .bookingId(booking.getBookingId())
                .bookingReference(booking.getBookingReference())
                .amount(payment.getAmount())
                .method(payment.getMethod())
                .status(payment.getStatus())
                .paidAt(payment.getPaidAt())
                .createdAt(payment.getCreatedAt())
                .guestName(booking.getGuestName())
                .guestEmail(booking.getGuestEmail())
                .roomNumber(room != null ? room.getRoomNumber() : null)
                .roomType(room != null ? room.getType() : null)
                .checkIn(booking.getCheckIn().atStartOfDay())
                .checkOut(booking.getCheckOut().atStartOfDay())
                .guests(booking.getGuests())
                .build();
    }
}
