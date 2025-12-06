import React, { useState, useEffect } from "react";
import axios from "axios";
 
export default function BookingsReport() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const tokenHeader = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
 
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:9193/api/bookings", {
          headers: tokenHeader,
        });
        setBookings(res.data);
      } catch (err) {
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
 
    fetchBookings();
  }, []);
 
  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await axios.patch(
        `http://localhost:9193/api/bookings/${bookingId}/cancel`,
        {},
        { headers: tokenHeader }
      );
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === bookingId ? { ...b, bookingStatus: "CANCELLED" } : b
        )
      );
    } catch {
      alert("Failed to cancel booking");
    }
  };
 
  const completeBooking = async (bookingId) => {
    if (!window.confirm("Mark this booking as completed?")) return;
    try {
      await axios.patch(
        `http://localhost:9193/api/bookings/${bookingId}/complete`,
        {},
        { headers: tokenHeader }
      );
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === bookingId ? { ...b, bookingStatus: "COMPLETED" } : b
        )
      );
    } catch {
      alert("Failed to complete booking");
    }
  };
 
  if (loading) return <p className="p-6 text-neutral-500 text-lg">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
 
  return (
    <section className="p-10 bg-neutral-50 min-h-screen space-y-12">
      <header>
        <h1 className="text-3xl font-light tracking-wide text-neutral-800">
          Bookings Management
        </h1>
        <p className="text-sm text-neutral-500 font-light">
          View and manage all hotel bookings
        </p>
      </header>
 
      <div className="bg-white border border-neutral-200 shadow rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-100 text-neutral-600 text-xs uppercase tracking-wider">
            <tr>
              {[
                "ID",
                "Customer",
                "Room",
                "Branch",
                "Check-in",
                "Check-out",
                "Days",
                "Total Price",
                "Status",
                "Actions",
              ].map((col) => (
                <th key={col} className="px-4 py-3 text-left font-semibold">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
 
          <tbody>
            {bookings.map((b, idx) => (
              <tr
                key={b.bookingId}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-neutral-50"
                } hover:bg-blue-50 transition`}
              >
                <td className="px-4 py-3 text-sm">{b.bookingId}</td>
                <td className="px-4 py-3 text-sm">{b.customerId}</td>
                <td className="px-4 py-3 text-sm">{b.roomId}</td>
                <td className="px-4 py-3 text-sm">{b.branchId}</td>
                <td className="px-4 py-3 text-sm">
                  {new Date(b.checkInDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm">
                  {new Date(b.checkOutDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm">{b.totalDays}</td>
                <td className="px-4 py-3 text-sm font-medium">₹{b.totalPrice}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      b.bookingStatus === "CONFIRMED"
                        ? "bg-blue-100 text-blue-700"
                        : b.bookingStatus === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : b.bookingStatus === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {b.bookingStatus}
                  </span>
                </td>
 
                <td className="px-4 py-3 text-sm flex gap-3">
                  {b.bookingStatus !== "CANCELLED" && (
                    <button
                      onClick={() => cancelBooking(b.bookingId)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition"
                    >
                      Cancel
                    </button>
                  )}
 
                  {b.bookingStatus !== "COMPLETED" && (
                    <button
                      onClick={() => completeBooking(b.bookingId)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition"
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
 
            {bookings.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-6 text-center text-neutral-500 text-sm"
                >
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
 
 