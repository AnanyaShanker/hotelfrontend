import { useState, useCallback } from 'react';
import paymentService from '../services/PaymentService';
import { useAuth } from "../hooks/useAuth";

/**
 * Custom hook for payment operations
 * Manages payment state and provides payment functions
 */
export const usePayment = () => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const { user } = useAuth();

  /**
   * Process a payment
   * @param {Object} bookingData - Booking information
   * @param {string} paymentMethod - Selected payment method
   * @returns {Promise} Payment result
   */
  const processPayment = useCallback(async (bookingData, paymentMethod) => {
    setProcessing(true);
    setError(null);
    setPaymentResult(null);

    try {
      // Validate inputs
      if (!bookingData || !bookingData.bookingId || !bookingData.amount) {
        throw new Error('Invalid booking data');
      }

      if (!paymentMethod) {
        throw new Error('Please select a payment method');
      }

      if (!user || !user.userId) {
        throw new Error('User not authenticated');
      }

      // Prepare payment data
      const paymentData = {
        bookingId: bookingData.type === 'room' ? bookingData.bookingId : null,
        facilityBookingId: bookingData.type === 'facility' ? bookingData.bookingId : null,
        customerId: user.userId,
        amountPaid: parseFloat(bookingData.amount),
        paymentMethod: paymentMethod,
        notes: `Payment for ${bookingData.type} booking #${bookingData.bookingId}`
      };

      console.log('Processing payment:', paymentData);

      const result = await paymentService.processPayment(paymentData);

      if (result.success && result.data.success) {
        setPaymentResult(result.data);
        return {
          success: true,
          data: result.data
        };
      } else {
        const errorMsg = result.error || result.data?.message || 'Payment failed';
        setError(errorMsg);
        setPaymentResult(result.data);
        return {
          success: false,
          error: errorMsg,
          data: result.data
        };
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      const errorMsg = err.message || 'Payment processing failed. Please try again.';
      setError(errorMsg);
      return {
        success: false,
        error: errorMsg
      };
    } finally {
      setProcessing(false);
    }
  }, [user]);

  /**
   * Retry a failed payment
   */
  const retryPayment = useCallback(async (bookingData, newPaymentMethod) => {
    return await processPayment(bookingData, newPaymentMethod);
  }, [processPayment]);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Clear payment result
   */
  const clearResult = useCallback(() => {
    setPaymentResult(null);
  }, []);

  return {
    processing,
    error,
    paymentResult,
    processPayment,
    retryPayment,
    clearError,
    clearResult
  };
};

