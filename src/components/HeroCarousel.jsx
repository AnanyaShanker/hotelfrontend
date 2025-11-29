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
    <div className="relative h-[85vh] w-full overflow-hidden rounded-3xl shadow-2xl">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="min-w-full h-[85vh] bg-cover bg-center"
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          Luxury Hotel Experience
        </h1>
        <p className="max-w-xl text-lg opacity-90">
          Experience world-class hospitality, comfort & elegance.
        </p>
      </div>

      {/* Buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-6 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full"
      >
        ❮
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-6 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full"
      >
        ❯
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 w-full flex justify-center gap-3">
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${
              index === i ? "bg-white scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}



