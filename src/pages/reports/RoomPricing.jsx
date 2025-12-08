import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
 
export default function RoomPricing() {
  const navigate = useNavigate();
 
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
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
        const [roomsRes, branchesRes, typesRes] = await Promise.all([
          axios.get("http://localhost:9193/api/rooms", { headers }),
          axios.get("http://localhost:9193/api/branches", { headers }),
          axios.get("http://localhost:9193/api/roomtypes", { headers }),
        ]);
 
        setRooms(roomsRes.data);
        setBranches(branchesRes.data);
        setRoomTypes(typesRes.data);
 
        const initialPrices = {};
        roomsRes.data.forEach((r) => (initialPrices[r.roomId] = r.pricePerNight));
        setPriceEdits(initialPrices);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
 
  const addRoom = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      const res = await axios.post("http://localhost:9193/api/rooms", newRoom, { headers });
 
      setRooms((prev) => [...prev, res.data]);
      setPriceEdits((prev) => ({ ...prev, [res.data.roomId]: res.data.pricePerNight }));
 
      alert("Room added successfully!");
      setNewRoom({
        roomNumber: "",
        description: "",
        pricePerNight: "",
        capacity: "",
        branchId: "",
        typeId: "",
        floorNumber: "",
      });
    } catch {
      alert("Failed to add room");
    }
  };
 
  const updatePrice = async (roomId) => {
    const newPrice = priceEdits[roomId];
    if (!newPrice) {
      alert("Enter valid price");
      return;
    }
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      const room = rooms.find((r) => r.roomId === roomId);
      const updatedRoom = { ...room, pricePerNight: Number(newPrice) };
 
      await axios.put(`http://localhost:9193/api/rooms/${roomId}`, updatedRoom, { headers });
 
      setRooms((prev) =>
        prev.map((r) => (r.roomId === roomId ? { ...r, pricePerNight: updatedRoom.pricePerNight } : r))
      );
 
      alert("Price updated");
    } catch {
      alert("Failed to update price");
    }
  };
 
  // AVAILABLE ↔ RESERVED
  const toggleRoomStatus = async (roomId, currentStatus) => {
    const newStatus = currentStatus === "AVAILABLE" ? "RESERVED" : "AVAILABLE";
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      await axios.patch(
        `http://localhost:9193/api/rooms/${roomId}/status`,
        { status: newStatus },
        { headers }
      );
 
      setRooms((prev) =>
        prev.map((r) => (r.roomId === roomId ? { ...r, status: newStatus } : r))
      );
    } catch {
      alert("Failed to update room status");
    }
  };
 
  if (loading) return <p className="p-6 text-neutral-600 animate-pulse">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
 
  return (
    <section className="px-10 py-20 bg-neutral-50 min-h-screen space-y-20 animate-fade-in">
      <button
        onClick={() => navigate("/admin-dashboard")}
        className="px-6 py-2 bg-neutral-800 text-white rounded uppercase tracking-wide text-sm hover:bg-neutral-900 transition"
      >
        ⬅ Back to Dashboard
      </button>
 
      <header className="text-center">
        <h1 className="text-4xl font-light tracking-wide text-neutral-900 mb-2">
          Room & Pricing Management
        </h1>
        <p className="text-neutral-600 text-base font-light">
          Add rooms, manage pricing, and block rooms when unavailable
        </p>
      </header>
 
      {/* ADD ROOM */}
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-neutral-200 space-y-8 animate-fade-in-up">
        <h2 className="text-2xl font-light text-neutral-800 tracking-wide text-center">
          ➕ Add New Room
        </h2>
 
        <div className="grid md:grid-cols-2 gap-6">
          {["roomNumber", "description", "pricePerNight", "capacity", "floorNumber"].map((field) => (
            <input
              key={field}
              className="border border-neutral-300 px-4 py-3 rounded text-neutral-700 focus:ring-2 focus:ring-neutral-700 outline-none"
              placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
              value={newRoom[field]}
              onChange={(e) => setNewRoom({ ...newRoom, [field]: e.target.value })}
            />
          ))}
 
          <select
            className="border border-neutral-300 px-4 py-3 rounded text-neutral-700"
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
            className="border border-neutral-300 px-4 py-3 rounded text-neutral-700"
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
          className="px-10 py-3 bg-neutral-900 text-white font-light uppercase tracking-wider rounded hover:bg-neutral-800 transition"
        >
          Add Room
        </button>
      </div>
 
      {/* ROOMS TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden animate-fade-in-up">
        <table className="w-full">
          <thead className="bg-neutral-100 text-neutral-700 text-[11px] uppercase tracking-widest font-light">
            <tr>
              {["ID", "Room No", "Branch", "Type", "Price", "Status", "Action"].map((col) => (
                <th key={col} className="px-5 py-4 text-left">
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
                <td className="px-5 py-4 text-sm">{room.roomId}</td>
                <td className="px-5 py-4 text-sm font-light">{room.roomNumber}</td>
                <td className="px-5 py-4 text-sm font-light">
                  {branches.find((b) => b.branchId === room.branchId)?.name || "Unknown"}
                </td>
                <td className="px-5 py-4 text-sm font-light">
                  {roomTypes.find((t) => t.typeId === room.typeId)?.typeName || "Unknown"}
                </td>
 
                {/* Price hidden when RESERVED */}
                <td className="px-5 py-4 text-sm font-light">
                  {room.status === "RESERVED" ? (
                    <span className="text-neutral-400 text-xs italic">Room is reserved</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="w-28 border border-neutral-300 px-2 py-1 rounded text-sm"
                        value={priceEdits[room.roomId] ?? ""}
                        onChange={(e) =>
                          setPriceEdits((prev) => ({ ...prev, [room.roomId]: e.target.value }))
                        }
                      />
                      <button
                        onClick={() => updatePrice(room.roomId)}
                        className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        Update
                      </button>
                    </div>
                  )}
                </td>
 
                {/* Status */}
                <td className="px-5 py-4">
                  {room.status === "AVAILABLE" ? (
                    <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                      AVAILABLE
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">
                      RESERVED
                    </span>
                  )}
                </td>
 
                {/* Toggle */}
                <td className="px-5 py-4">
                  <button
                    onClick={() => toggleRoomStatus(room.roomId, room.status)}
                    className={`px-3 py-1 text-white text-xs rounded transition ${
                      room.status === "AVAILABLE"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {room.status === "AVAILABLE" ? "Reserved" : "Make Available"}
                  </button>
                </td>
              </tr>
            ))}
 
            {rooms.length === 0 && (
              <tr>
                <td className="px-5 py-10 text-center text-neutral-500 font-light" colSpan={7}>
                  No rooms yet — add one above
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}