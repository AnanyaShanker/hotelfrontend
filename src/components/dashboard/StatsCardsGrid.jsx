// Stats Cards Grid Component
import React from 'react';
import StatCard from './StatCard';
import {
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  UsersIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

const StatsCardsGrid = ({ todayStats, monthStats, loading }) => {
  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN') || '0'}`;
  };

  const statsData = [
    {
      icon: <CalendarDaysIcon className="w-6 h-6" />,
      label: 'Total Bookings Today',
      value: todayStats?.totalBookings || 0,
      color: 'blue',
    },
    {
      icon: <CurrencyDollarIcon className="w-6 h-6" />,
      label: 'Revenue Today',
      value: formatCurrency(todayStats?.revenueToday),
      color: 'green',
    },
    {
      icon: <ChartBarIcon className="w-6 h-6" />,
      label: 'Occupancy Rate',
      value: `${todayStats?.occupancyRate?.toFixed(1) || '0'}%`,
      color: 'purple',
    },
    {
      icon: <HomeIcon className="w-6 h-6" />,
      label: 'Available Rooms',
      value: todayStats?.availableRooms || 0,
      color: 'indigo',
    },
    {
      icon: <ArrowRightOnRectangleIcon className="w-6 h-6" />,
      label: 'Pending Check-ins',
      value: todayStats?.pendingCheckIns || 0,
      color: 'yellow',
    },
    {
      icon: <ArrowLeftOnRectangleIcon className="w-6 h-6" />,
      label: 'Pending Check-outs',
      value: todayStats?.pendingCheckOuts || 0,
      color: 'yellow',
    },
    {
      icon: <UsersIcon className="w-6 h-6" />,
      label: 'New Customers',
      value: todayStats?.newCustomers || 0,
      color: 'blue',
    },
    {
      icon: <BanknotesIcon className="w-6 h-6" />,
      label: 'Monthly Revenue',
      value: formatCurrency(monthStats?.totalRevenue),
      trend: monthStats?.revenueGrowth,
      color: 'green',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} loading={loading} />
      ))}
    </div>
  );
};

export default StatsCardsGrid;

