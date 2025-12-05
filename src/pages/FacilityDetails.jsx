import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import { getFacilityById } from "../services/FacilityService";
import { useAuth } from "../hooks/useAuth";

export default function FacilityDetails() {
  const { id } = useParams();
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchFacilityDetails();
  }, [id]);

  const fetchFacilityDetails = async () => {
    try {
      const facilityData = await getFacilityById(id);
      setFacility(facilityData);
    } catch (error) {
      console.error("Error fetching facility details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      // Save where user wanted to go so we can redirect after login
      localStorage.setItem("returnUrl", `/book-facility/${id}`);
      navigate("/login");
      return;
    }
    navigate(`/book-facility/${id}`);
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
          <div className="text-neutral-600 font-light">Loading facility details...</div>
        </div>
      </PublicLayout>
    );
  }

  if (!facility) {
    return (
      <PublicLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-neutral-400 text-6xl mb-4">🏨</div>
          <p className="text-neutral-600 font-light mb-6">Facility not found</p>
          <button
            onClick={() => navigate("/facilities")}
            className="px-8 py-3 border border-neutral-300 text-neutral-800 text-xs uppercase tracking-widest font-light hover:border-neutral-400 transition"
          >
            Back to Facilities
          </button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="py-24 animate-fade-in">
        {/* Breadcrumb */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/facilities")}
            className="text-xs uppercase tracking-wider text-neutral-600 hover:text-neutral-900 transition font-light"
          >
            ← Back to Facilities
          </button>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            {/* Primary Image */}
            <div className="relative h-96 bg-neutral-200 overflow-hidden border border-neutral-200">
              {facility.primaryImage ? (
                <img
                  src={facility.primaryImage}
                  alt={facility.name}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setSelectedImage(facility.primaryImage)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">
                  {getIconForType(facility.type)}
                </div>
              )}
            </div>

            {/* Gallery */}
            {facility.gallery && facility.gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {facility.gallery.slice(0, 4).map((media, index) => (
                  <div
                    key={media.mediaId}
                    className="h-24 bg-neutral-200 overflow-hidden border border-neutral-200 cursor-pointer hover:border-neutral-400 transition"
                    onClick={() => setSelectedImage(media.filePath)}
                  >
                    <img
                      src={media.filePath}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="inline-block px-4 py-2 bg-neutral-100 text-neutral-800 text-xs uppercase tracking-widest font-light mb-4">
              {formatFacilityType(facility.type)}
            </div>

            <h1 className="text-3xl md:text-4xl font-light mb-4 text-neutral-900 tracking-wide">
              {facility.name}
            </h1>

            <p className="text-neutral-700 text-base font-light leading-relaxed mb-8">
              {facility.description || "Experience luxury and comfort at our premium facility."}
            </p>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-neutral-200">
              <div>
                <div className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-2">
                  Capacity
                </div>
                <div className="text-2xl font-light text-neutral-900">
                  {facility.capacity} <span className="text-sm">guests</span>
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-2">
                  Price
                </div>
                <div className="text-2xl font-light text-neutral-900">
                  ₹{facility.price} <span className="text-sm">/hour</span>
                </div>
              </div>

              {facility.location && (
                <div className="col-span-2">
                  <div className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-2">
                    Location
                  </div>
                  <div className="text-base font-light text-neutral-900">
                    📍 {facility.location}
                  </div>
                </div>
              )}

              <div className="col-span-2">
                <div className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-2">
                  Status
                </div>
                <div className={`text-base font-light ${
                  facility.status === "AVAILABLE" ? "text-green-700" : "text-red-700"
                }`}>
                  {facility.status === "AVAILABLE" ? "✓ Available" : "✗ Unavailable"}
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-4">
                Amenities Included
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-3 text-neutral-700 font-light text-sm">
                  <span className="w-1 h-1 bg-neutral-400 rounded-full"></span>
                  Professional service
                </li>
                <li className="flex items-center gap-3 text-neutral-700 font-light text-sm">
                  <span className="w-1 h-1 bg-neutral-400 rounded-full"></span>
                  Clean and maintained
                </li>
                <li className="flex items-center gap-3 text-neutral-700 font-light text-sm">
                  <span className="w-1 h-1 bg-neutral-400 rounded-full"></span>
                  Modern equipment
                </li>
              </ul>
            </div>

            {/* Brochure Download */}
            {facility.brochure && (
              <div className="mb-8">
                <a
                  href={facility.brochure}
                  download
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-700 hover:text-neutral-900 transition font-light"
                >
                  📄 Download Brochure
                </a>
              </div>
            )}

            {/* Book Now Button */}
            <button
              onClick={handleBookNow}
              disabled={facility.status !== "AVAILABLE"}
              className="w-full px-8 py-4 bg-neutral-800 text-white text-xs uppercase tracking-widest font-light hover:bg-neutral-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {facility.status === "AVAILABLE" ? "Book Now" : "Currently Unavailable"}
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-8 right-8 w-12 h-12 border border-white/30 text-white hover:bg-white/10 transition flex items-center justify-center text-2xl font-light"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt="Fullscreen"
            className="max-w-[90%] max-h-[90%] border-4 border-white animate-scale-in"
          />
        </div>
      )}
    </PublicLayout>
  );
}

