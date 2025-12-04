// Room Management - Main page with list of all rooms
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RoomService from '../../services/RoomService';
import BranchService from '../../services/BranchService';
import { getAllRoomTypes } from '../../services/RoomTypeService';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [branches, setBranches] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsRes, branchesRes, typesRes] = await Promise.all([
        RoomService.getAllRooms(),
        BranchService.getAllBranches(),
        getAllRoomTypes()
      ]);

      setRooms(roomsRes.data || []);
      setBranches(branchesRes.data || []);
      setRoomTypes(typesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, roomNumber) => {
    if (!confirm(`Are you sure you want to delete room "${roomNumber}"?`)) return;

    try {
      await RoomService.deleteRoom(id);
      alert('Room deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Failed to delete room');
    }
  };

  const handleStatusChange = async (roomId, newStatus) => {
    try {
      await RoomService.updateRoomStatus(roomId, newStatus);
      alert('Room status updated successfully');
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update room status');
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = filterBranch === 'ALL' || room.branchId === parseInt(filterBranch);
    const matchesType = filterType === 'ALL' || room.typeId === parseInt(filterType);
    const matchesStatus = filterStatus === 'ALL' || room.status === filterStatus;
    return matchesSearch && matchesBranch && matchesType && matchesStatus;
  });

  const statuses = ['AVAILABLE', 'RESERVED', 'OCCUPIED', 'MAINTENANCE'];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Room Management</h1>
            <p className="text-neutral-600 mt-2">Manage all hotel rooms</p>
          </div>
          <Link
            to="/admin/rooms/create"
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            <span>Add New Room</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by room number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Branch Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Branch
              </label>
              <select
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="ALL">All Branches</option>
                {branches.map(branch => (
                  <option key={branch.branchId} value={branch.branchId}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Room Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="ALL">All Types</option>
                {roomTypes.map(type => (
                  <option key={type.typeId} value={type.typeId}>
                    {type.typeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="ALL">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-neutral-600">Total Rooms</div>
            <div className="text-2xl font-bold text-neutral-900 mt-1">{rooms.length}</div>
          </div>
          <div className="bg-green-50 rounded-lg shadow-sm p-6">
            <div className="text-sm text-green-700">Available</div>
            <div className="text-2xl font-bold text-green-900 mt-1">
              {rooms.filter(r => r.status === 'AVAILABLE').length}
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg shadow-sm p-6">
            <div className="text-sm text-blue-700">Reserved</div>
            <div className="text-2xl font-bold text-blue-900 mt-1">
              {rooms.filter(r => r.status === 'RESERVED').length}
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow-sm p-6">
            <div className="text-sm text-yellow-700">Occupied</div>
            <div className="text-2xl font-bold text-yellow-900 mt-1">
              {rooms.filter(r => r.status === 'OCCUPIED').length}
            </div>
          </div>
          <div className="bg-red-50 rounded-lg shadow-sm p-6">
            <div className="text-sm text-red-700">Maintenance</div>
            <div className="text-2xl font-bold text-red-900 mt-1">
              {rooms.filter(r => r.status === 'MAINTENANCE').length}
            </div>
          </div>
        </div>

        {/* Rooms Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredRooms.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛏️</div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">No rooms found</h3>
              <p className="text-neutral-600 mb-4">
                {searchTerm || filterBranch !== 'ALL' || filterType !== 'ALL' || filterStatus !== 'ALL'
                  ? 'Try adjusting your filters'
                  : 'Get started by adding your first room'}
              </p>
              {rooms.length === 0 && (
                <Link
                  to="/admin/rooms/create"
                  className="inline-block bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700"
                >
                  Add First Room
                </Link>
              )}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Branch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Price/Night
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Floor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredRooms.map((room) => {
                  const branch = branches.find(b => b.branchId === room.branchId);
                  const type = roomTypes.find(t => t.typeId === room.typeId);

                  return (
                    <tr key={room.roomId} className="hover:bg-neutral-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-neutral-100">
                            {room.roomPrimaryImage ? (
                              <img
                                src={room.roomPrimaryImage}
                                alt={room.roomNumber}
                                className="h-full w-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-2xl">
                                🛏️
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-neutral-900">
                              Room {room.roomNumber}
                            </div>
                            <div className="text-sm text-neutral-500">
                              {room.description || 'No description'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {branch?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {type?.typeName || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        ₹{room.pricePerNight?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {room.capacity} guests
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        Floor {room.floorNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={room.status}
                          onChange={(e) => handleStatusChange(room.roomId, e.target.value)}
                          className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${
                            room.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                            room.status === 'RESERVED' ? 'bg-blue-100 text-blue-800' :
                            room.status === 'OCCUPIED' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/rooms/edit/${room.roomId}`}
                            className="text-amber-600 hover:text-amber-900"
                            title="Edit"
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => handleDelete(room.roomId, room.roomNumber)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomManagement;

