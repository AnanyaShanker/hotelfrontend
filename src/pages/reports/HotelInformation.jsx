import React, { useState, useEffect } from "react";
import axios from "axios";

export default function HotelInformation() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axios.get("http://localhost:9193/api/branches", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log("📦 Branches response:", res.data);
        setBranches(res.data);
      } catch (err) {
        console.error("❌ Error fetching branches:", err);
        setError("Failed to load branches");
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const updateBranch = async (branchId, updatedBranch) => {
    try {
      await axios.put(
        `http://localhost:9193/api/branches/${branchId}`,
        updatedBranch,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Branch updated successfully!");
    } catch (err) {
      console.error("❌ Error updating branch:", err);
      alert("Failed to update branch");
    }
  };

  if (loading) return <p className="p-6 text-neutral-600">Loading branches...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <section className="p-8 bg-neutral-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-neutral-800">
          Hotel Information Settings
        </h1>
        <span className="text-sm text-neutral-500">
          Manage branch details across all hotels
        </span>
      </div>

      {/* Card Container */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-neutral-100 text-neutral-700 text-sm uppercase tracking-wide">
              <th className="px-4 py-3 text-left">Branch ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Update</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch, idx) => (
              <tr
                key={branch.branchId}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-neutral-50"
                } hover:bg-blue-50 transition`}
              >
                <td className="px-4 py-3 text-sm text-neutral-800">
                  {branch.branchId}
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={branch.name}
                    onChange={(e) =>
                      setBranches((prev) =>
                        prev.map((b) =>
                          b.branchId === branch.branchId
                            ? { ...b, name: e.target.value }
                            : b
                        )
                      )
                    }
                    className="border border-neutral-300 px-2 py-1 rounded w-full text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={branch.location}
                    onChange={(e) =>
                      setBranches((prev) =>
                        prev.map((b) =>
                          b.branchId === branch.branchId
                            ? { ...b, location: e.target.value }
                            : b
                        )
                      )
                    }
                    className="border border-neutral-300 px-2 py-1 rounded w-full text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={branch.contactNumber || ""}
                    onChange={(e) =>
                      setBranches((prev) =>
                        prev.map((b) =>
                          b.branchId === branch.branchId
                            ? { ...b, contactNumber: e.target.value }
                            : b
                        )
                      )
                    }
                    className="border border-neutral-300 px-2 py-1 rounded w-full text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-3">
                  <select
                    value={branch.status}
                    onChange={(e) =>
                      setBranches((prev) =>
                        prev.map((b) =>
                          b.branchId === branch.branchId
                            ? { ...b, status: e.target.value }
                            : b
                        )
                      )
                    }
                    className="border border-neutral-300 px-2 py-1 rounded text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => updateBranch(branch.branchId, branch)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
