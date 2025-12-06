import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../services/UserService";
import { useNavigate } from "react-router-dom";
 
export default function UsersList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
 
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
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-wide">
          📋 Customers List
        </h2>
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          ← Back to Dashboard
        </button>
      </div>
 
      {/* Table */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-indigo-50 text-indigo-700">
              <th className="border p-4 text-left font-semibold">Name</th>
              <th className="border p-4 text-left font-semibold">Email</th>
              <th className="border p-4 text-left font-semibold">Phone</th>
              <th className="border p-4 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.userId}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="border p-4">{u.name}</td>
                <td className="border p-4">{u.email}</td>
                <td className="border p-4">{u.phone}</td>
                <td className="border p-4">
                  {u.status === "active" ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      Active
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                      Inactive
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
 