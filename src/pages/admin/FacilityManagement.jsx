// Facility Management - Main page with list of all facilities
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllFacilities, deleteFacility } from '../../services/FacilityService';
import { useAuth } from '../../hooks/useAuth';

const FacilityManagement = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const { user } = useAuth();

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const data = await getAllFacilities();
      setFacilities(data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      alert('Failed to load facilities');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await deleteFacility(id);
      alert('Facility deleted successfully');
      fetchFacilities();
    } catch (error) {
      console.error('Error deleting facility:', error);
      alert('Failed to delete facility');
    }
  };

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || facility.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || facility.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const facilityTypes = ['SPA', 'GYM', 'POOL', 'BANQUET', 'MEETING_HALL', 'RESTAURANT', 'OTHER'];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading facilities...</p>
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
            <h1 className="text-3xl font-bold text-neutral-900">Facility Management</h1>
            <p className="text-neutral-600 mt-2">Manage all hotel facilities</p>
          </div>
          <Link
            to="/admin/facilities/create"
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            <span>Add New Facility</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="ALL">All Types</option>
                {facilityTypes.map(type => (
                  <option key={type} value={type}>{type.replace('_', ' ')}</option>
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
                <option value="AVAILABLE">Available</option>
                <option value="UNAVAILABLE">Unavailable</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-neutral-600">Total Facilities</div>
            <div className="text-2xl font-bold text-neutral-900 mt-1">{facilities.length}</div>
          </div>
          <div className="bg-green-50 rounded-lg shadow-sm p-6">
            <div className="text-sm text-green-700">Available</div>
            <div className="text-2xl font-bold text-green-900 mt-1">
              {facilities.filter(f => f.status === 'AVAILABLE').length}
            </div>
          </div>
          <div className="bg-red-50 rounded-lg shadow-sm p-6">
            <div className="text-sm text-red-700">Unavailable</div>
            <div className="text-2xl font-bold text-red-900 mt-1">
              {facilities.filter(f => f.status === 'UNAVAILABLE').length}
            </div>
          </div>
          <div className="bg-amber-50 rounded-lg shadow-sm p-6">
            <div className="text-sm text-amber-700">Filtered Results</div>
            <div className="text-2xl font-bold text-amber-900 mt-1">{filteredFacilities.length}</div>
          </div>
        </div>

        {/* Facilities Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredFacilities.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">No facilities found</h3>
              <p className="text-neutral-600 mb-4">
                {searchTerm || filterType !== 'ALL' || filterStatus !== 'ALL'
                  ? 'Try adjusting your filters'
                  : 'Get started by adding your first facility'}
              </p>
              {facilities.length === 0 && (
                <Link
                  to="/admin/facilities/create"
                  className="inline-block bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700"
                >
                  Add First Facility
                </Link>
              )}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Facility
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Capacity
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
                {filteredFacilities.map((facility) => (
                  <tr key={facility.facilityId} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-neutral-100">
                          {facility.primaryImage ? (
                            <img
                              src={facility.primaryImage}
                              alt={facility.name}
                              className="h-full w-full object-cover"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-2xl">
                              🏢
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900">{facility.name}</div>
                          <div className="text-sm text-neutral-500 truncate max-w-xs">
                            {facility.description || 'No description'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                        {facility.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {facility.location || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      ₹{facility.price?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {facility.capacity} people
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        facility.status === 'AVAILABLE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {facility.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/facility/${facility.facilityId}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          👁️
                        </Link>
                        <Link
                          to={`/admin/facilities/edit/${facility.facilityId}`}
                          className="text-amber-600 hover:text-amber-900"
                          title="Edit"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDelete(facility.facilityId, facility.name)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacilityManagement;

