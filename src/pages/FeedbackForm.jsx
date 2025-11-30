export default function FeedbackForm() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center p-6">

      <div className="w-full max-w-xl bg-white/30 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/40">
        
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
          📝 Share Your Experience
        </h2>
        <p className="text-center text-gray-600 mb-8">
          We value your feedback. Help us make your stay even better!
        </p>

        {/* Feedback Form */}
        <form className="space-y-6">

 <div>
            <label className="block text-gray-700 font-semibold mb-1">Your Name</label>
            <input
              type="text"
              placeholder="Full name"
              className="w-full px-4 py-3 rounded-xl bg-white shadow-md outline-none border border-gray-200 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {/* Customer Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Your Email</label>
            <input
              type="email"
              placeholder="customer@example.com"
              className="w-full px-4 py-3 rounded-xl bg-white shadow-md outline-none border border-gray-200 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Booking Type Selector */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Feedback For</label>
            <select className="w-full px-4 py-3 rounded-xl bg-white shadow-md outline-none border border-gray-200 focus:ring-2 focus:ring-blue-400">
              <option value="">Select Type</option>
              <option value="room">Room Booking</option>
              <option value="facility">Facility Booking</option>
            </select>
          </div>


          {/* Rating */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Rating
            </label>

            <div className="flex items-center justify-between text-3xl">
              <span className="cursor-pointer hover:scale-125 transition">😡</span>
              <span className="cursor-pointer hover:scale-125 transition">😕</span>
              <span className="cursor-pointer hover:scale-125 transition">😐</span>
              <span className="cursor-pointer hover:scale-125 transition">😊</span>
              <span className="cursor-pointer hover:scale-125 transition">🤩</span>
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Comments</label>
            <textarea
              rows="4"
              placeholder="Tell us about your stay..."
              className="w-full px-4 py-3 rounded-xl bg-white shadow-md outline-none border border-gray-200 focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button className="w-full py-3 rounded-xl bg-blue-600 text-white text-lg font-semibold shadow-lg hover:bg-blue-700 transition">
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}