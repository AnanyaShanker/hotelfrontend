import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/AuthService";
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const response = await loginUser(email, password);
      const token = response.data.data.token;
      const user = response.data.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("roleId", user.roleId);
      localStorage.setItem("userName", user.name);

      setMsg("Login Successful. Redirecting...");

      // Check if user came from booking page
      const returnUrl = localStorage.getItem("returnUrl");

      setTimeout(() => {
        if (returnUrl) {
          // User was trying to book - send them back to booking page
          localStorage.removeItem("returnUrl");
          window.location.href = returnUrl;
        } else {
          // Normal login - go to home
          window.location.href = "/home";
        }
      }, 1000);

    } catch {
      setMsg("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-block mb-8">
            <div className="text-3xl font-light tracking-widest text-neutral-800">
              HOTELEASE
            </div>
            <div className="h-px bg-neutral-300 mt-2"></div>
          </div>
          <h2 className="text-2xl font-light text-neutral-900 tracking-wide mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-neutral-600 font-light">
            Sign in to access your account
          </p>
        </div>

        {/* Message */}
        {msg && (
          <div className={`p-4 border text-sm font-light text-center animate-fade-in ${
            msg.includes("Invalid") 
              ? "bg-red-50 border-red-200 text-red-800" 
              : "bg-neutral-100 border-neutral-200 text-neutral-800"
          }`}>
            {msg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 focus:outline-none focus:border-neutral-500 transition duration-200 font-light"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 focus:outline-none focus:border-neutral-500 transition duration-200 font-light"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-xs text-neutral-600 hover:text-neutral-900 transition font-light uppercase tracking-wider"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-xs font-light uppercase tracking-widest text-white bg-neutral-800 hover:bg-neutral-900 focus:outline-none transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-neutral-50 text-neutral-500 font-light uppercase tracking-wider">
                Or
              </span>
            </div>
          </div>

          {/* Create Account Link */}
          <div className="text-center">
            <p className="text-sm text-neutral-600 font-light mb-3">
              Don't have an account?
            </p>
            <button
              type="button"
              onClick={() => navigate("/add-user")}
              className="text-xs font-light uppercase tracking-widest text-neutral-800 hover:text-neutral-900 border border-neutral-300 hover:border-neutral-400 px-8 py-3 transition inline-block"
            >
              Create Account
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center pt-8">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="text-xs text-neutral-500 hover:text-neutral-700 transition font-light uppercase tracking-wider"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
