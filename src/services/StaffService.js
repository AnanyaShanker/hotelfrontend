import axios from "../api/axiosConfig";


const API_URL = "/api/staff";

const StaffService = {
  getStaffById: (staffId) => axios.get(`${API_URL}/${staffId}`),
  getStaffByUserId: (userId) => axios.get(`${API_URL}/user/${userId}`),
  listStaff: (hotelId, status) =>
    axios.get(API_URL, { params: { hotelId, status } }),
  updateStatus: (staffId, status) =>
    axios.patch(`${API_URL}/${staffId}/status`, { status }),
  updateHotel: (staffId, hotelId) =>
    axios.put(`${API_URL}/${staffId}/hotel`, { hotelId }),
};

export default StaffService;
