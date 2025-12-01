import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Facilities from "./pages/Facilities";
import FacilityDetails from "./pages/FacilityDetails";
import BookFacility from "./pages/BookFacility";
import MyFacilityBookings from "./pages/MyFacilityBookings";

// Role-based dashboards
import CustomerDashboard from "./components/dashboard/CustomerDashboard";
import StaffDashboard from "./components/dashboard/StaffDashboard";
import ManagerDashboard from "./components/dashboard/ManagerDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/add-user" element={<AddUser />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/feedback" element={<FeedbackForm />} />
                <Route path="/gallery" element={<Gallery />} />

                {/* Facility routes */}
                <Route path="/facilities" element={<Facilities />} />
                <Route path="/facility/:id" element={<FacilityDetails />} />
                <Route path="/book-facility/:id" element={<BookFacility />} />
                <Route path="/my-facility-bookings" element={<MyFacilityBookings />} />

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

                {/* Role-based dashboards */}
                <Route
                    path="/customer/dashboard"
                    element={
                        <ProtectedRoute>
                            <CustomerDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/staff/dashboard"
                    element={
                        <ProtectedRoute>
                            <StaffDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/manager/dashboard"
                    element={
                        <ProtectedRoute>
                            <ManagerDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
