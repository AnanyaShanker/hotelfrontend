import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import paymentService from '../services/PaymentService';
import { useAuth } from '../hooks/useAuth';
import PublicLayout from '../layouts/PublicLayout';

export default function PaymentHistory() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, success, failed, pending

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user && user.userId) {
      fetchPayments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAuthenticated, authLoading]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      console.log(' Fetching payment history for user:', user.userId);
      const result = await paymentService.getPaymentHistory(user.userId);
      if (result.success) {
        console.log(' Payment history received:', result.data);

        // Sort by date (newest first)
        const sortedPayments = result.data.sort((a, b) =>
          new Date(b.paymentDate) - new Date(a.paymentDate)
        );

        // Filter out failed attempts if successful payment exists for same booking
        const filteredPayments = filterDuplicateBookingAttempts(sortedPayments);

        console.log(` Total payments: ${sortedPayments.length}, After filtering: ${filteredPayments.length}`);
        setPayments(filteredPayments);
      }
    } catch (error) {
      console.error(' Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter out failed payment attempts if a successful payment exists for the same booking.
   * This prevents showing "Retry" buttons for bookings that have already been paid.
   */
  const filterDuplicateBookingAttempts = (payments) => {
    // Group payments by booking ID
    const bookingGroups = {};

    payments.forEach(payment => {
      // Create a unique key for room or facility booking
      const bookingKey = payment.bookingId
        ? `room_${payment.bookingId}`
        : `facility_${payment.facilityBookingId}`;

      if (!bookingGroups[bookingKey]) {
        bookingGroups[bookingKey] = [];
      }
      bookingGroups[bookingKey].push(payment);
    });

    console.log(' Booking groups:', bookingGroups);

    // For each booking, check if a successful payment exists
    const filteredPayments = [];

    Object.entries(bookingGroups).forEach(([bookingKey, bookingPayments]) => {
      // Check if there's a successful payment for this booking
      const hasSuccessfulPayment = bookingPayments.some(p =>
        p.status?.toUpperCase() === 'SUCCESS'
      );

      if (hasSuccessfulPayment) {
        console.log(` ${bookingKey}: Has successful payment - showing only SUCCESS attempts`);
        // Only show successful payments (hide all failed/pending attempts)
        filteredPayments.push(...bookingPayments.filter(p =>
          p.status?.toUpperCase() === 'SUCCESS'
        ));
      } else {
        console.log(` ${bookingKey}: No successful payment - showing all attempts`);
        // No successful payment yet, show all attempts (including failed with retry button)
        filteredPayments.push(...bookingPayments);
      }
    });

    return filteredPayments;
  };

  // Helper function to check if payment is truly failed
  const isPaymentFailed = (payment) => {
    const status = payment.status;

    // Normalize status check (case-insensitive)
    const normalizedStatus = typeof status === 'string' ? status.toUpperCase() : status;

    const isFailed = normalizedStatus === 'FAILED';
    const isSuccess = normalizedStatus === 'SUCCESS';

    // Return true ONLY if status is FAILED and NOT SUCCESS
    return isFailed && !isSuccess;
  };

  // Filter payments by status
  const filteredPayments = payments.filter((payment) => {
    if (filter === 'all') return true;
    const normalizedStatus = payment.status?.toUpperCase();
    if (filter === 'success') return normalizedStatus === 'SUCCESS';
    if (filter === 'failed') return normalizedStatus === 'FAILED';
    if (filter === 'pending') return normalizedStatus === 'PENDING';
    return true;
  });

  const handleRetry = (payment) => {
    console.log(' Retry button clicked for payment:', payment.paymentId, 'Status:', payment.status);
    const bookingType = payment.bookingId ? 'room' : 'facility';
    const bookingId = payment.bookingId || payment.facilityBookingId;

    navigate(`/payment/${bookingType}/${bookingId}`, {
      state: {
        bookingType,
        bookingId,
        amount: payment.amountPaid,
        bookingDetails: {}
      }
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const normalizedStatus = status?.toUpperCase();
    const styles = {
      SUCCESS: 'bg-green-100 text-green-800 border-green-300',
      FAILED: 'bg-red-100 text-red-800 border-red-300',
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    return (
      <span className={`px-3 py-1 text-xs uppercase tracking-wider font-light border ${styles[normalizedStatus] || 'bg-neutral-100 text-neutral-800 border-neutral-300'}`}>
        {status}
      </span>
    );
  };

  if (!user) {
    return (
      <PublicLayout>
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h2 className="text-2xl font-light mb-4">Please Login</h2>
          <button onClick={() => navigate('/login')} className="px-6 py-3 bg-neutral-800 text-white">
            Go to Login
          </button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto p-6 py-24 animate-fade-in">
        <h1 className="text-3xl font-light mb-8 text-neutral-900">Payment History</h1>

        {/* Filters */}
        <div className="mb-8 flex gap-2 border-b border-neutral-200 pb-4">
          {['all', 'success', 'failed', 'pending'].map((filterOption) => (
            <button
              key={filterOption}
              className={`px-6 py-2 text-xs uppercase tracking-widest font-light transition ${
                filter === filterOption
                  ? 'bg-neutral-800 text-white'
                  : 'bg-white border border-neutral-300 text-neutral-700 hover:border-neutral-400'
              }`}
              onClick={() => setFilter(filterOption)}
            >
              {filterOption}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-800"></div>
            <p className="mt-4 text-neutral-600 font-light">Loading payment history...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12 bg-neutral-50 border border-neutral-200">
            <div className="text-6xl mb-4">💳</div>
            <h3 className="text-xl font-light mb-2">No Payments Found</h3>
            <p className="text-neutral-600 font-light mb-6">
              {filter === 'all'
                ? 'You haven\'t made any payments yet'
                : `No ${filter} payments found`}
            </p>
            <button
              onClick={() => navigate('/facilities')}
              className="px-6 py-3 bg-neutral-800 text-white hover:bg-neutral-900 text-xs uppercase tracking-widest font-light"
            >
              Browse Facilities
            </button>
          </div>
        ) : (
          /* Desktop Table View */
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border border-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-widest text-neutral-600 font-light">Date</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-widest text-neutral-600 font-light">Booking ID</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-widest text-neutral-600 font-light">Type</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-widest text-neutral-600 font-light">Amount</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-widest text-neutral-600 font-light">Method</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-widest text-neutral-600 font-light">Status</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-widest text-neutral-600 font-light">Transaction ID</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-widest text-neutral-600 font-light">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.paymentId} className="border-t border-neutral-200 hover:bg-neutral-50">
                      <td className="px-4 py-3 text-sm text-neutral-800">{formatDate(payment.paymentDate)}</td>
                      <td className="px-4 py-3 text-sm text-neutral-800 font-mono">
                        #{payment.bookingId || payment.facilityBookingId}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-800">
                        {payment.bookingId ? 'Room' : 'Facility'}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-900 font-semibold">
                        ₹{parseFloat(payment.amountPaid).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-800">{payment.paymentMethod}</td>
                      <td className="px-4 py-3">{getStatusBadge(payment.status)}</td>
                      <td className="px-4 py-3 text-xs text-neutral-600 font-mono">{payment.transactionId}</td>
                      <td className="px-4 py-3">
                        {isPaymentFailed(payment) && (
                          <button
                            className="text-xs px-3 py-1 bg-neutral-800 text-white hover:bg-neutral-900 uppercase tracking-wider"
                            onClick={() => handleRetry(payment)}
                          >
                            Retry
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredPayments.map((payment) => (
                <div key={payment.paymentId} className="bg-white border border-neutral-200 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs text-neutral-600">
                        {formatDate(payment.paymentDate)}
                      </p>
                      <p className="text-sm font-semibold text-neutral-900 mt-1">
                        ₹{parseFloat(payment.amountPaid).toFixed(2)}
                      </p>
                    </div>
                    {getStatusBadge(payment.status)}
                  </div>

                  <div className="text-xs text-neutral-700 space-y-1">
                    <p><span className="text-neutral-600">Booking ID:</span> #{payment.bookingId || payment.facilityBookingId}</p>
                    <p><span className="text-neutral-600">Type:</span> {payment.bookingId ? 'Room' : 'Facility'}</p>
                    <p><span className="text-neutral-600">Method:</span> {payment.paymentMethod}</p>
                    <p><span className="text-neutral-600">Transaction:</span> {payment.transactionId}</p>
                  </div>

                  {isPaymentFailed(payment) && (
                    <button
                      className="mt-3 w-full text-xs px-3 py-2 bg-neutral-800 text-white hover:bg-neutral-900 uppercase tracking-wider"
                      onClick={() => handleRetry(payment)}
                    >
                      Retry Payment
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Summary Stats */}
        {!loading && payments.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 p-4 text-center">
              <p className="text-xs uppercase tracking-widest text-green-600 font-light mb-1">Successful</p>
              <p className="text-2xl font-light text-green-800">
                {payments.filter(p => p.status === 'SUCCESS').length}
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 p-4 text-center">
              <p className="text-xs uppercase tracking-widest text-red-600 font-light mb-1">Failed</p>
              <p className="text-2xl font-light text-red-800">
                {payments.filter(p => p.status === 'FAILED').length}
              </p>
            </div>
            <div className="bg-neutral-50 border border-neutral-200 p-4 text-center">
              <p className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-1">Total Paid</p>
              <p className="text-2xl font-light text-neutral-900">
                ₹{payments.filter(p => p.status === 'SUCCESS').reduce((sum, p) => sum + parseFloat(p.amountPaid), 0).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}

