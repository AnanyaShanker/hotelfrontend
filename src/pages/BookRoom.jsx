// src/pages/BookRoom.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import BookingService from "../services/RoomBookingService";
import RoomService from "../services/RoomService";
import RoomTypeService from "../services/RoomTypeService";
import { useAuth } from "../hooks/useAuth";
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

    useEffect(() => {
        if (user?.userId && formData.customerId !== user.userId) {
            setFormData((prev) => ({ ...prev, customerId: user.userId }));
        }
    }, [user, formData.customerId]);

    const [roomTypes, setRoomTypes] = useState([]);
    const [branches, setBranches] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            localStorage.setItem("returnUrl", window.location.pathname);
            navigate("/login");
        }
        if (!authLoading && isAuthenticated) {
            initialize();
        }
    }, [isAuthenticated, authLoading]);

    const initialize = async () => {
        try {
            await Promise.all([fetchBranches(), fetchRoomTypes(), resolvePreselectedRoom()]);
        } catch (e) {
            console.error("Initialization error:", e);
        } finally {
            setLoading(false);
        }
    };

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

    const fetchRoomTypes = async () => {
        try {
            const res = await RoomTypeService.getAllRoomTypes();
            setRoomTypes(res.data || []);
        } catch (error) {
            console.error("Error fetching room types:", error);
            setRoomTypes([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const loadAvailableRooms = async () => {
        setMessage("");

        if (!formData.branchId || !formData.typeId) {
            setMessage("Please select Branch and Room Type before loading rooms");
            return;
        }

        try {
            const res = await RoomService.getAvailableRooms(formData.branchId, formData.typeId);
            setAvailableRooms(res.data || []);

            if (!res.data?.length) {
                setMessage("No available rooms for the selected branch and type");
            }
        } catch (error) {
            console.error("Error loading rooms:", error);
            setMessage("Failed to load available rooms");
        }
    };

    const calculatePrice = () => {
        if (!formData.checkInDate || !formData.checkOutDate || !formData.roomId) return 0;

        const checkIn = new Date(formData.checkInDate);
        const checkOut = new Date(formData.checkOutDate);
        const nights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);

        if (nights <= 0) return 0;

        const selectedRoom = availableRooms.find((r) => r.roomId === parseInt(formData.roomId));
        if (!selectedRoom) return 0;

        return (selectedRoom.pricePerNight * nights).toFixed(2);
    };

    const totalPrice = calculatePrice();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setSubmitting(true);

        if (!formData.checkInDate || !formData.checkOutDate) {
            setMessage("Please select check-in and check-out dates");
            setSubmitting(false);
            return;
        }

        const checkIn = new Date(formData.checkInDate);
        const checkOut = new Date(formData.checkOutDate);

        if (checkOut <= checkIn) {
            setMessage("Check-out must be after Check-in");
            setSubmitting(false);
            return;
        }

        if (!formData.branchId || !formData.typeId || !formData.roomId) {
            setMessage("Please select Branch, Room Type and Room");
            setSubmitting(false);
            return;
        }

        if (!user?.userId) {
            setMessage("User not authenticated. Please login again.");
            setSubmitting(false);
            navigate("/login");
            return;
        }

        const checkInDateTime = new Date(formData.checkInDate + "T14:00:00").toISOString().split(".")[0];
        const checkOutDateTime = new Date(formData.checkOutDate + "T12:00:00").toISOString().split(".")[0];

        const bookingRequest = {
            customerId: parseInt(formData.customerId),
            branchId: parseInt(formData.branchId),
            roomId: parseInt(formData.roomId),
            checkInDate: checkInDateTime,
            checkOutDate: checkOutDateTime,
            totalPrice: parseFloat(totalPrice),
            paymentStatus: "PENDING",
            bookingStatus: "CONFIRMED",
            notes: formData.notes || null,
        };

        try {
            const response = await BookingService.createBooking(bookingRequest, formData.branchId, formData.typeId);

            const bookingId =
                response.data?.bookingId ||
                response.data?.data?.bookingId ||
                response.data?.booking_id ||
                response.data?.id;

            if (!bookingId) {
                setMessage("Booking created but ID not found. Check My Bookings.");
                setSubmitting(false);
                return;
            }

            setMessage("Booking confirmed! Redirecting to payment...");

            const selectedRoom = availableRooms.find((r) => r.roomId === parseInt(formData.roomId));

            setTimeout(() => {
                navigate(`/payment/room/${bookingId}`, {
                    state: {
                        bookingType: "room",
                        bookingId,
                        amount: totalPrice,
                        bookingDetails: {
                            roomNumber: selectedRoom?.roomNumber,
                            checkIn: formData.checkInDate,
                            checkOut: formData.checkOutDate,
                            numberOfGuests: formData.quantity,
                        },
                    },
                });
            }, 1500);
        } catch (error) {
            console.error("Booking error:", error);
            const errMsg =
                error.response?.data?.message || error.response?.data || "Booking failed. Please try again.";
            setMessage(typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg));
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <PublicLayout>
                <div className="flex items-center justify-center min-h-screen text-neutral-600">
                    Loading...
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <div className="py-24 max-w-4xl mx-auto animate-fade-in">

                {/* Header */}
                <div className="mb-12 text-center">
                    <button
                        onClick={() => navigate("/rooms")}
                        className="text-xs uppercase tracking-wider text-neutral-600 hover:text-neutral-900 transition font-light mb-6"
                    >
                        ← Back to Rooms
                    </button>

                    <span className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-4">
            Book Room
          </span>
                    <h1 className="text-4xl font-light text-neutral-900 tracking-wide mb-2">
                        Room Booking
                    </h1>
                    <p className="text-neutral-700 font-light">Complete your booking details below</p>
                </div>

                {/* Message */}
                {message && (
                    <div
                        className={`p-4 border text-sm font-light text-center mb-8 ${
                            message.toLowerCase().includes("success") ||
                            message.toLowerCase().includes("confirmed")
                                ? "bg-neutral-100 border-neutral-200 text-neutral-800"
                                : "bg-red-50 border-red-200 text-red-800"
                        }`}
                    >
                        {message}
                    </div>
                )}

                {/* FORM */}
                <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 p-10">

                    <div className="space-y-10">

                        {/* Dates */}
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-6 pb-3 border-b">
                                Select Dates
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest mb-3">Check-In *</label>
                                    <input
                                        type="date"
                                        name="checkInDate"
                                        min={today}
                                        required
                                        value={formData.checkInDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-neutral-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest mb-3">Check-Out *</label>
                                    <input
                                        type="date"
                                        name="checkOutDate"
                                        min={today}
                                        required
                                        value={formData.checkOutDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-neutral-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Branch + Room Type */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs uppercase tracking-widest mb-3">Branch *</label>
                                <select
                                    name="branchId"
                                    value={formData.branchId}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-neutral-300"
                                >
                                    <option value="">Select Branch</option>
                                    {branches.map((b) => (
                                        <option key={b.branchId} value={b.branchId}>
                                            {b.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-widest mb-3">Room Type *</label>
                                <select
                                    name="typeId"
                                    value={formData.typeId}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-neutral-300"
                                >
                                    <option value="">Select Room Type</option>
                                    {roomTypes.map((t) => (
                                        <option key={t.typeId} value={t.typeId}>
                                            {t.typeName || t.description || `Type ${t.typeId}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Load Rooms Button */}
                        <button
                            type="button"
                            onClick={loadAvailableRooms}
                            className="bg-yellow-500 text-white px-4 py-2 rounded"
                        >
                            Load Available Rooms
                        </button>

                        {/* RoomList */}
                        {availableRooms.length > 0 && (
                            <div>
                                <label className="block text-xs uppercase tracking-widest mb-3">Select Room *</label>
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

                        {/* Guests + Notes */}
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-6 pb-3 border-b">
                                Booking Details
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs uppercase tracking-widest mb-3">Guests *</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        min="1"
                                        max={availableRooms.find((r) => r.roomId === parseInt(formData.roomId))?.capacity || 1}
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-neutral-300"
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="text-xs uppercase tracking-widest mb-3">Special Requests</label>
                                <textarea
                                    name="notes"
                                    rows="3"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-neutral-300"
                                />
                            </div>
                        </div>

                        {/* Price Summary */}
                        <div className="bg-neutral-50 border p-6">
                            <h3 className="text-xs uppercase tracking-widest mb-4">Booking Summary</h3>

                            <div className="space-y-3 text-sm">
                                {formData.roomId && (
                                    <div className="flex justify-between">
                                        <span>Price per night:</span>
                                        <span>
                      ₹
                                            {availableRooms.find((r) => r.roomId === parseInt(formData.roomId))
                                                ?.pricePerNight || 0}
                    </span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span>Guests:</span>
                                    <span>{formData.quantity}</span>
                                </div>

                                {formData.checkInDate && formData.checkOutDate && (
                                    <div className="flex justify-between">
                                        <span>Duration:</span>
                                        <span>
                      {(() => {
                          const ci = new Date(formData.checkInDate);
                          const co = new Date(formData.checkOutDate);
                          const n = (co - ci) / (1000 * 60 * 60 * 24);
                          return n > 0 ? `${n} nights` : "Invalid";
                      })()}
                    </span>
                                    </div>
                                )}

                                <div className="flex justify-between border-t pt-3 text-base">
                                    <span className="font-normal">Total:</span>
                                    <span className="font-normal">₹{totalPrice}</span>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-6 border-t">
                            <button
                                type="submit"
                                disabled={submitting || totalPrice <= 0}
                                className="w-full py-4 bg-neutral-800 text-white uppercase tracking-widest text-xs disabled:opacity-50"
                            >
                                {submitting ? "Processing..." : `Confirm Booking – ₹${totalPrice}`}
                            </button>

                            <p className="text-xs text-neutral-500 text-center mt-4">
                                Payment is done after booking confirmation.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </PublicLayout>
    );
}