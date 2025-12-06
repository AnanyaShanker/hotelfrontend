import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // assuming you're using react-router

export default function AdminTopbar({ onMenuClick }) {
  const { user, logout } = useAuth(); // add logout from context
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clear auth state
    navigate("/login"); // redirect to login page
  };

  return (
    <header className="h-[72px] bg-white shadow-md flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* Toggle Button */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md hover:bg-black/10 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <h1 className="text-lg font-bold tracking-tight">Admin Dashboard</h1>
      </div>

      <div className="relative flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold">
            {user ? user.name : "Admin User"}
          </p>
          <p className="text-xs text-gray-500">
            {user ? user.email : "admin@hotelease.com"}
          </p>
        </div>

        {/* Avatar with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-black to-gray-700 text-white flex items-center justify-center font-bold shadow"
          >
            {user ? user.name?.charAt(0).toUpperCase() : "A"}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
