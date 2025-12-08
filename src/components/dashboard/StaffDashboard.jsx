
import { useState, useEffect } from "react";
import axios from "../../api/axiosConfig";
import { useAuth } from "../../hooks/useAuth";

export default function StaffDashboard() {
  const { user , logout} = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const formatDateTime = (dateString) => {
    if (!dateString) return "--";
    return new Date(dateString).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

 const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
 

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!user) return;

        const staffRes = await axios.get(`/api/staff/user/${user.userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const staffId = staffRes.data.data.staffId;

        const taskRes = await axios.get(`/api/stafftasks/staff/${staffId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setTasks(taskRes.data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const statusBadge = (status) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-700";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-700";
      case "COMPLETED": return "bg-green-100 text-green-700";
      default: return "bg-neutral-200 text-neutral-700";
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.patch(
        `/api/stafftasks/${taskId}/status?status=${newStatus}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks((prev) =>
        prev.map((t) =>
          t.taskId === taskId
            ? {
                ...t,
                status: newStatus,
                completedAt:
                  newStatus === "COMPLETED"
                    ? new Date().toISOString()
                    : t.completedAt
              }
            : t
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  
  const filteredTasks = tasks.filter((task) => {
  const assigned = new Date(task.assignedAt);

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  // Normalize to midnight for date-only comparison
  const normalize = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const assignedDate = normalize(assigned);
  const startDateOnly = start ? normalize(start) : null;
  const endDateOnly = end ? normalize(end) : null;

  if (startDateOnly && assignedDate < startDateOnly) return false;
  if (endDateOnly && assignedDate > endDateOnly) return false;

  if (statusFilter !== "ALL" && task.status !== statusFilter) return false;

  const q = searchQuery.toLowerCase();
  if (
    q &&
    !task.roomId.toString().toLowerCase().includes(q) &&
    !task.taskType.toLowerCase().includes(q)
  ) {
    return false;
  }

  return true;
});


  if (loading) {
    return (
      <div className="text-center py-32 text-neutral-600 text-lg">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* NAVBAR */}
      <header className="border-b border-neutral-200 fixed top-0 left-0 w-full bg-white z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="text-xl tracking-wide font-light text-neutral-900 cursor-pointer">
            HOTELEASE
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-3 border border-neutral-300 px-4 py-2 text-neutral-700 font-light hover:bg-neutral-100 transition"
            >
              <div className="w-8 h-8 rounded-full bg-neutral-300 flex items-center justify-center text-neutral-700">
                {user?.name?.charAt(0) || "S"}
              </div>
              <span className="text-sm">{user?.name}</span>
            </button>

             {showMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 shadow-lg p-4 animate-fade-in">
                <div className="text-neutral-900 font-light mb-1">{user?.name}</div>
                <div className="text-neutral-500 text-xs uppercase tracking-wider mb-4">
                  Staff
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

      {/* MAIN */}
      <main className="max-w-6xl mx-auto pt-32 px-6">
        <h1 className="text-3xl font-light text-neutral-900 mb-8 tracking-wide">
          Staff Dashboard
        </h1>

        {/* FILTER PANEL */}
        <section className="bg-white border border-neutral-200 p-6 mb-8">
          <h2 className="text-lg font-light text-neutral-800 mb-6 tracking-wide">
            Filter Tasks
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-wider text-neutral-600 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate || undefined}
                className="border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-wider text-neutral-600 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
                className="border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-wider text-neutral-600 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-neutral-300 px-3 py-2 text-sm"
              >
                <option value="ALL">All</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-wider text-neutral-600 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search Room / Task Type"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </section>

        {/* TASK TABLE */}
        <section className="bg-white border border-neutral-200 p-6">
          <h2 className="text-xl font-light text-neutral-800 mb-6 tracking-wide">
            Today's Tasks
          </h2>

          {filteredTasks.length === 0 ? (
            <div className="text-neutral-600 text-sm py-10 text-center">
              No tasks match the applied filters.
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-neutral-600 text-xs uppercase tracking-wider border-b border-neutral-300">
                  <th className="py-3">Room</th>
                  <th className="py-3">Task Type</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Assigned At</th>
                  <th className="py-3">Completed At</th>
                  <th className="py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredTasks.map((task) => (
                  <tr
                    key={task.taskId}
                    className="border-b border-neutral-200 text-sm font-light"
                  >
                    <td className="py-3">{task.roomId}</td>
                    <td className="py-3">{task.taskType}</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${statusBadge(
                          task.status
                        )}`}
                      >
                        {task.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3">{formatDateTime(task.assignedAt)}</td>
                    <td className="py-3">{formatDateTime(task.completedAt)}</td>
                    <td className="py-3">
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.taskId, e.target.value)}
                        className="border border-neutral-300 px-3 py-1 text-sm"
                      >
                        <option value="PENDING" disabled={task.status !== "PENDING"}>
                          Pending
                        </option>
                        <option
                          value="IN_PROGRESS"
                          disabled={task.status === "COMPLETED"}
                        >
                          In Progress
                        </option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}