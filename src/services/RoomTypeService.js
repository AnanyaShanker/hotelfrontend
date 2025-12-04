import axios from "../api/axiosConfig";

const API_URL = "/api/roomtypes";
class RoomTypeService {
  // Get all RoomTypes
  getAllRoomTypes() {
    return axios.get(API_URL);
  }

  // Get branch by ID
  getAvailableRoomsById(id) {
    return axios.get(`${API_URL}/${id}`);
  }
}


export default new RoomTypeService();