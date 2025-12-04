import { useNavigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import HeroCarousel from "../components/HeroCarousel";
import FacilityCard from "../components/FacilityCard";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user, isAdmin, isStaff, isCustomer } = useAuth();

  return (
    <PublicLayout>
      {/* WELCOME BANNER FOR LOGGED IN USERS */}
      {isAuthenticated && user && (
        <section className="mb-16 mt-28 animate-fade-in">
          <div className="relative overflow-hidden bg-neutral-50 border border-neutral-200 p-10">
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div>
                <h2 className="text-2xl font-light text-neutral-800 mb-3 tracking-wide">
                  Welcome back, {user.name}
                </h2>
                <p className="text-neutral-600 text-base font-light">
                  {isAdmin() && "Manage your hotel operations from the dashboard"}
                  {isStaff() && "Check your assigned tasks and manage your work"}
                  {isCustomer() && "Explore our facilities and manage your bookings"}
                </p>
              </div>
              <div>
                {isAdmin() && (
                  <button
                    onClick={() => navigate("/admin-dashboard")}
                    className="px-8 py-3 bg-neutral-800 text-white font-light text-sm tracking-wider uppercase hover:bg-neutral-900 transition"
                  >
                    Dashboard
                  </button>
                )}
                {isStaff() && (
                  <button
                    onClick={() => navigate("/staff-tasks")}
                    className="px-8 py-3 bg-neutral-800 text-white font-light text-sm tracking-wider uppercase hover:bg-neutral-900 transition"
                  >
                    My Tasks
                  </button>
                )}
                {isCustomer() && (
                  <button
                    onClick={() => navigate("/my-bookings")}
                    className="px-8 py-3 bg-neutral-800 text-white font-light text-sm tracking-wider uppercase hover:bg-neutral-900 transition"
                  >
                    My Bookings
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* HERO CAROUSEL */}
      <section className="mb-24 animate-fade-in">
        <HeroCarousel />
      </section>

      {/* STATS SECTION - Minimalist */}
      <section className="mb-24">
        <div className="border-t border-b border-neutral-200 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="space-y-3 animate-fade-in-up animate-delay-100">
              <div className="text-4xl md:text-5xl font-light text-neutral-900">500+</div>
              <div className="text-neutral-700 text-xs uppercase tracking-widest font-light">Luxury Rooms</div>
            </div>
            <div className="space-y-3 animate-fade-in-up animate-delay-200">
              <div className="text-4xl md:text-5xl font-light text-neutral-900">50K+</div>
              <div className="text-neutral-700 text-xs uppercase tracking-widest font-light">Happy Guests</div>
            </div>
            <div className="space-y-3 animate-fade-in-up animate-delay-300">
              <div className="text-4xl md:text-5xl font-light text-neutral-900">4.9★</div>
              <div className="text-neutral-700 text-xs uppercase tracking-widest font-light">Guest Rating</div>
            </div>
            <div className="space-y-3 animate-fade-in-up animate-delay-400">
              <div className="text-4xl md:text-5xl font-light text-neutral-900">24/7</div>
              <div className="text-neutral-700 text-xs uppercase tracking-widest font-light">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* FACILITIES */}
      <section className="text-center mb-24">
        <div className="mb-16">
          <span className="inline-block text-xs uppercase tracking-widest text-neutral-600 font-light mb-6">
            Our Amenities
          </span>
          <h2 className="text-3xl md:text-4xl font-light mb-6 text-neutral-900 tracking-wide">
            World-Class Facilities
          </h2>
          <p className="text-neutral-700 text-base mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Designed to offer the perfect blend of luxury, comfort, and
            convenience for an unforgettable experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="animate-fade-in-up animate-delay-100">
            <FacilityCard
              icon="🛏️"
              title="Luxury Rooms"
              description="Premium bedding with elegant interiors."
            />
          </div>
          <div className="animate-fade-in-up animate-delay-200">
            <FacilityCard
              icon="🏊‍♂️"
              title="Swimming Pool"
              description="Temperature controlled luxury pool."
            />
          </div>
          <div className="animate-fade-in-up animate-delay-300">
            <FacilityCard
              icon="🍽️"
              title="Fine Dining"
              description="World-class chefs & multi-cuisine menu."
            />
          </div>
          <div className="animate-fade-in-up animate-delay-400">
            <FacilityCard
              icon="🏋️"
              title="Fitness Center"
              description="Modern gym with expert trainers."
            />
          </div>
          <div className="animate-fade-in-up animate-delay-500">
            <FacilityCard
              icon="🚗"
              title="Free Parking"
              description="Secure & spacious parking facility."
            />
          </div>
          <div className="animate-fade-in-up animate-delay-600">
            <FacilityCard
              icon="📶"
              title="High-Speed WiFi"
              description="Seamless internet throughout the hotel."
            />
          </div>
        </div>

        {/* View All Facilities Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/facilities")}
            className="px-10 py-4 border border-neutral-300 text-neutral-800 font-light text-sm tracking-wider uppercase hover:border-neutral-400 hover:bg-neutral-50 transition"
          >
            View All Facilities
          </button>
        </div>
      </section>

      {/* ROOMS SECTION */}
      <section className="mb-24">
        <div className="border-t border-neutral-200 pt-24 pb-16">
          <div className="text-center mb-16">
            <span className="inline-block text-xs uppercase tracking-widest text-neutral-600 font-light mb-6">
              Accommodations
            </span>
            <h2 className="text-3xl md:text-4xl font-light mb-6 text-neutral-900 tracking-wide">
              Luxury Rooms & Suites
            </h2>
            <p className="text-neutral-700 text-base mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              Experience comfort and elegance in our thoughtfully designed rooms,
              perfect for both leisure and business travelers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-neutral-50 border border-neutral-200 p-8 hover:border-neutral-300 transition-all animate-fade-in-up animate-delay-100">
              <div className="text-5xl mb-6">🛏️</div>
              <h3 className="text-xl font-light mb-3 text-neutral-900 tracking-wide">Deluxe Rooms</h3>
              <p className="text-neutral-700 font-light text-sm mb-4">
                Spacious rooms with modern amenities and stunning views
              </p>
              <div className="text-neutral-600 text-sm font-light">From ₹5,000/night</div>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 p-8 hover:border-neutral-300 transition-all animate-fade-in-up animate-delay-200">
              <div className="text-5xl mb-6">👑</div>
              <h3 className="text-xl font-light mb-3 text-neutral-900 tracking-wide">Executive Suites</h3>
              <p className="text-neutral-700 font-light text-sm mb-4">
                Premium suites with separate living areas and luxury furnishings
              </p>
              <div className="text-neutral-600 text-sm font-light">From ₹12,000/night</div>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 p-8 hover:border-neutral-300 transition-all animate-fade-in-up animate-delay-300">
              <div className="text-5xl mb-6">✨</div>
              <h3 className="text-xl font-light mb-3 text-neutral-900 tracking-wide">Presidential Suite</h3>
              <p className="text-neutral-700 font-light text-sm mb-4">
                Ultimate luxury with panoramic views and butler service
              </p>
              <div className="text-neutral-600 text-sm font-light">From ₹25,000/night</div>
            </div>
          </div>

          {/* View All Rooms Button */}
          <div className="text-center">
            <button
              onClick={() => navigate("/rooms")}
              className="px-10 py-4 border border-neutral-300 text-neutral-800 font-light text-sm tracking-wider uppercase hover:border-neutral-400 hover:bg-neutral-50 transition"
            >
              View All Rooms
            </button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mb-24">
        <div className="text-center mb-16">
          <span className="inline-block text-xs uppercase tracking-widest text-neutral-600 font-light mb-6">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-light mb-6 text-neutral-900 tracking-wide">
            What Our Guests Say
          </h2>
          <p className="text-neutral-700 text-base max-w-2xl mx-auto font-light">
            Real experiences from our valued guests
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-10 border border-neutral-200 hover:border-neutral-300 transition-all animate-fade-in-up animate-delay-100">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-neutral-500 text-sm">★</span>
              ))}
            </div>
            <p className="text-neutral-800 mb-8 leading-relaxed font-light text-sm">
              "An absolutely stunning hotel! The service was impeccable, rooms were luxurious, and the amenities exceeded all expectations. Will definitely return!"
            </p>
            <div className="flex items-center gap-4 pt-6 border-t border-neutral-100">
              <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 font-light text-sm">
                JD
              </div>
              <div>
                <div className="font-light text-neutral-900 text-sm">John Doe</div>
                <div className="text-xs text-neutral-600 uppercase tracking-wider font-light">Business Traveler</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 border border-neutral-200 hover:border-neutral-300 transition-all animate-fade-in-up animate-delay-200">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-neutral-500 text-sm">★</span>
              ))}
            </div>
            <p className="text-neutral-800 mb-8 leading-relaxed font-light text-sm">
              "Perfect for our family vacation! The kids loved the pool, and we enjoyed the spa. The staff went above and beyond to make our stay special."
            </p>
            <div className="flex items-center gap-4 pt-6 border-t border-neutral-100">
              <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 font-light text-sm">
                SM
              </div>
              <div>
                <div className="font-light text-neutral-900 text-sm">Sarah Miller</div>
                <div className="text-xs text-neutral-600 uppercase tracking-wider font-light">Family Guest</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 border border-neutral-200 hover:border-neutral-300 transition-all animate-fade-in-up animate-delay-300">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-neutral-500 text-sm">★</span>
              ))}
            </div>
            <p className="text-neutral-800 mb-8 leading-relaxed font-light text-sm">
              "The attention to detail is remarkable. From check-in to check-out, everything was seamless. The dining experience was extraordinary!"
            </p>
            <div className="flex items-center gap-4 pt-6 border-t border-neutral-100">
              <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 font-light text-sm">
                RK
              </div>
              <div>
                <div className="font-light text-neutral-900 text-sm">Robert Kim</div>
                <div className="text-xs text-neutral-600 uppercase tracking-wider font-light">Luxury Traveler</div>
              </div>
            </div>
          </div>
        </div>

        {/* View Gallery Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/gallery")}
            className="px-10 py-4 border border-neutral-300 text-neutral-800 font-light text-sm tracking-wider uppercase hover:border-neutral-400 hover:bg-neutral-50 transition"
          >
            View Our Gallery
          </button>
        </div>
      </section>

      {/* CTA SECTION - Minimalist */}
      <section className="mb-24 animate-fade-in-up">
        <div className="relative overflow-hidden bg-neutral-800 p-20 text-center text-white">
          <div className="relative z-10">
            <span className="inline-block text-xs uppercase tracking-widest text-neutral-400 font-light mb-6">
              Exclusive Offer
            </span>
            <h2 className="text-3xl md:text-5xl font-light mb-6 tracking-wide">
              Ready for Your Luxury Stay?
            </h2>
            <p className="text-lg text-neutral-300 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              Book now and experience the finest hospitality. Special rates available for early bookings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/facilities")}
                className="px-10 py-4 bg-white text-neutral-800 font-light text-sm tracking-wider uppercase hover:bg-neutral-100 transition"
              >
                Browse Facilities
              </button>
              <button
                onClick={() => navigate("/my-bookings")}
                className="px-10 py-4 border border-white text-white font-light text-sm tracking-wider uppercase hover:bg-white/10 transition"
              >
                My Bookings
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED IMAGE */}
      <section className="mb-24 animate-fade-in-up">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block text-xs uppercase tracking-widest text-neutral-600 font-light mb-6">
              Experience Luxury
            </span>
            <h2 className="text-3xl md:text-4xl font-light mb-6 text-neutral-900 tracking-wide">
              Your Perfect Escape Awaits
            </h2>
            <p className="text-neutral-700 text-base leading-relaxed mb-8 font-light">
              Indulge in unparalleled comfort with our meticulously designed rooms,
              premium amenities, and personalized service that caters to your every need.
            </p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-4">
                <span className="w-1 h-1 bg-neutral-500 rounded-full"></span>
                <span className="text-neutral-800 font-light">24/7 Concierge Service</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="w-1 h-1 bg-neutral-500 rounded-full"></span>
                <span className="text-neutral-800 font-light">Complimentary Breakfast Buffet</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="w-1 h-1 bg-neutral-500 rounded-full"></span>
                <span className="text-neutral-800 font-light">Airport Transfer Service</span>
              </li>
            </ul>
            <button
              onClick={() => navigate("/facilities")}
              className="px-10 py-4 bg-neutral-800 text-white font-light text-sm tracking-wider uppercase hover:bg-neutral-900 transition"
            >
              Explore Facilities
            </button>
          </div>
          <div className="relative group">
            <img
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
              alt="Luxury Hotel"
              className="w-full h-[500px] object-cover"
            />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}



