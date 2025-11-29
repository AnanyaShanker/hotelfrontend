
export default function Sidebar() {
  return (
    <aside className="w-72 min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-8 shadow-2xl">
      <h2 className="text-2xl font-extrabold mb-12 tracking-wide">Admin</h2>

      <div className="space-y-6 text-sm font-medium">
        {["Dashboard", "Rooms", "Bookings", "Users", "Payments", "Settings"].map(
          (item) => (
            <div
              key={item}
              className="px-4 py-3 rounded-xl cursor-pointer hover:bg-white/10 transition"
            >
              {item}
            </div>
          )
        )}
      </div>
    </aside>
  );
}