import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import Card from "../../ui/Card";
import Table from "../../ui/Table";
import axios from "axios";

// Default export → Dashboard with stats, tables, revenue
export default function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [roomRevenue, setRoomRevenue] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsRes = await axios.get("http://localhost:9193/api/rooms");
        setRooms(roomsRes.data);

        const bookingsRes = await axios.get("http://localhost:9193/api/bookings");
        setBookings(bookingsRes.data);

        const revenueRes = await axios.get("http://localhost:9193/api/reports/room-revenue");
        setRoomRevenue(revenueRes.data);

        const total = revenueRes.data.reduce((sum, item) => sum + (item.revenue || 0), 0);
        setTotalRevenue(total);
      } catch (err) {
        console.error("Error fetching data:", err);
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

  return (
    <AdminLayout>
      <section className="mb-12 mt-6 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-light tracking-wide text-neutral-900 mb-4">
          Admin Dashboard Overview
        </h1>
        <p className="text-neutral-600 text-base font-light">
          A quick snapshot of hotel operations, bookings, and revenue.
        </p>
      </section>

      {loading ? (
        <p className="text-neutral-500 animate-pulse">Loading data...</p>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card title="Total Rooms">
              <span className="text-4xl font-light text-neutral-900">{totalRooms}</span>
            </Card>
            <Card title="Active Bookings">
              <span className="text-4xl font-light text-neutral-900">{activeBookings}</span>
            </Card>
            <Card title="Total Revenue">
              <span className="text-4xl font-light text-neutral-900">₹{totalRevenue}</span>
            </Card>
          </div>

          <Card title="Revenue by Room Type">
            <Table
              headers={[
                "Room Type",
                "Revenue",
                "Total Bookings",
                "Booked Nights",
                "Avg Revenue/Booking",
              ]}
              data={roomRevenue.map((r) => [
                r.roomType,
                `₹${r.revenue}`,
                r.totalBookings,
                r.bookedNights,
                `₹${r.avgRevenuePerBooking}`,
              ])}
            />
          </Card>

          <Card title="Recent Bookings">
            <Table
              headers={["Guest", "Room", "Status"]}
              data={bookings.slice(0, 5).map((b) => [
                b.user?.name || b.guestName || b.customerId || "Unknown",
                b.roomType || b.roomId || "N/A",
                b.status || b.bookingStatus || "N/A",
              ])}
            />
          </Card>
        </>
      )}
    </AdminLayout>
  );
}

