import React, { useState, useEffect } from "react";
import axios from "axios";

export default function RoomPricing() {
  const [rooms, setRooms] = useState([]);
  const [branches, setBranches] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    description: "",
    pricePerNight: "",
    capacity: "",
    branchId: "",
    typeId: "",
    floorNumber: "",
  });

  const [priceEdits, setPriceEdits] = useState({});

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Load data
  useEffect(() => {
    const load = async () => {
      try {
        const [roomsRes, branchRes, typesRes] = await Promise.all([
          axios.get("http://localhost:9193/api/rooms", { headers }),
          axios.get("http://localhost:9193/api/branches", { headers }),
          axios.get("http://localhost:9193/api/roomtypes", { headers }),
        ]);

        setRooms(roomsRes.data);
        setBranches(branchRes.data);
        setRoomTypes(typesRes.data);

        const initial = {};
        roomsRes.data.forEach((r) => (initial[r.roomId] = r.pricePerNight));
        setPriceEdits(initial);
      } catch (err) {
        setError("Failed to load rooms");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Add a room
  const addRoom = async () => {
    try {
      const res = await axios.post("http://localhost:9193/api/rooms", newRoom, { headers });
      setRooms((prev) => [...prev, res.data]);
      alert("Room added successfully");
    } catch {
      alert("Failed to add room");
    }
  };

  // Update price
  const updatePrice = async (roomId) => {
    const newPrice = Number(priceEdits[roomId]);
    if (!newPrice) return alert("Enter valid price");

    try {
      const room = rooms.find((r) => r.roomId === roomId);
      const updated = { ...room, pricePerNight: newPrice };
      await axios.put(`http://localhost:9193/api/rooms/${roomId}`, updated, { headers });

      setRooms((prev) =>
        prev.map((r) =>
          r.roomId === roomId ? { ...r, pricePerNight: newPrice } : r
        )
      );
      alert("Price updated!");
    } catch {
      alert("Failed to update price");
    }
  };

  // Toggle status (AVAILABLE ↔ BLOCKED)
  const toggleStatus = async (roomId, currentStatus) => {
    const newStatus = currentStatus === "AVAILABLE" ? "BLOCKED" : "AVAILABLE";
    try {
      await axios.patch(
        `http://localhost:9193/api/rooms/${roomId}/status`,
        { status: newStatus },
        { headers }
      );

      setRooms((prev) =>
        prev.map((r) =>
          r.roomId === roomId ? { ...r, status: newStatus } : r
        )
      );
    } catch {
      alert("Failed to update status");
    }
  };

  if (loading) return <p className="p-6 text-neutral-600">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <section className="p-10 bg-neutral-50 min-h-screen space-y-14">
      {/* HEADER */}
      <header>
        <h1 className="text-4xl font-light tracking-wide text-neutral-900 mb-2">
          Room & Pricing Management
        </h1>
        <p className="text-neutral-600 text-sm font-light">
          Manage rooms, pricing, and room availability
        </p>
      </header>

      {/* ADD ROOM */}
      <div className="bg-white border border-neutral-200 p-8 rounded-xl shadow-sm space-y-6">
        <h2 className="text-xl font-light text-neutral-900">Add New Room</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { key: "roomNumber", label: "Room Number" },
            { key: "description", label: "Description" },
            { key: "pricePerNight", label: "Price Per Night", type: "number" },
            { key: "capacity", label: "Capacity", type: "number" },
            { key: "floorNumber", label: "Floor Number", type: "number" },
          ].map((field) => (
            <input
              key={field.key}
              type={field.type || "text"}
              className="border border-neutral-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-neutral-700"
              placeholder={field.label}
              value={newRoom[field.key]}
              onChange={(e) =>
                setNewRoom({ ...newRoom, [field.key]: e.target.value })
              }
            />
          ))}

          <select
            className="border border-neutral-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-neutral-700"
            value={newRoom.branchId}
            onChange={(e) => setNewRoom({ ...newRoom, branchId: e.target.value })}
          >
            <option value="">Select Branch</option>
            {branches.map((b) => (
              <option key={b.branchId} value={b.branchId}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            className="border border-neutral-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-neutral-700"
            value={newRoom.typeId}
            onChange={(e) => setNewRoom({ ...newRoom, typeId: e.target.value })}
          >
            <option value="">Select Room Type</option>
            {roomTypes.map((t) => (
              <option key={t.typeId} value={t.typeId}>
                {t.typeName}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={addRoom}
          className="px-6 py-3 bg-neutral-900 text-white rounded hover:bg-neutral-800 transition"
        >
          ➕ Add Room
        </button>
      </div>

      {/* ROOMS TABLE */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-100 text-neutral-600 text-xs uppercase">
            <tr>
              {[
                "ID", "Room No", "Description", "Branch", "Type", "Price", "Status", "Actions",
              ].map((col) => (
                <th key={col} className="px-5 py-3 text-left font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rooms.map((room, idx) => (
              <tr
                key={room.roomId}
                className={`${idx % 2 === 0 ? "bg-white" : "bg-neutral-50"} hover:bg-neutral-100 transition`}
              >
                <td className="px-5 py-3 text-sm">{room.roomId}</td>
                <td className="px-5 py-3 text-sm">{room.roomNumber}</td>
                <td className="px-5 py-3 text-sm">{room.description}</td>
                <td className="px-5 py-3 text-sm">
                  {branches.find((b) => b.branchId === room.branchId)?.name || "Unknown"}
                </td>
                <td className="px-5 py-3 text-sm">
                  {roomTypes.find((t) => t.typeId === room.typeId)?.typeName || "Unknown"}
                </td>

                {/* PRICE EDIT — disabled when BLOCKED */}
                <td className="px-5 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className={`w-20 px-2 py-1 rounded text-sm ${
                        room.status === "BLOCKED"
                          ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                          : "border border-neutral-300"
                      }`}
                      value={priceEdits[room.roomId]}
                      disabled={room.status === "BLOCKED"}
                      onChange={(e) =>
                        setPriceEdits((prev) => ({
                          ...prev,
                          [room.roomId]: e.target.value,
                        }))
                      }
                    />
                    <button
                      onClick={() => updatePrice(room.roomId)}
                      disabled={room.status === "BLOCKED"}
                      className={`px-3 py-1 text-xs rounded transition ${
                        room.status === "BLOCKED"
                          ? "bg-neutral-400 text-white cursor-not-allowed"
                          : "bg-neutral-800 text-white hover:bg-neutral-900"
                      }`}
                    >
                      Update
                    </button>
                  </div>
                </td>

                {/* STATUS BADGE */}
                <td className="px-5 py-3 text-sm">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      room.status === "AVAILABLE"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {room.status}
                  </span>
                </td>

                {/* TOGGLE BUTTON */}
                <td className="px-5 py-3 text-sm">
                  <button
                    onClick={() => toggleStatus(room.roomId, room.status)}
                    className={`px-3 py-1 text-xs rounded text-white transition ${
                      room.status === "AVAILABLE"
                        ? "bg-orange-600 hover:bg-orange-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {room.status === "AVAILABLE" ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}

            {rooms.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-neutral-500">
                  No rooms found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
