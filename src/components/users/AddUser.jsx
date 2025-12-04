import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../services/UserService";
 
// VALIDATION RULES
const validators = {
  email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
  phone: (val) => /^[0-9]{10}$/.test(val),
  password: (val) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(val),
  name: (val) => val.trim().length >= 5,              // ✅ at least 5 chars
  securityAnswer: (val) => val.trim().length >= 5,    // ✅ at least 5 chars
};
 
const passwordHint = (val) => {
  const out = [];
  if (!/[a-z]/.test(val)) out.push("lowercase");
  if (!/[A-Z]/.test(val)) out.push("uppercase");
  if (!/\d/.test(val)) out.push("number");
  if (!/[@$!%*?&]/.test(val)) out.push("symbol");
  if (val.length < 8) out.push(`${8 - val.length} more characters`);
  return out.join(", ");
};
 
const nameHint = (val) => {
  if (val.length < 5) return `${5 - val.length} more characters needed`;
  return "";
};
 
const securityAnswerHint = (val) => {
  if (val.length < 5) return `${5 - val.length} more characters needed`;
  return "";
};
 
export default function AddUser() {
  const navigate = useNavigate();
 
  const [form, setForm] = useState({
    roleId: "1",
    name: "",
    email: "",
    phone: "",
    password: "",
    notes: "",
    status: "active",
    securityQuestion: "",
    securityAnswer: "",
  });
 
  const [profileImage, setProfileImage] = useState(null);
  const [idDocument, setIdDocument] = useState(null);
 
  const [errors, setErrors] = useState({});
  const [hints, setHints] = useState({ password: "", phone: "", name: "", securityAnswer: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [shakeFields, setShakeFields] = useState({});
 
  // 🔹 HANDLE CHANGE + LIVE VALIDATION
  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleaned = name === "phone" ? value.replace(/\D/g, "") : value;
    setForm({ ...form, [name]: cleaned });
 
    let errorMsg = "";
    let hintMsg = "";
 
    if (name === "password") hintMsg = passwordHint(cleaned);
    if (name === "phone" && cleaned.length < 10)
      hintMsg = `${10 - cleaned.length} digits remaining`;
    if (name === "name") hintMsg = nameHint(cleaned);
    if (name === "securityAnswer") hintMsg = securityAnswerHint(cleaned);
 
    if (!cleaned.trim()) {
      errorMsg = `${name} is required`;
    } else if (validators[name] && !validators[name](cleaned)) {
      errorMsg =
        name === "phone"
          ? "Phone must be exactly 10 digits"
          : name === "password"
          ? "Password must include uppercase, lowercase, number, symbol, and be 8+ characters"
          : name === "email"
          ? "Invalid email format"
          : name === "name"
          ? "Name must be at least 5 characters"
          : name === "securityAnswer"
          ? "Security answer must be at least 5 characters"
          : "Invalid " + name;
    }
 
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    setHints((prev) => ({ ...prev, [name]: hintMsg }));
  };
 
  // 🔹 SUBMIT — BLOCK IF INVALID
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
 
    const hasErrors = Object.values(errors).some((m) => m);
    const blankRequired = [
      "name",
      "email",
      "phone",
      "password",
      "securityQuestion",
      "securityAnswer",
    ].some((f) => !form[f]);
 
    if (hasErrors || blankRequired) {
      setMessage("⚠ Fix highlighted errors before submitting");
 
      // mark invalid fields to shake
      const newShake = {};
      ["name", "email", "phone", "password", "securityAnswer"].forEach((f) => {
        if (errors[f] || !form[f]) newShake[f] = true;
      });
      setShakeFields(newShake);
 
      // reset shake after animation
      setTimeout(() => setShakeFields({}), 500);
      return;
    }
 
    setLoading(true);
 
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (profileImage) data.append("profileImage", profileImage);
    if (idDocument) data.append("idDocument", idDocument);
 
    try {
      await createUser(data);
      setMessage("✅ Account created successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const code = err.response?.data?.code;
      if (code === "EMAIL_EXISTS") {
        setMessage("⚠ This email is already registered. Please use another one.");
      } else {
        setMessage("❌ Registration failed. Try again.");
      }
    } finally {
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
            Join HotelEase for premium luxury stays hsdigsbjhdyguasd
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
                  placeholder="Kumar Singh"
                />
                 {hints.name && (
                <p className="text-blue-500 text-xs mt-1">Missing: {hints.name}</p>
              )}
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
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
                      className={`appearance-none block w-full px-4 py-3 border ${
                        errors.email ? "border-red-500" : "border-neutral-300"
                      } placeholder-neutral-400 text-neutral-900 focus:outline-none focus:border-neutral-500 transition duration-200 font-light ${
                        shakeFields.email ? "shake" : ""
                      }`}
                      placeholder="you@example.com"
                    />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
              </div>
 
             {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={form.phone}
              onChange={handleChange}
              className={`appearance-none block w-full px-4 py-3 border ${
                errors.phone ? "border-red-500" : "border-neutral-300"
              } placeholder-neutral-400 text-neutral-900 focus:outline-none focus:border-neutral-500 transition duration-200 font-light ${
                shakeFields.phone ? "shake" : ""
              }`}
              placeholder="+91 98765 43210"
            />
            {hints.phone && (
              <p className="text-blue-500 text-xs mt-1">{hints.phone}</p>
            )}
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
 
            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className={`appearance-none block w-full px-4 py-3 border ${
                  errors.password ? "border-red-500" : "border-neutral-300"
                } placeholder-neutral-400 text-neutral-900 focus:outline-none focus:border-neutral-500 transition duration-200 font-light ${
                  shakeFields.password ? "shake" : ""
                }`}
                placeholder="••••••••"
              />
              {hints.password && (
                <p className="text-blue-500 text-xs mt-1">Missing: {hints.password}</p>
              )}
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
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
                  <label
                    htmlFor="securityQuestion"
                    className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3"
                  >
                    Security Question
                  </label>
                  <select
                    id="securityQuestion"
                    name="securityQuestion"
                    required
                    value={form.securityQuestion}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-500 transition duration-200 font-light"
                  >
                    <option value="">Select a question</option>
                    <option value="petName">What is your pet's name?</option>
                    <option value="birthCity">In which city were you born?</option>
                    <option value="motherMaiden">What is your mother's maiden name?</option>
                    <option value="firstSchool">What was the name of your first school?</option>
                  </select>
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
                {hints.securityAnswer && (
              <p className="text-blue-500 text-xs mt-1">{hints.securityAnswer}</p>
            )}
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