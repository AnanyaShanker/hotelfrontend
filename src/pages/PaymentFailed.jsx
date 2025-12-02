import { useNavigate, useLocation } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';

export default function PaymentFailed() {
  const navigate = useNavigate();
  const location = useLocation();
  const { transactionId, error, bookingId, bookingType, amount, bookingDetails } = location.state || {};

  const handleTryAgain = () => {
    navigate(`/payment/${bookingType}/${bookingId}`, {
      state: {
        bookingType,
        bookingId,
        amount,
        bookingDetails
      }
    });
  };

  const handleContactSupport = () => {
    navigate('/feedback');
  };

  if (!bookingId) {
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
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h1 className="text-4xl font-light text-neutral-900 mb-2">Payment Failed</h1>
          <p className="text-neutral-600 font-light">We couldn't process your payment</p>
        </div>

        {/* Error Details */}
        <div className="bg-red-50 border border-red-200 p-6 mb-8">
          <h3 className="text-xs uppercase tracking-widest text-red-800 font-semibold mb-2">
            Error Details
          </h3>
          <p className="text-sm text-red-700">
            {error || 'Payment processing failed. This might be due to insufficient funds, network issues, or temporary service unavailability.'}
          </p>
          {transactionId && (
            <p className="text-xs text-red-600 mt-3 font-mono">
              Reference ID: {transactionId}
            </p>
          )}
        </div>

        {/* Booking Information */}
        <div className="bg-neutral-50 border border-neutral-200 p-6 mb-8">
          <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-4">
            Booking Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Booking ID</span>
              <span className="text-neutral-900 font-semibold">#{bookingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Type</span>
              <span className="text-neutral-900">{bookingType === 'room' ? 'Room' : 'Facility'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Amount</span>
              <span className="text-neutral-900 font-semibold">₹{parseFloat(amount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-yellow-50 border border-yellow-200 p-6 mb-8">
          <h3 className="text-xs uppercase tracking-widest text-yellow-800 font-semibold mb-3">
            What You Can Do
          </h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Try again with the same or different payment method</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Check your account balance and limits</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Ensure stable internet connection</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Contact your bank if the issue persists</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleTryAgain}
            className="w-full px-6 py-4 bg-neutral-800 text-white hover:bg-neutral-900 transition text-xs uppercase tracking-widest font-light"
          >
            Try Again
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/my-facility-bookings')}
              className="px-6 py-3 border border-neutral-300 text-neutral-800 hover:border-neutral-400 transition text-xs uppercase tracking-widest font-light"
            >
              My Bookings
            </button>
            <button
              onClick={handleContactSupport}
              className="px-6 py-3 border border-neutral-300 text-neutral-800 hover:border-neutral-400 transition text-xs uppercase tracking-widest font-light"
            >
              Contact Support
            </button>
          </div>
        </div>

        {/* Help Notice */}
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-500 font-light">
            Need help? Our support team is available 24/7
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}

