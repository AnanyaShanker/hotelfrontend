import { useEffect, useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setIndex(index === 0 ? images.length - 1 : index - 1);
  };

  const nextSlide = () => {
    setIndex((index + 1) % images.length);
  };

  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform duration-1000 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="min-w-full h-[85vh] bg-cover bg-center transition-all duration-1000"
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />

      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
        <div className="max-w-4xl">
          <span className="inline-block text-xs uppercase tracking-widest text-white/90 font-light mb-6 animate-fade-in">
            Welcome to HotelEase
          </span>

          <h1 className="text-5xl md:text-7xl font-light mb-6 leading-tight tracking-wide animate-fade-in animate-delay-100">
            Luxury Hotel
            <br />
            <span className="text-white/90">Experience</span>
          </h1>

          <p className="max-w-2xl text-base md:text-lg font-light mb-10 leading-relaxed text-white/90 animate-fade-in animate-delay-200">
            Experience world-class hospitality, comfort & elegance in the heart of
            luxury
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animate-delay-300">
            <button className="px-10 py-4 bg-white text-neutral-800 font-light text-xs tracking-widest uppercase hover:bg-neutral-100 transition">
              Book Now
            </button>
            <button className="px-10 py-4 border border-white text-white font-light text-xs tracking-widest uppercase hover:bg-white/10 transition">
              Explore More
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-6 -translate-y-1/2 w-12 h-12 border border-white/30 hover:bg-white/10 text-white transition-all flex items-center justify-center group animate-fade-in animate-delay-400"
      >
        <span className="text-2xl font-light group-hover:-translate-x-1 transition-transform">
          ‹
        </span>
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-6 -translate-y-1/2 w-12 h-12 border border-white/30 hover:bg-white/10 text-white transition-all flex items-center justify-center group animate-fade-in animate-delay-400"
      >
        <span className="text-2xl font-light group-hover:translate-x-1 transition-transform">
          ›
        </span>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 w-full flex justify-center gap-2 animate-fade-in animate-delay-500">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-px rounded-full cursor-pointer transition-all duration-300 ${
              index === i
                ? "bg-white w-12"
                : "bg-white/50 w-8 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
