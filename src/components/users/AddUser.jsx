import React, { useState } from "react";
import { createUser } from "../../services/UserService";

export default function AddUser() {
  const [form, setForm] = useState({
    roleId: "",
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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (profileImage) data.append("profileImage", profileImage);
    if (idDocument) data.append("iDocument", idDocument);

    try {
      await createUser(data);
      setMessage("🎉 User registered successfully");
      setTimeout(()=>{
        window.location.href="/login";
      },1000);
      setForm({
        roleId: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        notes: "",
        status: "active",
        securityQuestions: "",
        securityAnswer: "",
      });
      setProfileImage(null);
      setIdDocument(null);
    } catch (err) {
      setMessage("❌ Failed to create user");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-5 text-center">➕ Create New User</h2>

      {message && (
        <p className="bg-blue-100 border border-blue-300 text-blue-600 p-2 rounded mb-4 text-center">
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <input className="border p-2 rounded w-full"
          name="roleId" placeholder="Role ID" onChange={handleChange} value={form.roleId} />

        <input className="border p-2 rounded w-full"
          name="name" placeholder="Full Name" onChange={handleChange} value={form.name} />

        <input className="border p-2 rounded w-full"
          name="email" placeholder="Email" onChange={handleChange} value={form.email} />

        <input className="border p-2 rounded w-full"
          name="phone" placeholder="Phone" onChange={handleChange} value={form.phone} />

        <input className="border p-2 rounded w-full"
          type="password" name="password" placeholder="Password" onChange={handleChange} value={form.password} />

        <textarea className="border p-2 rounded w-full"
          name="notes" placeholder="Notes" onChange={handleChange} value={form.notes}></textarea>

        {/* Security Question */}
        <select className="border p-2 rounded w-full"
          name="securityQuestions" onChange={handleChange} value={form.securityQuestions}>
          <option value="">Select Security Question</option>
          <option>What is your pet name?</option>
          <option>Which city were you born in?</option>
          <option>What is your favourite movie?</option>
          <option>Who is your childhood best friend?</option>
        </select>

        <input className="border p-2 rounded w-full"
          name="securityAnswer" placeholder="Security Answer" onChange={handleChange} value={form.securityAnswer} />

        {/* File Uploads */}
        <div>
          <label className="block mb-1 font-medium">Profile Image</label>
          <input type="file" onChange={(e) => setProfileImage(e.target.files[0])} />
        </div>

        <div>
          <label className="block mb-1 font-medium">ID Document</label>
          <input type="file" onChange={(e) => setIdDocument(e.target.files[0])} />
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded w-full">
          Create User
        </button>
      </form>
    </div>
  );
}
