import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function FeedbackForm() {
  const { user } = useAuth();
  const { id: referenceId } = useParams();  
  const location = useLocation();
  const navigate = useNavigate();

  // Get booking type from query
  const type = new URLSearchParams(location.search).get("type"); // "room" OR "facility"

  const [name, setName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");

  const ratingEmojis = ["😡", "😕", "😐", "😊", "🤩"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating!");
      return;
    }

    try {
      await axios.post("http://localhost:9193/api/feedback", {
        customerId: user.userId,
        bookingId: type === "room" ? referenceId : null,
        facilityBookingId: type === "facility" ? referenceId : null,
        rating,
        comments,
        submissionDate: new Date().toISOString().slice(0, 19).replace("T", " ")
      });

      alert("Thank you! Your feedback has been submitted.");
      navigate("/my-bookings"); // redirect back
    } catch (error) {
      console.error(error);
      alert("Error submitting feedback.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white/30 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/40">
        
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
          📝 Share Your Experience
        </h2>
        <p className="text-center text-gray-600 mb-8">
          We value your feedback. Help us make your stay even better!
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 shadow-md border"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Your Email</label>
            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 shadow-md border"
            />
          </div>

          {/* Booking Type */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Feedback For</label>
            <input
              value={type === "room" ? "Room Booking" : "Facility Booking"}
              readOnly
              className="w-full px-4 py-3 rounded-xl bg-gray-100 shadow-md border"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Rating</label>

            <div className="flex items-center justify-between text-3xl">
              {ratingEmojis.map((emoji, idx) => (
                <span
                  key={idx}
                  onClick={() => setRating(idx + 1)}
                  className={`cursor-pointer transition ${
                    rating === idx + 1 ? "scale-150" : "hover:scale-125"
                  }`}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Comments</label>
            <textarea
              rows="4"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Tell us about your stay..."
              className="w-full px-4 py-3 rounded-xl bg-white shadow-md border"
            ></textarea>
          </div>

          <button className="w-full py-3 rounded-xl bg-blue-600 text-white text-lg font-semibold shadow-lg hover:bg-blue-700 transition">
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}