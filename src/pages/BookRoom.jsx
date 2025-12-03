// src/pages/BookRoom.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import BookingService from "../services/RoomBookingService";
import RoomService from "../services/RoomService";
import RoomTypeService from "../services/RoomTypeService";
import { useAuth } from "../context/AuthContext";
import BranchService from "../services/BranchService";
import RoomList from "./RoomList";


export default function BookRoom() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { id } = useParams(); 

  const [formData, setFormData] = useState({
    customerId: user?.userId || "",
    branchId: "",
    typeId: "",
    roomId: id || "", 
    checkInDate: "",
    checkOutDate: "",
    notes: "",
    quantity: 1,
  });

  // Update customerId when user loads
  useEffect(() => {
    if (user?.userId && formData.customerId !== user.userId) {
      setFormData(prev => ({ ...prev, customerId: user.userId }));
    }
  }, [user, formData.customerId]);

  const [roomTypes, setRoomTypes] = useState([]); // dropdown of types
  const [branches, setBranches] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
  // Wait until auth is finished
  if (!authLoading && !isAuthenticated) {
    localStorage.setItem("returnUrl", window.location.pathname);
    navigate("/login");
  }
  if (!authLoading && isAuthenticated) {
    initialize();
  }
}, [isAuthenticated, authLoading]);

// Initialize: fetch branches, room types, and optionally resolve room by ID
const initialize = async () => {
  try {
    await Promise.all([fetchBranches(), fetchRoomTypes(), resolvePreselectedRoom()]);
  } catch (e) {
    console.error("Initialization error:", e);
  } finally {
    setLoading(false);
  }
};

// If arriving with /book-room/:id, fetch that room to set branch/type
const resolvePreselectedRoom = async () => {
  if (!id) return;
  try {
    const res = await RoomService.getRoomById(id);
    const room = res.data;
    setFormData((prev) => ({
      ...prev,
      branchId: room.branchId?.toString() || "",
      typeId: room.typeId?.toString() || "",
      roomId: room.roomId?.toString() || "",
    }));
    // Load availability list for that branch/type to populate dropdown
    if (room.branchId && room.typeId) {
      const avail = await RoomService.getAvailableRooms(room.branchId, room.typeId);
      setAvailableRooms(avail.data || []);
    }
  } catch (error) {
    console.error("Error resolving preselected room:", error);
    
  }
};

const fetchBranches = async () => {
  try {
    const res = await BranchService.getAllBranches();
    
    setBranches(res.data || []);
  } catch (error) {
    console.error("Error fetching branches:", error);
    setBranches([]);
  }
};




