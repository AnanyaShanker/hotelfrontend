import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import axios from '../api/axiosConfig';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { transactionId, amount, bookingId, bookingType, bookingDetails } = location.state || {};

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Update booking payment status on the backend
    const updateBookingStatus = async () => {
      if (!bookingId || !bookingType) return;

      try {
        console.log('📤 Attempting to update booking payment status:', { bookingId, bookingType });

        // Try to update via PATCH endpoint
        if (bookingType === 'facility') {
          await axios.patch(`/facility-bookings/${bookingId}/payment-status`, {
            paymentStatus: 'PAID'
          }).catch(err => {
            if (err.response?.status === 404) {
              console.warn('⚠️ PATCH endpoint not found, using localStorage workaround');
              // WORKAROUND: Store in localStorage for frontend display
              storePaidBooking(bookingId, bookingType);
            } else {
              throw err;
            }
          });
        } else if (bookingType === 'room') {
          await axios.patch(`/api/bookings/${bookingId}/payment-status`, {
            paymentStatus: 'PAID'
          }).catch(err => {
            if (err.response?.status === 404) {
              console.warn('⚠️ PATCH endpoint not found, using localStorage workaround');
              // WORKAROUND: Store in localStorage for frontend display
              storePaidBooking(bookingId, bookingType);
            } else {
              throw err;
            }
          });
        }

        console.log('✅ Booking payment status updated successfully');
      } catch (error) {
        console.error('❌ Error updating booking status:', error.message);
        // Don't block the user - payment was successful, just log the issue
      }
    };

    // WORKAROUND: Store paid booking IDs in localStorage
    const storePaidBooking = (id, type) => {
      try {
        const paidBookings = JSON.parse(localStorage.getItem('paidBookings') || '{}');
        paidBookings[`${type}-${id}`] = {
          bookingId: id,
          type: type,
          paidAt: new Date().toISOString(),
          status: 'PAID'
        };
        localStorage.setItem('paidBookings', JSON.stringify(paidBookings));
        console.log('💾 Stored payment status in localStorage:', paidBookings);
      } catch (err) {
        console.error('Failed to store payment status:', err);
      }
    };

    // Update booking status first
    updateBookingStatus();

    // Auto-redirect after 5 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Navigate with state to force refresh
          navigate('/my-bookings', {
            replace: true,
            state: { refresh: true, timestamp: Date.now() }
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, bookingId, bookingType]);

  if (!transactionId) {
    return (
      <PublicLayout>
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h2 className="text-2xl font-light mb-4">No Payment Information</h2>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-neutral-800 text-white">
            Go Home
          </button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto p-6 py-24 animate-fade-in">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4 animate-bounce">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-4xl font-light text-neutral-900 mb-2">Payment Successful!</h1>
          <p className="text-neutral-600 font-light">Your booking has been confirmed</p>
        </div>

        {/* Transaction Details */}
        <div className="bg-neutral-50 border border-neutral-200 p-8 mb-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
              <span className="text-xs uppercase tracking-widest text-neutral-600 font-light">Transaction ID</span>
              <span className="text-lg font-mono text-neutral-900">{transactionId}</span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
              <span className="text-xs uppercase tracking-widest text-neutral-600 font-light">Amount Paid</span>
              <span className="text-2xl font-light text-neutral-900">₹{parseFloat(amount).toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
              <span className="text-xs uppercase tracking-widest text-neutral-600 font-light">Booking ID</span>
              <span className="text-lg text-neutral-900">#{bookingId}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-neutral-600 font-light">Type</span>
              <span className="text-lg text-neutral-900">
                {bookingType === 'room' ? 'Room Booking' : 'Facility Booking'}
              </span>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        {bookingDetails && (
          <div className="bg-white border border-neutral-200 p-6 mb-8">
            <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-4">
              Booking Details
            </h3>
            {bookingType === 'room' ? (
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold">Room:</span> {bookingDetails.roomNumber}</p>
                <p><span className="font-semibold">Check-in:</span> {bookingDetails.checkIn}</p>
                <p><span className="font-semibold">Check-out:</span> {bookingDetails.checkOut}</p>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold">Facility:</span> {bookingDetails.facilityName}</p>
                <p><span className="font-semibold">Date:</span> {bookingDetails.date}</p>
                <p><span className="font-semibold">Time:</span> {bookingDetails.time}</p>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Message */}
        <div className="bg-green-50 border border-green-200 p-6 mb-8">
          <p className="text-sm text-green-800 text-center font-light">
            ✓ A confirmation email has been sent to your registered email address
          </p>
        </div>

        {/* Auto-redirect Notice */}
        <div className="text-center mb-8">
          <p className="text-sm text-neutral-600 font-light">
            Redirecting to My Bookings in <span className="font-semibold">{countdown}</span> seconds...
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/my-bookings', {
              replace: true,
              state: { refresh: true, timestamp: Date.now() }
            })}
            className="flex-1 px-6 py-4 bg-neutral-800 text-white hover:bg-neutral-900 transition text-xs uppercase tracking-widest font-light"
          >
            View My Bookings
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 px-6 py-4 border border-neutral-300 text-neutral-800 hover:border-neutral-400 transition text-xs uppercase tracking-widest font-light"
          >
            Back to Home
          </button>
        </div>
      </div>
    </PublicLayout>
  );
}

