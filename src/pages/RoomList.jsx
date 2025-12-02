// src/components/RoomList.jsx
import React from "react";

export default function RoomList({ rooms, selectedRoomId, onSelect }) {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="text-neutral-600 font-light">
        No rooms available for this branch and type.
      </div>
    );
  }

  return (
    <div className="mt-6 grid md:grid-cols-2 gap-6">
      {rooms.map((room) => (
        <div
          key={room.roomId}
          onClick={() => onSelect(room)}
          className={`border rounded-lg overflow-hidden cursor-pointer transition transform hover:scale-[1.02] ${
            selectedRoomId === room.roomId.toString()
              ? "border-yellow-500 bg-yellow-50 shadow-md"
              : "border-neutral-300 hover:border-neutral-500"
          }`}
        >
          {/* Room Image */}
          {room.imageUrl && (
            <img
              src={room.imageUrl}
              alt={`Room ${room.roomNumber}`}
              className="w-full h-48 object-cover"
            />
          )}

          {/* Room Details */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Room Number: {room.roomNumber}
            </h3>
            <p className="text-sm text-neutral-700 mb-2">
                Price: ₹{room.pricePerNight}/night
            </p>
            <p className="text-sm text-neutral-700 mb-2">
              Capacity: {room.capacity} guests
            </p>
            <p className="text-sm text-neutral-700 mb-2">
              Status: {room.status || "Available"}
            </p>

            {/* Room Description */}
            {room.description && (
              <p className="text-sm text-neutral-600 font-light mt-3">
                {room.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
