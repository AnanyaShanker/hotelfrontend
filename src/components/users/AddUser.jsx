import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../services/UserService";

export default function AddUser() {
  const [form, setForm] = useState({
    roleId: "1",
    name: "",
    email: "",
    phone: "",
    password: "",
    notes: "",
    status: "active",
    securityQuestions: "",
    securityAnswer: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [idDocument, setIdDocument] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (profileImage) data.append("profileImage", profileImage);
    if (idDocument) data.append("iDocument", idDocument);

    try {
      await createUser(data);
      setMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-8">
            <div className="text-3xl font-light tracking-widest text-neutral-800">
              HOTELEASE
            </div>
            <div className="h-px bg-neutral-300 mt-2"></div>
          </div>
          <h2 className="text-2xl font-light text-neutral-900 tracking-wide mb-2">
            Create Account
          </h2>
          <p className="text-sm text-neutral-600 font-light">
            Join HotelEase for premium luxury stays
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 border text-sm font-light text-center mb-8 animate-fade-in ${
            message.includes("failed") 
              ? "bg-red-50 border-red-200 text-red-800" 
              : "bg-neutral-100 border-neutral-200 text-neutral-800"
          }`}>
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-neutral-200 p-10">
          {/* Personal Information */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-6 pb-3 border-b border-neutral-200">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 focus:outline-none focus:border-neutral-500 transition duration-200 font-light"
                  placeholder="John Doe"
                />
              </div>

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
                  value={form.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 focus:outline-none focus:border-neutral-500 transition duration-200 font-light"
                  placeholder="you@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 focus:outline-none focus:border-neutral-500 transition duration-200 font-light"
                  placeholder="+91 98765 43210"
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
                  value={form.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 focus:outline-none focus:border-neutral-500 transition duration-200 font-light"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-6 pb-3 border-b border-neutral-200">
              Security Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Security Question */}
              <div>
                <label htmlFor="securityQuestions" className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                  Security Question
                </label>
                <input
                  id="securityQuestions"
                  name="securityQuestions"
                  type="text"
                  required
                  value={form.securityQuestions}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 focus:outline-none focus:border-neutral-500 transition duration-200 font-light"
                  placeholder="Your pet's name?"
                />
              </div>

              {/* Security Answer */}
              <div>
                <label htmlFor="securityAnswer" className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                  Security Answer
                </label>
                <input
                  id="securityAnswer"
                  name="securityAnswer"
                  type="text"
                  required
                  value={form.securityAnswer}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 focus:outline-none focus:border-neutral-500 transition duration-200 font-light"
                  placeholder="Your answer"
                />
              </div>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-6 pb-3 border-b border-neutral-200">
              Documents (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Image */}
              <div>
                <label htmlFor="profileImage" className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                  Profile Image
                </label>
                <input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                  className="appearance-none block w-full px-4 py-3 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-500 transition duration-200 font-light file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-light file:uppercase file:tracking-wider file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 file:transition"
                />
              </div>

              {/* ID Document */}
              <div>
                <label htmlFor="idDocument" className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                  ID Document
                </label>
                <input
                  id="idDocument"
                  name="idDocument"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setIdDocument(e.target.files[0])}
                  className="appearance-none block w-full px-4 py-3 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-500 transition duration-200 font-light file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-light file:uppercase file:tracking-wider file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 file:transition"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-6 pb-3 border-b border-neutral-200">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role */}
              <div>
                <label htmlFor="roleId" className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                  Account Type
                </label>
                <select
                  id="roleId"
                  name="roleId"
                  value={form.roleId}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-500 transition duration-200 font-light"
                >
                  <option value="1">Customer</option>
                  <option value="2">Staff</option>
                  <option value="3">Manager</option>
                  <option value="4">Admin</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-500 transition duration-200 font-light"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6">
              <label htmlFor="notes" className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                value={form.notes}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 focus:outline-none focus:border-neutral-500 transition duration-200 font-light"
                placeholder="Any additional information..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-neutral-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent text-xs font-light uppercase tracking-widest text-white bg-neutral-800 hover:bg-neutral-900 focus:outline-none transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-8">
          <p className="text-sm text-neutral-600 font-light mb-3">
            Already have an account?
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-xs font-light uppercase tracking-widest text-neutral-800 hover:text-neutral-900 border border-neutral-300 hover:border-neutral-400 px-8 py-3 transition inline-block"
          >
            Sign In
          </button>
        </div>

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
