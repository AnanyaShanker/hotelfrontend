import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const validators = {
  name: (val) => val.trim().length >= 5,
  securityQuestion: (val) => val.trim().length > 0,
  securityAnswer: (val) => val.trim().length >= 5,
  email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
  phone: (val) => /^[0-9]{10}$/.test(val),
  password: (val) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(val),
};

const passwordHint = (val) => {
  const hints = [];
  if (!/[a-z]/.test(val)) hints.push("lowercase");
  if (!/[A-Z]/.test(val)) hints.push("uppercase");
  if (!/\d/.test(val)) hints.push("number");
  if (!/[@$!%*?&]/.test(val)) hints.push("symbol");
  if (val.length < 8) hints.push(`${8 - val.length} more characters`);
  return hints.join(", ");
};

const phoneHint = (val) => (val.length < 10 ? `${10 - val.length} digits remaining` : "");
const nameHint = (val) => (val.length < 5 ? `${5 - val.length} more characters needed` : "");
const securityAnswerHint = (val) =>
  val.length < 5 ? `${5 - val.length} more characters needed` : "";

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
  const [hints, setHints] = useState({});
  const [message, setMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(
      ["email", "phone", "password", "name", "securityAnswer"].every((key) =>
        validators[key](form[key])
      )
    );
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = name === "phone" ? value.replace(/\D/g, "") : value;

    setForm((prev) => ({ ...prev, [name]: updated }));

    let msg = "";
    let hint = "";

    if (name === "password") hint = passwordHint(updated);
    if (name === "phone") hint = phoneHint(updated);
    if (name === "name") hint = nameHint(updated);
    if (name === "securityAnswer") hint = securityAnswerHint(updated);

    if (!updated.trim()) {
      msg = `${name} is required`;
    } else if (!validators[name](updated)) {
      switch (name) {
        case "phone":
          msg = "Phone must be exactly 10 digits";
          break;
        case "password":
          msg = "Password must include uppercase, lowercase, number, symbol, and 8+ characters";
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
          msg = "Invalid input";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: msg }));
    setHints((prev) => ({ ...prev, [name]: hint }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.entries(validators).forEach(([key, validate]) => {
      if (!validate(form[key])) newErrors[key] = `Invalid ${key}`;
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
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <ErrorText text={errors.name} />
      {form.name && !errors.name && <SuccessText text="✔ Looks good" />}
      {hints.name && <p style={{ fontSize: "12px" }}>{hints.name}</p>}

      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <ErrorText text={errors.email} />
      {form.email && !errors.email && <SuccessText text="✔ Valid email" />}

      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
      <ErrorText text={errors.phone} />
      {form.phone && !errors.phone && <SuccessText text="✔ Valid phone" />}
      {hints.phone && <p style={{ fontSize: "12px" }}>{hints.phone}</p>}

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      <ErrorText text={errors.password} />
      {form.password && !errors.password && <SuccessText text="✔ Strong password" />}
      {hints.password && <p style={{ fontSize: "12px" }}>{hints.password}</p>}

      <input
        name="securityQuestion"
        placeholder="Security Question"
        value={form.securityQuestion}
        onChange={handleChange}
      />
      <ErrorText text={errors.securityQuestion} />
      {form.securityQuestion && !errors.securityQuestion && <SuccessText text="✔ Looks good" />}

      <input
        name="securityAnswer"
        placeholder="Security Answer"
        value={form.securityAnswer}
        onChange={handleChange}
      />
      <ErrorText text={errors.securityAnswer} />
      {form.securityAnswer && !errors.securityAnswer && (
        <SuccessText text="✔ Looks good" />
      )}
      {hints.securityAnswer && <p style={{ fontSize: "12px" }}>{hints.securityAnswer}</p>}

      <button type="submit" disabled={!isFormValid}>
        Sign Up
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}