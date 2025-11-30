import axios from "axios";

const API_URL = "http://localhost:9193/api/users";

export const createUser = (formData) => {
 return axios.post(API_URL, formData, {
 headers: { "Content-Type": "multipart/form-data" },
 });
};
export const getAllUsers = () => {
    const token =localStorage.getItem("token");
    return axios.get(API_URL,{
        headers:{
            Authorization: "Bearer"+token
        }
    });
}