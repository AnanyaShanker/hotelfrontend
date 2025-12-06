import { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import { useSearchParams } from "react-router-dom";
import BackButton from "./BackButton";

export default function ManagerStaffTaskPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  // Manager's branchId is passed in URL: ?branchId=1
  const branchId = Number(searchParams.get("branchId"));

  useEffect(() => {
    if (!branchId) return;

    const fetchTasks = async () => {
      try {
        const res = await axios.get(`/api/stafftasks/hotel/${branchId}/tasks`);
        console.log("Manager Staff Task Load:", res.data);
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch staff tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [branchId]);

  // --------------------------------------
  // UPDATE STATUS
  // --------------------------------------
  const updateStatus = async (taskId, newStatus) => {
    try {
      await axios.patch(`/api/stafftasks/${taskId}/status`, null, {
        params: { status: newStatus },
      });

      // Update UI instantly
      setTasks((prev) =>
        prev.map((t) =>
          t.taskId === taskId
            ? {
                ...t,
                status: newStatus,
                completedAt:
                  newStatus === "COMPLETED"
                    ? new Date().toISOString().replace("T", " ").substring(0, 19)
                    : t.completedAt,
              }
            : t
        )
      );
    } catch (err) {
      console.error("Failed to update task:", err);
      alert("Error updating task status");
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading)
    return (
      <p className="mt-40 text-center text-neutral-500">Loading tasks...</p>
    );

  return (
    <div className="mt-28 mb-24 px-6 md:px-16">
         <BackButton />
      <section className="mb-10">
        <h1 className="text-3xl font-light text-neutral-800">
          Staff Tasks — Branch #{branchId}
        </h1>
        <p className="text-neutral-600 mt-2">
          View and monitor all staff tasks for your branch.
        </p>
      </section>

      {/* TABLE */}
      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-neutral-200">
          <h3 className="text-xl font-light text-neutral-800 tracking-wide">
            All Staff Tasks
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-100 text-neutral-600 border-b border-neutral-200">
              <tr>
                <th className="p-4">Task ID</th>
                <th className="p-4">Staff</th>
                <th className="p-4">Room</th>
                <th className="p-4">Task Type</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assigned</th>
                <th className="p-4">Completed</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center p-6 text-neutral-500">
                    No tasks found for this branch.
                  </td>
                </tr>
              )}

              {tasks.map((task) => (
                <tr
                  key={task.taskId}
                  className="border-b border-neutral-200 hover:bg-neutral-50"
                >
                  <td className="p-4">{task.taskId}</td>
                  <td className="p-4">{task.staffName || "—"}</td>
                  <td className="p-4">{task.roomNumber || "—"}</td>
                  <td className="p-4">{task.taskType}</td>

                  {/* STATUS */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                  </td>

                  <td className="p-4">
                    {task.assignedAt
                      ? task.assignedAt.replace("T", " ").substring(0, 19)
                      : "—"}
                  </td>

                  <td className="p-4">
                    {task.completedAt
                      ? task.completedAt.replace("T", " ").substring(0, 19)
                      : "—"}
                  </td>

                  {/* ACTION */}
                  <td className="p-4">
                    <select
                      value={task.status}
                      onChange={(e) => updateStatus(task.taskId, e.target.value)}
                      className="border border-neutral-400 px-2 py-1 rounded"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
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