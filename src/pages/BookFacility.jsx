import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import { getFacilityById, createFacilityBooking } from "../services/FacilityService";
import { useAuth } from "../hooks/useAuth";

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

  // Operating hours constants (6 AM - 11 PM)
  const OPERATING_HOURS = {
    START: 6,
    END: 23
  };

  // Date range constants
  const DATE_RESTRICTIONS = {
    MIN_ADVANCE_HOURS: 2,
    MAX_ADVANCE_DAYS: 90
  };

  // Duration constants
  const DURATION_LIMITS = {
    MIN_HOURS: 1,
    MAX_HOURS: 12
  };

  // Buffer time constants (minutes between bookings)
  const BUFFER_TIME = {
    MIN_MINUTES: 15,
    MAX_MINUTES: 60,
    DEFAULT_MINUTES: 30
  };

  // Customer booking limits
  const CUSTOMER_LIMITS = {
    MAX_ACTIVE_BOOKINGS: 3
  };

  // SPA-specific slot durations (in minutes)
  const SPA_ALLOWED_DURATIONS = [60, 90, 120]; // 1h, 1.5h, 2h

  // State for tracking customer's active bookings
  const [activeBookingsCount, setActiveBookingsCount] = useState(0);
  const [loadingBookingsCount, setLoadingBookingsCount] = useState(false);

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

  // Fetch active bookings count when user is available
  useEffect(() => {
    if (user?.userId && isAuthenticated) {
      fetchActiveBookingsCount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId, isAuthenticated]);

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

  // Get min date (2 hours from now)
  const getMinDate = () => {
    const minDate = new Date();
    minDate.setHours(minDate.getHours() + DATE_RESTRICTIONS.MIN_ADVANCE_HOURS);
    return minDate.toISOString().split('T')[0];
  };

  // Get max date (90 days from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + DATE_RESTRICTIONS.MAX_ADVANCE_DAYS);
    return maxDate.toISOString().split('T')[0];
  };

  // Generate time options (only 6 AM to 11 PM)
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = OPERATING_HOURS.START; hour <= OPERATING_HOURS.END; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(time);
      }
    }
    return options;
  };

  // Validate time is within operating hours
  const isWithinOperatingHours = (timeString) => {
    const [hour] = timeString.split(':').map(Number);
    return hour >= OPERATING_HOURS.START && hour <= OPERATING_HOURS.END;
  };

  // Calculate duration in hours
  const calculateDurationHours = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return (end - start) / (1000 * 60 * 60);
  };

  // Validate duration
  const validateDuration = (startTime, endTime) => {
    const hours = calculateDurationHours(startTime, endTime);

    if (hours <= 0) {
      return "End time must be after start time";
    }
    if (hours < DURATION_LIMITS.MIN_HOURS) {
      return `Minimum booking duration is ${DURATION_LIMITS.MIN_HOURS} hour${DURATION_LIMITS.MIN_HOURS > 1 ? 's' : ''}`;
    }
    if (hours > DURATION_LIMITS.MAX_HOURS) {
      return `Maximum booking duration is ${DURATION_LIMITS.MAX_HOURS} hours`;
    }
    return null;
  };

  // Check if facility is SPA
  const isSpaFacility = () => {
    return facility?.type === 'SPA';
  };

  // Validate SPA slot duration
  const validateSpaSlot = (startTime, endTime) => {
    if (!isSpaFacility()) return null;

    const durationMinutes = calculateDurationHours(startTime, endTime) * 60;

    if (!SPA_ALLOWED_DURATIONS.includes(durationMinutes)) {
      return `SPA bookings must be ${SPA_ALLOWED_DURATIONS.join(', ')} minutes only`;
    }
    return null;
  };

  // Fetch customer's active bookings count
  const fetchActiveBookingsCount = async () => {
    if (!user?.userId) return;

    setLoadingBookingsCount(true);
    try {
      const response = await fetch(`http://localhost:9193/facility-bookings/customer/${user.userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const bookings = await response.json();
        // Count only CONFIRMED bookings (not CANCELLED or COMPLETED)
        const activeCount = bookings.filter(b => b.bookingStatus === 'CONFIRMED').length;
        setActiveBookingsCount(activeCount);
      }
    } catch (error) {
      console.error('Error fetching active bookings:', error);
    } finally {
      setLoadingBookingsCount(false);
    }
  };

  // Check if customer has reached booking limit
  const hasReachedBookingLimit = () => {
    return activeBookingsCount >= CUSTOMER_LIMITS.MAX_ACTIVE_BOOKINGS;
  };

  // Calculate buffer time in minutes
  const getBufferMinutes = () => {
    return BUFFER_TIME.DEFAULT_MINUTES;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate time inputs
    if (name === 'startTime' || name === 'endTime') {
      if (value && !isWithinOperatingHours(value)) {
        setMessage(`Operating hours are ${OPERATING_HOURS.START}:00 AM - ${OPERATING_HOURS.END}:00 PM`);
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear previous messages when user types
    setMessage("");

    // Validate duration when both times are set
    if (name === 'startTime' && formData.endTime) {
      const error = validateDuration(value, formData.endTime);
      if (error) setMessage(error);
    }
    if (name === 'endTime' && formData.startTime) {
      const error = validateDuration(formData.startTime, value);
      if (error) setMessage(error);
    }
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

    // Validate date is within allowed range
    const selectedDate = new Date(formData.bookingDate);
    const minDate = new Date(getMinDate());
    const maxDate = new Date(getMaxDate());

    if (selectedDate < minDate) {
      setMessage(`Bookings must be made at least ${DATE_RESTRICTIONS.MIN_ADVANCE_HOURS} hours in advance`);
      setSubmitting(false);
      return;
    }

    if (selectedDate > maxDate) {
      setMessage(`Bookings cannot be made more than ${DATE_RESTRICTIONS.MAX_ADVANCE_DAYS} days in advance`);
      setSubmitting(false);
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      setMessage("Please select start and end time");
      setSubmitting(false);
      return;
    }

    // Check customer booking limit
    if (hasReachedBookingLimit()) {
      setMessage(`You have reached the maximum limit of ${CUSTOMER_LIMITS.MAX_ACTIVE_BOOKINGS} active bookings. Please complete or cancel an existing booking first.`);
      setSubmitting(false);
      return;
    }

    // Validate times are within operating hours
    if (!isWithinOperatingHours(formData.startTime)) {
      setMessage(`Start time must be between ${OPERATING_HOURS.START}:00 AM and ${OPERATING_HOURS.END}:00 PM`);
      setSubmitting(false);
      return;
    }

    if (!isWithinOperatingHours(formData.endTime)) {
      setMessage(`End time must be between ${OPERATING_HOURS.START}:00 AM and ${OPERATING_HOURS.END}:00 PM`);
      setSubmitting(false);
      return;
    }

    // Validate duration
    const durationError = validateDuration(formData.startTime, formData.endTime);
    if (durationError) {
      setMessage(durationError);
      setSubmitting(false);
      return;
    }

    // Validate SPA slot duration if facility is SPA
    const spaSlotError = validateSpaSlot(formData.startTime, formData.endTime);
    if (spaSlotError) {
      setMessage(spaSlotError);
      setSubmitting(false);
      return;
    }

    // Validate quantity
    if (formData.quantity < 1) {
      setMessage("Number of guests must be at least 1");
      setSubmitting(false);
      return;
    }

    if (formData.quantity > facility.capacity) {
      setMessage(`Maximum capacity is ${facility.capacity} guests`);
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

      console.log(" Facility booking response:", response);

      // FacilityService already unwraps response.data, so response is the data
      const bookingId = response.facilityBookingId ||
                       response.facility_booking_id ||
                       response.id;

      console.log(" Extracted facility bookingId:", bookingId);

      if (!bookingId) {
        console.error(" No booking ID found in response:", response);
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
      console.error("Facility booking error:", error);
      console.error("Error response:", error.response?.data);
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
  const minDate = getMinDate();
  const maxDate = getMaxDate();
  const timeOptions = generateTimeOptions();

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
            <p className="text-neutral-700 font-light">Complete your booking below
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
            {/* Customer Booking Limit Warning */}
            {loadingBookingsCount ? (
              <div className="bg-neutral-50 border border-neutral-200 p-4 rounded animate-fade-in">
                <p className="text-sm text-neutral-600 font-light text-center">
                  Checking your active bookings...
                </p>
              </div>
            ) : hasReachedBookingLimit() ? (
              <div className="bg-red-50 border border-red-300 p-6 rounded animate-fade-in">
                <h4 className="text-xs uppercase tracking-widest text-red-900 font-medium mb-3 flex items-center gap-2">
                  <span>⚠️</span>
                  Booking Limit Reached
                </h4>
                <p className="text-sm text-red-800 font-light mb-2">
                  You have reached the maximum limit of {CUSTOMER_LIMITS.MAX_ACTIVE_BOOKINGS} active bookings.
                </p>
                <p className="text-sm text-red-700 font-light">
                  Please complete or cancel an existing booking before making a new one.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/my-bookings')}
                  className="mt-4 px-6 py-2 bg-red-600 text-white text-xs uppercase tracking-wider font-light hover:bg-red-700 transition"
                >
                  View My Bookings
                </button>
              </div>
            ) : activeBookingsCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded animate-fade-in">
                <p className="text-sm text-amber-800 font-light">
                  <span className="font-medium">Note:</span> You have {activeBookingsCount} active booking{activeBookingsCount !== 1 ? 's' : ''}.
                  You can have up to {CUSTOMER_LIMITS.MAX_ACTIVE_BOOKINGS} active bookings at a time.
                </p>
              </div>
            )}

            {/* Booking Rules Info Box */}
            <div className="bg-blue-50 border border-blue-200 p-6 rounded animate-fade-in">
              <h4 className="text-xs uppercase tracking-widest text-blue-900 font-medium mb-4 flex items-center gap-2">
                <span>ℹ️</span>
                Booking Guidelines
              </h4>
              <ul className="space-y-2 text-sm text-blue-800 font-light">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Operating Hours: {OPERATING_HOURS.START}:00 AM - {OPERATING_HOURS.END}:00 PM daily</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Advance Booking: {DATE_RESTRICTIONS.MIN_ADVANCE_HOURS} hours to {DATE_RESTRICTIONS.MAX_ADVANCE_DAYS} days ahead</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Duration: Minimum {DURATION_LIMITS.MIN_HOURS} hour, Maximum {DURATION_LIMITS.MAX_HOURS} hours per booking</span>
                </li>
                {isSpaFacility() && (
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span className="font-medium">SPA Slots: Must be exactly {SPA_ALLOWED_DURATIONS.join(', ')} minutes only</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Buffer Time: {BUFFER_TIME.DEFAULT_MINUTES} minutes between bookings (automatic)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Capacity: Maximum {facility.capacity} guests for this facility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Active Bookings Limit: Maximum {CUSTOMER_LIMITS.MAX_ACTIVE_BOOKINGS} bookings per customer</span>
                </li>
              </ul>
            </div>

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
                    min={minDate}
                    max={maxDate}
                    value={formData.bookingDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-500 transition font-light"
                  />
                  <p className="text-xs text-neutral-500 mt-2 font-light">
                    Book {DATE_RESTRICTIONS.MIN_ADVANCE_HOURS}h - {DATE_RESTRICTIONS.MAX_ADVANCE_DAYS} days in advance
                  </p>
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
                  <select
                    id="startTime"
                    name="startTime"
                    required
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-500 transition font-light"
                  >
                    <option value="">Select start time</option>
                    {timeOptions.map((time) => (
                      <option key={`start-${time}`} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-neutral-500 mt-2 font-light">
                    Operating hours: {OPERATING_HOURS.START}:00 AM - {OPERATING_HOURS.END}:00 PM
                  </p>
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                    End Time *
                  </label>
                  <select
                    id="endTime"
                    name="endTime"
                    required
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-500 transition font-light"
                  >
                    <option value="">Select end time</option>
                    {timeOptions.map((time) => (
                      <option key={`end-${time}`} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-neutral-500 mt-2 font-light">
                    Min: {DURATION_LIMITS.MIN_HOURS}h, Max: {DURATION_LIMITS.MAX_HOURS}h duration
                  </p>
                </div>
              </div>

              {/* SPA Quick Slot Selector */}
              {isSpaFacility() && formData.startTime && (
                <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded animate-fade-in">
                  <h4 className="text-xs uppercase tracking-widest text-purple-900 font-medium mb-3">
                    SPA Quick Select (Standard Durations)
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {SPA_ALLOWED_DURATIONS.map((minutes) => {
                      const hours = minutes / 60;
                      const startHour = parseInt(formData.startTime.split(':')[0]);
                      const startMinute = parseInt(formData.startTime.split(':')[1]);
                      const endHour = Math.floor((startHour * 60 + startMinute + minutes) / 60);
                      const endMinute = (startHour * 60 + startMinute + minutes) % 60;
                      const calculatedEndTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

                      const isSelected = formData.endTime === calculatedEndTime;
                      const isWithinHours = endHour <= OPERATING_HOURS.END;

                      return (
                        <button
                          key={minutes}
                          type="button"
                          disabled={!isWithinHours}
                          onClick={() => {
                            if (isWithinHours) {
                              setFormData(prev => ({ ...prev, endTime: calculatedEndTime }));
                            }
                          }}
                          className={`px-4 py-3 border text-sm font-light transition ${
                            isSelected 
                              ? 'bg-purple-600 text-white border-purple-600'
                              : isWithinHours
                                ? 'bg-white text-purple-900 border-purple-300 hover:bg-purple-100'
                                : 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                          }`}
                        >
                          {hours}h ({minutes} min)
                          {!isWithinHours && <span className="block text-xs mt-1">Outside hours</span>}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-purple-700 mt-3 font-light">
                    Click to automatically set end time based on standard SPA session durations
                  </p>
                </div>
              )}

              {/* Duration Display with Validation */}
              {formData.startTime && formData.endTime && (
                <div className="mt-4 p-4 border rounded animate-fade-in">
                  {(() => {
                    const duration = calculateDurationHours(formData.startTime, formData.endTime);
                    const durationError = validateDuration(formData.startTime, formData.endTime);
                    const spaError = validateSpaSlot(formData.startTime, formData.endTime);
                    const error = durationError || spaError;
                    const isValid = !error;

                    return (
                      <div className={`flex items-center justify-between ${isValid ? 'text-green-700' : 'text-red-700'}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{isValid ? '✓' : '✗'}</span>
                          <div>
                            <p className="text-sm font-light">
                              Duration: <strong>{duration.toFixed(1)} hours</strong> ({(duration * 60).toFixed(0)} minutes)
                            </p>
                            {error && (
                              <p className="text-xs mt-1">{error}</p>
                            )}
                            {isValid && isSpaFacility() && (
                              <p className="text-xs mt-1 text-green-600">
                                ✓ Valid SPA slot duration
                              </p>
                            )}
                          </div>
                        </div>
                        {isValid && (
                          <div className="text-xs uppercase tracking-wider font-light px-3 py-1 bg-green-50 border border-green-200 rounded">
                            Valid
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
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
                {formData.startTime && formData.endTime && (
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-600">Buffer Time (Auto):</span>
                    <span className="text-neutral-700">{BUFFER_TIME.DEFAULT_MINUTES} minutes</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-neutral-200 text-base">
                  <span className="text-neutral-900 font-normal">Total Price:</span>
                  <span className="text-neutral-900 font-normal">₹{totalPrice}</span>
                </div>
                <div className="mt-2 text-xs text-neutral-600 font-light">
                  <p>• Buffer time is automatically added between bookings</p>
                  {isSpaFacility() && (
                    <p>• SPA session must be {SPA_ALLOWED_DURATIONS.join('/')} minutes</p>
                  )}
                  <p>• You have {CUSTOMER_LIMITS.MAX_ACTIVE_BOOKINGS - activeBookingsCount} booking slot{CUSTOMER_LIMITS.MAX_ACTIVE_BOOKINGS - activeBookingsCount !== 1 ? 's' : ''} remaining</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-neutral-200">
              <button
                type="submit"
                disabled={submitting || totalPrice === null || totalPrice === undefined || hasReachedBookingLimit()}
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
                ) : hasReachedBookingLimit() ? (
                  `Booking Limit Reached (${CUSTOMER_LIMITS.MAX_ACTIVE_BOOKINGS}/${CUSTOMER_LIMITS.MAX_ACTIVE_BOOKINGS})`
                ) : (
                  `Confirm Booking - ₹${totalPrice}`
                )}
              </button>

              <p className="text-xs text-neutral-500 text-center mt-4 font-light">
                {totalPrice > 0 ? 'Payment will be processed after confirmation' : 'This is a complimentary facility'}
              </p>
            </div>
          </div>
        </form>
      </div>
    </PublicLayout>
  );
}

