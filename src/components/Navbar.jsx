import { useState, useEffect } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-md bg-white/60 shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-black to-gray-700 flex items-center justify-center text-white font-bold shadow">
            HE
          </div>
          <div>
            <a href="/" className="text-lg font-extrabold tracking-tight">
              HotelEase
            </a>
            <p className="text-xs text-gray-500 -mt-1">Luxury stays</p>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#home" className="hover:text-yellow-500 transition">Home</a>
          <a href="#rooms" className="hover:text-yellow-500 transition">Rooms</a>
          <a href="#gallery" className="hover:text-yellow-500 transition">Gallery</a>
          <a href="#contact" className="hover:text-yellow-500 transition">Contact</a>
          <a
            href="#login"
            className="ml-4 inline-block px-4 py-2 rounded-lg bg-black text-white hover:opacity-90 transition"
          >
            Login
          </a>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((s) => !s)}
            className="p-2 rounded-md hover:bg-black/5 transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu - slide down */}
      <div
        className={`md:hidden bg-white/80 backdrop-blur-md border-t border-gray-200 transition-all duration-300 overflow-hidden ${
          open ? "max-h-60" : "max-h-0"
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-3">
          <a href="#home" className="py-2 hover:text-yellow-500">Home</a>
          <a href="#rooms" className="py-2 hover:text-yellow-500">Rooms</a>
          <a href="#gallery" className="py-2 hover:text-yellow-500">Gallery</a>
          <a href="#contact" className="py-2 hover:text-yellow-500">Contact</a>
          <a
            href="#login"
            className="mt-2 inline-block px-4 py-2 rounded-lg bg-black text-white text-center"
          >
            Login
          </a>
        </div>
      </div>
    </header>
  );
}


