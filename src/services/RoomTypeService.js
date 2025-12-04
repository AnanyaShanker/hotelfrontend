

import axios from "../api/axiosConfig";

// ✅ Match your Spring Boot controller mapping
const API_URL = "/api/roomtypes"; // Using the primary endpoint

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

  // Delete room type (if you add a DELETE endpoint later)
  deleteRoomType(id) {
    return axios.delete(`${API_URL}/${id}`);
  }
}

// Export as default (class instance) for consistency
export default new RoomTypeService();

// Also keep named export for backward compatibility
export const getAllRoomTypes = () => {
  console.log("🔍 Fetching room types from:", API_URL);
  return axios.get(API_URL);
};

