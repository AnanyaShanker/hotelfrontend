import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const validators = {
  // Required with minimum length
  name: (val) => val.trim().length >= 5,
  securityQuestion: (val) => val.trim().length > 0,
  securityAnswer: (val) => val.trim().length >= 5,

  // Strict validation
  email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
  phone: (val) => /^[0-9]{10}$/.test(val),
  password: (val) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(val),
};

// Hints
const passwordHint = (val) => {
  const hints = [];
  if (!/[a-z]/.test(val)) hints.push("lowercase");
  if (!/[A-Z]/.test(val)) hints.push("uppercase");
  if (!/\d/.test(val)) hints.push("number");
  if (!/[@$!%*?&]/.test(val)) hints.push("symbol");
  if (val.length < 8) hints.push(`${8 - val.length} more characters`);
  return hints.join(", ");
};

const phoneHint = (val) => {
  if (val.length < 10) return `${10 - val.length} digits remaining`;
  return "";
};

const nameHint = (val) => {
  if (val.length < 5) return `${5 - val.length} more characters needed`;
  return "";
};

const securityAnswerHint = (val) => {
  if (val.length < 5) return `${5 - val.length} more characters needed`;
  return "";
};

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    securityQuestion: "",
    securityAnswer: "",
    roleId: "1",
    status: "active",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [hints, setHints] = useState({
    phone: "",
    password: "",
    name: "",
    securityAnswer: "",
  });
  const [message, setMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  // ✅ Only check email, phone, password for strict validity
  useEffect(() => {
    setIsFormValid(
      ["email", "phone", "password","name","securityAnswer"].every((key) => validators[key](form[key]))
    );
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = value;

    if (name === "phone") updated = value.replace(/\D/g, "");

    setForm((prev) => ({ ...prev, [name]: updated }));

    let msg = "";
    let hint = "";

    if (name === "password") hint = passwordHint(updated);
    if (name === "phone") hint = phoneHint(updated);
    if (name === "name") hint = nameHint(updated);
    if (name === "securityAnswer") hint = securityAnswerHint(updated);

    if (updated.trim() === "") {
      msg = `${name} is required`;
    } else if (!validators[name](updated)) {
      switch (name) {
        case "phone":
          msg = "Phone must be exactly 10 digits";
          break;
        case "password":
          msg =
            "Password must include uppercase, lowercase, number, symbol, and be 8+ characters";
          break;
        case "email":
          msg = "Invalid email format";
          break;
        case "name":
          msg = "Name must be at least 5 characters";
          break;
        case "securityAnswer":
          msg = "Security answer must be at least 5 characters";
          break;
        default:
          msg = "Invalid " + name;
      }
    }

    setErrors((prev) => ({ ...prev, [name]: msg }));
    setHints((prev) => ({ ...prev, [name]: hint }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.entries(validators).forEach(([key, validate]) => {
      if (!validate(form[key])) {
        newErrors[key] = `Invalid ${key}`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage("⚠ Fix highlighted errors before submitting");
      return;
    }

    setMessage("🎉 Account created successfully!");
    setTimeout(() => navigate("/login"), 1500);
  };

  const ErrorText = ({ text }) =>
    text ? <p style={{ color: "red", fontSize: "12px" }}>{text}</p> : null;

  const SuccessText = ({ text }) =>
    text ? <p style={{ color: "green", fontSize: "12px" }}>{text}</p> : null;

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />
      {errors.name && <ErrorText text={errors.name} />}
      {form.name && !errors.name && <SuccessText text="✔ Looks good" />}
      {hints.name && <p style={{ fontSize: "12px" }}>{hints.name}</p>}

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      {errors.email && <ErrorText text={errors.email} />}
      {form.email && !errors.email && <SuccessText text="✔ Valid email" />}

      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
      />
      {errors.phone && <ErrorText text={errors.phone} />}
      {form.phone && !errors.phone && <SuccessText text="✔ Valid phone" />}
      {hints.phone && <p style={{ fontSize: "12px" }}>{hints.phone}</p>}

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      {errors.password && <ErrorText text={errors.password} />}
      {form.password && !errors.password && (
        <SuccessText text="✔ Strong password" />
      )}
      {hints.password && <p style={{ fontSize: "12px" }}>{hints.password}</p>}

      <input
        name="securityQuestion"
        placeholder="Security Question"
        value={form.securityQuestion}
        onChange={handleChange}
      />
      {errors.securityQuestion && <ErrorText text={errors.securityQuestion} />}
      {form.securityQuestion && !errors.securityQuestion && (
        <SuccessText text="✔ Looks good" />
      )}

      <input
        name="securityAnswer"
        placeholder="Security Answer"
        value={form.securityAnswer}
        onChange={handleChange}
      />
      {errors.securityAnswer && <ErrorText text={errors.securityAnswer} />}
      {form.securityAnswer && !errors.securityAnswer && (
        <SuccessText text="✔ Looks good" />
      )}
      {hints.securityAnswer && (
        <p style={{ fontSize: "12px" }}>{hints.securityAnswer}</p>
      )}

      <button type="submit" disabled={!isFormValid}>
        Sign Up
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}




  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto animate-fade-in">
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

        {message && (
          <div
            className={`p-4 border text-sm font-light text-center mb-8 ${
              message.includes("⚠")
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-neutral-100 border-neutral-200 text-neutral-800"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-neutral-200 p-10">
          {/* PERSONAL INFO */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-6 pb-3 border-b border-neutral-200">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* NAME */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`block w-full px-4 py-3 border ${
                    errors.name ? "border-red-500" : "border-neutral-300"
                  }`}
                />
                <ErrorText text={errors.name} />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`block w-full px-4 py-3 border ${
                    errors.email ? "border-red-500" : "border-neutral-300"
                  }`}
                />
                <ErrorText text={errors.email} />
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                  Phone Number
                </label>
                <input
                  name="phone"
                  maxLength="10"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="9123456789"
                  className={`block w-full px-4 py-3 border ${
                    errors.phone ? "border-red-500" : "border-neutral-300"
                  }`}
                />
                {hints.phone && (
                  <p className="text-blue-500 text-xs">{hints.phone}</p>
                )}
                <ErrorText text={errors.phone} />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`block w-full px-4 py-3 border ${
                    errors.password ? "border-red-500" : "border-neutral-300"
                  }`}
                />
                {hints.password && (
                  <p className="text-blue-500 text-xs">Missing: {hints.password}</p>
                )}
                <ErrorText text={errors.password} />
              </div>
            </div>
          </div>

          {/* SECURITY INFO */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-6 pb-3 border-b border-neutral-200">
              Security Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* QUESTION */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                  Security Question
                </label>
                <select
                  name="securityQuestion"
                  value={form.securityQuestion}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-neutral-300"
                >
                  <option value="">Select a question</option>
                  <option value="petName">What is your pet's name?</option>
                  <option value="birthCity">In which city were you born?</option>
                  <option value="motherMaiden">What is your mother's maiden name?</option>
                  <option value="firstSchool">What was your first school?</option>
                </select>
                <ErrorText text={errors.securityQuestion} />
              </div>

              {/* ANSWER */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                  Security Answer
                </label>
                <input
                  name="securityAnswer"
                  value={form.securityAnswer}
                  onChange={handleChange}
                  placeholder="Your answer"
                  className={`block w-full px-4 py-3 border ${
                    errors.securityAnswer ? "border-red-500" : "border-neutral-300"
                  }`}
                />
                <ErrorText text={errors.securityAnswer} />
              </div>
            </div>
          </div>

          {/* DOCUMENTS */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-6 pb-3 border-b border-neutral-200">
              Documents (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                  className="block w-full px-4 py-3 border border-neutral-300"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                  ID Document
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setIdDocument(e.target.files[0])}
                  className="block w-full px-4 py-3 border border-neutral-300"
                />
              </div>
            </div>
          </div>

          {/* ADDITIONAL INFO */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-light mb-6 pb-3 border-b border-neutral-200">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                  Account Type
                </label>
                <select
                  name="roleId"
                  value={form.roleId}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-neutral-300"
                >
                  <option value="1">Customer</option>
                  <option value="2">Staff</option>
                  <option value="3">Manager</option>
                  <option value="4">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-neutral-300"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-xs uppercase tracking-widest text-neutral-600 font-light mb-3">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                rows="3"
                value={form.notes}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-neutral-300"
                placeholder="Any additional information..."
              />
            </div>
          </div>

          {/* SUBMIT */}
          <div className="pt-6 border-t border-neutral-200">
            <button
              type="submit"
              disabled={!isFormValid}
              className="w-full flex justify-center py-4 px-4 text-xs uppercase tracking-widest text-white bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Account
            </button>
          </div>
        </form>

        {/* LOGIN LINK */}
        <div className="text-center mt-8">
          <p className="text-sm text-neutral-600 font-light mb-3">
            Already have an account?
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-xs uppercase tracking-widest border px-8 py-3"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );


