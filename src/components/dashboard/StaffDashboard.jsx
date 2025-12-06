import { useState, useEffect } from "react";
import axios from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
 
export default function StaffDashboard() {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
 
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const token = localStorage.getItem("token");
 
  // Helper: format date/time in AM/PM format
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
 
  // Fetch tasks for this staff
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!user) return;
 
        // Step 1: Get staffId from userId
        const staffRes = await axios.get(`/api/staff/user/${user.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
 
        const staffId = staffRes.data.data.staffId;
 
        // Step 2: Fetch tasks of that staff
        const taskRes = await axios.get(`/api/stafftasks/staff/${staffId}`, {
          headers: { Authorization: `Bearer ${token}` },
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
 
  // Status color badges
  const statusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      default:
        return "bg-neutral-200 text-neutral-700";
    }
  };
 
  // Update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const res = await axios.patch(
        `/api/stafftasks/${taskId}/status?status=${newStatus}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
 
      // Update UI
      setTasks((prev) =>
        prev.map((t) =>
          t.taskId === taskId
            ? {
                ...t,
                status: newStatus,
                completedAt:
                  newStatus === "COMPLETED"
                    ? new Date().toISOString()
                    : t.completedAt,
              }
            : t
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };
 
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
          {/* LOGO */}
          <div className="text-xl tracking-wide font-light text-neutral-900 cursor-pointer">
            HOTELEASE
          </div>
 
          {/* USER MENU */}
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
 
                <button className="w-full text-left text-sm text-neutral-800 py-2 hover:text-neutral-600">
                  Profile
                </button>
 
                <button
                  className="w-full text-left text-sm text-neutral-800 py-2 hover:text-neutral-600"
                  onClick={() => (window.location.href = "/logout")}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
 
      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto pt-32 px-6">
        <h1 className="text-3xl font-light text-neutral-900 mb-8 tracking-wide">
          Staff Dashboard
        </h1>
 
        {/* TASK TABLE */}
        <section className="bg-white border border-neutral-200 p-6">
          <h2 className="text-xl font-light text-neutral-800 mb-6 tracking-wide">
            Today's Tasks
          </h2>
 
          {tasks.length === 0 ? (
            <div className="text-neutral-600 text-sm py-10 text-center">
              No tasks assigned for today.
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
                {tasks.map((task) => (
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
                        onChange={(e) =>
                          updateTaskStatus(task.taskId, e.target.value)
                        }
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