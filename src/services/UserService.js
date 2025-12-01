import axios from "../api/axiosConfig";

const API_URL = "/api/users";

export const createUser = (formData) => {
  // Don't send token for signup (public endpoint)
  console.log('📝 Creating user with formData');

  return axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    // Skip the auth interceptor for this request
    skipAuth: true
  });
};

export const getAllUsers = () => {
  return axios.get(API_URL);
};
