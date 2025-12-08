import { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
 
export default function MyTickets() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    if (!user) return;
 
    axios
      .get(`/api/support/customer/${user.userId}`)
      .then((res) => setTickets(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);
 
  return (
    <div className="max-w-5xl mx-auto mt-32 px-6 mb-20">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-light text-neutral-800 tracking-wide">
          My Support Tickets
        </h1>
 
        <button
          onClick={() => navigate("/support/create")}
          className="px-6 py-3 bg-neutral-800 text-white font-light text-sm tracking-wider uppercase hover:bg-neutral-900 transition"
        >
          Create Ticket
        </button>
      </div>
 
      {loading ? (
        <p className="text-neutral-600 text-sm">Loading your tickets...</p>
      ) : tickets.length === 0 ? (
        <div className="border border-neutral-200 bg-neutral-50 p-10 text-center">
          <p className="text-neutral-700 font-light text-sm">
            You haven’t raised any support tickets yet.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {tickets.map((t) => (
            <div
              key={t.ticketId}
              className="border border-neutral-200 p-6 bg-white hover:border-neutral-300 transition"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-light text-neutral-900">
                  {t.subject}
                </h2>
                <span
                  className={`px-3 py-1 text-xs tracking-wider font-light uppercase border ${
                    t.status === "OPEN"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : t.status === "IN_PROGRESS"
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {t.status}
                </span>
              </div>
 
              <p className="text-neutral-700 text-sm mt-3 font-light">
                {t.details}
              </p>
 
              <p className="text-neutral-500 text-xs mt-4">
                Ticket ID: {t.ticketId} · Booking ID: {t.bookingId || "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
 