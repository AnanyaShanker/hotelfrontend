import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
 
import Login from "./components/Login";
import Signup from "./components/Signup";
import PrivateRoute from "./routes/PrivateRoute";
 
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Gallery from "./pages/Gallery";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Render Home at root */}
        <Route path="/" element={<Home />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        //<Route path="/dashboard" element={<Dashboard />} />
 
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
 
        {/* Direct routes for Home and Gallery */}
        <Route path="/home" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </BrowserRouter>
  );
 
}

export default App;