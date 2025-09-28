package com.hotelhub.backend.service.impl;

import com.hotelhub.backend.dto.request.BookingRequest;
import com.hotelhub.backend.dto.response.BookingResponse;
import com.hotelhub.backend.entity.Booking;
import com.hotelhub.backend.entity.Room;
import com.hotelhub.backend.entity.User;
import com.hotelhub.backend.repository.BookingRepository;
import com.hotelhub.backend.repository.RoomRepository;
import com.hotelhub.backend.repository.UserRepository;
import com.hotelhub.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public BookingResponse createBooking(BookingRequest request, String email) {
        // Validate input
        validateBookingRequest(request);

        // Kiểm tra phòng có tồn tại và available
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + request.getRoomId()));

        if (!Boolean.TRUE.equals(room.getAvailable())) {
            throw new RuntimeException("Room is not available");
        }

        // Kiểm tra xem phòng có bị trùng lịch không
        List<String> activeStatuses = Arrays.asList("pending", "confirmed", "paid");
        long overlappingCount = bookingRepository.countOverlapping(
                request.getRoomId(),
                request.getCheckIn(),
                request.getCheckOut(),
                activeStatuses);

        if (overlappingCount > 0) {
            throw new RuntimeException("Room is already booked for the selected dates");
        }

        // Tạo booking
        Booking booking = new Booking();
        booking.setRoomId(request.getRoomId());
        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());
        booking.setGuests(request.getGuests());
        booking.setNotes(request.getNotes());

        // Tính total price nếu chưa có
        if (request.getTotalPrice() == null) {
            long nights = ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());
            double totalPrice = nights * room.getPrice();
            booking.setTotalPrice(java.math.BigDecimal.valueOf(totalPrice));
        } else {
            booking.setTotalPrice(request.getTotalPrice());
        }

        // Nếu có user login thì gán user, không thì lưu thông tin guest
        if (email != null && !email.isEmpty()) {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
            booking.setUser(user);
        } else {
            // Guest booking - lưu thông tin khách
            if (request.getGuestName() == null || request.getGuestEmail() == null) {
                throw new RuntimeException("Guest information (name, email) is required for guest booking");
            }
            booking.setGuestName(request.getGuestName());
            booking.setGuestEmail(request.getGuestEmail());
            booking.setGuestPhone(request.getGuestPhone());
        }

        // Đặt thời gian hold booking (15 phút)
        booking.setHoldUntil(LocalDateTime.now().plusMinutes(15));

        Booking savedBooking = bookingRepository.save(booking);
        return BookingResponse.fromEntity(savedBooking);
    }

    @Override
    public List<BookingResponse> getBookingsByUser(Long userId) {
        List<Booking> bookings = bookingRepository.findByUser_UserId(userId);
        return bookings.stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponse getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));
        return BookingResponse.fromEntity(booking);
    }

    @Override
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));

        if ("cancelled".equals(booking.getStatus())) {
            throw new RuntimeException("Booking is already cancelled");
        }

        if ("paid".equals(booking.getStatus())) {
            throw new RuntimeException("Cannot cancel paid booking");
        }

        booking.setStatus("cancelled");
        bookingRepository.save(booking);
    }

    private void validateBookingRequest(BookingRequest request) {
        if (request.getRoomId() == null) {
            throw new RuntimeException("Room ID is required");
        }

        if (request.getCheckIn() == null || request.getCheckOut() == null) {
            throw new RuntimeException("Check-in and check-out dates are required");
        }

        if (request.getCheckIn().isBefore(LocalDate.now())) {
            throw new RuntimeException("Check-in date must be in the future");
        }

        if (request.getCheckOut().isBefore(request.getCheckIn().plusDays(1))) {
            throw new RuntimeException("Check-out date must be at least 1 day after check-in");
        }

        if (request.getGuests() == null || request.getGuests() < 1) {
            throw new RuntimeException("Number of guests must be at least 1");
        }

        if (request.getGuests() > 10) {
            throw new RuntimeException("Maximum 10 guests allowed");
        }
    }
}