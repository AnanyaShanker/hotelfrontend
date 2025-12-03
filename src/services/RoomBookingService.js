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

  // Get bookings by customer ID
  getBookingsByCustomer(customerId) {
<<<<<<< HEAD
    return axios.get(`${API_URL}/customer/${customerId}`);
  }

  // Get booking details with full information
  getBookingDetails(bookingId) {
    return axios.get(`${API_URL}/${bookingId}/details`);
=======
    console.log('🔄 Fetching room bookings for customer:', customerId);

    // Try the ideal endpoint first
    return axios.get(`${API_URL}/customer/${customerId}`)
      .then(response => {
        console.log('✅ Room bookings endpoint exists! Returned:', response.data?.length || 0, 'bookings');
        return response;
      })
      .catch(err => {
        const status = err.response?.status;

        // Handle different error cases
        if (status === 404) {
          console.warn('⚠️ /customer/{id} endpoint not found (404)');
          console.log('💡 Trying workaround: Fetch all bookings and filter...');

          // WORKAROUND: Try to get ALL bookings and filter on frontend
          return this.getAllBookings()
            .then(response => {
              const allBookings = response.data || [];
              console.log('📊 Fetched all bookings:', allBookings.length);

              // Filter by customer ID
              const customerBookings = allBookings.filter(
                booking => booking.customerId === customerId
              );

              console.log('✅ Filtered to customer bookings:', customerBookings.length);
              return { data: customerBookings };
            })
            .catch(fallbackErr => {
              console.error('❌ Fallback also failed:', fallbackErr.message);
              console.log('ℹ️ Returning empty array - room bookings will not show');
              return { data: [] };
            });
        } else if (status === 401 || status === 403) {
          console.error('❌ Authentication error for room bookings:', status);
          console.log('ℹ️ User may need to re-login');
          return { data: [] };
        } else {
          console.error('❌ Unexpected error fetching room bookings:', err.message);
          console.log('ℹ️ Status:', status);
          return { data: [] };
        }
      });
  }

  // Get booking details with full information
  // NOTE: Backend endpoint /api/bookings/{id}/details needs to be added
  // For now, fallback to basic booking info
  getBookingDetails(bookingId) {
    return axios.get(`${API_URL}/${bookingId}/details`)
      .catch(err => {
        console.warn("Booking details endpoint not implemented, using basic booking:", err.message);
        // Fallback to basic booking endpoint
        return this.getBookingById(bookingId);
      });
>>>>>>> 0b0b86626b6bf433af9f183b5cccf7fc0a147feb
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
