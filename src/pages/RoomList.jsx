import React, { useState } from "react";

export default function RoomList({ rooms, selectedRoomId, onSelect }) {
  console.log("Rooms data:", rooms);

  // Filter state
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Apply filters
  const filteredRooms = rooms.filter((room) => {
    const matchesMin = minPrice ? room.pricePerNight >= parseInt(minPrice) : true;
    const matchesMax = maxPrice ? room.pricePerNight <= parseInt(maxPrice) : true;
    return matchesMin && matchesMax;
  });

  if (!rooms || rooms.length === 0) {
    return (
      <div className="text-neutral-600 font-light text-center py-10">
        No rooms available for this branch.
      </div>
    );
  }

  return (
    <div>
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow mb-6">
        {/* Min Price */}
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className={`p-4 border text-sm font-light text-center animate-fade-in w-32 ${
            minPrice
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-neutral-100 border-neutral-200 text-neutral-800"
          }`}
        />

        {/* Max Price */}
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className={`p-4 border text-sm font-light text-center animate-fade-in w-32 ${
            maxPrice
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-neutral-100 border-neutral-200 text-neutral-800"
          }`}
        />

        {/* Reset Filters Button */}
        <button
           type="button" 
          onClick={() => {
            setMinPrice("");
            setMaxPrice("");
          }}
          className={`p-4 border text-sm font-light text-center animate-fade-in ${
            !minPrice && !maxPrice
              ? "bg-neutral-100 border-neutral-200 text-neutral-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          Reset Filters
        </button>
      </div>

      {/* Room Cards */}
      {filteredRooms.length === 0 ? (
        <div className="text-neutral-600 font-light text-center py-10">
          No rooms match your filters.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <div
              key={room.roomId}
              onClick={() => onSelect(room)}
              className={`group border rounded-xl overflow-hidden cursor-pointer transition transform hover:scale-[1.02] hover:shadow-xl ${
                selectedRoomId === room.roomId?.toString()
                  ? "border-yellow-500 bg-yellow-50 shadow-md"
                  : "border-neutral-200 bg-white"
              }`}
            >
              {/* Room Image */}
              {room.roomPrimaryImage ? (
                <div className="relative">
                  <img
                    src={room.roomPrimaryImage}
                    alt={`Room ${room.roomNumber}`}
                    className="w-full h-56 object-cover group-hover:brightness-105 transition"
                  />
                  <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    ₹{room.pricePerNight}/night
                  </span>
                </div>
              ) : (
                <div className="w-full h-56 bg-neutral-200 flex items-center justify-center text-neutral-500">
                  No Image Available
                </div>
              )}

              {/* Room Details */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  Room {room.roomNumber}
                </h3>
                <p className="text-sm text-neutral-700 mb-1">
                  Capacity: <span className="font-medium">{room.capacity}</span> 
                </p>
                  <p className="text-sm text-neutral-700 mb-1">
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      room.status === "AVAILABLE"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {room.status || "Available"}
                  </span>
                </p>
                {room.description && (
                  <p className="text-sm text-neutral-600 font-light mt-3 line-clamp-3">
                    {room.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
