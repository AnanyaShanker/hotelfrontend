import React, { useEffect, useState } from "react";
import axios from "axios";
 
export default function StaffEnroll() {
  const [staffUsers, setStaffUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const tokenHeader = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
 
  // Local state to store selected hotel for each staff user
  const [selectedHotel, setSelectedHotel] = useState({});
 
  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, branchesRes, staffRes] = await Promise.all([
          axios.get("http://localhost:9193/api/users", { headers: tokenHeader }),
          axios.get("http://localhost:9193/api/branches", { headers: tokenHeader }),
          axios.get("http://localhost:9193/api/staff", { headers: tokenHeader }),
        ]);
 
        // Filter staff-role users (roleId = 2)
        const staffRoleUsers = usersRes.data.data.filter((u) => u.roleId === 2 && u.status=="active");
 
        // Merge staff rows with users (to know which user is already registered as staff)
        const staffMap = {};
        staffRes.data.data.forEach((s) => {
          staffMap[s.userId] = s;
        });
 
        setStaffUsers(
          staffRoleUsers.map((u) => ({
            ...u,
            staffRecord: staffMap[u.userId] || null,
          }))
        );
 
        setBranches(branchesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
 
    load();
  }, []);
 
  // Assign or update staff entry
  const handleAssign = async (userId) => {
    const hotelId = selectedHotel[userId];
 
    if (!hotelId) {
      alert("Please select a hotel before assigning.");
      return;
    }
 
    try {
      const staff = staffUsers.find((u) => u.userId === userId).staffRecord;
 
      let res;
      if (staff) {
        // UPDATE STAFF HOTEL
        res = await axios.put(
          `http://localhost:9193/api/staff/${staff.staffId}/hotel`,
          { hotelId },
          { headers: tokenHeader }
        );
      } else {
        // CREATE NEW STAFF
        res = await axios.post(
          "http://localhost:9193/api/staff",
          { userId, hotelId },
          { headers: tokenHeader }
        );
      }
 
      alert("Staff successfully saved!");
 
      // Reload updated staff list
      setStaffUsers((prev) =>
        prev.map((u) =>
          u.userId === userId
            ? { ...u, staffRecord: res.data.data }
            : u
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to assign staff.");
    }
  };
 
  // Remove staff assignment → deactivate user + mark staff unavailable
  const handleRemove = async (userId) => {
    const staff = staffUsers.find((u) => u.userId === userId).staffRecord;
 
    if (!staff) {
      alert("This user is not a staff member.");
      return;
    }
 
    try {
      // 1️⃣ Update USER status = inactive
      await axios.patch(
        `http://localhost:9193/api/users/${userId}/toggle-status`,
        {},
        { headers: tokenHeader }
      );
 
      // 2️⃣ Update STAFF status = UNAVAILABLE
      await axios.patch(
        `http://localhost:9193/api/staff/${staff.staffId}/status`,
        { status: "UNAVAILABLE" },
        { headers: tokenHeader }
      );
 
      alert("Staff removed successfully!");
 
      // Update UI
      setStaffUsers((prev) =>
        prev.map((u) =>
          u.userId === userId
            ? { ...u, staffRecord: { ...staff, status: "UNAVAILABLE" } }
            : u
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to remove staff.");
    }
  };
 
  if (loading) return <p className="p-6 text-neutral-500">Loading...</p>;
 
  return (
    <section className="p-10 bg-neutral-50 min-h-screen space-y-10 animate-fade-in">
      <header>
        <h1 className="text-3xl font-light tracking-wide text-neutral-800">
          Staff Enrollment
        </h1>
        <p className="text-sm text-neutral-500 font-light">
          Assign hotel branches to your staff members
        </p>
      </header>
 
      <div className="bg-white border border-neutral-200 shadow rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-100 text-neutral-600 text-xs uppercase tracking-wider">
            <tr>
              {["User ID", "Name", "Email", "Hotel Branch", "Action", "Remove"].map(
                (col) => (
                  <th key={col} className="px-4 py-3 text-left font-semibold">
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
 
          <tbody>
            {staffUsers.map((u, idx) => (
              <tr
                key={u.userId}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-neutral-50"
                } hover:bg-blue-50 transition`}
              >
                <td className="px-4 py-3 text-sm">{u.userId}</td>
                <td className="px-4 py-3 text-sm">{u.name}</td>
                <td className="px-4 py-3 text-sm">{u.email}</td>
 
                {/* Hotel Dropdown */}
                <td className="px-4 py-3 text-sm">
                  <select
                    className="border border-neutral-300 px-3 py-2 rounded w-full"
                    value={selectedHotel[u.userId] || u.staffRecord?.hotelId || ""}
                    onChange={(e) =>
                      setSelectedHotel({
                        ...selectedHotel,
                        [u.userId]: Number(e.target.value),
                      })
                    }
                  >
                    <option value="">Select Hotel</option>
                    {branches.map((b) => (
                      <option key={b.branchId} value={b.branchId}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </td>
 
                {/* Create / Update Button */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleAssign(u.userId)}
                    className={`px-4 py-2 rounded text-white text-sm transition ${
                      u.staffRecord
                        ? "bg-blue-600 hover:bg-blue-700" // Update button
                        : "bg-green-600 hover:bg-green-700" // Create Staff button
                    }`}
                  >
                    {u.staffRecord ? "Update" : "Create Staff"}
                  </button>
                </td>
 
                {/* Remove Button */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleRemove(u.userId)}
                    className="px-4 py-2 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition"
                  >
                    Remove
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
 