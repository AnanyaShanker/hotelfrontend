import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import axios from "axios";

export default function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [roomRevenue, setRoomRevenue] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, roomsRes, usersRes, branchesRes, revenueRes] =
          await Promise.all([
            axios.get("http://localhost:9193/api/bookings", { headers }),
            axios.get("http://localhost:9193/api/rooms", { headers }),
            axios.get("http://localhost:9193/api/users", { headers }),
            axios.get("http://localhost:9193/api/branches", { headers }),
            axios.get("http://localhost:9193/api/reports/room-revenue", { headers }),
          ]);

        setBookings(bookingsRes.data);
        setRooms(roomsRes.data);
        setUsers(usersRes.data.data);
        setBranches(branchesRes.data);
        setRoomRevenue(revenueRes.data);

        const total = revenueRes.data.reduce((sum, item) => sum + (item.revenue || 0), 0);
        setTotalRevenue(total);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCustomerName = (id) => users.find((u) => u.userId === id)?.name || "Unknown";
  const getRoomNo = (id) => rooms.find((r) => r.roomId === id)?.roomNumber || "N/A";
  const getBranchName = (id) => branches.find((b) => b.branchId === id)?.name || "N/A";

  const activeBookings = bookings.filter(
    (b) =>
      b.bookingStatus?.toUpperCase() === "CONFIRMED" ||
      b.bookingStatus?.toUpperCase() === "PENDING"
  ).length;

  return (
    <AdminLayout>
      {/* HEADER */}
      <section className="mb-20 mt-10 animate-fade-in">
        <h1 className="text-4xl font-light tracking-wide text-neutral-900 mb-3">
          Admin Dashboard Overview
        </h1>
        <p className="text-neutral-600 text-base font-light">
          Monitor hotel performance — rooms, bookings & revenue in real-time.
        </p>
      </section>

      {loading ? (
        <p className="text-neutral-500 animate-pulse">Loading...</p>
      ) : (
        <>
          {/* STATS GRID */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-neutral-50 border border-neutral-200 p-10 rounded-xl text-center hover:border-neutral-300 transition">
              <div className="text-5xl font-light text-neutral-900 mb-2">{rooms.length}</div>
              <div className="text-neutral-600 text-xs uppercase tracking-widest font-light">
                Total Rooms
              </div>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 p-10 rounded-xl text-center hover:border-neutral-300 transition">
              <div className="text-5xl font-light text-neutral-900 mb-2">{activeBookings}</div>
              <div className="text-neutral-600 text-xs uppercase tracking-widest font-light">
                Active Bookings
              </div>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 p-10 rounded-xl text-center hover:border-neutral-300 transition">
              <div className="text-5xl font-light text-neutral-900 mb-2">₹{totalRevenue}</div>
              <div className="text-neutral-600 text-xs uppercase tracking-widest font-light">
                Total Revenue
              </div>
            </div>
          </div>

          {/* RECENT BOOKINGS */}
          <section className="mb-24">
            <h2 className="text-2xl font-light tracking-wide text-neutral-900 mb-6">
              Recent Bookings
            </h2>

            <div className="overflow-x-auto border border-neutral-200 rounded-xl bg-white shadow-sm">
              <table className="w-full">
                <thead className="bg-neutral-100 text-neutral-600 text-xs uppercase tracking-wider font-light">
                  <tr>
                    <th className="px-6 py-4 text-left">Customer</th>
                    <th className="px-6 py-4 text-left">Room No</th>
                    <th className="px-6 py-4 text-left">Branch</th>
                    <th className="px-6 py-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map((b, idx) => (
                    <tr
                      key={b.bookingId}
                      className={`${idx % 2 === 0 ? "bg-white" : "bg-neutral-50"} hover:bg-blue-50 transition`}
                    >
                      <td className="px-6 py-4 text-sm">{getCustomerName(b.customerId)}</td>
                      <td className="px-6 py-4 text-sm">{getRoomNo(b.roomId)}</td>
                      <td className="px-6 py-4 text-sm">{getBranchName(b.branchId)}</td>
                      <td className="px-6 py-4 text-sm">
                        {b.bookingStatus === "CONFIRMED" && (
                          <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                            CONFIRMED
                          </span>
                        )}
                        {b.bookingStatus === "PENDING" && (
                          <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                            PENDING
                          </span>
                        )}
                        {b.bookingStatus === "CANCELLED" && (
                          <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700">
                            CANCELLED
                          </span>
                        )}
                        {b.bookingStatus === "COMPLETED" && (
                          <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                            COMPLETED
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* REVENUE BY ROOM TYPE */}
          <section className="mb-24">
            <h2 className="text-2xl font-light tracking-wide text-neutral-900 mb-6">
              Revenue by Room Type
            </h2>

            <div className="overflow-x-auto border border-neutral-200 rounded-xl bg-white shadow-sm">
              <table className="w-full">
                <thead className="bg-neutral-100 text-neutral-600 text-xs uppercase tracking-wider font-light">
                  <tr>
                    <th className="px-6 py-4 text-left">Room Type</th>
                    <th className="px-6 py-4 text-left">Total Bookings</th>
                    <th className="px-6 py-4 text-left">Booked Nights</th>
                    <th className="px-6 py-4 text-left">Revenue</th>
                    <th className="px-6 py-4 text-left">Avg Revenue / Booking</th>
                  </tr>
                </thead>
                <tbody>
                  {roomRevenue.map((r, idx) => (
                    <tr
                      key={idx}
                      className={`${idx % 2 === 0 ? "bg-white" : "bg-neutral-50"} hover:bg-blue-50 transition`}
                    >
                      <td className="px-6 py-4 text-sm">{r.roomType}</td>
                      <td className="px-6 py-4 text-sm">{r.totalBookings}</td>
                      <td className="px-6 py-4 text-sm">{r.bookedNights}</td>
                      <td className="px-6 py-4 text-sm font-medium">₹{r.revenue}</td>
                      <td className="px-6 py-4 text-sm">₹{r.avgRevenuePerBooking}</td>
                    </tr>
                  ))}

                  {roomRevenue.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-6 text-neutral-500 text-sm text-center"
                      >
                        No revenue data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </AdminLayout>
  );
}
