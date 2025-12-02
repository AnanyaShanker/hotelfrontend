// src/services/BranchService.js
import axios from "../api/axiosConfig";

// ✅ Match your Spring Boot controller mapping
const API_URL = "/api/branches";

class BranchService {
  // Get all branches
  getAllBranches() {
    return axios.get(API_URL);
  }

  // Get branch by ID
  getBranchById(id) {
    return axios.get(`${API_URL}/${id}`);
  }

  // Search branches by location
  searchBranchesByLocation(location) {
    return axios.get(`${API_URL}/search`, { params: { location } });
  }

  // Add a new branch
  addBranch(branch) {
    return axios.post(API_URL, branch);
  }

  // Update branch by ID
  updateBranch(id, branch) {
    return axios.put(`${API_URL}/${id}`, branch);
  }

  // Toggle branch status
  toggleBranchStatus(id) {
    return axios.patch(`${API_URL}/${id}/toggle-status`);
  }

  // Delete branch (if you add a DELETE endpoint later)
  deleteBranch(id) {
    return axios.delete(`${API_URL}/${id}`);
  }
}

export default new BranchService();
