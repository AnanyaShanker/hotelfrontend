import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import axios from "axios";
 
export default function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [branches, setBranches] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [roomRevenue, setRoomRevenue] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
 
        const [roomsRes, branchesRes, bookingsRes, revenueRes] = await Promise.all([
          axios.get("http://localhost:9193/api/rooms", { headers }),
          axios.get("http://localhost:9193/api/branches", { headers }),
          axios.get("http://localhost:9193/api/bookings", { headers }),
          axios.get("http://localhost:9193/api/reports/room-revenue", { headers }),
        ]);
 
        setRooms(roomsRes.data);
        setBranches(branchesRes.data);
        setBookings(bookingsRes.data);
        setRoomRevenue(revenueRes.data);
 
        const total = revenueRes.data.reduce((sum, item) => sum + (item.revenue || 0), 0);
        setTotalRevenue(total);
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
 
  const totalRooms = rooms.length;
  const activeBookings = bookings.filter((b) => {
    const status = b.status || b.bookingStatus;
    return status?.toUpperCase() === "CONFIRMED" || status?.toUpperCase() === "PENDING";
  }).length;
 
  const getBranch = (roomId) =>
    branches.find((b) => b.branchId === rooms.find((r) => r.roomId === roomId)?.branchId)?.name ||
    "Unknown";
 
  const getRoomNo = (roomId) =>
    rooms.find((r) => r.roomId === roomId)?.roomNumber || "N/A";
 
  return (
    <AdminLayout>
      {/* Dashboard Header */}
      <section className="mb-14 mt-6 animate-fade-in text-center">
        <h1 className="text-4xl font-light tracking-wide text-neutral-900 mb-2">
          Admin Dashboard Overview
        </h1>
        <p className="text-neutral-600 font-light">
          Monitor hotel rooms, bookings and revenue at a glance
        </p>
      </section>
 
      {loading ? (
        <p className="text-neutral-500 text-center animate-pulse">Loading...</p>
      ) : (
        <>
          {/* STATS SECTION */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { title: "Total Rooms", value: totalRooms },
              { title: "Active Bookings", value: activeBookings },
              { title: "Total Revenue", value: `₹${totalRevenue}` },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white p-8 border border-neutral-200 rounded-xl shadow-sm text-center animate-fade-in-up"
              >
                <h3 className="text-sm uppercase tracking-widest text-neutral-500 font-light mb-3">
                  {item.title}
                </h3>
                <div className="text-5xl font-light text-neutral-900">{item.value}</div>
              </div>
            ))}
          </div>
 
          {/* REVENUE TABLE */}
          <div className="bg-white p-8 border border-neutral-200 rounded-xl shadow-sm animate-fade-in-up mb-12">
            <h2 className="text-xl font-light text-neutral-800 mb-6">
              Revenue by Room Type
            </h2>
            <table className="w-full text-sm">
              <thead className="bg-neutral-100 text-neutral-600 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-left">Room Type</th>
                  <th className="px-5 py-3 text-left">Revenue</th>
                  <th className="px-5 py-3 text-left">Total Bookings</th>
                  <th className="px-5 py-3 text-left">Booked Nights</th>
                  <th className="px-5 py-3 text-left">Avg Revenue / Booking</th>
                </tr>
              </thead>
              <tbody>
                {roomRevenue.map((r, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}
                  >
                    <td className="px-5 py-3">{r.roomType}</td>
                    <td className="px-5 py-3">₹{r.revenue}</td>
                    <td className="px-5 py-3">{r.totalBookings}</td>
                    <td className="px-5 py-3">{r.bookedNights}</td>
                    <td className="px-5 py-3">₹{r.avgRevenuePerBooking}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
 
          {/* RECENT BOOKINGS — FIXED EXACTLY AS REQUESTED */}
          <div className="bg-white p-8 border border-neutral-200 rounded-xl shadow-sm animate-fade-in-up">
            <h2 className="text-xl font-light text-neutral-800 mb-6">Recent Bookings</h2>
            <table className="w-full text-sm">
              <thead className="bg-neutral-100 text-neutral-600 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-left">Customer ID</th>
                  <th className="px-5 py-3 text-left">Branch</th>
                  <th className="px-5 py-3 text-left">Room No</th>
                  <th className="px-5 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 6).map((b, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}
                  >
                    <td className="px-5 py-3">{b.customerId || b.userId || "Unknown"}</td>
                    <td className="px-5 py-3">{getBranch(b.roomId)}</td>
                    <td className="px-5 py-3">{getRoomNo(b.roomId)}</td>
                    <td className="px-5 py-3">
                      {(b.status || b.bookingStatus || "N/A").toUpperCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminLayout>
  );
}