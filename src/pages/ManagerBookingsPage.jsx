import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../api/axiosConfig";
import BackButton from "./BackButton";

export default function ManagerBookingsPage() {
  const [params] = useSearchParams();
  const branchId = params.get("branchId");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`/api/bookings/branch/${branchId}/detailed`);
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching branch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (branchId) fetchBookings();
  }, [branchId]);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleString("en-IN") : "--";

  const statusClass = (s) => {
    switch (s) {
      case "CONFIRMED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      case "COMPLETED":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (

    <div className="mt-28 px-8 mb-24 animate-fade-in">
        <BackButton />
      <h1 className="text-3xl font-light mb-2 tracking-wide">
        Branch Bookings — Manager View
      </h1>
      <p className="text-neutral-600 mb-10">
        Viewing all bookings for branch ID: {branchId}
      </p>

      <div className="bg-neutral-50 border border-neutral-200 p-6">
        <h2 className="text-xl font-light mb-6">Today's Bookings</h2>

        {loading ? (
          <p className="text-neutral-500">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-neutral-500">No bookings found for this branch.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-neutral-300 text-sm text-neutral-700">
                <th className="text-left py-3">Booking ID</th>
                <th className="text-left py-3">Customer</th>
                <th className="text-left py-3">Room</th>
                <th className="text-left py-3">Check-in</th>
                <th className="text-left py-3">Check-out</th>
                <th className="text-left py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr key={b.bookingId} className="border-b border-neutral-200">
                  <td className="py-3">{b.bookingId}</td>
                  <td className="py-3">{b.customerName}</td>
                  <td className="py-3">{b.roomNumber}</td>
                  <td className="py-3">{formatDate(b.checkInDate)}</td>
                  <td className="py-3">{formatDate(b.checkOutDate)}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-xs ${statusClass(b.bookingStatus)}`}>
                      {b.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}