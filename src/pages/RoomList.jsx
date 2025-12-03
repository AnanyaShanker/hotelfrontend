// src/components/RoomList.jsx
import React from "react";

export default function RoomList({ rooms, selectedRoomId, onSelect }) {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-neutral-400 text-4xl mb-4">🛏️</div>
        <p className="text-neutral-600 font-light">No rooms available for this branch and type.</p>
        <p className="text-neutral-500 font-light text-sm mt-2">Please try a different selection.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid md:grid-cols-2 gap-6">
      {rooms.map((room) => (
        <div
          key={room.roomId}
          onClick={() => onSelect(room)}
          className={`border overflow-hidden cursor-pointer transition-all duration-300 ${
            selectedRoomId === room.roomId.toString()
              ? "border-neutral-800 bg-neutral-50 shadow-lg"
              : "border-neutral-200 hover:border-neutral-400 hover:shadow-md"
          }`}
        >
          {/* Room Image */}
          <div className="relative h-48 bg-neutral-200 overflow-hidden group">
            {room.roomPrimaryImage ? (
              <img
                src={room.roomPrimaryImage}
                alt={`Room ${room.roomNumber}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl">
                🛏️
              </div>
            )}
            {selectedRoomId === room.roomId.toString() && (
              <div className="absolute top-4 right-4 bg-neutral-800 text-white px-3 py-1 text-xs uppercase tracking-wider font-light">
                Selected
              </div>
            )}
          </div>

          {/* Room Details */}
          <div className="p-6">
            <h3 className="text-lg font-light text-neutral-900 mb-4 tracking-wide">
              Room {room.roomNumber}
            </h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600 font-light">Price</span>
                <span className="text-neutral-900 font-light">₹{parseFloat(room.pricePerNight).toLocaleString()}/night</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600 font-light">Capacity</span>
                <span className="text-neutral-900 font-light">{room.capacity} guests</span>
              </div>
              {room.floorNumber && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600 font-light">Floor</span>
                  <span className="text-neutral-900 font-light">{room.floorNumber}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600 font-light">Status</span>
                <span className="text-neutral-900 font-light">{room.status || "Available"}</span>
              </div>
            </div>

            {/* Room Description */}
            {room.description && (
              <p className="text-sm text-neutral-700 font-light mt-4 pt-4 border-t border-neutral-200">
                {room.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
