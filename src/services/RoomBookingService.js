// src/services/BookingService.js
import axios from "../api/axiosConfig";

const API_URL = "/api/bookings"; // adjust if backend runs elsewhere

class BookingService {
  // Create a new booking
  createBooking(booking, branchId, typeId) {
    return axios.post(API_URL, booking, {
      params: { branchId, typeId },
    });
  }

  // Get all bookings
  getAllBookings() {
    return axios.get(API_URL);
  }

  // Get booking by ID
  getBookingById(bookingId) {
    return axios.get(`${API_URL}/${bookingId}`);
  }

  // Get bookings by branch
  getBookingsByBranch(branchId) {
    return axios.get(`${API_URL}/branch/${branchId}`);
  }

  // Cancel booking
  cancelBooking(bookingId) {
    return axios.patch(`${API_URL}/${bookingId}/cancel`);
  }

  // Complete booking
  completeBooking(bookingId) {
    return axios.patch(`${API_URL}/${bookingId}/complete`);
  }

  // Update booking status based on payment
  updateBookingStatus(payment) {
    return axios.post(`${API_URL}/update-status`, payment);
  }
}

export default new BookingService();
