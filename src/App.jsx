import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";

import Login from "./components/auth/Login";
import UsersList from "./components/users/UsersList";
import AddUser from "./components/users/AddUser";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ForgotPassword from "./components/auth/ForgotPassword";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Gallery from "./pages/Gallery";
import FeedbackForm from "./pages/FeedbackForm";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} /> {/* Login route */}
        <Route path="/login" element={<Login />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />

        {/* Protected routes */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
