import axios from "../api/axiosConfig";

export const getAllRoomTypes = () => {
  return axios.get("/api/room-types");
};
