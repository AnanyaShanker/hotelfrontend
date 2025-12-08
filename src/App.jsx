import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";

import Login from "./components/auth/Login";
import Signup from "./components/Signup";
import UsersList from "./components/users/UsersList";
import AddUser from "./components/users/AddUser";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ForgotPassword from "./components/auth/ForgotPassword";
//import PaymentList from "./pages/reports/PaymentList";
import GalleryManagement from "./pages/admin/GalleryManagement";
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

import StaffDashboard from "./components/dashboard/StaffDashboard";
import MyTickets from "./pages/MyTickets";
import CreateTicket from "./pages/CreateTicket";

// Admin pages
//import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import FacilityManagement from "./pages/admin/FacilityManagement";
import CreateFacility from "./pages/admin/CreateFacility";
import EditFacility from "./pages/admin/EditFacility";
import RoomManagement from "./pages/admin/RoomManagement";

// Manager Dashboard
//import ManagerDashboard from "./components/dashboard/ManagerDashboard";
 import ManagerDashboard from "./pages/ManagerDashboard";
import RoomPricing from "./pages/reports/RoomPricing";
import HotelInformation from "./pages/reports/HotelInformation";
import BookingsReport from "./pages/reports/BookingsReport";
import StaffEnroll from "./pages/reports/StaffEnroll";
import ManagerBookingsPage from "./pages/ManagerBookingsPage";
import ManagerRoomStatusPage from "./pages/ManagerRoomStatusPage";
import ManagerSupportTasksPage from "./pages/ManagerSupportTasksPage";
import ManagerReportsPage from "./pages/ManagerReportsPage";
import ManagerStaffTasksPage from "./pages/ManagerStaffTasksPage";
import PaymentList from "./pages/reports/PaymentList";



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
                <Route path="/feedback/:id" element={<FeedbackForm />} />
                <Route path="/gallery" element={<Gallery />} />

                {/* Facility routes */}
                <Route path="/facilities" element={<Facilities />} />
                <Route path="/facility/:id" element={<FacilityDetails />} />
                <Route path="/book-facility/:id" element={<BookFacility />} />
                <Route path="/my-facility-bookings" element={<MyFacilityBookings />} />
<Route path="/payments" element={<PaymentList/>}/>
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

                <Route path="/booking-report" element={<BookingsReport/>} />
                 <Route path="/enroll-staff" element={<StaffEnroll/>} />

                {/* Admin Dashboard Route */}
                <Route
                path="/admin-dashboard"
                element={
                    <ProtectedRoute>
                    <AdminDashboard />
                    </ProtectedRoute>
                }
                />
                {/* Staff Dashboard Route */}
                                        <Route
                        path="/staff-dashboard"
                        element={
                            <ProtectedRoute>
                            <StaffDashboard/>
                            </ProtectedRoute>
                        }
                />

              {/* Report routes */}
                <Route path="/reports/room-occupancy" element={<RoomOccupancyReport />} />
                <Route path="/reports/housekeeping" element={<HousekeepingReport />} />
                <Route path="/reports/room-revenue" element={<RoomRevenueReport />} />
                <Route path="/reports/feedback" element={<GuestFeedbackReport />} />
                <Route path="/management/pricing" element={<RoomPricing />} />
                <Route path="/management/branch" element={<HotelInformation />} />
                <Route path="/payments" element={<PaymentList/>}/>



                {/* Manager Dashboard Route */}
                <Route
                    path="/manager-dashboard"
                    element={
                        <ProtectedRoute>
                            <ManagerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route path="/manager/bookings" element={<ManagerBookingsPage />} />
                <Route path="/manager/room-status" element={<ManagerRoomStatusPage />} />
                <Route path="/manager/support-tickets" element={<ManagerSupportTasksPage />} />
                 <Route path="/manager/staff-tasks" element={<ManagerStaffTasksPage />} />
                 <Route path="/manager/reports" element={<ManagerReportsPage />} />

                {/* Support ticket routes */}
                <Route path="/my-tickets" element={<MyTickets />} />
                <Route path="/support/create" element={<CreateTicket />} />

                {/* Admin Panel Routes */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
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
                <Route
                    path="/admin/rooms"
                    element={
                        <ProtectedRoute>
                            <RoomManagement />
                        </ProtectedRoute>
                    }
                />

                 <Route
                    path="/admin/gallery"
                    element={
                        <ProtectedRoute>
                            <GalleryManagement />
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

                {/* Staff dashboard route (final chosen version) */}
                <Route
                    path="/staff-dashboard"
                    element={
                        <ProtectedRoute>
                            <StaffDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* <Route
                    path="/manager/dashboard"
                    element={
                        <ProtectedRoute>
                            <ManagerDashboard />
                        </ProtectedRoute>
                    }
                /> */}



            </Routes>
        </BrowserRouter>
    );
}