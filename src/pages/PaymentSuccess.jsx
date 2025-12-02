import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { transactionId, amount, bookingId, bookingType, bookingDetails } = location.state || {};

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/my-facility-bookings');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

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
            onClick={() => navigate('/my-facility-bookings')}
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

