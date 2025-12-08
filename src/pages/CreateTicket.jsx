import { useState, useEffect } from "react";
import axios from "../api/axiosConfig";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function CreateTicket() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookingId, setBookingId] = useState(null);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("General");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch user's latest booking to auto-fill bookingId
  useEffect(() => {
    if (!user) return;

    axios
      .get(`/api/bookings/customer/${user.userId}`)
      .then((res) => {
        const lastBooking = res.data?.[0];
        if (lastBooking) setBookingId(lastBooking.bookingId);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const dto = {
      customerId: user.userId,
      bookingId: bookingId || null,
      facilityBookingId: null,
      subject,
      category,
      details,
      status: "OPEN"
    };

    axios
      .post("/api/support", dto)
      .then(() => navigate("/my-tickets"))
      .catch((err) => console.error(err));
  };

  return (
    <div className="max-w-3xl mx-auto mt-32 px-6 mb-20">
      <h1 className="text-3xl font-light text-neutral-800 tracking-wide mb-10">
        Create Support Ticket
      </h1>

      <form
        onSubmit={handleSubmit}
        className="border border-neutral-200 p-10 bg-white space-y-6"
      >
        {/* Booking ID */}
        <div>
          <label className="block text-xs uppercase text-neutral-600 tracking-wider mb-2 font-light">
            Booking ID
          </label>
          <input
            type="text"
            value={bookingId || "No active bookings"}
            disabled
            className="w-full p-3 border border-neutral-300 bg-neutral-100 text-neutral-700 text-sm"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs uppercase text-neutral-600 tracking-wider mb-2 font-light">
            Subject
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-3 border border-neutral-300 text-sm font-light"
            placeholder="Enter issue subject"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs uppercase text-neutral-600 tracking-wider mb-2 font-light">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border border-neutral-300 text-sm font-light"
          >
            <option>General</option>
            <option>Room Service</option>
            <option>Maintenance</option>
            <option>Billing</option>
            <option>Housekeeping</option>
          </select>
        </div>

        {/* Details */}
        <div>
          <label className="block text-xs uppercase text-neutral-600 tracking-wider mb-2 font-light">
            Details
          </label>
          <textarea
            required
            rows="6"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full p-3 border border-neutral-300 text-sm font-light"
            placeholder="Describe the issue..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="px-10 py-3 bg-neutral-800 text-white font-light text-sm tracking-wider uppercase hover:bg-neutral-900 transition"
        >
          Submit Ticket
        </button>
      </form>
    </div>
  );
}