import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSecurityQuestion, resetPassword } from "../../services/AuthService";
 
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
 
  const navigate = useNavigate();
 
  // Validation helpers
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
 
  const validatePassword = (password) => {
    // At least 8 chars, one uppercase, one number
    const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;;
    return re.test(password);
  };
 
  const fetchQuestion = async () => {
    setMsg("");
    setQuestion("");
    setAnswer("");
    setNewPassword("");
 
    if (!validateEmail(email)) {
      setMsg("❌ Please enter a valid email address");
      return;
    }
 
    try {
      const res = await getSecurityQuestion(email);
      const q = res.data?.data?.securityQuestion;
      if (res.data.status === 200 && q) {
        setQuestion(q);
      } else {
        setMsg(res.data.message || "❌ No security question found");
      }
    } catch (err) {
      console.error("Error:", err.response || err);
      if (err.response?.status === 404) {
        setMsg("❌ Email not Registered");
      } else {
        setMsg("❌ Server error");
      }
    }
  };
 
  const handleReset = async () => {
    if (!answer || !newPassword) {
      setMsg("❌ Please enter answer and new password");
      return;
    }
 
    if (!validatePassword(newPassword)) {
      setMsg(
        "❌ Password must be at least 8 characters, include an uppercase letter and a number and a symbol"
      );
      return;
    }
 
    setLoading(true);
    setMsg("");
 
    try {
      const res = await resetPassword(email, answer, newPassword);
      const success = res.status === 200;
 
      if (success) {
        setMsg("✔ Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMsg(res.data?.message || "❌ Wrong answer!");
      }
    } catch (err) {
      setMsg("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-6">
            <div className="text-3xl font-light tracking-widest text-neutral-800">
              HOTELEASE
            </div>
            <div className="h-px bg-neutral-300 mt-2" />
          </div>
          <h2 className="text-2xl font-light text-neutral-900 tracking-wide mb-2">
            Reset Your Password
          </h2>
          <p className="text-sm text-neutral-600 font-light">
            Verify your identity using your security question.
          </p>
        </div>
 
        {/* Message */}
        {msg && (
          <div
            className={`p-4 border text-sm font-light text-center mb-6 animate-fade-in ${
              msg.startsWith("✔")
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {msg}
          </div>
        )}
 
        {/* Card */}
        <div className="bg-white border border-neutral-200 p-8">
          {/* Step 1: Email */}
          <div className="mb-6 pb-5 border-b border-neutral-200">
            <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-4">
              Step 1 · Account Email
            </h3>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 focus:outline-none focus:border-neutral-500 transition duration-200 font-light"
            />
            {/* Real-time email validation */}
            {email && !validateEmail(email) && (
              <p className="text-xs text-red-600 mt-2">
                ❌ Please enter a valid email address
              </p>
            )}
            {email && validateEmail(email) && (
              <p className="text-xs text-emerald-600 mt-2">✔ Valid email format</p>
            )}
 
            <button
              type="button"
              onClick={fetchQuestion}
              className="mt-4 w-full py-3 text-xs font-light uppercase tracking-widest text-white bg-neutral-800 hover:bg-neutral-900 transition duration-200"
            >
              Get Security Question
            </button>
          </div>
 
          {/* Step 2: Question + Reset */}
          {question && (
            <div>
              <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-4">
                Step 2 · Answer & New Password
              </h3>
 
              <div className="mb-4">
                <div className="text-xs uppercase tracking-widest text-neutral-500 font-light mb-2">
                  Your Security Question
                </div>
                <div className="text-sm text-neutral-900 bg-neutral-50 border border-neutral-200 px-4 py-3 font-light">
                  {question}
                </div>
              </div>
 
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="answer"
                    className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-2"
                  >
                    Your Answer
                  </label>
                  <input
                    id="answer"
                    type="text"
                    placeholder="Type your answer here"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 focus:outline-none focus:border-neutral-500 transition duration-200 font-light"
                  />
                </div>
 
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-2"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 focus:outline-none focus:border-neutral-500 transition duration-200 font-light"
                  />
                  {/* Real-time password validation */}
                  {newPassword && !validatePassword(newPassword) && (
                    <p className="text-xs text-red-600 mt-2">
                      ❌ Password must be at least 8 characters, include an uppercase letter and a number
                    </p>
                  )}
                  {newPassword && validatePassword(newPassword) && (
                    <p className="text-xs text-emerald-600 mt-2">✔ Strong password</p>
                  )}
                </div>
 
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-xs font-light uppercase tracking-widest text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </div>
          )}
        </div>
 
        {/* Back link */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-xs text-neutral-700 hover:text-neutral-900 font-light uppercase tracking-widest"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}