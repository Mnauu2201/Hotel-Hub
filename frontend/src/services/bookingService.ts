import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

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
    const response = await axios.get(`${API_BASE_URL}/rooms/available`, {
      params: { checkIn, checkOut }
    });
    return (response.data?.rooms as unknown[]) || [];
  },

  // Đặt phòng cho khách chưa đăng nhập
  createGuestBooking: async (bookingData: BookingCreateRequestGuest) => {
    const response = await axios.post<GuestBookingCreateResponse>(`${API_BASE_URL}/bookings/guest`, bookingData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  // Đặt phòng cho người dùng đã đăng nhập
  createUserBooking: async (bookingData: BookingCreateRequestUser) => {
    // Ensure token is available in the request
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data as BookingResponse | { booking: BookingResponse };
  },

  // Lấy danh sách booking của người dùng đã đăng nhập
  getUserBookings: async () => {
    // Ensure token is available in the request
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    const response = await axios.get(`${API_BASE_URL}/bookings`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return (response.data?.bookings as BookingResponse[]) || [];
  },

  // Lấy thông tin phòng theo ID
  getRoomById: async (roomId: number | string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/rooms/${roomId}`);
      return response.data?.room || response.data;
    } catch (error) {
      console.error('Error fetching room:', error);
      throw error;
    }
  },

  // Lấy chi tiết booking theo ID (cho người dùng đã đăng nhập)
  getUserBookingById: async (bookingId: number | string) => {
    // Ensure token is available in the request
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    const response = await axios.get(`${API_BASE_URL}/bookings/user/${bookingId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data as BookingResponse;
  },

  // Hủy booking
  cancelBooking: async (bookingId: number | string) => {
    // Ensure token is available in the request
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    const response = await axios.put(`${API_BASE_URL}/bookings/user/${bookingId}/cancel`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data as { message: string };
  }
};

export default bookingService;


