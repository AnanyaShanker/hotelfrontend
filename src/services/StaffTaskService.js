import axios from "../api/axiosConfig";


const API_URL = "/api/stafftasks";

const StaffTaskService = {
  createTask: (taskData) => axios.post(API_URL, taskData),
  getTask: (taskId) => axios.get(`${API_URL}/${taskId}`),
  getTasksByStaff: (staffId) => axios.get(`${API_URL}/staff/${staffId}`),
  getTasksByRoom: (roomId) => axios.get(`${API_URL}/room/${roomId}`),
  getAllTasks: () => axios.get(API_URL),
  updateStatus: (taskId, status, remarks = "") =>
    axios.patch(`${API_URL}/${taskId}/status`, null, {
      params: { status, remarks },
    }),
  assignTaskToStaff: (hotelId, taskData) =>
    axios.post(`${API_URL}/hotel/${hotelId}/assign`, taskData),
};

export default StaffTaskService;
