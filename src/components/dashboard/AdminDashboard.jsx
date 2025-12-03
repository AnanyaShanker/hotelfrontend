import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
 const navigate = useNavigate();

 const menuItems = [
 { label: "Revenue", path: "/reports/revenue" },
 { label: "Occupancy", path: "/reports/occupancy" },
 { label: "Housekeeping", path: "/housekeeping" },
 { label: "All Users", path: "/users" },
 { label: "Payments", path: "/payments" },
 { label: "Staff Information", path: "/staff" },
 ];

 const handleLogout = () => {
 localStorage.removeItem("token"); // remove JWT
 localStorage.removeItem("user"); // if stored user data
 navigate("/login");
 };

 return (
 <div className="flex min-h-screen bg-neutral-50">
 {/* Sidebar */}
 <aside className="w-64 bg-white border-r border-neutral-200 p-6 space-y-8">
 <h1 className="text-xl tracking-[0.25em] text-neutral-800 font-light">
 HOTELEASE
 </h1>

 <nav className="space-y-4 text-neutral-600 text-sm font-light">
 <p className="hover:text-neutral-900 cursor-pointer">Dashboard</p>
 <p className="hover:text-neutral-900 cursor-pointer">Reservations</p>
 <p className="hover:text-neutral-900 cursor-pointer">Rooms</p>
 <p className="hover:text-neutral-900 cursor-pointer">Staff</p>
 <p className="hover:text-neutral-900 cursor-pointer">Reports</p>
 </nav>
 </aside>

 {/* Main */}
 <div className="flex-1 flex flex-col">
 {/* 🔹 Top Bar */}
 <header className="flex justify-between items-center px-10 py-6 bg-white border-b border-neutral-200">
 <h2 className="text-2xl font-light tracking-wide text-neutral-900">
 Admin Dashboard
 </h2>

 <div className="flex items-center gap-6">
 {/* Profile / role (optional dynamic from backend) */}
 <div className="text-right">
 <p className="text-sm font-medium text-neutral-700">Admin Super</p>
 <p className="text-xs text-neutral-500 tracking-wide">SUPER_ADMIN</p>
 </div>

 {/* Profile icon */}
 <div className="w-9 h-9 bg-neutral-300 rounded-full"></div>

 {/* 🔥 Logout Button */}
 <button
 onClick={handleLogout}
 className="text-xs font-light uppercase tracking-widest px-4 py-2 border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-100 transition"
 >
 Logout
 </button>
 </div>
 </header>

 {/* Content */}
 <main className="p-10">
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {menuItems.map((item, i) => (
 <button
 key={i}
 onClick={() => navigate(item.path)}
 className="w-full bg-white border border-neutral-200 shadow-sm p-6 text-left hover:shadow-md transition rounded"
 >
 <p className="text-lg font-light text-neutral-900 mb-1">
 {item.label}
 </p>
 <p className="text-xs text-neutral-500 tracking-wide">
 View {item.label.toLowerCase()} →
 </p>
 </button>
 ))}
 </div>
 </main>
 </div>
 </div>
 );
}

