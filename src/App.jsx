import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";

import Login from "./components/auth/Login";
import Signup from "./components/Signup";
import UsersList from "./components/users/UsersList";
import AddUser from "./components/users/AddUser";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ForgotPassword from "./components/auth/ForgotPassword";

import Home from "./pages/Home";

import Gallery from "./pages/Gallery";
import FeedbackForm from "./pages/FeedbackForm";
import Facilities from "./pages/Facilities";
import FacilityDetails from "./pages/FacilityDetails";
import BookFacility from "./pages/BookFacility";
import MyFacilityBookings from "./pages/MyFacilityBookings";



import MyBookings from "./pages/MyBookings";


// Room Booking pages
import Rooms from "./pages/Rooms";
import BookRoom from "./pages/BookRoom";

// Payment pages
import PaymentCheckout from "./pages/PaymentCheckout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import PaymentHistory from "./pages/PaymentHistory";

// Report pages
import RoomOccupancyReport from "./pages/reports/RoomOccupancyReport";
import RoomRevenueReport from "./pages/reports/RoomRevenueReport";
import GuestFeedbackReport from "./pages/reports/GuestFeedbackReport";
import HousekeepingReport from "./pages/reports/HousekeepingReport";

import AdminDashboard from "./components/dashboard/AdminDashboard";
import StaffDashboard from "./components/dashboard/StaffDashboard";
import PaymentList from "./pages/reports/PaymentList";
import RoomPricing from "./pages/reports/RoomPricing";
import HotelInformation from "./pages/reports/HotelInformation";
import BookingsReport from "./pages/reports/BookingsReport";
import StaffEnroll from "./pages/reports/StaffEnroll";




import MyTickets from "./pages/MyTickets";
import CreateTicket from "./pages/CreateTicket";

// Admin pages

import FacilityManagement from "./pages/admin/FacilityManagement";
import CreateFacility from "./pages/admin/CreateFacility";
import EditFacility from "./pages/admin/EditFacility";




export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/add-user" element={<AddUser />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/feedback" element={<FeedbackForm />} />
                <Route path="/gallery" element={<Gallery />} />

                {/* Facility routes */}
                <Route path="/facilities" element={<Facilities />} />
                <Route path="/facility/:id" element={<FacilityDetails />} />
                <Route path="/book-facility/:id" element={<BookFacility />} />
                <Route path="/my-facility-bookings" element={<MyFacilityBookings />} />

                {/* Room Booking routes */}
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/book-room" element={<BookRoom />} />

                {/* Unified Bookings Page */}
                <Route path="/my-bookings" element={<MyBookings />} />

                {/* Payment routes */}
                <Route path="/payment/:bookingType/:bookingId" element={<PaymentCheckout />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/failed" element={<PaymentFailed />} />
                <Route path="/my-payments" element={<PaymentHistory />} />
                <Route path="/payments" element={<PaymentList />} />
                <Route path="/booking-report" element={<BookingsReport />} />

                {/* Report routes */}
                <Route path="/reports/room-occupancy" element={<RoomOccupancyReport />} />
                <Route path="/reports/housekeeping" element={<HousekeepingReport />} />
                <Route path="/reports/room-revenue" element={<RoomRevenueReport />} />
                <Route path="/reports/feedback" element={<GuestFeedbackReport />} />
                <Route path="/management/pricing" element={<RoomPricing />} />
                <Route path="/management/branch" element={<HotelInformation />} />
                <Route path="/enroll-staff" element={<StaffEnroll/>}/>
              

               
                

                {/* Support ticket routes */}
                <Route path="/my-tickets" element={<MyTickets />} />
                <Route path="/support/create" element={<CreateTicket />} />

                <Route
  path="/staff-dashboard"
  element={
    <ProtectedRoute>
      <StaffDashboard/>
    </ProtectedRoute>
  }
/>
                <Route
                    path="/admin/facilities"
                    element={
                        <ProtectedRoute>
                            <FacilityManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/facilities/create"
                    element={
                        <ProtectedRoute>
                            <CreateFacility />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/facilities/edit/:id"
                    element={
                        <ProtectedRoute>
                            <EditFacility />
                        </ProtectedRoute>
                    }
                />
                

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
  path="/admin-dashboard"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/staff-dashboard"
  element={
    <ProtectedRoute>
      <StaffDashboard />
    </ProtectedRoute>
  }
/>

            </Routes>
        </BrowserRouter>
    );
}
