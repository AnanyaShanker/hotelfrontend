import React, { useState } from "react";
import { useNavigate } from "react-router-dom";   // ✅ import useNavigate
import { getSecurityQuestion, resetPassword } from "../../services/AuthService"; // adjust path to your api file

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();   // ✅ define navigate here

  const fetchQuestion = async () => {
    try {
      const res = await getSecurityQuestion(email);

      console.log("Response:", res.data); // Debug log

      const question = res.data?.data?.securityQuestion;
      if (res.data.status === 200 && question) {
        setQuestion(question);
        setMsg("");
      } else {
        setMsg(res.data.message || "❌ No security question found");
      }
    } catch (err) {
      console.error("Error:", err.response || err);
      if (err.response?.status === 404) {
        setMsg("❌ Email not found");
      } else {
        setMsg("❌ Server error");
      }
    }
  };

  const handleReset = async () => {
    try {
      const res = await resetPassword(email, answer, newPassword);

      console.log("Reset response:", res.data); // Debug log

      // Success check based on backend response
      const success = res.status === 200; // ✅ use HTTP status code

      if (success) {
        setMsg("✔ Password reset successful! Please login now.");
        alert("✔ Password reset successful!");
        navigate("/login"); // ✅ now navigate works
      } else {
        setMsg(res.data?.message || "❌ Wrong answer!");
        alert(res.data?.message || "❌ Wrong answer!");
      }
    } catch (err) {
      console.error("Reset error:", err.response?.data || err);
      setMsg("❌ Something went wrong");
      alert("❌ Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">🔐 Forgot Password</h2>

      {msg && <div className="text-center mb-3 text-blue-700">{msg}</div>}

      {/* Email */}
      <input
        type="email"
        placeholder="Enter Email"
        className="border p-2 w-full mb-3"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button className="bg-blue-600 text-white px-3 py-2 rounded w-full mb-4"
        onClick={fetchQuestion}>
        Get Security Question
      </button>

      {/* Show question only after fetch */}
      {question && (
        <>
          <div className="font-medium mb-2">🔹 {question}</div>

          <input
            type="text"
            placeholder="Enter your answer"
            className="border p-2 w-full mb-3"
            onChange={(e) => setAnswer(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter new password"
            className="border p-2 w-full mb-3"
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button
            className="bg-green-600 text-white px-3 py-2 rounded w-full"
            onClick={handleReset}
          >
            Reset Password
          </button>
        </>
      )}
    </div>
  );
}
