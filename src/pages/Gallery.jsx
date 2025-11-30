import PublicLayout from "../layouts/PublicLayout";
import GalleryGrid from "../components/gallery/GalleryGrid";

export default function Gallery() {
  return (
    <PublicLayout>
       {/* ===== MINIMALIST HERO HEADER ===== */}
      <div className="relative overflow-hidden bg-neutral-800 pt-32 pb-20">
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
          <span className="inline-block mb-8 text-xs uppercase tracking-widest text-neutral-400 font-light animate-fade-in">
            Visual Experience
          </span>

          <h1 className="text-4xl md:text-6xl font-light mb-8 tracking-wide leading-tight animate-fade-in animate-delay-100">
            Moments Captured in
            <br />
            <span className="text-white/90">
              Elegance
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-neutral-300 text-base md:text-lg font-light leading-relaxed mb-12 animate-fade-in animate-delay-200">
            Discover the beauty of our rooms, interiors, fine dining, and world-class amenities through our visual showcase.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-12 mt-16 border-t border-b border-neutral-700 py-12">
            <div className="text-center animate-fade-in animate-delay-100">
              <div className="text-3xl font-light mb-2">500+</div>
              <div className="text-xs text-neutral-300 uppercase tracking-widest font-light">Photos</div>
            </div>
            <div className="text-center animate-fade-in animate-delay-200">
              <div className="text-3xl font-light mb-2">50+</div>
              <div className="text-xs text-neutral-300 uppercase tracking-widest font-light">Locations</div>
            </div>
            <div className="text-center animate-fade-in animate-delay-300">
              <div className="text-3xl font-light mb-2">4.9★</div>
              <div className="text-xs text-neutral-300 uppercase tracking-widest font-light">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-20 animate-fade-in">
          <span className="inline-block text-xs uppercase tracking-widest text-neutral-600 font-light mb-6">
            Our Collection
          </span>
          <h2 className="text-3xl md:text-4xl font-light mb-6 text-neutral-900 tracking-wide">
            Explore Our Gallery
          </h2>
          <p className="text-neutral-700 max-w-2xl mx-auto font-light">
            Click on any image to view in full screen and discover the details
          </p>
        </div>
        <GalleryGrid />
      </div>
    </PublicLayout>
  );
}
