// Manager Dashboard Main Component
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Services
import ManagerDashboardService from '../../services/ManagerDashboardService';
import StaffTaskService from '../../services/StaffTaskService';

// Components
import StatsCardsGrid from './StatsCardsGrid';
import StaffList from './StaffList';
import PendingTasks from './PendingTasks';
import ActivityFeed from './ActivityFeed';
import TopRooms from './TopRooms';
import AssignTaskModal from './AssignTaskModal';

// Icons
import {
  ArrowPathIcon,
  BuildingOfficeIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [dashboardData, setDashboardData] = useState({
    todayStats: null,
    monthStats: null,
    staffList: [],
    topRooms: [],
    pendingTasks: [],
    recentActivity: [],
    branchInfo: null,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Modals
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showStaffTasksModal, setShowStaffTasksModal] = useState(false);
  const [staffTasks, setStaffTasks] = useState([]);

  // Get branch ID from user data
  const branchId = user?.branchId || localStorage.getItem('branchId');

  // Initial data load
  useEffect(() => {
    if (!branchId) {
      toast.error('Branch ID not found. Please login again.');
      navigate('/login');
      return;
    }
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData(true); // Silent refresh
    }, 30000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  // Fetch all dashboard data
  const fetchDashboardData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);

      console.log('📊 Fetching dashboard data for branch:', branchId);

      const response = await ManagerDashboardService.getDashboardData(branchId);
      console.log('✅ Dashboard data received:', response);

      setDashboardData(response);
      setError(null);

      if (!silent) {
        toast.success('Dashboard loaded successfully!');
      }
    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');

      if (!silent) {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle assign task
  const handleAssignTask = (staff) => {
    setSelectedStaff(staff);
    setShowAssignTaskModal(true);
  };

  // Submit task assignment
  const handleTaskAssignment = async (taskData) => {
    try {
      console.log('📝 Assigning task:', taskData);

      await StaffTaskService.createTask({
        ...taskData,
        status: 'PENDING',
      });

      toast.success('Task assigned successfully! Staff will be notified via email.');

      // Refresh dashboard data
      await fetchDashboardData(true);

      return Promise.resolve();
    } catch (err) {
      console.error('❌ Error assigning task:', err);
      toast.error(err.response?.data?.message || 'Failed to assign task');
      return Promise.reject(err);
    }
  };

  // View staff tasks
  const handleViewTasks = async (staff) => {
    try {
      setSelectedStaff(staff);
      const tasks = await StaffTaskService.getTasksByStaff(staff.staffId);
      setStaffTasks(tasks);
      setShowStaffTasksModal(true);
    } catch (err) {
      console.error('❌ Error fetching staff tasks:', err);
      toast.error('Failed to load staff tasks');
    }
  };

  // Update task status
  const handleUpdateTaskStatus = async (taskId, status) => {
    try {
      console.log('🔄 Updating task status:', taskId, status);

      await StaffTaskService.updateTaskStatus(taskId, status);

      toast.success(`Task marked as ${status.toLowerCase()}`);

      // Refresh dashboard
      await fetchDashboardData(true);
    } catch (err) {
      console.error('❌ Error updating task:', err);
      toast.error('Failed to update task status');
    }
  };

  // View task details
  const handleViewTaskDetails = async (task) => {
    toast.info(`Task #${task.taskId} - ${task.taskType} for Room ${task.roomNumber}`);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  // Loading state
  if (loading && !dashboardData.todayStats) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-neutral-200 border-t-blue-600 mb-4"></div>
          <p className="text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !dashboardData.todayStats) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchDashboardData()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Branch Info */}
            <div className="flex items-center space-x-3">
              <BuildingOfficeIcon className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-lg font-semibold text-neutral-900">
                  {dashboardData.branchInfo?.branchName || 'Manager Dashboard'}
                </h1>
                <p className="text-xs text-neutral-500">
                  {dashboardData.branchInfo?.location}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => fetchDashboardData()}
                disabled={refreshing}
                className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors disabled:opacity-50"
                title="Refresh Dashboard"
              >
                <ArrowPathIcon
                  className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
                />
              </button>
              <div className="text-right">
                <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
                <p className="text-xs text-neutral-500">Manager</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-neutral-600 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatsCardsGrid
          todayStats={dashboardData.todayStats}
          monthStats={dashboardData.monthStats}
          loading={loading}
        />

        {/* Staff Management */}
        <div className="mb-8">
          <StaffList
            staffList={dashboardData.staffList}
            onAssignTask={handleAssignTask}
            onViewTasks={handleViewTasks}
            loading={loading}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pending Tasks */}
          <PendingTasks
            tasks={dashboardData.pendingTasks}
            onViewDetails={handleViewTaskDetails}
            onUpdateStatus={handleUpdateTaskStatus}
            loading={loading}
          />

          {/* Activity Feed */}
          <ActivityFeed
            activities={dashboardData.recentActivity}
            loading={loading}
          />
        </div>

        {/* Top Rooms */}
        <div className="mb-8">
          <TopRooms rooms={dashboardData.topRooms} loading={loading} />
        </div>

        {/* Branch Summary */}
        {dashboardData.branchInfo && (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Branch Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Total Rooms</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {dashboardData.branchInfo.totalRooms}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Total Staff</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {dashboardData.branchInfo.totalStaff}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Manager</p>
                <p className="text-lg font-semibold text-neutral-900">
                  {dashboardData.branchInfo.managerName}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Location</p>
                <p className="text-sm font-medium text-neutral-700">
                  {dashboardData.branchInfo.location}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AssignTaskModal
        isOpen={showAssignTaskModal}
        onClose={() => {
          setShowAssignTaskModal(false);
          setSelectedStaff(null);
        }}
        staff={selectedStaff}
        onSuccess={handleTaskAssignment}
      />

      {/* Staff Tasks Modal */}
      {showStaffTasksModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 bg-neutral-500 bg-opacity-75"
              onClick={() => setShowStaffTasksModal(false)}
            ></div>
            <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6">
              <h3 className="text-xl font-semibold mb-4">
                Tasks for {selectedStaff?.name}
              </h3>
              <div className="max-h-96 overflow-y-auto">
                {staffTasks.length === 0 ? (
                  <p className="text-center text-neutral-500 py-8">
                    No tasks assigned yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {staffTasks.map((task) => (
                      <div
                        key={task.taskId}
                        className="border border-neutral-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold">Task #{task.taskId}</span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              task.status === 'COMPLETED'
                                ? 'bg-green-100 text-green-800'
                                : task.status === 'IN_PROGRESS'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600">
                          {task.taskType} - Room {task.roomNumber}
                        </p>
                        {task.remarks && (
                          <p className="text-xs text-neutral-500 mt-1 italic">
                            "{task.remarks}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowStaffTasksModal(false)}
                className="mt-4 w-full px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;