const fetchRoomTypes = async (typeId) => {
  try {
    // Directly call your dedicated endpoint
    const res = await RoomTypeService.getAllRoomTypes();

     setRoomTypes(res.data || []);
  } catch (error) {
    console.error("Error fetching Room types:", error);
    setRoomTypes([]);
  }

  
};
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Load rooms after selecting branch + type
  const loadAvailableRooms = async () => {
    setMessage("");
    if (!formData.branchId || !formData.typeId) {
      setMessage("Please select Branch and Room Type before loading rooms");
      return;
    }
    try {
      const res = await RoomService.getAvailableRooms(formData.branchId, formData.typeId);
      setAvailableRooms(res.data || []);
      if (res.data?.length === 0) {
        setMessage("No available rooms for the selected branch and type");
      }
    } catch (error) {
      console.error("Error fetching available rooms:", error);
      setMessage("Failed to load available rooms");
    }
  };

  // Price calculation: nights * room price 
  const calculatePrice = () => {
    if (!formData.checkInDate || !formData.checkOutDate || !formData.roomId) return 0;
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const nights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
    if (nights <= 0) return 0;
    const selectedRoom = availableRooms.find(
      (r) => r.roomId === parseInt(formData.roomId)
    );
    if (!selectedRoom) return 0;
    return (selectedRoom.pricePerNight * nights ).toFixed(2);
  };

  const totalPrice = calculatePrice();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    // Validation
    if (!formData.checkInDate || !formData.checkOutDate) {
      setMessage("Please select check-in and check-out dates");
      setSubmitting(false);
      return;
    }
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    if (checkOut <= checkIn) {
      setMessage("Check-out date must be after check-in date");
      setSubmitting(false);
      return;
    }
    if (!formData.branchId) {
      setMessage("Please select a Branch");
      setSubmitting(false);
      return;
    }
    if (!formData.typeId) {
      setMessage("Please select a Room Type");
      setSubmitting(false);
      return;
    }
    if (!formData.roomId) {
      setMessage("Please select a Room");
      setSubmitting(false);
      return;
    }
    if (Number(formData.quantity) < 1) {
      setMessage("Number of guests must be at least 1");
      setSubmitting(false);
      return;
    }
    if (!formData.customerId || !user?.userId) {
      setMessage("User not authenticated. Please login again.");
      setSubmitting(false);
      navigate('/login');
      return;
    }

    // Format dates for backend (ensure ISO datetime format)
    const checkInDateTime = new Date(formData.checkInDate + 'T14:00:00'); // 2pm check-in
    const checkOutDateTime = new Date(formData.checkOutDate + 'T12:00:00'); // 12pm check-out

    const bookingRequest = {
      customerId: parseInt(formData.customerId),
      branchId: parseInt(formData.branchId),
      roomId: parseInt(formData.roomId),
      checkInDate: checkInDateTime.toISOString().split('.')[0], // Remove milliseconds
      checkOutDate: checkOutDateTime.toISOString().split('.')[0],
      totalPrice: parseFloat(totalPrice),
      paymentStatus: 'PENDING',
      bookingStatus: 'CONFIRMED',
      notes: formData.notes || null,
    };

    console.log("📤 Sending booking request:", bookingRequest);
    console.log("📤 Query params - branchId:", formData.branchId, "typeId:", formData.typeId);

// Around line 187-245, replace the conflicted section with:

