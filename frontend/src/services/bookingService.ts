import api from './api';

export type BookingCreateRequestGuest = {
  roomId: number | string;
  checkIn: string; // ISO date (YYYY-MM-DD)
  checkOut: string; // ISO date (YYYY-MM-DD)
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  notes?: string;
};

export type BookingCreateRequestUser = {
  roomId: number | string;
  checkIn: string; // ISO date (YYYY-MM-DD)
  checkOut: string; // ISO date (YYYY-MM-DD)
  guests: number;
  notes?: string;
};

export type BookingResponse = {
  bookingId?: number;
  bookingReference: string;
  roomId?: number;
  roomNumber?: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalPrice?: number;
};

export type GuestBookingCreateResponse = {
  message?: string;
  booking: BookingResponse;
};

const bookingService = {
  // Lấy danh sách phòng có sẵn
  getAvailableRooms: async (checkIn: string, checkOut: string) => {
    const response = await api.get('/rooms/available', {
      params: { checkIn, checkOut }
    });
    return (response.data?.rooms as unknown[]) || [];
  },

  // Đặt phòng cho khách chưa đăng nhập
  createGuestBooking: async (bookingData: BookingCreateRequestGuest) => {
    const response = await api.post<GuestBookingCreateResponse>('/bookings/guest', bookingData);
    return response.data;
  },

  // Đặt phòng cho người dùng đã đăng nhập
  createUserBooking: async (bookingData: BookingCreateRequestUser) => {
    const response = await api.post('/bookings', bookingData);
    return response.data as BookingResponse | { booking: BookingResponse };
  },

  // Lấy danh sách booking của người dùng đã đăng nhập
  getUserBookings: async () => {
    const response = await api.get('/bookings');
    return (response.data?.bookings as BookingResponse[]) || [];
  },

  // Lấy chi tiết booking theo ID (cho người dùng đã đăng nhập)
  getUserBookingById: async (bookingId: number | string) => {
    const response = await api.get(`/bookings/user/${bookingId}`);
    return response.data as BookingResponse;
  },

  // Hủy booking
  cancelBooking: async (bookingId: number | string) => {
    const response = await api.put(`/bookings/user/${bookingId}/cancel`);
    return response.data as { message: string };
  }
};

export default bookingService;


