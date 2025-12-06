import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../services/UserService";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const tokenHeader = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await getAllUsers();
      const customerUsers = res.data.data.filter((u) => u.roleId === 1);
      setUsers(customerUsers);
    } catch (err) {
      console.log(err);
    }
  };

  // STATUS TOGGLE
  const toggleStatus = async (id) => {
    try {
      await axios.patch(
        `http://localhost:9193/api/users/${id}/toggle-status`,
        {},
        { headers: tokenHeader }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.userId === id
            ? { ...u, status: u.status === "active" ? "inactive" : "active" }
            : u
        )
      );
    } catch {
      alert("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-12 space-y-14">
      {/* Page Header */}
      <header className="animate-fade-in">
        <h1 className="text-4xl font-light tracking-wide text-neutral-900 mb-2">
          Customers Management
        </h1>
        <p className="text-neutral-600 text-sm font-light">
          View and manage all hotel customers
        </p>
      </header>

      {/* Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in-up">
        <table className="w-full">
          <thead className="bg-neutral-100 text-neutral-600 text-xs uppercase tracking-wider">
            <tr>
              {["Name", "Email", "Phone", "Status", "Actions"].map((h) => (
                <th key={h} className="px-6 py-4 text-left font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {users.map((u, idx) => (
              <tr
                key={u.userId}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-neutral-50"
                } hover:bg-neutral-100 transition`}
              >
                <td className="px-6 py-4 text-sm">{u.name}</td>
                <td className="px-6 py-4 text-sm">{u.email}</td>
                <td className="px-6 py-4 text-sm">{u.phone}</td>

                {/* Status Badge */}
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      u.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.status.toUpperCase()}
                  </span>
                </td>

                {/* Toggle Button */}
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleStatus(u.userId)}
                    className={`px-4 py-2 text-xs rounded transition text-white ${
                      u.status === "active"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {u.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-neutral-500 text-sm"
                >
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Back Button */}
      <div className="pt-4">
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="px-8 py-3 border border-neutral-300 text-neutral-800 font-light text-sm tracking-wider uppercase hover:border-neutral-400 hover:bg-neutral-50 transition"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
