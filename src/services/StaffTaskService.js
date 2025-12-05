// Staff Task Management API Service
import axios from '../api/axiosConfig';

// Create/Assign Task
export const createTask = async (taskData) => {
  const response = await axios.post('/api/stafftasks', taskData);
  return response.data;
};

// Get all tasks for branch
export const getTasksByBranch = async (branchId) => {
  const response = await axios.get(`/api/stafftasks/branch/${branchId}`);
  return response.data;
};

// Get specific staff's tasks
export const getTasksByStaff = async (staffId) => {
  const response = await axios.get(`/api/stafftasks/staff/${staffId}`);
  return response.data;
};

// Get task details
export const getTaskById = async (taskId) => {
  const response = await axios.get(`/api/stafftasks/${taskId}`);
  return response.data;
};

// Update task status
export const updateTaskStatus = async (taskId, status) => {
  const response = await axios.patch(`/api/stafftasks/${taskId}`, { status });
  return response.data;
};

// Update full task
export const updateTask = async (taskId, taskData) => {
  const response = await axios.patch(`/api/stafftasks/${taskId}`, taskData);
  return response.data;
};

export default {
  createTask,
  getTasksByBranch,
  getTasksByStaff,
  getTaskById,
  updateTaskStatus,
  updateTask,
};

