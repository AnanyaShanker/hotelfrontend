import axios from '../api/axiosConfig';

const API_BASE = '/api/payments';

/**
 * Payment Service
 * Handles all payment-related API calls
 */
const paymentService = {
  /**
   * Process a new payment
   * @param {Object} paymentData - Payment information
   * @returns {Promise} Payment result
   */
  processPayment: async (paymentData) => {
    try {
      const response = await axios.post(`${API_BASE}/pay-now`, paymentData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Payment failed. Please try again.',
        data: error.response?.data
      };
    }
  },

  /**
   * Get payment history for a customer
   * @param {number} customerId - Customer ID
   * @returns {Promise} Array of payments
   */
  getPaymentHistory: async (customerId) => {
    try {
      const response = await axios.get(`${API_BASE}/customer/${customerId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to load payment history'
      };
    }
  },

  /**
   * Get payment by room booking ID
   * @param {number} bookingId - Room booking ID
   * @returns {Promise} Payment details
   */
  getPaymentByBooking: async (bookingId) => {
    try {
      const response = await axios.get(`${API_BASE}/booking/${bookingId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching payment:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Payment not found'
      };
    }
  },

  /**
   * Get payment by facility booking ID
   * @param {number} facilityBookingId - Facility booking ID
   * @returns {Promise} Payment details
   */
  getPaymentByFacilityBooking: async (facilityBookingId) => {
    try {
      const response = await axios.get(`${API_BASE}/facility-booking/${facilityBookingId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching payment:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Payment not found'
      };
    }
  },

  /**
   * Retry a failed payment
   * @param {Object} retryData - Retry payment information
   * @returns {Promise} Payment result
   */
  retryPayment: async (retryData) => {
    const paymentData = {
      bookingId: retryData.bookingType === 'room' ? retryData.bookingId : null,
      facilityBookingId: retryData.bookingType === 'facility' ? retryData.bookingId : null,
      customerId: retryData.customerId,
      amountPaid: retryData.amount,
      paymentMethod: retryData.paymentMethod,
      notes: 'Retry payment attempt'
    };
    return await paymentService.processPayment(paymentData);
  }
};

export default paymentService;

