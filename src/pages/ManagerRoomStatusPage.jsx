import { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import { useSearchParams } from "react-router-dom";
import BackButton from "./BackButton";

export default function ManagerRoomStatusPage() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState({});
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const branchId = Number(searchParams.get("branchId"));

  useEffect(() => {
    if (!branchId) return;

    const loadData = async () => {
      try {
        // Room types
        const rt = await axios.get("/api/roomtypes");
        const typeMap = {};
        rt.data.forEach((t) => (typeMap[t.typeId] = t.typeName));
        setRoomTypes(typeMap);

        // Rooms
        const res = await axios.get(`/api/rooms/branch/${branchId}`);
        setRooms(res.data);
      } catch (err) {
        console.error("Failed to load rooms:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [branchId]);

  // 🔥 Toggle between AVAILABLE ↔ MAINTENANCE only
  const toggleStatus = async (room) => {
    let newStatus;

    if (room.status === "AVAILABLE") newStatus = "MAINTENANCE";
    else if (room.status === "MAINTENANCE") newStatus = "AVAILABLE";
    //else if(room.status === "OCCUPIED") newStatus ="AVAILABLE"
    else {
      alert("Status controlled by bookings. Cannot toggle OCCUPIED rooms.");
      return;
    }

    try {
      await axios.patch(`/api/rooms/${room.roomId}/status`, {
        status: newStatus,
      });

      setRooms((prev) =>
        prev.map((r) =>
          r.roomId === room.roomId ? { ...r, status: newStatus } : r
        )
      );
    } catch (err) {
      console.error("Failed to update room status", err);
      alert("Failed to update room status.");
    }
  };

  if (loading)
    return (
      <p className="mt-40 text-center text-neutral-500">Loading rooms...</p>
    );

  return (
    
    <div className="mt-28 mb-24 px-6 md:px-16 animate-fade-in">
         <BackButton />
      <section className="mb-16">
        <div className="bg-neutral-50 border border-neutral-200 p-10">
          <h2 className="text-3xl font-light text-neutral-800 mb-3 tracking-wide">
            Room Status — Branch #{branchId}
          </h2>
          <p className="text-neutral-600 font-light">
            Update availability & maintenance status for rooms.
          </p>
        </div>
      </section>

      <section className="bg-white border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <h3 className="text-xl font-light text-neutral-800 tracking-wide">
            Rooms Overview
          </h3>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-100 text-neutral-600 border-b border-neutral-200">
            <tr>
              <th className="p-4">Room Number</th>
              <th className="p-4">Room Type</th>
              <th className="p-4">Capacity</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {rooms.map((room) => (
              <tr
                key={room.roomId}
                className="border-b border-neutral-200 hover:bg-neutral-50 transition"
              >
                <td className="p-4">{room.roomNumber}</td>
                <td className="p-4">{roomTypes[room.typeId] || "—"}</td>
                <td className="p-4">{room.capacity}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      room.status === "AVAILABLE"
                        ? "bg-green-100 text-green-800"
                        : room.status === "MAINTENANCE"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {room.status}
                  </span>
                </td>

                <td className="p-4">
                  <button
                    onClick={() => toggleStatus(room)}
                    disabled={room.status === "OCCUPIED"}
                    className={`px-4 py-2 text-xs border border-neutral-800 text-neutral-800
                      hover:bg-neutral-800 hover:text-white transition uppercase tracking-wide 
                      ${
                        room.status === "OCCUPIED"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                  >
                    Change Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}