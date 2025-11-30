export default function AdminSidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-gradient-to-b from-gray-900 to-black text-white shadow-2xl transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-8 border-b border-white/10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-extrabold tracking-wide">Admin Panel</h2>
            <p className="text-xs text-gray-400 mt-1">HotelEase Control</p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="text-white hover:text-red-400 text-xl"
          >
            ✕
          </button>
        </div>

        <nav className="p-6 space-y-3 text-sm">
          {[
            "Dashboard",
            "Rooms",
            "Bookings",
            "Customers",
            "Payments",
            "Staff",
            "Reports",
            "Settings",
          ].map((item) => (
            <div
              key={item}
              className="px-4 py-3 rounded-xl cursor-pointer hover:bg-white/10 transition"
            >
              {item}
            </div>
          ))}
        </nav>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}
    </>
  );
}
