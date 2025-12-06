import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import { useAuth } from "../hooks/useAuth";

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) return;

    const fetchBranch = async () => {
      try {
        const res = await axios.get(`/api/branches/manager/${user.userId}`);
        setBranch(res.data);
      } catch (err) {
        console.error("Failed to load branch:", err);
      }
      setLoading(false);
    };

    fetchBranch();
  }, [user]);

  if (!isAuthenticated || !isAdmin()) {
    return (
      <div className="mt-40 text-center text-neutral-700">
        <p>You are not authorized to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-40 text-center text-neutral-700">
        <p>Loading your branch dashboard...</p>
      </div>
    );
  }

  return (
    <>
      {/* LOGOUT BUTTON floating top-right */}
      <button
        onClick={handleLogout}
        className="fixed top-4 right-4 z-50 text-neutral-700 hover:text-neutral-900 font-semibold text-lg tracking-wide uppercase px-6 py-3 transition-transform duration-200 hover:scale-105"
      >
        Logout
      </button>

      {/* MAIN CONTENT with equal margin */}
      <div className="m-8">
        {/* HEADER */}
        <section className="mb-16">
          <div className="relative overflow-hidden bg-neutral-50 border border-neutral-200 p-10 rounded-md shadow-sm">
            <h2 className="text-3xl font-light text-neutral-800 mb-3 tracking-wide">
              Manager Dashboard — {branch?.name}
            </h2>
            <p className="text-neutral-600 text-base font-light max-w-2xl">
              Manage operations, staff, rooms, and performance reports for your branch.
            </p>
          </div>
        </section>

        {/* MAIN GRID */}
        <section className="grid md:grid-cols-3 gap-10">
          <DashboardCard
            title="🛏️ Branch Bookings"
            desc="View and manage all room bookings for this branch."
            action={() => navigate(`/manager/bookings?branchId=${branch.branchId}`)}
            btn="View Bookings"
          />

          <DashboardCard
            title="🚪 Room Status"
            desc="Update availability and maintenance status of all rooms."
            action={() => navigate(`/manager/room-status?branchId=${branch.branchId}`)}
            btn="Manage Rooms"
          />

          <DashboardCard
            title="🎫 Support Tickets"
            desc="Monitor support tickets raised by guests and assign staff."
            action={() => navigate(`/manager/support-tickets?branchId=${branch.branchId}`)}
            btn="View Tickets"
          />

          <DashboardCard
            title="📋 Staff Tasks"
            desc="View housekeeping & operational tasks."
            action={() => navigate(`/manager/staff-tasks?branchId=${branch.branchId}`)}
            btn="View Assigned Tasks"
          />

          <DashboardCard
            title="📊 Branch Reports"
            desc="View revenue, occupancy, feedback and housekeeping reports."
            action={() =>
              navigate(`/manager/reports?branchId=${branch.branchId}&managerId=${user.userId}`)
            }
            btn="View Reports"
          />
        </section>
      </div>
    </>
  );
}

function DashboardCard({ title, desc, action, btn }) {
  return (
    <div className="bg-neutral-50 border border-neutral-200 p-8 hover:border-neutral-300 transition-all rounded-md shadow-sm">
      <h3 className="text-xl font-light mb-4 text-neutral-900 tracking-wide">{title}</h3>
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
