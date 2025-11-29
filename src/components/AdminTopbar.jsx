export default function AdminTopbar({ onMenuClick }) {
  return (
    <header className="h-[72px] bg-white shadow-md flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* Toggle Button */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md hover:bg-black/10 transition"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <h1 className="text-lg font-bold tracking-tight">Admin Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold">Admin User</p>
          <p className="text-xs text-gray-500">admin@hotelease.com</p>
        </div>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-black to-gray-700 text-white flex items-center justify-center font-bold shadow">
          A
        </div>
      </div>
    </header>
  );
}

