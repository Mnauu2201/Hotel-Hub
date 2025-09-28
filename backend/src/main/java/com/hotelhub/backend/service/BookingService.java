package com.hotelhub.backend.service;

import com.hotelhub.backend.dto.request.BookingRequest;
import com.hotelhub.backend.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {
    // BookingResponse createBooking(BookingRequest request);
    BookingResponse createBooking(BookingRequest request, String email);

    List<BookingResponse> getBookingsByUser(Long userId);

    BookingResponse getBookingById(Long bookingId);

    void cancelBooking(Long bookingId);
}
