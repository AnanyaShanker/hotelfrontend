import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import paymentService from '../services/PaymentService';
import { useAuth } from '../context/AuthContext';
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
      const result = await paymentService.getPaymentHistory(user.userId);
      if (result.success) {
        // Sort by date (newest first)
        const sortedPayments = result.data.sort((a, b) =>
          new Date(b.paymentDate) - new Date(a.paymentDate)
        );
        setPayments(sortedPayments);
      }
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    if (filter === 'all') return true;
    if (filter === 'success') return payment.status === 'SUCCESS';
    if (filter === 'failed') return payment.status === 'FAILED';
    if (filter === 'pending') return payment.status === 'PENDING';
    return true;
  });

  const getStatusBadge = (status) => {
    const styles = {
      SUCCESS: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      PENDING: 'bg-yellow-100 text-yellow-800'
    };
    return (
      <span className={`px-3 py-1 text-xs font-semibold uppercase ${styles[status] || 'bg-neutral-100 text-neutral-800'}`}>
        {status}
      </span>
    );
  };

  const handleRetry = (payment) => {
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
                        {payment.status === 'FAILED' && (
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

                  <div className="space-y-1 text-xs">
                    <p><span className="text-neutral-600">Booking:</span> #{payment.bookingId || payment.facilityBookingId}</p>
                    <p><span className="text-neutral-600">Type:</span> {payment.bookingId ? 'Room' : 'Facility'}</p>
                    <p><span className="text-neutral-600">Method:</span> {payment.paymentMethod}</p>
                    <p><span className="text-neutral-600">Transaction:</span> {payment.transactionId}</p>
                  </div>

                  {payment.status === 'FAILED' && (
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
                ₹{payments
                  .filter(p => p.status === 'SUCCESS')
                  .reduce((sum, p) => sum + parseFloat(p.amountPaid), 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}

