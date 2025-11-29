import React, { useState } from "react";
import axios from "../api/axiosConfig";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/users/login", { email, password });
      localStorage.setItem("token", res.data.data.token);
      alert("Login successful!");
    } catch (err) {
  alert("Error: " + (err.response?.data?.message || "Invalid credentials"));
}

  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