try {
  const response = await BookingService.createBooking(bookingRequest, formData.branchId, formData.typeId);

  console.log("📦 Booking response:", response);
  console.log("📦 Response data:", response.data);

  // Axios wraps response in .data, so we need response.data
  const bookingData = response.data;

  // Try multiple possible locations for booking ID
  const bookingId = bookingData?.bookingId ||
                   bookingData?.data?.bookingId ||
                   bookingData?.booking_id ||
                   bookingData?.id;

  console.log("🎯 Extracted bookingId:", bookingId);

  if (!bookingId) {
    console.error("❌ No booking ID found in response:", bookingData);
    setMessage("Booking created but could not get booking ID. Please check 'My Bookings'.");
    setSubmitting(false);
    return;
  }

  setMessage("Booking confirmed successfully! Redirecting to payment...");

  const selectedRoom = availableRooms.find(r => r.roomId === parseInt(formData.roomId));

  setTimeout(() => {
    console.log("🔄 Navigating to payment with:", {
      bookingId,
      amount: totalPrice,
      room: selectedRoom?.roomNumber
    });

    navigate(`/payment/room/${bookingId}`, {
      state: {
        bookingType: 'room',
        bookingId: bookingId,
        amount: totalPrice,
        bookingDetails: {
          roomNumber: selectedRoom?.roomNumber || 'N/A',
          checkIn: formData.checkInDate,
          checkOut: formData.checkOutDate,
          numberOfGuests: formData.quantity
        }
      }
    });
  }, 1500);
} catch (error) {
  console.error("❌ Booking error:", error);
  console.error("❌ Error response:", error.response?.data);
  const errorMsg = error.response?.data?.message || error.response?.data || "Booking failed. Please try again.";
  setMessage(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
  setSubmitting(false);
}

    catch (error) {
      console.error("❌ Booking error:", error);
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

  return (
    <PublicLayout>
      <div className="py-24 max-w-4xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate("/home")}
            className="text-xs uppercase tracking-wider text-neutral-600 hover:text-neutral-900 transition font-light mb-6"
          >
            ← Back to Home
          </button>

          <div className="text-center">
            <span className="inline-block text-xs uppercase tracking-widest text-neutral-600 font-light mb-4">
              Book Room
            </span>
            <h1 className="text-3xl md:text-4xl font-light mb-2 text-neutral-900 tracking-wide">
              Room Booking
            </h1>
            <p className="text-neutral-700 font-light">Complete your booking details below</p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-4 border text-sm font-light text-center mb-8 animate-fade-in ${
              String(message).toLowerCase().includes("success") || 
              String(message).toLowerCase().includes("confirmed") ||
              String(message).toLowerCase().includes("redirecting")
                ? "bg-neutral-100 border-neutral-200 text-neutral-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {typeof message === 'string' ? message : JSON.stringify(message, null, 2)}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 p-10">
          <div className="space-y-8">
            {/* Dates */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-6 pb-3 border-b border-neutral-200">
                Select Dates
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="checkInDate" className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                    Check-In Date *
                  </label>
                  <input
                    type="date"
                    id="checkInDate"
                    name="checkInDate"
                    min={today}
                    required
                    value={formData.checkInDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-500 transition font-light"
                  />
                </div>
                <div>
                  <label htmlFor="checkOutDate" className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                    Check-Out Date *
                  </label>
                  <input
                    type="date"
                    id="checkOutDate"
                    name="checkOutDate"
                    min={today}
                    required
                    value={formData.checkOutDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-500 transition font-light"
                  />
                </div>
              </div>
            </div>

            {/* Branch & Room Type */}
            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                  <label
                    htmlFor="branchId"
                    className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3"
                  >
                    Branch *
                  </label>
                  <select
  id="branchId"
  name="branchId"
  required
  value={formData.branchId}
  onChange={handleChange}
  className="w-full px-4 py-3 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-500 transition font-light"
>
  <option value="">Select Branch</option>
  {branches.map((branch) => (
    <option key={branch.branchId} value={branch.branchId}>
      {branch.name}
    </option>
  ))}
</select>

                </div>

              <div>
                <label htmlFor="typeId" className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                  Room Type *
                </label>
                <select
                  id="typeId"
                  name="typeId"
                  required
                  value={formData.typeId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-500 transition font-light"
                >
                  <option value="">Select Room Type</option>
                  {roomTypes.map((type) => (
                    <option key={type.typeId} value={type.typeId}>
                      {type.typeName || type.description || `Type ${type.typeId}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Load Rooms */}
    <button
  type="button"
  onClick={loadAvailableRooms}
  className="px-6 py-3 rounded-lg border text-sm font-medium text-center animate-fade-in
             bg-neutral-50 border-neutral-200 text-neutral-800 shadow-sm
             hover:bg-blue-100 hover:border-blue-300 hover:text-blue-900 hover:shadow-md
             transition duration-300 ease-in-out"
>
  Load Available Rooms
</button>


{availableRooms.length > 0 && (
  <div>
    <label className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
      Select Room *
    </label>
    <RoomList
      rooms={availableRooms}
      selectedRoomId={formData.roomId}
      onSelect={(room) =>
        setFormData((prev) => ({
          ...prev,
          roomId: room.roomId.toString(),
          quantity: room.capacity,
        }))
      }
    />
  </div>
)}

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
                    max={
      availableRooms.find((r) => r.roomId === parseInt(formData.roomId))?.capacity || 1
    }
                  
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-500 transition font-light"
                  />
                 
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
                {formData.roomId && (
                  <div className="flex justify-between">
                    <span className="text-neutral-700">Room Rate:</span>
                    <span className="text-neutral-900">
                      ₹{availableRooms.find((r) => r.roomId === parseInt(formData.roomId))?.pricePerNight || 0}/night
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-700">Number of Guests:</span>
                  <span className="text-neutral-900">{formData.quantity}</span>
                </div>
                {formData.checkInDate && formData.checkOutDate && (
                  <div className="flex justify-between">
                    <span className="text-neutral-700">Duration:</span>
                    <span className="text-neutral-900">
                      {(() => {
                        const checkIn = new Date(formData.checkInDate);
                        const checkOut = new Date(formData.checkOutDate);
                        const nights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
                        return nights > 0 ? `${nights} nights` : "Invalid";
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
