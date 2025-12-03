import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePayment } from '../hooks/usePayment';
import { useAuth } from '../context/AuthContext';
import PublicLayout from '../layouts/PublicLayout';

export default function PaymentCheckout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { processing, error, processPayment, clearError } = usePayment();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const { bookingType, bookingId, amount, bookingDetails } = location.state || {};

  // Debug logging
  useEffect(() => {
    console.log("💳 PaymentCheckout loaded");
    console.log("💳 Location state:", location.state);
    console.log("💳 Booking Type:", bookingType);
    console.log("💳 Booking ID:", bookingId);
    console.log("💳 Amount:", amount);
    console.log("💳 Booking Details:", bookingDetails);
  }, []);

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      console.log("❌ Not authenticated, redirecting to login");
      navigate('/login');
      return;
    }
  }, [isAuthenticated, authLoading, navigate]);

  const [selectedMethod, setSelectedMethod] = useState('UPI');

  const paymentMethods = [
    { id: 'UPI', label: 'UPI', icon: '📱', popular: true },
    { id: 'CREDIT_CARD', label: 'Credit Card', icon: '💳', popular: true },
    { id: 'DEBIT_CARD', label: 'Debit Card', icon: '💳', popular: false },
    { id: 'BANK_TRANSFER', label: 'Bank Transfer', icon: '🏦', popular: false },
    { id: 'CASH', label: 'Cash on Arrival', icon: '💵', popular: false }
  ];

  const handlePayment = async () => {
    clearError();

    const bookingData = {
      bookingId,
      type: bookingType,
      amount
    };

    const result = await processPayment(bookingData, selectedMethod);

    if (result.success) {
      navigate('/payment/success', {
        state: {
          transactionId: result.data.transactionId,
          amount,
          bookingId,
          bookingType,
          bookingDetails
        }
      });
    } else {
      navigate('/payment/failed', {
        state: {
          transactionId: result.data?.transactionId,
          error: result.error,
          bookingId,
          bookingType,
          amount,
          bookingDetails
        }
      });
    }
  };

  if (!bookingId || !amount) {
    return (
      <PublicLayout>
        <div className="max-w-2xl mx-auto p-6 text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-light mb-4">Invalid Booking Data</h2>
          <p className="text-neutral-600 mb-6">Unable to process payment. Please try booking again.</p>
          <button
            onClick={() => navigate('/facilities')}
            className="px-6 py-3 bg-neutral-800 text-white hover:bg-neutral-900"
          >
            Back to Facilities
          </button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto p-6 py-24 animate-fade-in">
        <h1 className="text-3xl font-light mb-8 text-neutral-900">Complete Payment</h1>

        {/* Booking Summary */}
        <div className="bg-neutral-50 border border-neutral-200 p-6 mb-8">
          <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-4">
            Booking Summary
          </h3>
          {bookingType === 'room' ? (
            <div className="space-y-2">
              <p className="text-neutral-800">
                <span className="font-semibold">Room:</span> {bookingDetails?.roomNumber || 'N/A'}
              </p>
              <p className="text-neutral-800">
                <span className="font-semibold">Check-in:</span> {bookingDetails?.checkIn || 'N/A'}
              </p>
              <p className="text-neutral-800">
                <span className="font-semibold">Check-out:</span> {bookingDetails?.checkOut || 'N/A'}
              </p>
              <p className="text-neutral-800">
                <span className="font-semibold">Guests:</span> {bookingDetails?.numberOfGuests || 'N/A'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-neutral-800">
                <span className="font-semibold">Facility:</span> {bookingDetails?.facilityName || 'N/A'}
              </p>
              <p className="text-neutral-800">
                <span className="font-semibold">Date:</span> {bookingDetails?.date || 'N/A'}
              </p>
              <p className="text-neutral-800">
                <span className="font-semibold">Time:</span> {bookingDetails?.time || 'N/A'}
              </p>
            </div>
          )}
          <div className="border-t border-neutral-200 mt-4 pt-4">
            <p className="text-2xl font-light text-neutral-900">
              Total Amount: <span className="font-semibold">₹{parseFloat(amount).toFixed(2)}</span>
            </p>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-8">
          <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-6">
            Select Payment Method
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                className={`p-6 border-2 transition-all hover:border-neutral-400 ${
                  selectedMethod === method.id
                    ? 'border-neutral-800 bg-neutral-50'
                    : 'border-neutral-200 bg-white'
                }`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{method.icon}</div>
                  <div className="text-sm font-light">{method.label}</div>
                  {method.popular && (
                    <div className="text-xs text-neutral-500 mt-1">Popular</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            className="flex-1 px-6 py-4 border border-neutral-300 text-neutral-800 hover:border-neutral-400 transition text-xs uppercase tracking-widest font-light"
            onClick={() => navigate(-1)}
            disabled={processing}
          >
            Cancel
          </button>
          <button
            className="flex-1 px-6 py-4 bg-neutral-800 text-white hover:bg-neutral-900 transition text-xs uppercase tracking-widest font-light disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePayment}
            disabled={processing || !selectedMethod}
          >
            {processing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Pay ₹${parseFloat(amount).toFixed(2)}`
            )}
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-neutral-50 border border-neutral-200">
          <p className="text-xs text-neutral-600 text-center font-light">
            🔒 Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}

