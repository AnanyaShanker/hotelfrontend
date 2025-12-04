// Stat Card Component for Dashboard
import React from 'react';

const StatCard = ({ icon, label, value, trend, color = 'blue', loading = false }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    indigo: 'bg-indigo-100 text-indigo-600',
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
          <div className="w-16 h-6 bg-neutral-200 rounded"></div>
        </div>
        <div className="w-24 h-4 bg-neutral-200 rounded mb-2"></div>
        <div className="w-32 h-8 bg-neutral-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend !== undefined && trend !== null && (
          <span
            className={`text-sm font-medium ${
              trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-neutral-600'
            }`}
          >
            {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-sm text-neutral-600 font-light mb-1">{label}</p>
      <p className="text-3xl font-bold text-neutral-900">{value}</p>
    </div>
  );
};

export default StatCard;

