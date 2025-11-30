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
 
export default function App() {
  return (
  <BrowserRouter>
  <Routes>
  <Route path="/" element={<Login />} /> {/* Login route */}
  <Route path="/login" element={<Login />} />
  <Route path="/add-user" element={<AddUser />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
 
  {/* Protected route example — once logged in */}
  <Route
  path="/users"
  element={
  <ProtectedRoute>
  <UsersList />
  </ProtectedRoute>
  }
  />
  </Routes>
  </BrowserRouter>
  );
 }
 