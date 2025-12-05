// Admin Dashboard - Main entry point for admin panel
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllFacilities } from '../../services/FacilityService';
import RoomService from '../../services/RoomService';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalFacilities: 0,
    availableFacilities: 0,
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    maintenanceRooms: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [facilities, rooms] = await Promise.all([
        getAllFacilities().catch(() => []),
        RoomService.getAllRooms().then(res => res.data).catch(() => [])
      ]);

      setStats({
        totalFacilities: facilities.length,
        availableFacilities: facilities.filter(f => f.status === 'AVAILABLE').length,
        totalRooms: rooms.length,
        availableRooms: rooms.filter(r => r.status === 'AVAILABLE').length,
        occupiedRooms: rooms.filter(r => r.status === 'OCCUPIED').length,
        maintenanceRooms: rooms.filter(r => r.status === 'MAINTENANCE').length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Facility Management',
      description: 'Manage hotel facilities',
      icon: '🏢',
      link: '/admin/facilities',
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
      title: 'Room Management',
      description: 'Manage hotel rooms',
      icon: '🛏️',
      link: '/admin/rooms',
      color: 'bg-green-50 border-green-200 text-green-700'
    },
    {
      title: 'Booking Management',
      description: 'View and manage bookings',
      icon: '📅',
      link: '/admin/bookings',
      color: 'bg-purple-50 border-purple-200 text-purple-700'
    },
    {
      title: 'Payment Verification',
      description: 'Verify pending payments',
      icon: '💳',
      link: '/admin/payments',
      color: 'bg-amber-50 border-amber-200 text-amber-700'
    },
    {
      title: 'User Management',
      description: 'Manage users and roles',
      icon: '👥',
      link: '/users',
      color: 'bg-pink-50 border-pink-200 text-pink-700'
    },
    {
      title: 'Reports',
      description: 'View analytics and reports',
      icon: '📊',
      link: '/reports',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-700'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-neutral-900">Admin Dashboard</h1>
          <p className="text-neutral-600 mt-2">Welcome back, {user?.name || 'Admin'}!</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Overview</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Total Facilities</p>
                    <p className="text-3xl font-bold text-neutral-900 mt-2">{stats.totalFacilities}</p>
                    <p className="text-sm text-green-600 mt-1">{stats.availableFacilities} available</p>
                  </div>
                  <div className="text-4xl">🏢</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Total Rooms</p>
                    <p className="text-3xl font-bold text-neutral-900 mt-2">{stats.totalRooms}</p>
                    <p className="text-sm text-green-600 mt-1">{stats.availableRooms} available</p>
                  </div>
                  <div className="text-4xl">🛏️</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Occupied Rooms</p>
                    <p className="text-3xl font-bold text-neutral-900 mt-2">{stats.occupiedRooms}</p>
                    <p className="text-sm text-neutral-500 mt-1">
                      {stats.totalRooms > 0 ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0}% occupancy
                    </p>
                  </div>
                  <div className="text-4xl">🏠</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Maintenance</p>
                    <p className="text-3xl font-bold text-neutral-900 mt-2">{stats.maintenanceRooms}</p>
                    <p className="text-sm text-red-600 mt-1">Needs attention</p>
                  </div>
                  <div className="text-4xl">🔧</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`block p-6 rounded-lg border-2 hover:shadow-lg transition-all ${action.color}`}
              >
                <div className="text-4xl mb-3">{action.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                <p className="text-sm opacity-80">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity - Placeholder */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
            <p className="text-neutral-600 text-center py-8">
              Recent activity tracking coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
