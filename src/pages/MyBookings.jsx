import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import { getFacilityBookingsByCustomer, getFacilityBookingDetails, cancelFacilityBooking } from "../services/FacilityService";
import RoomBookingService from "../services/RoomBookingService";
import { useAuth } from "../context/AuthContext";

export default function MyBookings() {
  const [facilityBookings, setFacilityBookings] = useState([]);
  const [roomBookings, setRoomBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("ALL"); // ALL, FACILITY, ROOM
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, CONFIRMED, CANCELLED, COMPLETED
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // WORKAROUND: Apply localStorage payment status to bookings
  const applyLocalStoragePaymentStatus = useCallback((bookings, type) => {
    try {
      const paidBookings = JSON.parse(localStorage.getItem('paidBookings') || '{}');

      return bookings.map(booking => {
        const id = booking.facilityBookingId || booking.bookingId;
        const key = `${type}-${id}`;

        // If we have a localStorage record of this payment
        if (paidBookings[key]) {
          console.log(`💾 Applying localStorage payment status for ${type} booking #${id}`);
          return {
            ...booking,
            paymentStatus: 'PAID',
            _localOverride: true // Flag to show it's from localStorage
          };
        }

        return booking;
      });
    } catch (err) {
      console.error('Error applying localStorage status:', err);
      return bookings;
    }
  }, []);

  // Memoized fetch function
  const fetchAllBookings = useCallback(async (showLoader = true) => {
    if (!user?.userId) {
      console.warn("⚠️ No user ID available, skipping fetch");
      setLoading(false);
      return;
    }

    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      console.log("📥 Fetching bookings for customer:", user.userId);

      // Fetch facility bookings
      let facilityData = [];
      try {
        const result = await getFacilityBookingsByCustomer(user.userId);
        facilityData = Array.isArray(result) ? result : [];
        console.log("✅ Facility bookings:", facilityData.length);
      } catch (err) {
        console.error("❌ Facility bookings error:", err.message);
        facilityData = [];
      }

      // Fetch room bookings
      let roomData = [];
      try {
        console.log("🏨 Fetching room bookings for customer:", user.userId);
        const response = await RoomBookingService.getBookingsByCustomer(user.userId);

        console.log("📦 Room bookings response:", {
          hasData: !!response?.data,
          isArray: Array.isArray(response?.data),
          length: response?.data?.length || 0,
          firstItem: response?.data?.[0]
        });

        // Parse response - RoomBookingService returns { data: [...] }
        if (response && response.data && Array.isArray(response.data)) {
          roomData = response.data;
          console.log("✅ Room bookings parsed successfully:", roomData.length);
        } else if (Array.isArray(response)) {
          roomData = response;
          console.log("✅ Room bookings (direct array):", roomData.length);
        } else {
          console.error("❌ Unexpected response format:", typeof response);
          roomData = [];
        }
      } catch (err) {
        console.error("❌ Room bookings error:", err.message);
        console.error("   Status:", err.response?.status);
        if (err.response?.status !== 404) {
          console.error("   Full error:", err);
        }
        roomData = [];
      }

      // WORKAROUND: Apply localStorage payment status overrides
      const facilityDataWithStatus = applyLocalStoragePaymentStatus(facilityData, 'facility');
      const roomDataWithStatus = applyLocalStoragePaymentStatus(roomData, 'room');

      console.log("🔄 Updating state...");
      console.log("   Facility bookings:", facilityDataWithStatus.length);
      console.log("   Room bookings:", roomDataWithStatus.length);

      if (roomDataWithStatus.length > 0) {
        console.log("   Room booking sample:", roomDataWithStatus[0]);
      } else {
        console.warn("⚠️ No room bookings to set in state!");
      }

      // Update state with fresh data
      setFacilityBookings(facilityDataWithStatus);
      setRoomBookings(roomDataWithStatus);

      console.log("✅ State updated - Facilities:", facilityDataWithStatus.length, "Rooms:", roomDataWithStatus.length);
    } catch (error) {
      console.error("❌ Fatal error fetching bookings:", error);
      setFacilityBookings([]);
      setRoomBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.userId, applyLocalStoragePaymentStatus]);

  // Initial load and auth check
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      console.log("❌ Not authenticated, redirecting to login");
      navigate("/login", { state: { returnUrl: "/my-bookings" } });
      return;
    }

    console.log("🔄 Initial bookings load");
    fetchAllBookings(true);
  }, [isAuthenticated, authLoading, navigate, fetchAllBookings]);

  // Handle refresh from payment redirect
  useEffect(() => {
    if (location.state?.refresh) {
      console.log("🔄 Payment redirect - force refresh");
      setTimeout(() => {
        fetchAllBookings(false);
      }, 500); // Small delay to ensure backend is updated

      // Clear state
      window.history.replaceState({}, document.title);
    }
  }, [location.state, fetchAllBookings]);

  const handleViewDetails = async (bookingId, type) => {
    try {
      console.log(`🔍 Viewing ${type} booking details:`, bookingId);

      let details;
      if (type === 'FACILITY') {
        details = await getFacilityBookingDetails(bookingId);
        details.type = 'FACILITY';
      } else {
        const response = await RoomBookingService.getBookingDetails(bookingId);
        details = response.data;
        details.type = 'ROOM';
      }

      console.log("✅ Booking details:", details);
      setSelectedBooking(details);
      setShowModal(true);
    } catch (error) {
      console.error("❌ Error fetching booking details:", error);
      alert("Unable to load booking details. Please try again.");
    }
  };

  const handleCancelBooking = async (bookingId, type) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      if (type === 'FACILITY') {
        await cancelFacilityBooking(bookingId, user.userId);
      } else {
        await RoomBookingService.cancelBooking(bookingId);
      }

      alert("Booking cancelled successfully");
      fetchAllBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking");
    }
  };

  // Combine and filter bookings
  const getAllBookings = useCallback(() => {
    console.log("🔄 getAllBookings called");
    console.log("   facilityBookings:", Array.isArray(facilityBookings) ? facilityBookings.length : "NOT AN ARRAY");
    console.log("   roomBookings:", Array.isArray(roomBookings) ? roomBookings.length : "NOT AN ARRAY");

    // Safely map facility bookings
    const facilityList = Array.isArray(facilityBookings)
      ? facilityBookings.map(b => ({
          ...b,
          type: 'FACILITY',
          displayDate: b.bookingDate || b.createdAt,
          displayId: b.facilityBookingId
        }))
      : [];

    // Safely map room bookings
    const roomList = Array.isArray(roomBookings)
      ? roomBookings.map(b => ({
          ...b,
          type: 'ROOM',
          displayDate: b.checkInDate || b.createdAt,
          displayId: b.bookingId
        }))
      : [];

    console.log("📊 Mapped bookings - Facilities:", facilityList.length, "Rooms:", roomList.length);

    if (roomBookings.length > 0 && roomList.length === 0) {
      console.error("❌ MAPPING FAILED! roomBookings has data but roomList is empty");
      console.log("   Sample roomBooking:", roomBookings[0]);
    }

    let combined = [...facilityList, ...roomList];

    // Filter by type
    if (filter === 'FACILITY') {
      combined = facilityList;
    } else if (filter === 'ROOM') {
      combined = roomList;
    }

    // Filter by status
    if (statusFilter !== 'ALL') {
      combined = combined.filter(b => b.bookingStatus === statusFilter);
    }

    // Sort by date (newest first)
    combined.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.displayDate || Date.now());
      const dateB = new Date(b.createdAt || b.displayDate || Date.now());
      return dateB - dateA;
    });

    console.log("📋 Filtered bookings:", combined.length);
    return combined;
  }, [facilityBookings, roomBookings, filter, statusFilter]);

  const filteredBookings = getAllBookings();

  const getStatusBadge = (status) => {
    const styles = {
      CONFIRMED: "bg-green-50 text-green-700 border-green-200",
      CANCELLED: "bg-red-50 text-red-700 border-red-200",
      COMPLETED: "bg-neutral-100 text-neutral-700 border-neutral-200",
    };
    return styles[status] || "bg-neutral-50 text-neutral-700 border-neutral-200";
  };

  const getPaymentBadge = (status) => {
    const styles = {
      PAID: "text-green-700",
      PENDING: "text-yellow-700",
      FAILED: "text-red-700",
    };
    return styles[status] || "text-neutral-700";
  };

  if (loading && !refreshing) {
    return (
      <PublicLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-800 mb-4"></div>
          <div className="text-neutral-600 font-light text-sm uppercase tracking-widest">Loading Bookings...</div>
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
            My Account
          </span>
          <h1 className="text-3xl md:text-4xl font-light mb-6 text-neutral-900 tracking-wide">
            My Bookings
          </h1>
          <p className="text-neutral-700 text-base font-light mb-4">
            View and manage all your facility and room bookings
          </p>
          <button
            onClick={() => fetchAllBookings(false)}
            disabled={refreshing}
            className={`px-6 py-2 border border-neutral-300 text-neutral-800 text-xs uppercase tracking-widest font-light hover:border-neutral-400 transition ${
              refreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-neutral-50 border border-neutral-200 p-6 text-center">
            <div className="text-3xl font-light text-neutral-900 mb-2">
              {facilityBookings.length + roomBookings.length}
            </div>
            <div className="text-xs uppercase tracking-widest text-neutral-600 font-light">
              Total Bookings
            </div>
          </div>
          <div className="bg-neutral-50 border border-neutral-200 p-6 text-center">
            <div className="text-3xl font-light text-neutral-900 mb-2">
              {facilityBookings.length}
            </div>
            <div className="text-xs uppercase tracking-widest text-neutral-600 font-light">
              Facilities
            </div>
          </div>
          <div className="bg-neutral-50 border border-neutral-200 p-6 text-center">
            <div className="text-3xl font-light text-neutral-900 mb-2">
              {roomBookings.length}
            </div>
            <div className="text-xs uppercase tracking-widest text-neutral-600 font-light">
              Rooms
            </div>
          </div>
          <div className="bg-neutral-50 border border-neutral-200 p-6 text-center">
            <div className="text-3xl font-light text-neutral-900 mb-2">
              {[...facilityBookings, ...roomBookings].filter(b => b.bookingStatus === 'CONFIRMED').length}
            </div>
            <div className="text-xs uppercase tracking-widest text-neutral-600 font-light">
              Active
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-12 border-t border-b border-neutral-200 py-6">
          <div className="max-w-6xl mx-auto">
            {/* Type Filter */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-4">
                Booking Type
              </label>
              <div className="flex flex-wrap gap-3">
                {['ALL', 'FACILITY', 'ROOM'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-6 py-2 text-xs uppercase tracking-widest font-light transition ${
                      filter === type
                        ? "bg-neutral-800 text-white"
                        : "bg-white border border-neutral-300 text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    {type === 'ALL' ? 'All Bookings' : `${type}${type === 'FACILITY' ? ' Bookings' : ' Bookings'}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-4">
                Status
              </label>
              <div className="flex flex-wrap gap-3">
                {['ALL', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-6 py-2 text-xs uppercase tracking-widest font-light transition ${
                      statusFilter === status
                        ? "bg-neutral-800 text-white"
                        : "bg-white border border-neutral-300 text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {filteredBookings.length > 0 && (
          <div className="text-center mb-8 text-sm text-neutral-600 font-light">
            Showing {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'}
          </div>
        )}

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-neutral-400 text-6xl mb-6">📋</div>
            <p className="text-neutral-600 font-light text-lg mb-4">No bookings found</p>
            <p className="text-neutral-500 font-light text-sm mb-8">
              {statusFilter !== 'ALL' ? 'Try changing the filters' : 'Start by booking a facility or room'}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/facilities')}
                className="px-8 py-3 border border-neutral-300 text-neutral-800 text-xs uppercase tracking-widest font-light hover:border-neutral-400 transition"
              >
                Browse Facilities
              </button>
              <button
                onClick={() => navigate('/rooms')}
                className="px-8 py-3 bg-neutral-800 text-white text-xs uppercase tracking-widest font-light hover:bg-neutral-900 transition"
              >
                Browse Rooms
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking, index) => {
              const bookingId = booking.displayId || booking.facilityBookingId || booking.bookingId;
              return (
              <div
                key={`${booking.type}-${bookingId}-${index}`}
                className="bg-white border border-neutral-200 hover:border-neutral-300 transition-all p-6 md:p-8"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  {/* Left: Booking Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">
                        {booking.type === 'FACILITY' ? '🏢' : '🛏️'}
                      </span>
                      <div>
                        <h3 className="text-lg font-light text-neutral-900 tracking-wide">
                          {booking.type === 'FACILITY' ? (
                            `${booking.facilityName || 'Facility'} Booking`
                          ) : (
                            `Room ${booking.roomNumber || booking.roomId || 'N/A'}`
                          )}
                        </h3>
                        <p className="text-xs uppercase tracking-widest text-neutral-500 font-light">
                          {booking.type} BOOKING #{bookingId}
                        </p>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between md:justify-start md:gap-2">
                        <span className="text-neutral-600 font-light">Date:</span>
                        <span className="text-neutral-900 font-light">
                          {booking.type === 'FACILITY'
                            ? booking.bookingDate
                            : `${booking.checkInDate} - ${booking.checkOutDate}`}
                        </span>
                      </div>
                      {booking.type === 'FACILITY' && booking.startTime && (
                        <div className="flex justify-between md:justify-start md:gap-2">
                          <span className="text-neutral-600 font-light">Time:</span>
                          <span className="text-neutral-900 font-light">
                            {booking.startTime} - {booking.endTime}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between md:justify-start md:gap-2">
                        <span className="text-neutral-600 font-light">Amount:</span>
                        <span className="text-neutral-900 font-light">₹{parseFloat(booking.totalPrice).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between md:justify-start md:gap-2">
                        <span className="text-neutral-600 font-light">Payment:</span>
                        <span className={`font-light ${getPaymentBadge(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status & Actions */}
                  <div className="flex flex-col items-end gap-4">
                    <span className={`px-4 py-2 border text-xs uppercase tracking-widest font-light ${getStatusBadge(booking.bookingStatus)}`}>
                      {booking.bookingStatus}
                    </span>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleViewDetails(
                          booking.facilityBookingId || booking.bookingId,
                          booking.type
                        )}
                        className="px-4 py-2 border border-neutral-300 text-neutral-800 text-xs uppercase tracking-widest font-light hover:border-neutral-400 transition"
                      >
                        View Details
                      </button>

                      {booking.bookingStatus === 'CONFIRMED' && booking.paymentStatus === 'PENDING' && (
                        <button
                          onClick={() => navigate(`/payment/${booking.type.toLowerCase()}/${booking.facilityBookingId || booking.bookingId}`)}
                          className="px-4 py-2 bg-neutral-800 text-white text-xs uppercase tracking-widest font-light hover:bg-neutral-900 transition"
                        >
                          Pay Now
                        </button>
                      )}

                      {booking.bookingStatus === 'CONFIRMED' && (
                        <button
                          onClick={() => handleCancelBooking(
                            booking.facilityBookingId || booking.bookingId,
                            booking.type
                          )}
                          className="px-4 py-2 border border-red-300 text-red-700 text-xs uppercase tracking-widest font-light hover:border-red-400 transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        )}

        {/* Details Modal */}
        {showModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="border-b border-neutral-200 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-light text-neutral-900 tracking-wide">
                    Booking Details
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-neutral-600 hover:text-neutral-900 text-2xl font-light"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Booking Info */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-4">
                    Booking Information
                  </h3>
                  <div className="bg-neutral-50 border border-neutral-200 p-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600 font-light">Type:</span>
                      <span className="text-neutral-900 font-light">{selectedBooking.type} Booking</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600 font-light">ID:</span>
                      <span className="text-neutral-900 font-light">
                        {selectedBooking.facilityBookingId || selectedBooking.bookingId}
                      </span>
                    </div>
                    {selectedBooking.type === 'FACILITY' ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-neutral-600 font-light">Facility:</span>
                          <span className="text-neutral-900 font-light">{selectedBooking.facilityName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600 font-light">Type:</span>
                          <span className="text-neutral-900 font-light">{selectedBooking.facilityType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600 font-light">Date:</span>
                          <span className="text-neutral-900 font-light">{selectedBooking.bookingDate}</span>
                        </div>
                        {selectedBooking.startTime && (
                          <div className="flex justify-between">
                            <span className="text-neutral-600 font-light">Time:</span>
                            <span className="text-neutral-900 font-light">
                              {selectedBooking.startTime} - {selectedBooking.endTime}
                            </span>
                          </div>
                        )}
                        {selectedBooking.quantity && (
                          <div className="flex justify-between">
                            <span className="text-neutral-600 font-light">Quantity:</span>
                            <span className="text-neutral-900 font-light">{selectedBooking.quantity}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-neutral-600 font-light">Room:</span>
                          <span className="text-neutral-900 font-light">
                            {selectedBooking.roomNumber || selectedBooking.roomId}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600 font-light">Check-in:</span>
                          <span className="text-neutral-900 font-light">{selectedBooking.checkInDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600 font-light">Check-out:</span>
                          <span className="text-neutral-900 font-light">{selectedBooking.checkOutDate}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Customer Info */}
                {selectedBooking.customerName && (
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-4">
                      Customer Information
                    </h3>
                    <div className="bg-neutral-50 border border-neutral-200 p-4 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-600 font-light">Name:</span>
                        <span className="text-neutral-900 font-light">{selectedBooking.customerName}</span>
                      </div>
                      {selectedBooking.customerEmail && (
                        <div className="flex justify-between">
                          <span className="text-neutral-600 font-light">Email:</span>
                          <span className="text-neutral-900 font-light">{selectedBooking.customerEmail}</span>
                        </div>
                      )}
                      {selectedBooking.customerPhone && (
                        <div className="flex justify-between">
                          <span className="text-neutral-600 font-light">Phone:</span>
                          <span className="text-neutral-900 font-light">{selectedBooking.customerPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Payment Info */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-4">
                    Payment Information
                  </h3>
                  <div className="bg-neutral-50 border border-neutral-200 p-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600 font-light">Total Amount:</span>
                      <span className="text-neutral-900 font-light text-lg">
                        ₹{parseFloat(selectedBooking.totalPrice).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600 font-light">Payment Status:</span>
                      <span className={`font-light ${getPaymentBadge(selectedBooking.paymentStatus)}`}>
                        {selectedBooking.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600 font-light">Booking Status:</span>
                      <span className="text-neutral-900 font-light">{selectedBooking.bookingStatus}</span>
                    </div>
                    {selectedBooking.paymentId && (
                      <div className="flex justify-between">
                        <span className="text-neutral-600 font-light">Payment ID:</span>
                        <span className="text-neutral-900 font-light">{selectedBooking.paymentId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {selectedBooking.notes && (
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-4">
                      Notes
                    </h3>
                    <div className="bg-neutral-50 border border-neutral-200 p-4 text-sm text-neutral-700 font-light">
                      {selectedBooking.notes}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-4">
                    Timestamps
                  </h3>
                  <div className="bg-neutral-50 border border-neutral-200 p-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600 font-light">Created:</span>
                      <span className="text-neutral-900 font-light">
                        {new Date(selectedBooking.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {selectedBooking.updatedAt && (
                      <div className="flex justify-between">
                        <span className="text-neutral-600 font-light">Last Updated:</span>
                        <span className="text-neutral-900 font-light">
                          {new Date(selectedBooking.updatedAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-neutral-200 p-6 flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-neutral-300 text-neutral-800 text-xs uppercase tracking-widest font-light hover:border-neutral-400 transition"
                >
                  Close
                </button>
                {selectedBooking.paymentStatus === 'PENDING' && selectedBooking.bookingStatus === 'CONFIRMED' && (
                  <button
                    onClick={() => {
                      setShowModal(false);
                      navigate(`/payment/${selectedBooking.type.toLowerCase()}/${selectedBooking.facilityBookingId || selectedBooking.bookingId}`);
                    }}
                    className="px-6 py-3 bg-neutral-800 text-white text-xs uppercase tracking-widest font-light hover:bg-neutral-900 transition"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}

