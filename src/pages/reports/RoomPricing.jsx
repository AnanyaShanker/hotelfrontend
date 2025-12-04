import React, { useState, useEffect } from "react";
import axios from "axios";

export default function RoomPricing() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get("http://localhost:9193/api/rooms", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setRooms(res.data);
      } catch (err) {
        console.error("❌ Error fetching rooms:", err);
        setError("Failed to load rooms");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const updatePrice = async (roomId, newPrice) => {
    try {
      const room = rooms.find((r) => r.roomId === roomId);
      const updatedRoom = { ...room, pricePerNight: newPrice };

      await axios.put(
        `http://localhost:9193/api/rooms/${roomId}`,
        updatedRoom,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setRooms((prev) =>
        prev.map((r) =>
          r.roomId === roomId ? { ...r, pricePerNight: newPrice } : r
        )
      );

      alert("Price updated successfully!");
    } catch (err) {
      console.error("❌ Error updating price:", err);
      alert("Failed to update price");
    }
  };

  if (loading) return <p className="p-6 text-neutral-600">Loading rooms...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <section className="p-8 bg-neutral-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-neutral-800">
          Room Pricing Control
        </h1>
        <span className="text-sm text-neutral-500">
          Manage pricing across all branches
        </span>
      </div>

      {/* Card Container */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-neutral-100 text-neutral-700 text-sm uppercase tracking-wide">
              <th className="px-4 py-3 text-left">Room ID</th>
              <th className="px-4 py-3 text-left">Room Number</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Price Per Night</th>
              <th className="px-4 py-3 text-left">Update</th>
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
                <td className="px-4 py-3 text-sm text-neutral-800">
                  {room.roomId}
                </td>
                <td className="px-4 py-3 text-sm text-neutral-800">
                  {room.roomNumber}
                </td>
                <td className="px-4 py-3 text-sm text-neutral-600">
                  {room.description}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-neutral-900">
                  ₹{room.pricePerNight}
                </td>
                <td className="px-4 py-3 flex items-center gap-2">
                  <input
                    type="number"
                    value={room.pricePerNight}
                    onChange={(e) =>
                      setRooms((prev) =>
                        prev.map((r) =>
                          r.roomId === room.roomId
                            ? { ...r, pricePerNight: e.target.value }
                            : r
                        )
                      )
                    }
                    className="border border-neutral-300 px-2 py-1 rounded w-24 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                  <button
                    onClick={() => updatePrice(room.roomId, room.pricePerNight)}
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
