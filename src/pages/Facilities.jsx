import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import { getAllFacilities } from "../services/FacilityService";
import { useAuth } from "../context/AuthContext";

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      console.log("🔍 Fetching facilities from backend...");
      const data = await getAllFacilities();
      console.log("✅ Facilities received:", data);
      console.log("📊 Number of facilities:", data?.length || 0);
      setFacilities(data || []);
    } catch (error) {
      console.error("❌ Error fetching facilities:", error);
      console.error("Error details:", error.response?.data || error.message);
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredFacilities = filter === "ALL"
    ? facilities
    : facilities.filter(f => f.type === filter);

  const facilityTypes = ["ALL", "SPA", "GYM", "POOL", "BANQUET", "MEETING_HALL", "RESTAURANT", "OTHER"];

  const handleBookNow = (facilityId) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate(`/book-facility/${facilityId}`);
  };

  const getIconForType = (type) => {
    const icons = {
      SPA: "🧖",
      GYM: "🏋️",
      POOL: "🏊",
      BANQUET: "🎉",
      MEETING_HALL: "🏢",
      RESTAURANT: "🍽️",
      OTHER: "✨"
    };
    return icons[type] || "🏨";
  };

  const formatFacilityType = (type) => {
    const typeLabels = {
      'SPA': 'Spa & Wellness',
      'GYM': 'Fitness Center',
      'POOL': 'Swimming Pool',
      'BANQUET': 'Banquet Hall',
      'MEETING_HALL': 'Meeting Room',
      'RESTAURANT': 'Restaurant',
      'OTHER': 'Other'
    };
    return typeLabels[type] || type;
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-neutral-600 font-light">Loading facilities...</div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="py-24 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs uppercase tracking-widest text-neutral-600 font-light mb-6">
            Our Amenities
          </span>
          <h1 className="text-3xl md:text-4xl font-light mb-6 text-neutral-900 tracking-wide">
            Explore Our Facilities
          </h1>
          <p className="text-neutral-700 text-base max-w-2xl mx-auto font-light">
            Book our world-class facilities for your comfort and convenience
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 border-t border-b border-neutral-200 py-6">
          <div className="flex flex-wrap justify-center gap-4">
            {facilityTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-2 text-xs uppercase tracking-widest font-light transition ${
                  filter === type
                    ? "bg-neutral-800 text-white"
                    : "bg-white border border-neutral-300 text-neutral-700 hover:border-neutral-400"
                }`}
              >
                {type.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Debug Info */}
        {filteredFacilities.length > 0 && (
          <div className="text-center mb-8 text-sm text-neutral-600 font-light">
            Showing {filteredFacilities.length} {filteredFacilities.length === 1 ? 'facility' : 'facilities'}
          </div>
        )}

        {/* Facilities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFacilities.map((facility, index) => (
            <div
              key={facility.facilityId}
              className={`bg-white border border-neutral-200 hover:border-neutral-300 transition-all duration-300 overflow-hidden hover:shadow-lg animate-fade-in-up animate-delay-${Math.min(index + 1, 6)}00`}
            >
              {/* Image */}
              <div className="relative h-64 bg-neutral-200 overflow-hidden group">
                {facility.primaryImage ? (
                  <img
                    src={facility.primaryImage}
                    alt={facility.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    {getIconForType(facility.type)}
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-neutral-800 text-white px-4 py-2 text-xs uppercase tracking-wider font-light">
                  {formatFacilityType(facility.type)}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 border-t border-neutral-200">
                <h3 className="text-lg font-light mb-2 text-neutral-900 tracking-wide">
                  {facility.name}
                </h3>
                <p className="text-neutral-700 text-sm font-light mb-4 line-clamp-2">
                  {facility.description || "Experience luxury and comfort"}
                </p>

                {/* Details */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-100">
                  <div className="text-sm text-neutral-600 font-light">
                    <span className="block text-xs uppercase tracking-wider">Capacity</span>
                    <span className="text-neutral-900">{facility.capacity} guests</span>
                  </div>
                  <div className="text-sm text-neutral-600 font-light text-right">
                    <span className="block text-xs uppercase tracking-wider">Price</span>
                    <span className="text-neutral-900">₹{facility.price}/hr</span>
                  </div>
                </div>

                {/* Location */}
                {facility.location && (
                  <div className="text-xs text-neutral-600 font-light mb-4">
                    📍 {facility.location}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/facility/${facility.facilityId}`)}
                    className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-800 text-xs uppercase tracking-widest font-light hover:border-neutral-400 transition"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleBookNow(facility.facilityId)}
                    className="flex-1 px-4 py-3 bg-neutral-800 text-white text-xs uppercase tracking-widest font-light hover:bg-neutral-900 transition"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFacilities.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-neutral-400 text-5xl mb-4">🏨</div>
            <p className="text-neutral-600 font-light mb-4">
              {facilities.length === 0
                ? "No facilities available in the database"
                : `No facilities found in ${filter} category`}
            </p>
            {facilities.length === 0 && (
              <div className="mt-6 p-6 bg-neutral-50 border border-neutral-200 max-w-2xl mx-auto text-left">
                <p className="text-sm font-light text-neutral-700 mb-3">
                  <strong>To add sample facilities:</strong>
                </p>
                <ol className="text-sm font-light text-neutral-700 space-y-2 ml-4">
                  <li>1. Open MySQL Workbench or your database client</li>
                  <li>2. Run the SQL file: <code className="bg-neutral-200 px-2 py-1">sample-facilities-data.sql</code></li>
                  <li>3. Refresh this page</li>
                </ol>
                <p className="text-xs text-neutral-500 mt-4">
                  Or check the browser console (F12) for API errors.
                </p>
              </div>
            )}
            {facilities.length > 0 && (
              <button
                onClick={() => setFilter("ALL")}
                className="mt-6 px-8 py-3 border border-neutral-300 text-neutral-800 text-xs uppercase tracking-widest font-light hover:border-neutral-400 transition"
              >
                View All Facilities
              </button>
            )}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}

