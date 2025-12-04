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
    const { id } = useParams(); // optional: support /book-room/:id for preselected room

    const [formData, setFormData] = useState({
        customerId: user?.userId || "",
        branchId: "",
        typeId: "",
        roomId: id || "", // preselect if arriving via /book-room/:id
        checkInDate: "",
        checkOutDate: "",
        notes: "",
        quantity: 1,
    });

    const [preselectedRoom, setPreselectedRoom] = useState(null); // Store pre-selected room details
    const isRoomPreselected = !!id; // True if user came from Rooms page

    // Update customerId when user loads
    useEffect(() => {
        if (user?.userId && formData.customerId !== user.userId) {
            setFormData((prev) => ({ ...prev, customerId: user.userId }));
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            console.log("🔍 Fetching pre-selected room:", id);
            const res = await RoomService.getRoomById(id);
            const room = res.data || res;
            console.log("✅ Pre-selected room loaded:", room);

            // Store full room details for display
            setPreselectedRoom(room);

            // Pre-fill form
            setFormData((prev) => ({
                ...prev,
                branchId: room.branchId?.toString() || "",
                typeId: room.typeId?.toString() || "",
                roomId: room.roomId?.toString() || "",
                quantity: room.capacity || 1, // Set default to room capacity
            }));
        } catch (error) {
            console.error("❌ Error loading pre-selected room:", error);
            // If not found, gracefully allow user to select manually
            setPreselectedRoom(null);
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

    const fetchRoomTypes = async () => {
        try {
            console.log("🔍 Fetching room types...");
            const res = await RoomTypeService.getAllRoomTypes();
            console.log("✅ Room types response:", res);

            const types = res.data || res || [];
            console.log("📦 Extracted room types:", types);

            setRoomTypes(types);
        } catch (error) {
            console.error("❌ Error fetching room types:", error);
            console.error("❌ Error details:", error.response?.data || error.message);

            // Fallback: derive unique types from all rooms
            console.log("⚠️ Using fallback: deriving types from rooms");
            try {
                const roomsRes = await RoomService.getAllRooms();
                const rooms = roomsRes.data || [];
                const uniqueByTypeId = new Map();
                rooms.forEach((r) => {
                    if (!uniqueByTypeId.has(r.typeId)) uniqueByTypeId.set(r.typeId, r);
                });
                setRoomTypes(Array.from(uniqueByTypeId.values()));
            } catch (fallbackError) {
                console.error("❌ Fallback also failed:", fallbackError);
                setRoomTypes([]);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        // convert numeric fields to numbers
        const parsedValue =
            type === "number" ? (value === "" ? "" : parseInt(value, 10)) : value;
        setFormData((prev) => ({
            ...prev,
            [name]: parsedValue,
        }));
    };

    // Validate dates before searching
    const validateDates = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) {
            return "Please select both check-in and check-out dates";
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Reset time for comparison

        if (checkInDate < now) {
            return "Check-in date cannot be in the past";
        }

        if (checkOutDate <= checkInDate) {
            return "Check-out date must be after check-in date";
        }

        const daysDiff = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        if (daysDiff > 30) {
            return "Maximum booking duration is 30 days";
        }

        return null; // Valid
    };

    // Search for available rooms based on dates
    const handleSearchAvailability = async () => {
        setMessage("");

        // Validate all required fields
        const dateError = validateDates(formData.checkInDate, formData.checkOutDate);
        if (dateError) {
            setMessage(dateError);
            return;
        }

        if (!formData.branchId || !formData.typeId) {
            setMessage("Please select both Branch and Room Type");
            return;
        }

        try {
            setLoading(true);
            console.log("🔍 Searching availability for:", {
                branchId: formData.branchId,
                typeId: formData.typeId,
                checkIn: formData.checkInDate,
                checkOut: formData.checkOutDate,
            });

            const res = await RoomService.getAvailableRoomsForDates(
                formData.branchId,
                formData.typeId,
                formData.checkInDate,
                formData.checkOutDate
            );

            console.log("✅ Available rooms:", res);

            const rooms = Array.isArray(res) ? res : (res.data || []);
            setAvailableRooms(rooms);

            if (!rooms || rooms.length === 0) {
                setMessage("No rooms available for the selected dates. Please try different dates.");
            } else {
                setMessage(`Found ${rooms.length} available room${rooms.length > 1 ? "s" : ""} for your dates!`);
            }
        } catch (error) {
            console.error("❌ Error searching availability:", error);
            setMessage("Failed to search available rooms. Please try again.");
            setAvailableRooms([]);
        } finally {
            setLoading(false);
        }
    };

    // Price calculation: nights * room price
    const calculatePrice = () => {
        if (!formData.checkInDate || !formData.checkOutDate || !formData.roomId) return 0;
        const checkIn = new Date(formData.checkInDate);
        const checkOut = new Date(formData.checkOutDate);
        const nights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
        if (nights <= 0) return 0;

        // Use pre-selected room price if available, otherwise find from availableRooms
        let pricePerNight = 0;
        if (isRoomPreselected && preselectedRoom) {
            pricePerNight = Number(preselectedRoom.pricePerNight || 0);
        } else {
            const selectedRoom = availableRooms.find(
                (r) => String(r.roomId) === String(formData.roomId)
            );
            if (!selectedRoom) return 0;
            pricePerNight = Number(selectedRoom.pricePerNight || 0);
        }

        return (pricePerNight * nights).toFixed(2);
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
            navigate("/login");
            return;
        }

        // Format dates for backend (ensure ISO datetime format)
        const checkInDateTime = new Date(formData.checkInDate + "T14:00:00"); // 2pm check-in
        const checkOutDateTime = new Date(formData.checkOutDate + "T12:00:00"); // 12pm check-out

        const bookingRequest = {
            customerId: parseInt(formData.customerId, 10),
            branchId: parseInt(formData.branchId, 10),
            roomId: parseInt(formData.roomId, 10),
            checkInDate: checkInDateTime.toISOString().split(".")[0], // Remove milliseconds
            checkOutDate: checkOutDateTime.toISOString().split(".")[0],
            totalPrice: parseFloat(totalPrice) || 0,
            paymentStatus: "PENDING",
            bookingStatus: "CONFIRMED",
            notes: formData.notes || null,
        };

        console.log("📤 Sending booking request:", bookingRequest);
        console.log("📤 Query params - branchId:", formData.branchId, "typeId:", formData.typeId);

        try {
            const response = await BookingService.createBooking(
                bookingRequest,
                formData.branchId,
                formData.typeId
            );

            console.log("📦 Booking response:", response);
            console.log("📦 Response data:", response.data);

            const bookingData = response.data || response;

            // Try multiple possible locations for booking ID
            const bookingId =
                bookingData?.bookingId ||
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

            const selectedRoom =
                availableRooms.find((r) => String(r.roomId) === String(formData.roomId)) || preselectedRoom;

            // Redirect immediately (no long blocking)
            navigate(`/payment/room/${bookingId}`, {
                state: {
                    bookingType: "room",
                    bookingId: bookingId,
                    amount: totalPrice,
                    bookingDetails: {
                        roomNumber: selectedRoom?.roomNumber || "N/A",
                        checkIn: formData.checkInDate,
                        checkOut: formData.checkOutDate,
                        numberOfGuests: formData.quantity,
                    },
                },
            });
        } catch (error) {
            console.error("❌ Booking error:", error);
            console.error("❌ Error response:", error.response?.data);
            const errorMsg = error.response?.data?.message || error.response?.data || "Booking failed. Please try again.";
            setMessage(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
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
                        onClick={() => navigate("/rooms")}
                        className="text-xs uppercase tracking-wider text-neutral-600 hover:text-neutral-900 transition font-light mb-6"
                    >
                        ← Back to Rooms
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
                        {typeof message === "string" ? message : JSON.stringify(message, null, 2)}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 p-10">
                    <div className="space-y-8">
                        {/* Show Selected Room Details (if pre-selected) */}
                        {isRoomPreselected && preselectedRoom && (
                            <div className="bg-neutral-50 border border-neutral-200 p-6">
                                <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-4">
                                    Your Selected Room
                                </h3>
                                <div className="flex items-start gap-6">
                                    {/* Room Image */}
                                    {preselectedRoom.roomPrimaryImage && (
                                        <div className="w-32 h-32 bg-neutral-200 overflow-hidden flex-shrink-0">
                                            <img
                                                src={preselectedRoom.roomPrimaryImage}
                                                alt={`Room ${preselectedRoom.roomNumber}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Room Details */}
                                    <div className="flex-1">
                                        <h4 className="text-xl font-light text-neutral-900 mb-2">Room {preselectedRoom.roomNumber}</h4>
                                        {preselectedRoom.description && (
                                            <p className="text-sm text-neutral-700 font-light mb-3">{preselectedRoom.description}</p>
                                        )}
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-neutral-600 font-light">Capacity:</span>{" "}
                                                <span className="text-neutral-900">{preselectedRoom.capacity} guests</span>
                                            </div>
                                            <div>
                                                <span className="text-neutral-600 font-light">Rate:</span>{" "}
                                                <span className="text-neutral-900">
                          ₹{parseFloat(preselectedRoom.pricePerNight).toLocaleString()}/night
                        </span>
                                            </div>
                                            {preselectedRoom.floorNumber && (
                                                <div>
                                                    <span className="text-neutral-600 font-light">Floor:</span>{" "}
                                                    <span className="text-neutral-900">{preselectedRoom.floorNumber}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Change Room Link */}
                                <div className="mt-4 pt-4 border-t border-neutral-200">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/rooms")}
                                        className="text-xs uppercase tracking-wider text-neutral-600 hover:text-neutral-900 transition font-light"
                                    >
                                        ← Change Room
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 1: Select Dates */}
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-6 pb-3 border-b border-neutral-200">
                                {isRoomPreselected ? "Step 1: Select Your Dates" : "Step 1: Select Your Dates"}
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="checkInDate"
                                        className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3"
                                    >
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
                                    <label
                                        htmlFor="checkOutDate"
                                        className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3"
                                    >
                                        Check-Out Date *
                                    </label>
                                    <input
                                        type="date"
                                        id="checkOutDate"
                                        name="checkOutDate"
                                        min={formData.checkInDate || today}
                                        required
                                        value={formData.checkOutDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-500 transition font-light"
                                    />
                                </div>
                            </div>

                            {/* Date Info */}
                            {formData.checkInDate && formData.checkOutDate && (
                                <div className="mt-4 p-4 bg-neutral-50 border border-neutral-200">
                                    <p className="text-sm text-neutral-700 font-light">
                                        <span className="font-normal">Duration:</span>{" "}
                                        {(() => {
                                            const checkIn = new Date(formData.checkInDate);
                                            const checkOut = new Date(formData.checkOutDate);
                                            const nights = Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));
                                            return nights > 0 ? `${nights} night${nights > 1 ? "s" : ""}` : "Invalid dates";
                                        })()}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Step 2: Select Branch & Room Type (only show if room NOT pre-selected) */}
                        {!isRoomPreselected && (
                            <div>
                                <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-6 pb-3 border-b border-neutral-200">
                                    Step 2: Select Location & Room Type
                                </h3>
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
                                        <label
                                            htmlFor="typeId"
                                            className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3"
                                        >
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
                            </div>
                        )}

                        {/* Step 3: Search Button (only show if room NOT pre-selected) */}
                        {!isRoomPreselected && (
                            <div className="pt-4 border-t border-neutral-200">
                                <button
                                    type="button"
                                    onClick={handleSearchAvailability}
                                    disabled={!formData.checkInDate || !formData.checkOutDate || !formData.branchId || !formData.typeId}
                                    className="w-full flex justify-center py-4 px-4 border border-transparent text-xs font-light uppercase tracking-widest text-white bg-neutral-800 hover:bg-neutral-900 focus:outline-none transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Search Available Rooms
                                </button>
                                <p className="text-xs text-neutral-500 text-center mt-3 font-light">
                                    Complete all fields above to search for available rooms
                                </p>
                            </div>
                        )}

                        {/* Step 4: Room Selection (appears after search, only if room NOT pre-selected) */}
                        {!isRoomPreselected && availableRooms && availableRooms.length > 0 && (
                            <div>
                                <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-6 pb-3 border-b border-neutral-200">
                                    Step 3: Select Your Room
                                </h3>
                                <RoomList
                                    rooms={availableRooms}
                                    selectedRoomId={formData.roomId}
                                    onSelect={(room) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            roomId: String(room.roomId),
                                            quantity: room.capacity || 1,
                                        }))
                                    }
                                />
                            </div>
                        )}

                        {/* Booking Details */}
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-6 pb-3 border-b border-neutral-200">
                                {isRoomPreselected ? "Step 2: Guest Details" : "Booking Details"}
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="quantity"
                                        className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3"
                                    >
                                        Number of Guests *
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        required
                                        min="1"
                                        max={
                                            (availableRooms.find((r) => String(r.roomId) === String(formData.roomId))?.capacity ||
                                                preselectedRoom?.capacity ||
                                                1)
                                        }
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-500 transition font-light"
                                    />
                                    {formData.roomId && (
                                        <p className="text-xs text-neutral-500 mt-2 font-light">
                                            Capacity:{" "}
                                            {availableRooms.find((r) => String(r.roomId) === String(formData.roomId))?.capacity ||
                                                preselectedRoom?.capacity ||
                                                "N/A"}{" "}
                                            guests
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6">
                                <label
                                    htmlFor="notes"
                                    className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3"
                                >
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
                                {isRoomPreselected ? "Step 3: Booking Summary" : "Booking Summary"}
                            </h3>

                            <div className="space-y-3 text-sm font-light">
                                {/* Room Info */}
                                {isRoomPreselected && preselectedRoom && (
                                    <div className="flex justify-between pb-3 border-b border-neutral-200">
                                        <span className="text-neutral-700">Room:</span>
                                        <span className="text-neutral-900">Room {preselectedRoom.roomNumber}</span>
                                    </div>
                                )}

                                {/* Room Rate */}
                                {formData.roomId && (
                                    <div className="flex justify-between">
                                        <span className="text-neutral-700">Room Rate:</span>
                                        <span className="text-neutral-900">
                      ₹
                                            {isRoomPreselected && preselectedRoom
                                                ? parseFloat(preselectedRoom.pricePerNight).toLocaleString()
                                                : (availableRooms.find((r) => String(r.roomId) === String(formData.roomId))?.pricePerNight || 0)
                                            }
                                            /night
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
                                disabled={submitting || !totalPrice || Number(totalPrice) <= 0}
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

                            <p className="text-xs text-neutral-500 text-center mt-4 font-light">Payment will be processed after confirmation</p>
                        </div>
                    </div>
                </form>
            </div>
        </PublicLayout>
    );
}
