import axios from "../api/axiosConfig";
 
const API_URL = "/api/roomtypes";
 
class RoomTypeService {
  // Get all room types
  getAllRoomTypes() {
    console.log("🔍 Fetching room types from:", API_URL);
    return axios.get(API_URL);
  }
 
  // Get room type by ID
  getRoomTypeById(id) {
    return axios.get(`${API_URL}/${id}`);
  }
 
  // Add a new room type
  addRoomType(roomType) {
    return axios.post(API_URL, roomType);
  }
 
  // Update room type by ID
  updateRoomType(id, roomType) {
    return axios.put(`${API_URL}/${id}`, roomType);
  }
 
  // Delete room type
  deleteRoomType(id) {
    return axios.delete(`${API_URL}/${id}`);
  }
}
 
// Exporting single instance
export default new RoomTypeService();
 
// Backward compatible function (if used somewhere else)
export const getAllRoomTypes = () => {
  console.log("🔍 Fetching room types from:", API_URL);
  return axios.get(API_URL);
};
 