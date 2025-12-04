// Top Performing Rooms Component
import React from 'react';
import { HomeIcon, CurrencyDollarIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const TopRooms = ({ rooms, loading }) => {
  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN') || '0'}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-6">
          Top Performing Rooms
        </h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-neutral-200 rounded-lg p-4">
              <div className="h-4 bg-neutral-200 rounded w-1/3 mb-2"></div>
              <div className="h-8 bg-neutral-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <h2 className="text-xl font-semibold text-neutral-900 mb-6">
        Top Performing Rooms
      </h2>

      <div className="space-y-4">
        {!rooms || rooms.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            No room performance data available
          </div>
        ) : (
          rooms.map((room, index) => (
            <div
              key={room.roomId}
              className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <HomeIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">
                      Room {room.roomNumber}
                    </p>
                    <p className="text-xs text-neutral-500">{room.roomType}</p>
                  </div>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                  #{index + 1}
                </span>
              </div>

              {/* Occupancy Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
                  <span>Occupancy Rate</span>
                  <span className="font-semibold">
                    {room.occupancyRate?.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${room.occupancyRate || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <ChartBarIcon className="w-4 h-4 text-neutral-400" />
                  <div>
                    <p className="text-xs text-neutral-500">Bookings</p>
                    <p className="text-sm font-semibold text-neutral-900">
                      {room.totalBookings}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="w-4 h-4 text-neutral-400" />
                  <div>
                    <p className="text-xs text-neutral-500">Revenue</p>
                    <p className="text-sm font-semibold text-neutral-900">
                      {formatCurrency(room.totalRevenue)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopRooms;

