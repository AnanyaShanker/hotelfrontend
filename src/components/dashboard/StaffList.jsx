// Staff List Component
import React, { useState } from 'react';
import { UserCircleIcon, BriefcaseIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const StaffList = ({ staffList, onAssignTask, onViewTasks, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const getStatusColor = (status) => {
    const colors = {
      AVAILABLE: 'bg-green-100 text-green-800 border-green-200',
      BUSY: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      UNAVAILABLE: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-neutral-100 text-neutral-800 border-neutral-200';
  };

  const filteredStaff = staffList?.filter((staff) => {
    const matchesSearch =
      staff.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      filterDepartment === 'ALL' || staff.department === filterDepartment;
    const matchesStatus = filterStatus === 'ALL' || staff.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  }) || [];

  const departments = [...new Set(staffList?.map((s) => s.department))];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                <div className="h-3 bg-neutral-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-neutral-900">Staff Management</h2>
        <span className="text-sm text-neutral-600">
          {filteredStaff.length} staff members
        </span>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search staff..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Status</option>
          <option value="AVAILABLE">Available</option>
          <option value="BUSY">Busy</option>
          <option value="UNAVAILABLE">Unavailable</option>
        </select>
      </div>

      {/* Staff Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Staff
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Department
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Tasks
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filteredStaff.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-neutral-500">
                  No staff members found
                </td>
              </tr>
            ) : (
              filteredStaff.map((staff) => (
                <tr key={staff.staffId} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <UserCircleIcon className="w-10 h-10 text-neutral-400" />
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{staff.name}</p>
                        <p className="text-xs text-neutral-500">{staff.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <BriefcaseIcon className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm text-neutral-700">{staff.department}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        staff.status
                      )}`}
                    >
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4 text-yellow-500" />
                        <span className="text-neutral-600">
                          {staff.tasksPending || 0} pending
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span className="text-neutral-600">
                          {staff.tasksCompleted || 0} done
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right space-x-2">
                    <button
                      onClick={() => onAssignTask(staff)}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Assign Task
                    </button>
                    <button
                      onClick={() => onViewTasks(staff)}
                      className="inline-flex items-center px-3 py-1.5 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-lg hover:bg-neutral-200 transition-colors"
                    >
                      View Tasks
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffList;

