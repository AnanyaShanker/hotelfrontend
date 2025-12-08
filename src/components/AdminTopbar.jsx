import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
 
export default function AdminTopbar({ onMenuClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
 
  const handleLogout = () => {
    // Clear token or any auth info
    localStorage.removeItem("token");
    // Redirect to login page
    navigate("/login");
  };
 
  return (
    <header className="h-[72px] bg-white shadow-md flex items-center justify-between px-6 relative">
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
          <p className="text-sm font-semibold">
            {user ? user.name : "Admin User"}
          </p>
          <p className="text-xs text-gray-500">
            {user ? user.email : "admin@hotelease.com"}
          </p>
        </div>
 
        {/* Avatar with dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-black to-gray-700 text-white flex items-center justify-center font-bold shadow"
          >
            {user ? user.name?.charAt(0).toUpperCase() : "A"}
          </button>
 
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg p-4">
              <p className="text-sm font-semibold text-gray-900">
                {user ? user.name : "Admin User"}
              </p>
              <p className="text-xs text-gray-500 mb-3">
                {user ? user.role || "Admin" : "Admin"}
              </p>
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm text-red-600 hover:text-red-800"
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