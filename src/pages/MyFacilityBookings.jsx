import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import { getFacilityBookingsByCustomer, cancelFacilityBooking, getFacilityBookingDetails } from "../services/FacilityService";
import { useAuth } from "../context/AuthContext";

export default function MyFacilityBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    try {
      const data = await getFacilityBookingsByCustomer(user.userId);
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (bookingId) => {
    try {
      const details = await getFacilityBookingDetails(bookingId);
      setSelectedBooking(details);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await cancelFacilityBooking(bookingId, user.userId);
      alert("Booking cancelled successfully");
      fetchBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking");
    }
  };

  const filteredBookings = filter === "ALL"
    ? bookings
    : bookings.filter(b => b.bookingStatus === filter);

  const getStatusColor = (status) => {
    const colors = {
      CONFIRMED: "text-green-700 bg-green-50 border-green-200",
      CANCELLED: "text-red-700 bg-red-50 border-red-200",
      COMPLETED: "text-neutral-700 bg-neutral-100 border-neutral-200",
    };
    return colors[status] || "text-neutral-700 bg-neutral-50 border-neutral-200";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      PAID: "text-green-700",
      PENDING: "text-yellow-700",
      FAILED: "text-red-700",
    };
    return colors[status] || "text-neutral-700";
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-neutral-600 font-light">Loading bookings...</div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="py-24 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs uppercase tracking-widest text-neutral-600 font-light mb-6">
            Your Bookings
          </span>
          <h1 className="text-3xl md:text-4xl font-light mb-6 text-neutral-900 tracking-wide">
            Facility Bookings
          </h1>
          <p className="text-neutral-700 text-base font-light">
            Manage your facility bookings
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 border-t border-b border-neutral-200 py-6">
          <div className="flex flex-wrap justify-center gap-4">
            {["ALL", "CONFIRMED", "CANCELLED", "COMPLETED"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2 text-xs uppercase tracking-widest font-light transition ${
                  filter === status
                    ? "bg-neutral-800 text-white"
                    : "bg-white border border-neutral-300 text-neutral-700 hover:border-neutral-400"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.map((booking, index) => (
            <div
              key={booking.facilityBookingId}
              className={`bg-white border border-neutral-200 hover:border-neutral-300 transition-all p-6 animate-fade-in-up animate-delay-${Math.min(index + 1, 6)}00`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Booking Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`inline-block px-3 py-1 border text-xs uppercase tracking-wider font-light ${getStatusColor(booking.bookingStatus)}`}>
                      {booking.bookingStatus}
                    </span>
                    <span className={`text-xs uppercase tracking-wider font-light ${getPaymentStatusColor(booking.paymentStatus)}`}>
                      {booking.paymentStatus}
                    </span>
                  </div>

                  <h3 className="text-lg font-light mb-2 text-neutral-900">
                    Booking ID: #{booking.facilityBookingId}
                  </h3>

                  <div className="grid md:grid-cols-3 gap-4 text-sm font-light">
                    <div>
                      <span className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                        Date
                      </span>
                      <span className="text-neutral-900">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <span className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                        Time
                      </span>
                      <span className="text-neutral-900">
                        {booking.startTime && booking.endTime
                          ? `${booking.startTime} - ${booking.endTime}`
                          : "Full Day"}
                      </span>
                    </div>

                    <div>
                      <span className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                        Total Price
                      </span>
                      <span className="text-neutral-900">₹{booking.totalPrice}</span>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-3 text-sm text-neutral-600 font-light">
                      <span className="text-xs uppercase tracking-wider">Notes: </span>
                      {booking.notes}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 md:ml-6">
                  <button
                    onClick={() => handleViewDetails(booking.facilityBookingId)}
                    className="px-6 py-2 border border-neutral-300 text-neutral-800 text-xs uppercase tracking-widest font-light hover:border-neutral-400 transition whitespace-nowrap"
                  >
                    View Details
                  </button>

                  {booking.bookingStatus === "CONFIRMED" && (
                    <button
                      onClick={() => handleCancelBooking(booking.facilityBookingId)}
                      className="px-6 py-2 border border-red-300 text-red-700 text-xs uppercase tracking-widest font-light hover:border-red-400 transition whitespace-nowrap"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="text-center py-16">
            <div className="text-neutral-400 text-5xl mb-4">📅</div>
            <p className="text-neutral-600 font-light mb-6">No bookings found</p>
            <button
              onClick={() => navigate("/facilities")}
              className="px-8 py-3 bg-neutral-800 text-white text-xs uppercase tracking-widest font-light hover:bg-neutral-900 transition"
            >
              Browse Facilities
            </button>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white max-w-2xl w-full p-10 animate-scale-in relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition flex items-center justify-center text-2xl font-light"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>

            <h2 className="text-2xl font-light mb-6 text-neutral-900 tracking-wide">
              Booking Details
            </h2>

            <div className="space-y-6">
              {/* Booking Info */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-4 pb-2 border-b border-neutral-200">
                  Booking Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm font-light">
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">Booking ID</span>
                    <span className="text-neutral-900">#{selectedBooking.facilityBookingId}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">Status</span>
                    <span className={`inline-block px-2 py-1 border text-xs ${getStatusColor(selectedBooking.bookingStatus)}`}>
                      {selectedBooking.bookingStatus}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">Date</span>
                    <span className="text-neutral-900">{new Date(selectedBooking.bookingDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">Time</span>
                    <span className="text-neutral-900">
                      {selectedBooking.startTime && selectedBooking.endTime
                        ? `${selectedBooking.startTime} - ${selectedBooking.endTime}`
                        : "Full Day"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Facility Info */}
              {selectedBooking.facilityName && (
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-4 pb-2 border-b border-neutral-200">
                    Facility Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm font-light">
                    <div>
                      <span className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">Name</span>
                      <span className="text-neutral-900">{selectedBooking.facilityName}</span>
                    </div>
                    <div>
                      <span className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">Type</span>
                      <span className="text-neutral-900">{selectedBooking.facilityType}</span>
                    </div>
                    {selectedBooking.facilityLocation && (
                      <div className="col-span-2">
                        <span className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">Location</span>
                        <span className="text-neutral-900">📍 {selectedBooking.facilityLocation}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Info */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-4 pb-2 border-b border-neutral-200">
                  Payment Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm font-light">
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">Status</span>
                    <span className={`${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                      {selectedBooking.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">Total Amount</span>
                    <span className="text-neutral-900 font-normal">₹{selectedBooking.totalPrice}</span>
                  </div>
                </div>
              </div>

              {selectedBooking.notes && (
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-4 pb-2 border-b border-neutral-200">
                    Special Requests
                  </h3>
                  <p className="text-sm text-neutral-700 font-light">{selectedBooking.notes}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-8 w-full px-8 py-3 bg-neutral-800 text-white text-xs uppercase tracking-widest font-light hover:bg-neutral-900 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}

