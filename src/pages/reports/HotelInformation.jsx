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
    const load = async () => {
      try {
        const [branchesRes, usersRes] = await Promise.all([
          axios.get("http://localhost:9193/api/branches", { headers: tokenHeader }),
          axios.get("http://localhost:9193/api/users", { headers: tokenHeader }),
        ]);

        const managerUsers = usersRes.data.data
          .filter((u) => u.roleId === 3)
          .map((u) => ({
            managerId: u.userId,
            fullName: u.name,
          }));

        setManagers(managerUsers);
        setBranches(branchesRes.data);
      } catch {
        setError("Failed to load branch information");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Managers not assigned anywhere
  const availableManagers = managers.filter(
    (m) => !branches.some((b) => b.managerId === m.managerId)
  );

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
        totalRooms: Number(newBranch.totalRooms) || 0,
        managerId: newBranch.managerId || null,
        status: "active",
      };

      const res = await axios.post(
        "http://localhost:9193/api/branches",
        payload,
        { headers: tokenHeader }
      );

      setBranches((prev) => [...prev, res.data]);
      alert("Branch added successfully");

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
      const res = await axios.put(
        `http://localhost:9193/api/branches/${editingBranch.branchId}`,
        editingBranch,
        { headers: tokenHeader }
      );

      setBranches((prev) =>
        prev.map((b) => (b.branchId === editingBranch.branchId ? res.data : b))
      );
      setEditingBranch(null);
      alert("Branch updated");
    } catch {
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
      alert("Status change failed");
    }
  };

  if (loading)
    return <p className="p-6 text-neutral-600 text-lg animate-pulse">Loading branch information...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <section className="p-10 bg-neutral-50 min-h-screen space-y-14 animate-fade-in">
      {/* HEADER */}
      <header className="mt-6">
        <h1 className="text-4xl font-light tracking-wide text-neutral-900 mb-2">
          Branch Management
        </h1>
        <p className="text-neutral-600 font-light">
          SuperAdmin — Manage hotel branches and assign managers
        </p>
      </header>

      {/* ADD BRANCH FORM */}
      <div className="bg-white p-10 rounded-xl border border-neutral-200 shadow-sm space-y-6 animate-fade-in-up">
        <h2 className="text-2xl font-light text-neutral-800 tracking-wide">
          Add New Branch
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {["name", "location", "contactNumber", "totalRooms"].map((field) => (
            <input
              key={field}
              placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
              className="border border-neutral-300 px-4 py-3 rounded text-neutral-700 focus:ring-2 focus:ring-neutral-700 outline-none"
              value={newBranch[field]}
              onChange={(e) =>
                setNewBranch({ ...newBranch, [field]: e.target.value })
              }
            />
          ))}

          <select
            className="border border-neutral-300 px-4 py-3 rounded text-neutral-700 focus:ring-2 focus:ring-neutral-700"
            value={newBranch.managerId}
            onChange={(e) =>
              setNewBranch({ ...newBranch, managerId: e.target.value })
            }
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
          className="px-8 py-3 bg-neutral-900 text-white uppercase tracking-widest text-sm rounded hover:bg-neutral-800 transition"
        >
          ➕ Add Branch
        </button>
      </div>

      {/* BRANCH TABLE */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden animate-fade-in-up">
        <table className="w-full">
          <thead className="bg-neutral-100 text-neutral-600 text-xs uppercase tracking-widest">
            <tr>
              {["ID", "Name", "Location", "Contact", "Rooms", "Manager", "Status", "Actions"].map(
                (col) => (
                  <th key={col} className="px-5 py-4 text-left font-medium">
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {branches.map((b, idx) => (
              <tr
                key={b.branchId}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-neutral-50"
                } hover:bg-neutral-100 transition`}
              >
                <td className="px-5 py-4 text-sm">{b.branchId}</td>
                <td className="px-5 py-4 text-sm font-light">{b.name}</td>
                <td className="px-5 py-4 text-sm font-light">{b.location}</td>
                <td className="px-5 py-4 text-sm font-light">{b.contactNumber || "N/A"}</td>
                <td className="px-5 py-4 text-sm font-light">{b.totalRooms}</td>
                <td className="px-5 py-4 text-sm font-light">
                  {b.managerId ? `#${b.managerId}` : "Not Assigned"}
                </td>
                <td className="px-5 py-4">
                  {b.status === "active" ? (
                    <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">
                      INACTIVE
                    </span>
                  )}
                </td>

                <td className="px-5 py-4 flex gap-3">
                  <button
                    onClick={() => setEditingBranch({ ...b })}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleStatus(b.branchId)}
                    className={`px-3 py-1 text-white text-xs rounded transition ${
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

      {/* EDIT MODAL */}
      {editingBranch && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center animate-fade-in">
          <div className="bg-white p-8 rounded-xl shadow-xl w-[480px] space-y-6 animate-fade-in-up">
            <h2 className="text-xl font-light text-neutral-800">Edit Branch</h2>

            <div className="space-y-4">
              {["name", "location", "contactNumber", "totalRooms"].map((field) => (
                <input
                  key={field}
                  className="border border-neutral-300 px-4 py-3 rounded w-full"
                  placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
                  value={editingBranch[field] || ""}
                  onChange={(e) =>
                    setEditingBranch({ ...editingBranch, [field]: e.target.value })
                  }
                />
              ))}

              <select
                className="border border-neutral-300 px-4 py-3 rounded w-full"
                value={editingBranch.managerId || ""}
                onChange={(e) =>
                  setEditingBranch({ ...editingBranch, managerId: Number(e.target.value) })
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

            <div className="flex justify-end gap-3 pt-6">
              <button
                onClick={() => setEditingBranch(null)}
                className="px-4 py-2 bg-neutral-300 rounded hover:bg-neutral-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={updateBranch}
                className="px-4 py-2 bg-neutral-900 text-white rounded hover:bg-neutral-800 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
