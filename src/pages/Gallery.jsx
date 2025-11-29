import PublicLayout from "../layouts/PublicLayout";
import GalleryGrid from "../components/gallery/GalleryGrid";

export default function Gallery() {
  return (
    <PublicLayout>
       {/* ===== PREMIUM HERO HEADER ===== */}
      <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">

        {/* Decorative Blur Orbs */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-700/30 rounded-full blur-3xl" />
        <div className="absolute top-20 -right-20 w-96 h-96 bg-pink-700/20 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-28 text-center text-white">
          {/* <span className="inline-block mb-4 px-6 py-2 text-xs uppercase tracking-widest bg-white/10 rounded-full border border-white/20 backdrop-blur">
            Explore Luxury
          </span> */}

          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Moments Captured in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Elegance</span>
          </h1>

          <p className="max-w-2xl mx-auto text-gray-300 text-sm md:text-base">
            Discover the beauty of our rooms, interiors, fine dining, and world-class amenities through our visual showcase.
          </p>
        </div>
      </div>
      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <GalleryGrid />
      </div>
    </PublicLayout>
  );
}
