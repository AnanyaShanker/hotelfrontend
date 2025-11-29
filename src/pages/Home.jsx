import PublicLayout from "../layouts/PublicLayout";
import HeroCarousel from "../components/HeroCarousel";
import FacilityCard from "../components/FacilityCard";

export default function Home() {
  return (
    <PublicLayout>
      {/* HERO CAROUSEL */}
      <section className="mb-24">
        <HeroCarousel />
      </section>

      {/* FACILITIES */}
      <section className="text-center mb-24">
        <h2 className="text-4xl font-extrabold mb-6">
          World-Class Facilities
        </h2>
        <p className="text-gray-600 mb-12 max-w-xl mx-auto">
          Designed to offer the perfect blend of luxury, comfort, and
          convenience.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          <FacilityCard
            icon="🛏️"
            title="Luxury Rooms"
            description="Premium bedding with elegant interiors."
          />
          <FacilityCard
            icon="🏊‍♂️"
            title="Swimming Pool"
            description="Temperature controlled luxury pool."
          />
          <FacilityCard
            icon="🍽️"
            title="Fine Dining"
            description="World-class chefs & multi-cuisine menu."
          />
          <FacilityCard
            icon="🏋️"
            title="Fitness Center"
            description="Modern gym with expert trainers."
          />
          <FacilityCard
            icon="🚗"
            title="Free Parking"
            description="Secure & spacious parking facility."
          />
          <FacilityCard
            icon="📶"
            title="High-Speed WiFi"
            description="Seamless internet throughout the hotel."
          />
        </div>
      </section>
    </PublicLayout>
  );
}



