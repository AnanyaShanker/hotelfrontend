import React, { useEffect, useState } from "react";
import axios from "../../api/axiosConfig";

export default function HousekeepingReport() {
  const [summary, setSummary] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------------------------
  // Load API Data
  // --------------------------
  useEffect(() => {
    async function load() {
      try {
        const [summaryRes, rowsRes] = await Promise.all([
          axios.get("/api/reports/housekeeping/admin", { skipAuth: true }),
          axios.get("/api/reports/housekeeping/admin/summary", { skipAuth: true }),
        ]);

        setRows(summaryRes.data);
        setSummary(rowsRes.data);
      } catch (err) {
        console.error("Error loading housekeeping report:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-12 text-blue-700 animate-pulse">
        Loading housekeeping report…
      </p>
    );

  if (!summary)
    return (
      <p className="text-center mt-12 text-red-600">
        Could not load summary.
      </p>
    );

  // Summary Values
  const {
    totalTasks,
    completedTasks,
    pendingTasks,
    inProgressTasks,
    completionPercentage,
    averageCompletionTime,
  } = summary;

  // --------------------------
  // CARD COMPONENT
  // --------------------------
  const StatCard = ({ icon, title, value }) => (
    <div className="p-7 bg-white rounded-xl border border-blue-200 shadow-md 
                    hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="text-4xl">{icon}</div>
        <div>
          <h2 className="text-sm text-blue-600 uppercase tracking-widest">{title}</h2>
          <p className="text-3xl font-semibold text-blue-900">{value}</p>
        </div>
      </div>
    </div>
  );

  // --------------------------
  // TABLE ROW COLORING
  // --------------------------
  const getStatusColor = (status) => {
    status = status?.toUpperCase();
    switch (status) {
      case "COMPLETED":
        return "bg-green-50";
      case "PENDING":
        return "bg-yellow-50";
      case "IN_PROGRESS":
        return "bg-blue-50";
      default:
        return "bg-white";
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-extrabold text-black-900 mb-10">
        Housekeeping Report
      </h1>

      {/* -------------------- STAT CARDS -------------------- */}
      <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6 mb-12">
        <StatCard title="Total Tasks" icon="🧹" value={totalTasks} />
        <StatCard title="Completed" icon="✅" value={completedTasks} />
        
        <StatCard
          title="Completion %"
          icon="📊"
          value={`${completionPercentage?.toFixed(1)}%`}
        />
       
      </div>

      {/* -------------------- TABLE -------------------- */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">
          Housekeeping Tasks — Detailed View
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-50 text-sm text-neutral-700">
                <th className="p-3 text-left border-b">Task ID</th>
                <th className="p-3 text-left border-b">Staff</th>
                <th className="p-3 text-left border-b">Room</th>
                <th className="p-3 text-left border-b">Branch</th>
                <th className="p-3 text-left border-b">Task Type</th>
                <th className="p-3 text-left border-b">Status</th>
                <th className="p-3 text-left border-b">Assigned At</th>
                <th className="p-3 text-left border-b">Completed At</th>
                
              </tr>
            </thead>

            <tbody>
              {rows.map((task, i) => (
                <tr
                  key={i}
                  className={`${getStatusColor(
                    task.status
                  )} hover:shadow-md transition transform hover:translate-y-0.5`}
                >
                  <td className="p-3">{task.taskId}</td>
                  <td className="p-3">{task.staffName}</td>
                  <td className="p-3">{task.roomNumber}</td>
                  <td className="p-3">{task.branchName}</td>
                  <td className="p-3">{task.taskType}</td>

                  {/* Status Badge */}
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : task.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : task.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>

                  <td className="p-3 text-sm text-neutral-700">
                    {task.assignedAt?.replace("T", " ")}
                  </td>

                  <td className="p-3 text-sm text-neutral-700">
                    {task.completedAt ? task.completedAt.replace("T", " ") : "—"}
                  </td>

                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}