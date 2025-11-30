import axios from "axios";

const BASE_URL = "http://localhost:9193/api/users";

export const loginUser = async (email, password) => {
  return axios.post(`${BASE_URL}/login`, { email, password });
};
// FORGOT PASSWORD (still in AuthController)
export const getSecurityQuestion = (email) => {
    return axios.post(`http://localhost:9193/api/auth/forgot-password`, { email });
   };
   
   // RESET PASSWORD (still in AuthController)
   // api.js


export const resetPassword = (email, securityAnswer, newPassword) => {
  return axios.post("http://localhost:9193/api/auth/reset-password", {
    email,
    securityAnswer,   // ✅ correct field name
    newPassword          // ✅ backend expects "newPassword"
  }, {
    headers: { "Content-Type": "application/json" }
  });
};

   