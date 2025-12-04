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

  // ✅ NEW: Get available rooms for specific date range
  getAvailableRoomsForDates(branchId, typeId, checkIn, checkOut) {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().replace('T', ' ').substring(0, 19);
    };

    console.log("🔍 Searching rooms for dates:", {
      branchId,
      typeId,
      checkIn: formatDate(checkIn),
      checkOut: formatDate(checkOut)
    });

    return axios.get(`${API_URL}/available/dates`, {
      params: {
        branchId,
        typeId,
        checkIn: formatDate(checkIn),
        checkOut: formatDate(checkOut)
      }
    });
  }

  // Get room by ID
  getRoomById(roomId) {
    return axios.get(`${API_URL}/${roomId}`);
  }

  // Admin: Create new room
  createRoom(roomData) {
    return axios.post(API_URL, roomData);
  }

  // Admin: Update room
  updateRoom(roomId, roomData) {
    return axios.put(`${API_URL}/${roomId}`, roomData);
  }

  // Admin: Delete room
  deleteRoom(roomId) {
    return axios.delete(`${API_URL}/${roomId}`);
  }

  // Admin: Update room status
  updateRoomStatus(roomId, status) {
    return axios.patch(`${API_URL}/${roomId}/status`, null, {
      params: { status }
    });
  }

  // Admin: Upload room image
  uploadRoomImage(roomId, imageFile) {
    const formData = new FormData();
    formData.append('file', imageFile);
    return axios.post(`${API_URL}/${roomId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
}

export default new RoomService();
