import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, getRoleName, isAdmin, isStaff } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-lg bg-white/80 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-shadow">
            HE
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              HotelEase
            </div>
            <p className={`text-xs -mt-1 transition-colors ${scrolled ? 'text-gray-500' : 'text-white/80'}`}>
              Luxury stays
            </p>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <a
            href="/"
            className={`hover:text-purple-600 transition-colors relative group ${scrolled ? 'text-gray-700' : 'text-white'}`}
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300" />
          </a>
          <a
            href="#rooms"
            className={`hover:text-purple-600 transition-colors relative group ${scrolled ? 'text-gray-700' : 'text-white'}`}
          >
            Rooms
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300" />
          </a>
          <a
            href="/gallery"
            className={`hover:text-purple-600 transition-colors relative group ${scrolled ? 'text-gray-700' : 'text-white'}`}
          >
            Gallery
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300" />
          </a>
          <a
            href="#contact"
            className={`hover:text-purple-600 transition-colors relative group ${scrolled ? 'text-gray-700' : 'text-white'}`}
          >
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300" />
          </a>
          <button
            className="ml-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((s) => !s)}
            className={`p-2 rounded-lg hover:bg-black/5 transition ${scrolled ? 'text-gray-700' : 'text-white'}`}
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
        className={`md:hidden bg-white/90 backdrop-blur-lg border-t border-gray-200 transition-all duration-300 overflow-hidden ${
          open ? "max-h-80" : "max-h-0"
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-4">
          <a href="/" className="py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors">Home</a>
          <a href="#rooms" className="py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors">Rooms</a>
          <a href="/gallery" className="py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors">Gallery</a>
          <a href="#contact" className="py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors">Contact</a>
          <button
            className="mt-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-center shadow-lg"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </header>
  );
}
