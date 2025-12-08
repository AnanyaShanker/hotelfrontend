import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import { useAuth } from "../hooks/useAuth";

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const token = localStorage.getItem("token");

  // ---------------------------
  // Fetch Manager's Branch
  // ---------------------------
  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) return;

    const fetchBranch = async () => {
      try {
        const res = await axios.get(`/api/branches/manager/${user.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBranch(res.data);
      } catch (err) {
        console.error("Failed to load branch:", err);
      }
      setLoading(false);
    };

    fetchBranch();
  }, [user]);

  // ---------------------------
  // Logout
  // ---------------------------
  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (!isAuthenticated || !isAdmin()) {
    return (
      <div className="mt-40 text-center text-neutral-700">
        <p>You are not authorized to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-40 text-neutral-600 text-lg">
        Loading your branch information...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* -------------------------------------- */}
      {/* NAVBAR (Same as StaffDashboard) */}
      {/* -------------------------------------- */}
      <header className="border-b border-neutral-200 fixed top-0 left-0 w-full bg-white z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="text-xl tracking-wide font-light text-neutral-900 cursor-pointer">
            HOTELEASE
          </div>

          {/* PROFILE DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-3 border border-neutral-300 px-4 py-2 text-neutral-700 font-light hover:bg-neutral-100 transition"
            >
              <div className="w-8 h-8 rounded-full bg-neutral-300 flex items-center justify-center text-neutral-700">
                {user?.name?.charAt(0) || "M"}
              </div>
              <span className="text-sm">{user?.name}</span>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 shadow-lg p-4 animate-fade-in">
                <div className="text-neutral-900 font-light mb-1">{user?.name}</div>
                <div className="text-neutral-500 text-xs uppercase tracking-wider mb-4">
                  Manager
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left text-sm text-neutral-800 py-2 hover:text-neutral-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* -------------------------------------- */}
      {/* MAIN CONTENT */}
      {/* -------------------------------------- */}
      <main className="max-w-6xl mx-auto pt-32 px-6">
        {/* HEADER */}
        <h1 className="text-3xl font-light text-neutral-900 mb-8 tracking-wide">
          Manager Dashboard — {branch?.name}
        </h1>

        {/* GRID OF PANELS (Same style as staff dashboard section cards) */}
        <section className="grid md:grid-cols-2 gap-10">

          <DashboardCard
            title="🛏️ Branch Bookings"
            desc="View and manage all guest bookings for this branch."
            btn="View Bookings"
            action={() => navigate(`/manager/bookings?branchId=${branch.branchId}`)}
          />

          <DashboardCard
            title="🚪 Room Status"
            desc="Update availability and maintenance status for rooms."
            btn="Manage Rooms"
            action={() => navigate(`/manager/room-status?branchId=${branch.branchId}`)}
          />

          <DashboardCard
            title="🎫 Support Tickets"
            desc="Monitor and respond to guest support tickets."
            btn="View Tickets"
            action={() => navigate(`/manager/support-tickets?branchId=${branch.branchId}`)}
          />

          <DashboardCard
            title="📋 Staff Tasks"
            desc="View all housekeeping and staff tasks."
            btn="View Staff Tasks"
            action={() => navigate(`/manager/staff-tasks?branchId=${branch.branchId}`)}
          />

        </section>
      </main>
    </div>
  );
}

// ------------------------------------------------------
// REUSABLE DASHBOARD CARD (Same style as StaffDashboard)
// ------------------------------------------------------
function DashboardCard({ title, desc, btn, action }) {
  return (
    <div className="bg-white border border-neutral-200 p-8 rounded-md shadow-sm hover:shadow-md transition-all">
      <h3 className="text-xl font-light mb-4 text-neutral-900 tracking-wide">
        {title}
      </h3>
      <p className="text-neutral-700 font-light text-sm mb-6">{desc}</p>

      <button
        onClick={action}
        className="px-6 py-3 bg-neutral-800 text-white font-light text-sm tracking-wider uppercase hover:bg-neutral-900 transition"
      >
        {btn}
      </button>
    </div>
  );
}