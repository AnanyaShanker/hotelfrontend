import React, { useState } from "react";
import axios from "../api/axiosConfig";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    securityQuestions: "",
    securityAnswer: "",
    profileImage: null,
    iDocument: null,
  });

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

   try {
  const res = await axios.post("/api/users", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  alert("Signup successful! User ID: " + res.data.data.userId);
} catch (err) {
  alert("Error: " + (err.response?.data?.message || "Signup failed"));
}

  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <input name="phone" placeholder="Phone" onChange={handleChange} />
      <input name="securityQuestions" placeholder="Security Question" onChange={handleChange} />
      <input name="securityAnswer" placeholder="Security Answer" onChange={handleChange} />
      <input name="profileImage" type="file" onChange={handleChange} />
      <input name="iDocument" type="file" onChange={handleChange} />
      <button type="submit">Signup</button>
    </form>
  );
}

export default Signup;
