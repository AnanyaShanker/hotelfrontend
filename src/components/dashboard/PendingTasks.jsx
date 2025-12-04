// Pending Tasks Component
import React, { useState } from 'react';
import {
  ClockIcon,
  CheckCircleIcon,
  UserIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

const PendingTasks = ({ tasks, onViewDetails, onUpdateStatus, loading }) => {
  const [filterType, setFilterType] = useState('ALL');
  const [filterStaff, setFilterStaff] = useState('ALL');

  const getTaskTypeColor = (type) => {
    const colors = {
      CLEANING: 'bg-blue-100 text-blue-800 border-blue-200',
      MAINTENANCE: 'bg-orange-100 text-orange-800 border-orange-200',
      CHECKOUT: 'bg-purple-100 text-purple-800 border-purple-200',
      INSPECTION: 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[type] || 'bg-neutral-100 text-neutral-800 border-neutral-200';
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',
      COMPLETED: 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[status] || 'bg-neutral-100 text-neutral-800 border-neutral-200';
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    if (diffInHours > 0) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInMins > 0) return `${diffInMins} minute${diffInMins > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const filteredTasks = tasks?.filter((task) => {
    const matchesType = filterType === 'ALL' || task.taskType === filterType;
    const matchesStaff =
      filterStaff === 'ALL' || task.staffName?.includes(filterStaff);
    return matchesType && matchesStaff;
  }) || [];

  const uniqueStaff = [...new Set(tasks?.map((t) => t.staffName))];
  const taskTypes = ['CLEANING', 'MAINTENANCE', 'CHECKOUT', 'INSPECTION'];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-neutral-200 rounded-lg p-4">
              <div className="h-4 bg-neutral-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-neutral-900">Pending Tasks</h2>
        <span className="text-sm text-neutral-600">
          {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Task Types</option>
          {taskTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          value={filterStaff}
          onChange={(e) => setFilterStaff(e.target.value)}
          className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Staff</option>
          {uniqueStaff.map((staff) => (
            <option key={staff} value={staff}>
              {staff}
            </option>
          ))}
        </select>
      </div>

      {/* Tasks List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <CheckCircleIcon className="w-16 h-16 mx-auto mb-2 text-green-500" />
            <p>No pending tasks! Great job! 🎉</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.taskId}
              className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-semibold text-neutral-700">
                    Task #{task.taskId}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTaskTypeColor(
                      task.taskType
                    )}`}
                  >
                    {task.taskType}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status === 'IN_PROGRESS' ? 'In Progress' : task.status}
                  </span>
                </div>
                <span className="text-xs text-neutral-500">
                  {getTimeAgo(task.assignedAt)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-4 h-4 text-neutral-400" />
                  <span className="text-sm text-neutral-700">{task.staffName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <HomeIcon className="w-4 h-4 text-neutral-400" />
                  <span className="text-sm text-neutral-700">Room {task.roomNumber}</span>
                </div>
              </div>

              {task.remarks && (
                <p className="text-sm text-neutral-600 mb-3 italic">
                  "{task.remarks}"
                </p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                <button
                  onClick={() => onViewDetails(task)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View Details
                </button>
                <div className="flex items-center space-x-2">
                  {task.status === 'PENDING' && (
                    <button
                      onClick={() => onUpdateStatus(task.taskId, 'IN_PROGRESS')}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ClockIcon className="w-4 h-4 mr-1" />
                      Mark In Progress
                    </button>
                  )}
                  {task.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => onUpdateStatus(task.taskId, 'COMPLETED')}
                      className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PendingTasks;

