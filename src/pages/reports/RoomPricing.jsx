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
 
  // local state to edit prices per room
  const [priceEdits, setPriceEdits] = useState({});
 
  // FETCH ROOMS + BRANCHES + ROOM TYPES
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const [roomsRes, branchesRes, typesRes] = await Promise.all([
          axios.get("http://localhost:9193/api/rooms", { headers }),
          axios.get("http://localhost:9193/api/branches", { headers }),
          axios.get("http://localhost:9193/api/roomtypes", { headers }),
        ]);
        setRooms(roomsRes.data);
        setBranches(branchesRes.data);
        setRoomTypes(typesRes.data);
 
        // init price edits from rooms
        const initialPrices = {};
        roomsRes.data.forEach((r) => {
          initialPrices[r.roomId] = r.pricePerNight;
        });
        setPriceEdits(initialPrices);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
 
  // ADD ROOM
  const addRoom = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      const res = await axios.post(
        "http://localhost:9193/api/rooms",
        newRoom,
        { headers }
      );
      setRooms((prev) => [...prev, res.data]);
      setPriceEdits((prev) => ({
        ...prev,
        [res.data.roomId]: res.data.pricePerNight,
      }));
      alert("Room added successfully!");
      setNewRoom({
        roomNumber: "",
        description: "",
        pricePerNight: "",
        capacity: "",
        branchId: "",
        typeId: "",
      });
    } catch (err) {
      console.error("❌ Error adding room:", err);
      alert("Failed to add room");
    }
  };
 
  // UPDATE PRICE
  const updatePrice = async (roomId) => {
    const newPrice = priceEdits[roomId];
    if (newPrice === "" || newPrice == null) {
      alert("Please enter a valid price");
      return;
    }
 
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      const room = rooms.find((r) => r.roomId === roomId);
      if (!room) {
        alert("Room not found");
        return;
      }
 
      const updatedRoom = { ...room, pricePerNight: Number(newPrice) };
 
      await axios.put(
        `http://localhost:9193/api/rooms/${roomId}`,
        updatedRoom,
        { headers }
      );
 
      setRooms((prev) =>
        prev.map((r) =>
          r.roomId === roomId ? { ...r, pricePerNight: Number(newPrice) } : r
        )
      );
      alert("Price updated successfully!");
    } catch (err) {
      console.error("❌ Error updating price:", err);
      alert("Failed to update price");
    }
  };
 
  // REMOVE ROOM
  const removeRoom = async (roomId) => {
    if (!window.confirm("Remove this room from availability?")) return;
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      await axios.delete(`http://localhost:9193/api/rooms/${roomId}`, {
        headers,
      });
      setRooms((prev) => prev.filter((r) => r.roomId !== roomId));
      setPriceEdits((prev) => {
        const copy = { ...prev };
        delete copy[roomId];
        return copy;
      });
      alert("Room removed successfully!");
    } catch (err) {
      console.error("❌ Error removing room:", err);
      alert("Failed to remove room");
    }
  };
 
  if (loading) return <p className="p-6 text-neutral-600">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
 
  return (
    <section className="p-10 bg-neutral-50 min-h-screen space-y-12">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-light tracking-wide text-neutral-800">
          Room &amp; Pricing Management
        </h1>
        <p className="text-sm text-neutral-500 font-light mt-1">
          SuperAdmin — Add rooms, assign types, change pricing, remove rooms
        </p>
      </header>
 
      {/* Add Room Form */}
      <div className="bg-white border border-neutral-200 shadow-sm p-8 rounded-xl space-y-6">
        <h2 className="text-lg font-medium text-neutral-800">Add New Room</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            className="border border-neutral-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Room Number"
            value={newRoom.roomNumber}
            onChange={(e) =>
              setNewRoom({ ...newRoom, roomNumber: e.target.value })
            }
          />
          <input
            className="border border-neutral-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Description"
            value={newRoom.description}
            onChange={(e) =>
              setNewRoom({ ...newRoom, description: e.target.value })
            }
          />
          <input
            type="number"
            className="border border-neutral-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Price Per Night"
            value={newRoom.pricePerNight}
            onChange={(e) =>
              setNewRoom({ ...newRoom, pricePerNight: e.target.value })
            }
          />
          <input
            type="number"
            className="border border-neutral-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Capacity"
            value={newRoom.capacity}
            onChange={(e) =>
              setNewRoom({ ...newRoom, capacity: e.target.value })
            }
          />
          <input
            type="number"
            className="border border-neutral-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Floor Number"
            value={newRoom.floorNumber}
            onChange={(e) =>
              setNewRoom({ ...newRoom, floorNumber: e.target.value })
            }
          />
          <select
            className="border border-neutral-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={newRoom.branchId}
            onChange={(e) =>
              setNewRoom({ ...newRoom, branchId: e.target.value })
            }
          >
            <option value="">Select Branch</option>
            {branches.map((b) => (
              <option key={b.branchId} value={b.branchId}>
                {b.name}
              </option>
            ))}
          </select>
          <select
            className="border border-neutral-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={newRoom.typeId}
            onChange={(e) =>
              setNewRoom({ ...newRoom, typeId: e.target.value })
            }
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
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          ➕ Add Room
        </button>
      </div>
 
      {/* Rooms Table */}
      <div className="bg-white border border-neutral-200 shadow-sm rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-100 text-neutral-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">ID</th>
              <th className="px-4 py-2 text-left font-semibold">Room No</th>
              <th className="px-4 py-2 text-left font-semibold">Description</th>
              <th className="px-4 py-2 text-left font-semibold">Branch</th>
              <th className="px-4 py-2 text-left font-semibold">Type</th>
              <th className="px-4 py-2 text-left font-semibold">Price / Night</th>
              <th className="px-4 py-2 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room, idx) => (
              <tr
                key={room.roomId}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-neutral-50"
                } hover:bg-blue-50 transition`}
              >
                <td className="px-4 py-2 text-sm">{room.roomId}</td>
                <td className="px-4 py-2 text-sm font-medium">
                  {room.roomNumber}
                </td>
                <td className="px-4 py-2 text-sm">{room.description}</td>
                <td className="px-4 py-2 text-sm">
                  {branches.find((b) => b.branchId === room.branchId)?.name ||
                    "Unknown"}
                </td>
                <td className="px-4 py-2 text-sm">
                  {roomTypes.find((t) => t.typeId === room.typeId)?.typeName ||
                    "Unknown"}
                </td>
                <td className="px-4 py-2 text-sm">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="w-24 border border-neutral-300 px-2 py-1 rounded text-sm"
                      value={
                        priceEdits[room.roomId] ?? room.pricePerNight ?? ""
                      }
                      onChange={(e) =>
                        setPriceEdits((prev) => ({
                          ...prev,
                          [room.roomId]: e.target.value,
                        }))
                      }
                    />
                    <span className="text-neutral-500 text-xs">₹</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => updatePrice(room.roomId)}
                      className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => removeRoom(room.roomId)}
                      className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-neutral-500 text-sm"
                >
                  No rooms found. Add a new room above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
 
 