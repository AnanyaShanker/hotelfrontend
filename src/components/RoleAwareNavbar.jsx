import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleAwareNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, getRoleName, isAdmin, isStaff, isCustomer } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white border-b border-neutral-200" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className={`text-2xl font-light tracking-widest ${scrolled ? 'text-neutral-800' : 'text-white'}`}>
            HOTELEASE
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-light uppercase tracking-widest">
          <a
            href="/"
            className={`hover:text-neutral-400 transition-colors ${scrolled ? 'text-neutral-800' : 'text-white'}`}
          >
            Home
          </a>

          <a
            href="/facilities"
            className={`hover:text-neutral-400 transition-colors ${scrolled ? 'text-neutral-800' : 'text-white'}`}
          >
            Facilities
          </a>

            {/* {isAuthenticated && isCustomer() &&( */}
              <a
                href="/book-room"
                className={`hover:text-neutral-400 transition-colors ${scrolled ? 'text-neutral-800' : 'text-white'}`}
              >
                Rooms
              </a>
            
            {/* )} */}

          {isAuthenticated && isCustomer() && (
            <>
              <a
                href="/my-facility-bookings"
                className={`hover:text-neutral-400 transition-colors ${scrolled ? 'text-neutral-800' : 'text-white'}`}
              >
                My Bookings
              </a>
              <a
                href="/my-payments"
                className={`hover:text-neutral-400 transition-colors ${scrolled ? 'text-neutral-800' : 'text-white'}`}
              >
                Payments
              </a>
            </>
          )}

          {isAuthenticated && isAdmin() && (
            <>
              <a
                href="/dashboard"
                className={`hover:text-neutral-400 transition-colors ${scrolled ? 'text-neutral-800' : 'text-white'}`}
              >
                Dashboard
              </a>
              <a
                href="/manage-bookings"
                className={`hover:text-neutral-400 transition-colors ${scrolled ? 'text-neutral-800' : 'text-white'}`}
              >
                Bookings
              </a>
            </>
          )}

          {isAuthenticated && isStaff() && (
            <>
              <a
                href="/staff-tasks"
                className={`hover:text-neutral-400 transition-colors ${scrolled ? 'text-neutral-800' : 'text-white'}`}
              >
                My Tasks
              </a>
              <a
                href="/staff-portal"
                className={`hover:text-neutral-400 transition-colors ${scrolled ? 'text-neutral-800' : 'text-white'}`}
              >
                Portal
              </a>
            </>
          )}

          <a
            href="/gallery"
            className={`hover:text-neutral-400 transition-colors ${scrolled ? 'text-neutral-800' : 'text-white'}`}
          >
            Gallery
          </a>

          {/* Login/User Menu */}
          {!isAuthenticated ? (
            <button
              className={`ml-4 px-6 py-2 border font-light text-xs tracking-widest uppercase transition-all ${
                scrolled 
                  ? 'border-neutral-800 text-neutral-800 hover:bg-neutral-800 hover:text-white'
                  : 'border-white text-white hover:bg-white hover:text-neutral-800'
              }`}
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          ) : (
            <div className="relative ml-4">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-2 px-4 py-2 border transition ${
                  scrolled
                    ? 'border-neutral-200 text-neutral-800 hover:bg-neutral-50'
                    : 'border-white/30 text-white hover:bg-white/10'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-light ${
                  scrolled ? 'bg-neutral-200 text-neutral-800' : 'bg-white/20 text-white'
                }`}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="text-xs font-light">{user?.name?.split(' ')[0]}</div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 py-2">
                  <div className="px-4 py-3 border-b border-neutral-200">
                    <p className="text-xs font-light text-neutral-800">{user?.name}</p>
                    <p className="text-xs text-neutral-500 mt-1">{getRoleName(user?.roleId)}</p>
                  </div>

                  <button
                    onClick={() => {
                      navigate("/profile");
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition font-light uppercase tracking-wider"
                  >
                    Profile
                  </button>

                  {isCustomer() && (
                    <button
                      onClick={() => {
                        navigate("/my-bookings");
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition font-light uppercase tracking-wider"
                    >
                      Bookings
                    </button>
                  )}
                  
                  {isCustomer() && (
                    <button
                       onClick={() => {
                        navigate("/my-tickets");
                        setShowUserMenu(false);
                      }}
                     className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition font-light uppercase tracking-wider"
                   >
                       Raised Tickets
                    </button>
                  )}

                  {isAdmin() && (
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition font-light uppercase tracking-wider"
                    >
                      Dashboard
                    </button>
                  )}

                  {isStaff() && (
                    <button
                      onClick={() => {
                        navigate("/staff-tasks");
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition font-light uppercase tracking-wider"
                    >
                      Tasks
                    </button>
                  )}

                  <div className="border-t border-neutral-200 my-2"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition font-light uppercase tracking-wider"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((s) => !s)}
            className={`p-2 transition ${scrolled ? 'text-neutral-700' : 'text-white'}`}
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
                  strokeWidth="1"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-white border-t border-neutral-200 transition-all duration-300 overflow-hidden ${
          open ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-4">
          {isAuthenticated && user && (
            <div className="pb-4 border-b border-neutral-200">
              <p className="text-xs font-light text-neutral-800">{user.name}</p>
              <p className="text-xs text-neutral-500 mt-1">{getRoleName(user.roleId)}</p>
            </div>
          )}

          <a href="/" className="py-2 text-xs text-neutral-700 font-light uppercase tracking-wider hover:text-neutral-400 transition">Home</a>
          <a href="/facilities" className="py-2 text-xs text-neutral-700 font-light uppercase tracking-wider hover:text-neutral-400 transition">Facilities</a>

          {isAuthenticated && isCustomer() && (
            <>
            <a href="/my-bookings" className="py-2 text-xs text-neutral-700 font-light uppercase tracking-wider hover:text-neutral-400 transition">My Bookings</a>
            <a  href="/support-tickets" className="py-2 text-xs text-neutral-700 font-light uppercase tracking-wider hover:text-neutral-400 transition"> Raised Tickets</a>
            </>
          )}

          {isAuthenticated && isAdmin() && (
            <>
              <a href="/dashboard" className="py-2 text-xs text-neutral-700 font-light uppercase tracking-wider hover:text-neutral-400 transition">Dashboard</a>
              <a href="/manage-bookings" className="py-2 text-xs text-neutral-700 font-light uppercase tracking-wider hover:text-neutral-400 transition">Bookings</a>
            </>
          )}

          {isAuthenticated && isStaff() && (
            <>
              <a href="/staff-tasks" className="py-2 text-xs text-neutral-700 font-light uppercase tracking-wider hover:text-neutral-400 transition">My Tasks</a>
              <a href="/staff-portal" className="py-2 text-xs text-neutral-700 font-light uppercase tracking-wider hover:text-neutral-400 transition">Portal</a>
            </>
          )}

          <a href="/gallery" className="py-2 text-xs text-neutral-700 font-light uppercase tracking-wider hover:text-neutral-400 transition">Gallery</a>

          {!isAuthenticated ? (
            <button
              className="mt-2 px-6 py-3 border border-neutral-800 text-neutral-800 text-xs font-light uppercase tracking-wider hover:bg-neutral-800 hover:text-white transition"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          ) : (
            <>
              <a href="/profile" className="py-2 text-xs text-neutral-700 font-light uppercase tracking-wider hover:text-neutral-400 transition">Profile</a>
              <button
                onClick={handleLogout}
                className="mt-2 px-6 py-3 border border-neutral-800 text-neutral-800 text-xs font-light uppercase tracking-wider hover:bg-neutral-800 hover:text-white transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
