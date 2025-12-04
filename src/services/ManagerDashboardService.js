// Manager Dashboard API Service
import axios from '../api/axiosConfig';

// Get complete dashboard data
export const getDashboardData = async (branchId) => {
  const response = await axios.get(`/api/manager/dashboard/${branchId}`);
  return response.data;
};

// Get today's statistics
export const getTodayStats = async (branchId) => {
  const response = await axios.get(`/api/manager/today-stats/${branchId}`);
  return response.data;
};

// Get monthly statistics
export const getMonthStats = async (branchId) => {
  const response = await axios.get(`/api/manager/month-stats/${branchId}`);
  return response.data;
};

// Get staff list
export const getStaffList = async (branchId) => {
  const response = await axios.get(`/api/manager/staff/${branchId}`);
  return response.data;
};

// Get pending tasks
export const getPendingTasks = async (branchId) => {
  const response = await axios.get(`/api/manager/pending-tasks/${branchId}`);
  return response.data;
};

// Get top performing rooms
export const getTopRooms = async (branchId, limit = 5) => {
  const response = await axios.get(`/api/manager/top-rooms/${branchId}?limit=${limit}`);
  return response.data;
};

// Get recent activity
export const getRecentActivity = async (branchId, limit = 10) => {
  const response = await axios.get(`/api/manager/recent-activity/${branchId}?limit=${limit}`);
  return response.data;
};

// Get branch info
export const getBranchInfo = async (branchId) => {
  const response = await axios.get(`/api/manager/branch-info/${branchId}`);
  return response.data;
};

export default {
  getDashboardData,
  getTodayStats,
  getMonthStats,
  getStaffList,
  getPendingTasks,
  getTopRooms,
  getRecentActivity,
  getBranchInfo,
};

