import React, { useState } from "react";
import { loginUser } from "../../services/AuthService";
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const response = await loginUser(email, password);
      const token = response.data.data.token;
      const user = response.data.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("roleId", user.roleId);
      localStorage.setItem("userName", user.name);

      setMsg("Login Successful 🎉 Redirecting...");

      if (user.roleId === 1) window.location.href = "/customer/dashboard";
      else if (user.roleId === 2) window.location.href = "/staff/dashboard";
      else if (user.roleId === 3) window.location.href = "/manager/dashboard";
      else if (user.roleId === 4) window.location.href = "/admin/dashboard";

    } catch (err) {
      setMsg("❌ Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 Login</h2>

      {msg && (
        <div className={`auth-msg ${msg.includes("❌") ? "error" : "success"}`}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="login-input"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="login-input"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="login-btn">Login</button>
      </form>

      <a href="/add-user" className="login-link">Create a new Account</a>
      <a href="/forgot-password" className="login-link">Forgot Password</a>
    </div>
  );
}
