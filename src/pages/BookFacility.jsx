import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import { getFacilityById, createFacilityBooking } from "../services/FacilityService";
import { useAuth } from "../context/AuthContext";

export default function BookFacility() {
  const { id } = useParams();
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    bookingDate: "",
    startTime: "",
    endTime: "",
    timeSlot: "",
    quantity: 1,
    notes: "",
  });

  useEffect(() => {
    // Wait for auth to finish loading before checking authentication
    if (authLoading) return;

    if (!isAuthenticated) {
      // Save current booking page URL so we can return here after login
      localStorage.setItem("returnUrl", window.location.pathname);
      navigate("/login");
      return;
    }
    if (id) {
      fetchFacility();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated, authLoading]);

  const fetchFacility = async () => {
    try {
      const data = await getFacilityById(id);
      setFacility(data);
    } catch (error) {
      console.error("Error fetching facility:", error);
      setMessage("Failed to load facility details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculatePrice = () => {
    if (!facility || !formData.startTime || !formData.endTime) return 0;

    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    const hours = (end - start) / (1000 * 60 * 60);

    if (hours <= 0) return 0;

    return (facility.price * hours * formData.quantity).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    // Validation
    if (!formData.bookingDate) {
      setMessage("Please select a booking date");
      setSubmitting(false);
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      setMessage("Please select start and end time");
      setSubmitting(false);
      return;
    }

    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);

    if (end <= start) {
      setMessage("End time must be after start time");
      setSubmitting(false);
      return;
    }

    const bookingRequest = {
      customerId: user.userId,
      facilityId: parseInt(id),
      bookingDate: formData.bookingDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      timeSlot: formData.timeSlot || null,
      quantity: parseInt(formData.quantity),
      notes: formData.notes || null,
      autoCapturePayment: false,
    };

    try {
      const response = await createFacilityBooking(bookingRequest);

      console.log("📦 Facility booking response:", response);

      // FacilityService already unwraps response.data, so response is the data
      const bookingId = response.facilityBookingId ||
                       response.facility_booking_id ||
                       response.id;

      console.log("🎯 Extracted facility bookingId:", bookingId);

      if (!bookingId) {
        console.error("❌ No booking ID found in response:", response);
        setMessage("Booking created but could not get booking ID. Please check 'My Bookings'.");
        setSubmitting(false);
        return;
      }

      const totalPrice = calculatePrice();
      setMessage("Booking confirmed successfully! Redirecting to payment...");

      setTimeout(() => {
        console.log("🔄 Navigating to payment with:", {
          bookingId,
          amount: totalPrice,
          facility: facility.name
        });

        navigate(`/payment/facility/${bookingId}`, {
          state: {
            bookingType: 'facility',
            bookingId: bookingId,
            amount: totalPrice,
            bookingDetails: {
              facilityName: facility.name,
              date: formData.bookingDate,
              time: `${formData.startTime} - ${formData.endTime}`,
              quantity: formData.quantity
            }
          }
        });
      }, 1500);
    } catch (error) {
      console.error("❌ Facility booking error:", error);
      console.error("❌ Error response:", error.response?.data);
      const errorMsg = error.response?.data?.message || error.response?.data || "Booking failed. Please try again.";
      setMessage(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-neutral-600 font-light">Loading...</div>
        </div>
      </PublicLayout>
    );
  }

  if (!facility) {
    return (
      <PublicLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-neutral-400 text-6xl mb-4">🏨</div>
          <p className="text-neutral-600 font-light mb-6">Facility not found</p>
          <button
            onClick={() => navigate("/facilities")}
            className="px-8 py-3 border border-neutral-300 text-neutral-800 text-xs uppercase tracking-widest font-light hover:border-neutral-400 transition"
          >
            Back to Facilities
          </button>
        </div>
      </PublicLayout>
    );
  }

  const totalPrice = calculatePrice();
  const today = new Date().toISOString().split('T')[0];

  return (
    <PublicLayout>
      <div className="py-24 max-w-4xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate(`/facility/${id}`)}
            className="text-xs uppercase tracking-wider text-neutral-600 hover:text-neutral-900 transition font-light mb-6"
          >
            ← Back to Facility
          </button>

          <div className="text-center">
            <span className="inline-block text-xs uppercase tracking-widest text-neutral-600 font-light mb-4">
              Book Facility
            </span>
            <h1 className="text-3xl md:text-4xl font-light mb-2 text-neutral-900 tracking-wide">
              {facility.name}
            </h1>
            <p className="text-neutral-700 font-light">
              Complete your booking details below
            </p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 border text-sm font-light text-center mb-8 animate-fade-in ${
            message.includes("success") || message.includes("confirmed")
              ? "bg-neutral-100 border-neutral-200 text-neutral-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}>
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 p-10">
          <div className="space-y-8">
            {/* Date & Time */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-6 pb-3 border-b border-neutral-200">
                Select Date & Time
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bookingDate" className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                    Booking Date *
                  </label>
                  <input
                    type="date"
                    id="bookingDate"
                    name="bookingDate"
                    required
                    min={today}
                    value={formData.bookingDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-500 transition font-light"
                  />
                </div>

                <div>
                  <label htmlFor="timeSlot" className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                    Time Slot (Optional)
                  </label>
                  <input
                    type="text"
                    id="timeSlot"
                    name="timeSlot"
                    placeholder="e.g., Morning Session"
                    value={formData.timeSlot}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-500 transition font-light"
                  />
                </div>

                <div>
                  <label htmlFor="startTime" className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    required
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-500 transition font-light"
                  />
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                    End Time *
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    required
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-500 transition font-light"
                  />
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-6 pb-3 border-b border-neutral-200">
                Booking Details
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="quantity" className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                    Number of Guests *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    required
                    min="1"
                    max={facility.capacity}
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-500 transition font-light"
                  />
                  <p className="text-xs text-neutral-500 mt-2 font-light">
                    Maximum capacity: {facility.capacity} guests
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="notes" className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                  Special Requests (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any special requirements..."
                  className="w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 focus:outline-none focus:border-neutral-500 transition font-light"
                />
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-neutral-50 border border-neutral-200 p-6">
              <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-4">
                Booking Summary
              </h3>

              <div className="space-y-3 text-sm font-light">
                <div className="flex justify-between">
                  <span className="text-neutral-700">Facility Rate:</span>
                  <span className="text-neutral-900">₹{facility.price}/hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-700">Number of Guests:</span>
                  <span className="text-neutral-900">{formData.quantity}</span>
                </div>
                {formData.startTime && formData.endTime && (
                  <div className="flex justify-between">
                    <span className="text-neutral-700">Duration:</span>
                    <span className="text-neutral-900">
                      {(() => {
                        const start = new Date(`2000-01-01T${formData.startTime}`);
                        const end = new Date(`2000-01-01T${formData.endTime}`);
                        const hours = (end - start) / (1000 * 60 * 60);
                        return hours > 0 ? `${hours.toFixed(1)} hours` : "Invalid";
                      })()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-neutral-200 text-base">
                  <span className="text-neutral-900 font-normal">Total Price:</span>
                  <span className="text-neutral-900 font-normal">₹{totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-neutral-200">
              <button
                type="submit"
                disabled={submitting || !totalPrice || totalPrice <= 0}
                className="w-full flex justify-center py-4 px-4 border border-transparent text-xs font-light uppercase tracking-widest text-white bg-neutral-800 hover:bg-neutral-900 focus:outline-none transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Booking...
                  </span>
                ) : (
                  `Confirm Booking - ₹${totalPrice}`
                )}
              </button>

              <p className="text-xs text-neutral-500 text-center mt-4 font-light">
                Payment will be processed after confirmation
              </p>
            </div>
          </div>
        </form>
      </div>
    </PublicLayout>
  );
}

