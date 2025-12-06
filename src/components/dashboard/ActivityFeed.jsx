// Activity Feed Component
import React from 'react';
import {
  CalendarIcon,
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon,
  UserIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';

const ActivityFeed = ({ activities, loading }) => {
  const getActivityIcon = (type) => {
    const icons = {
      BOOKING: <CalendarIcon className="w-5 h-5" />,
      PAYMENT: <CurrencyDollarIcon className="w-5 h-5" />,
      TASK: <ClipboardDocumentCheckIcon className="w-5 h-5" />,
      CUSTOMER: <UserIcon className="w-5 h-5" />,
      MAINTENANCE: <WrenchScrewdriverIcon className="w-5 h-5" />,
    };
    return icons[type] || <CalendarIcon className="w-5 h-5" />;
  };

  const getActivityColor = (type) => {
    const colors = {
      BOOKING: 'bg-blue-100 text-blue-600',
      PAYMENT: 'bg-green-100 text-green-600',
      TASK: 'bg-purple-100 text-purple-600',
      CUSTOMER: 'bg-yellow-100 text-yellow-600',
      MAINTENANCE: 'bg-orange-100 text-orange-600',
    };
    return colors[type] || 'bg-neutral-100 text-neutral-600';
  };

  const getStatusColor = (status) => {
    const colors = {
      CONFIRMED: 'text-green-600',
      PENDING: 'text-yellow-600',
      CANCELLED: 'text-red-600',
      COMPLETED: 'text-blue-600',
    };
    return colors[status] || 'text-neutral-600';
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `${diffInDays}d ago`;
    if (diffInHours > 0) return `${diffInHours}h ago`;
    if (diffInMins > 0) return `${diffInMins}m ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-6">Recent Activity</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <h2 className="text-xl font-semibold text-neutral-900 mb-6">Recent Activity</h2>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {!activities || activities.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            No recent activity
          </div>
        ) : (
          activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 pb-4 border-b border-neutral-200 last:border-b-0 last:pb-0"
            >
              <div
                className={`p-2 rounded-full ${getActivityColor(activity.type)}`}
              >
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900">
                  {activity.description}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-neutral-500">
                    {getTimeAgo(activity.timestamp)}
                  </span>
                  {activity.status && (
                    <>
                      <span className="text-xs text-neutral-400">•</span>
                      <span
                        className={`text-xs font-medium ${getStatusColor(
                          activity.status
                        )}`}
                      >
                        {activity.status}
                      </span>
                    </>
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

export default ActivityFeed;

