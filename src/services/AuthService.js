import axios from "../api/axiosConfig";

export const loginUser = async (email, password) => {
  return axios.post("/api/users/login", { email, password }, {
    skipAuth: true // Don't send token for login
  });
};

// FORGOT PASSWORD
export const getSecurityQuestion = (email) => {
  return axios.post("/api/auth/forgot-password", { email }, {
    skipAuth: true // Public endpoint
  });
};

// RESET PASSWORD
export const resetPassword = (email, securityAnswer, newPassword) => {
  return axios.post("/api/auth/reset-password", {
    email,
    securityAnswer,
    newPassword
  }, {
    headers: { "Content-Type": "application/json" },
    skipAuth: true // Public endpoint
  });
};

   