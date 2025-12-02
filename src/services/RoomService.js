// src/services/RoomService.js
import axios from "../api/axiosConfig";

const API_URL = "/api/rooms"; // adjust if backend runs elsewhere

class RoomService {
  // Get all rooms
  getAllRooms() {
    return axios.get(API_URL);
  }

  // Get all available rooms
  getAllAvailableRooms() {
    return axios.get(`${API_URL}/available/all`);
  }

  // Get rooms by branch
  getRoomsByBranch(branchId) {
    return axios.get(`${API_URL}/branch/${branchId}`);
  }

  // Get rooms by type
  getRoomsByType(typeId) {
    return axios.get(`${API_URL}/type/${typeId}`);
  }

  // Get available rooms by branch and type
  getAvailableRooms(branchId, typeId) {
    return axios.get(`${API_URL}/available`, {
      params: { branchId, typeId },
    });
  }

  // Get room by ID
  getRoomById(roomId) {
    return axios.get(`${API_URL}/${roomId}`);
  }
}

export default new RoomService();
