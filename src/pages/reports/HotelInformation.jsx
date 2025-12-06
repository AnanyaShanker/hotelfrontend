import React, { useState, useEffect } from "react";
import axios from "axios";
 
export default function HotelInformation() {
  const [branches, setBranches] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBranch, setEditingBranch] = useState(null);
  const [error, setError] = useState(null);
 
  const tokenHeader = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
 
  const [newBranch, setNewBranch] = useState({
    name: "",
    location: "",
    contactNumber: "",
    totalRooms: "",
    managerId: "",
  });
 
  // Fetch branches + managers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchesRes, usersRes] = await Promise.all([
          axios.get("http://localhost:9193/api/branches", { headers: tokenHeader }),
          axios.get("http://localhost:9193/api/users", { headers: tokenHeader }),
        ]);
 
        const managerUsers = usersRes.data.data
          .filter((u) => u.roleId === 3) // Managers only
          .map((u) => ({
            managerId: u.userId,
            fullName: u.name,
          }));
 
        setManagers(managerUsers);
        setBranches(branchesRes.data);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
 
    fetchData();
  }, []);
 
  // Managers not assigned anywhere
  const availableManagers = managers.filter(
    (m) => !branches.some((b) => b.managerId === m.managerId)
  );
 
  // For edit → allow branch to keep its current manager
  const availableManagersForEdit = editingBranch
    ? [
        ...availableManagers,
        ...managers.filter((m) => m.managerId === editingBranch.managerId),
      ]
    : availableManagers;
 
  const addBranch = async () => {
    try {
      const payload = {
        name: newBranch.name,
        location: newBranch.location,
        contactNumber: newBranch.contactNumber,
        managerId: newBranch.managerId || null,
        totalRooms: Number(newBranch.totalRooms) || 0,
        status: "active",
      };
 
      const res = await axios.post(
        "http://localhost:9193/api/branches",
        payload,
        { headers: tokenHeader }
      );
 
      setBranches((prev) => [...prev, res.data]);
      alert("Branch added successfully!");
 
      setNewBranch({
        name: "",
        location: "",
        contactNumber: "",
        totalRooms: "",
        managerId: "",
      });
    } catch {
      alert("Failed to add branch");
    }
  };
 
  const updateBranch = async () => {
    try {
      const payload = {
        name: editingBranch.name,
        location: editingBranch.location,
        contactNumber: editingBranch.contactNumber,
        managerId: editingBranch.managerId || null,
        totalRooms: Number(editingBranch.totalRooms),
        status: editingBranch.status,
      };
 
      const res = await axios.put(
        `http://localhost:9193/api/branches/${editingBranch.branchId}`,
        payload,
        { headers: tokenHeader }
      );
 
      setBranches((prev) =>
        prev.map((b) => (b.branchId === editingBranch.branchId ? res.data : b))
      );
 
      setEditingBranch(null);
      alert("Branch updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update branch");
    }
  };
 
  const toggleStatus = async (branchId) => {
    try {
      await axios.patch(
        `http://localhost:9193/api/branches/${branchId}/toggle-status`,
        {},
        { headers: tokenHeader }
      );
 
      setBranches((prev) =>
        prev.map((b) =>
          b.branchId === branchId
            ? { ...b, status: b.status === "active" ? "inactive" : "active" }
            : b
        )
      );
    } catch {
      alert("Failed to update status");
    }
  };
 
  if (loading) return <p className="p-6 text-neutral-500 text-lg">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
 
  return (
    <section className="p-10 bg-neutral-50 min-h-screen space-y-12">
      <header>
        <h1 className="text-3xl font-light tracking-wide text-neutral-800">
          Branch Management
        </h1>
        <p className="text-sm text-neutral-500 font-light">
          SuperAdmin — Manage hotel branches and assign branch managers
        </p>
      </header>
 
      {/* Add Branch Section */}
      <div className="bg-white border border-neutral-200 shadow p-8 rounded-xl space-y-6">
        <h2 className="text-lg font-medium text-neutral-800">Add New Branch</h2>
 
        <div className="grid md:grid-cols-2 gap-6">
          {["name", "location", "contactNumber", "totalRooms"].map((field) => (
            <input
              key={field}
              className="border border-neutral-300 px-3 py-2 rounded w-full"
              placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
              value={newBranch[field]}
              onChange={(e) => setNewBranch({ ...newBranch, [field]: e.target.value })}
            />
          ))}
 
          {/* Manager dropdown */}
          <select
            className="border border-neutral-300 px-3 py-2 rounded w-full"
            value={newBranch.managerId}
            onChange={(e) => setNewBranch({ ...newBranch, managerId: e.target.value })}
          >
            <option value="">Assign Manager (optional)</option>
            {availableManagers.map((m) => (
              <option key={m.managerId} value={m.managerId}>
                {m.fullName}
              </option>
            ))}
          </select>
        </div>
 
        <button
          onClick={addBranch}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          ➕ Add Branch
        </button>
      </div>
 
      {/* Branches Table */}
      <div className="bg-white border border-neutral-200 shadow rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-100 text-neutral-600 text-xs uppercase tracking-wider">
            <tr>
              {[
                "ID",
                "Name",
                "Location",
                "Contact",
                "Rooms",
                "Manager",
                "Status",
                "Actions",
              ].map((col) => (
                <th key={col} className="px-4 py-3 text-left font-semibold">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
 
          <tbody>
            {branches.map((b, idx) => (
              <tr
                key={b.branchId}
                className={`${idx % 2 === 0 ? "bg-white" : "bg-neutral-50"} hover:bg-blue-50 transition`}
              >
                <td className="px-4 py-3 text-sm">{b.branchId}</td>
                <td className="px-4 py-3 text-sm">{b.name}</td>
                <td className="px-4 py-3 text-sm">{b.location}</td>
                <td className="px-4 py-3 text-sm">{b.contactNumber || "N/A"}</td>
                <td className="px-4 py-3 text-sm">{b.totalRooms}</td>
                <td className="px-4 py-3 text-sm">
                  {b.managerId ? `#${b.managerId}` : "Not Assigned"}
                </td>
                <td className="px-4 py-3 text-sm">
                  {b.status === "active" ? (
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700">
                      INACTIVE
                    </span>
                  )}
                </td>
 
                {/* Actions */}
                <td className="px-4 py-3 flex gap-3">
                  <button
                    onClick={() => setEditingBranch({ ...b })}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleStatus(b.branchId)}
                    className={`px-3 py-1 text-white text-sm rounded transition ${
                      b.status === "active"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {b.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      {/* Edit Modal */}
      {editingBranch && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-[480px] space-y-6">
            <h2 className="text-lg font-semibold text-neutral-800">Edit Branch</h2>
 
            <div className="space-y-4">
              {["name", "location", "contactNumber", "totalRooms"].map((field) => (
                <input
                  key={field}
                  className="border border-neutral-300 px-3 py-2 rounded w-full"
                  placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
                  value={editingBranch[field] || ""}
                  onChange={(e) =>
                    setEditingBranch({ ...editingBranch, [field]: e.target.value })
                  }
                />
              ))}
 
              {/* Manager Dropdown */}
              <select
                className="border border-neutral-300 px-3 py-2 rounded w-full"
                value={editingBranch.managerId || ""}
                onChange={(e) =>
                  setEditingBranch({
                    ...editingBranch,
                    managerId: Number(e.target.value),
                  })
                }
              >
                <option value="">Select Manager</option>
                {availableManagersForEdit.map((m) => (
                  <option key={m.managerId} value={m.managerId}>
                    {m.fullName}
                  </option>
                ))}
              </select>
            </div>
 
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setEditingBranch(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={updateBranch}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
 
 