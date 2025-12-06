import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar({ isOpen, onClose }) {
  const [reportsOpen, setReportsOpen] = useState(false);
  const [managementOpen, setManagementOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-neutral-50 border-r border-neutral-200 shadow-xl transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="p-8 border-b border-neutral-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-light tracking-wide text-neutral-800">
              Admin Panel
            </h2>
            <p className="text-xs text-neutral-500 mt-1">HotelEase Control</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-600 hover:text-red-500 text-lg transition"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-3 text-sm overflow-y-auto h-[calc(100%-5rem)]">
          {/* Customers */}
          <Link
            to="/users"
            onClick={onClose}
            className={`block px-4 py-3 rounded-lg cursor-pointer hover:bg-neutral-100 transition ${
              location.pathname === "/users"
                ? "bg-neutral-200 text-neutral-900"
                : "text-neutral-700"
            }`}
          >
            Customers
          </Link>

          {/* Bookings */}
          <Link
            to="/booking-report"
            onClick={onClose}
            className={`block px-4 py-3 rounded-lg cursor-pointer hover:bg-neutral-100 transition ${
              location.pathname === "/booking-report"
                ? "bg-neutral-200 text-neutral-900"
                : "text-neutral-700"
            }`}
          >
            Bookings
          </Link>

          {/* Management */}
          <div>
            <div
              onClick={() => setManagementOpen(!managementOpen)}
              className="px-4 py-3 rounded-lg cursor-pointer hover:bg-neutral-100 transition flex justify-between items-center text-neutral-700"
            >
              <span>Management</span>
              <span className="text-xs">{managementOpen ? "▲" : "▼"}</span>
            </div>
            {managementOpen && (
              <div className="ml-6 mt-2 space-y-2 animate-fade-in-up">
                {[
                  { label: "Branch Management", path: "/management/branch" },
                  { label: "Room Type & Pricing", path: "/management/pricing" },
                
                 
                ].map((subItem) => (
                  <Link
                    key={subItem.label}
                    to={subItem.path}
                    onClick={onClose}
                    className={`block px-3 py-2 rounded-md hover:bg-neutral-100 transition ${
                      location.pathname === subItem.path
                        ? "bg-neutral-200 text-neutral-900"
                        : "text-neutral-700"
                    }`}
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Staff */}
          <Link
            to="/enroll-staff"
            onClick={onClose}
            className={`block px-4 py-3 rounded-lg cursor-pointer hover:bg-neutral-100 transition ${
              location.pathname === "/enroll-staff"
                ? "bg-neutral-200 text-neutral-900"
                : "text-neutral-700"
            }`}
          >
            Staff
          </Link>

          {/* Payments */}
          <Link
            to="/payments"
            onClick={onClose}
            className={`block px-4 py-3 rounded-lg cursor-pointer hover:bg-neutral-100 transition ${
              location.pathname === "/payments"
                ? "bg-neutral-200 text-neutral-900"
                : "text-neutral-700"
            }`}
          >
            Payments
          </Link>

          {/* Reports */}
          <div>
            <div
              onClick={() => setReportsOpen(!reportsOpen)}
              className="px-4 py-3 rounded-lg cursor-pointer hover:bg-neutral-100 transition flex justify-between items-center text-neutral-700"
            >
              <span>Reports</span>
              <span className="text-xs">{reportsOpen ? "▲" : "▼"}</span>
            </div>
            {reportsOpen && (
              <div className="ml-6 mt-2 space-y-2 animate-fade-in-up">
                {[
                  { label: "Housekeeping Reports", path: "/reports/housekeeping" },
                  { label: "Room Occupancy Reports", path: "/reports/room-occupancy" },
                  { label: "Room Revenue Reports", path: "/reports/room-revenue" },
                  { label: "Feedback Report", path: "/reports/feedback" },
                ].map((subItem) => (
                  <Link
                    key={subItem.label}
                    to={subItem.path}
                    onClick={onClose}
                    className={`block px-3 py-2 rounded-md hover:bg-neutral-100 transition ${
                      location.pathname === subItem.path
                        ? "bg-neutral-200 text-neutral-900"
                        : "text-neutral-700"
                    }`}
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </aside>

      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
        />
      )}
    </>
  );
}
