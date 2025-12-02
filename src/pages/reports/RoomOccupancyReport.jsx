// src/pages/reports/RoomOccupancyReport.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "../../api/axiosConfig";

// charts
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// ✔ NEW: Revenue-style Card Component
function StatCard({ title, value, subtitle, icon }) {
  return (
    <div
      className="p-7 bg-white rounded-xl border border-blue-200 shadow-md
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="text-4xl">{icon}</div>

        <div>
          <h2 className="text-sm text-blue-600 uppercase tracking-widest">{title}</h2>
          <p className="text-3xl font-semibold text-blue-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RoomOccupancyReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await axios.get("/api/reports/room-occupancy/overall", {
          skipAuth: true,
        });

        const normalized = (res.data || []).map((r) => ({
          ...r,
          lastCheckIn: r.lastCheckIn ?? r.last_check_in ?? r.last_checkin ?? null,
          lastCheckOut: r.lastCheckOut ?? r.last_check_out ?? r.last_checkout ?? null,
          occupancyPercent:
            typeof r.occupancyPercent === "number"
              ? r.occupancyPercent
              : Number(r.occupancyPercent) || 0,
          totalBookings: r.totalBookings ?? r.total_bookings ?? 0,
          totalRevenue: r.totalRevenue ?? r.total_revenue ?? 0,
          bookedNights: r.bookedNights ?? r.booked_nights ?? 0,
          roomType: r.roomType ?? r.room_type ?? "Unknown",
          branchName: r.branchName ?? r.branch_name ?? "Unknown",
          roomNumber: r.roomNumber ?? r.room_number ?? "",
        }));

        setData(normalized);
      } catch (err) {
        console.error("Error fetching room occupancy:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totals = useMemo(() => {
    const totalRooms = data.length;
    const totalBookings = data.reduce((s, r) => s + (r.totalBookings || 0), 0);

    const avgOccupancy =
      data.length === 0
        ? 0
        : data.reduce((s, r) => s + (r.occupancyPercent || 0), 0) / data.length;

    return {
      totalRooms,
      totalBookings,
      avgOccupancy: Number(avgOccupancy.toFixed(2)),
    };
  }, [data]);

  // Doughnut Chart
  const doughnutData = useMemo(() => {
    const map = {};
    data.forEach((r) => {
      const k = r.roomType || "Other";
      map[k] = (map[k] || 0) + (r.totalBookings ?? 0);
    });

    const labels = Object.keys(map);
    const values = labels.map((l) => map[l]);

    const palette = [
      "#0b6efd",
      "#16a34a",
      "#f59e0b",
      "#7c3aed",
      "#06b6d4",
      "#ef4444",
      "#8b5cf6",
      "#f97316",
    ];

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: labels.map((_, i) => palette[i % palette.length]),
          hoverOffset: 8,
        },
      ],
    };
  }, [data]);

  // Branch Bar Chart
  const branchBarData = useMemo(() => {
    const map = {};
    const count = {};

    data.forEach((r) => {
      const b = r.branchName || "Unknown";
      map[b] = (map[b] || 0) + (r.occupancyPercent || 0);
      count[b] = (count[b] || 0) + 1;
    });

    const labels = Object.keys(map);
    const values = labels.map((b) =>
      count[b] ? Number((map[b] / count[b]).toFixed(2)) : 0
    );

    return {
      labels,
      datasets: [
        {
          label: "Avg Occupancy (%)",
          data: values,
          backgroundColor: labels.map(
            (_, i) => `rgba(11,110,253,${0.8 - i * 0.06})`
          ),
          borderRadius: 8,
        },
      ],
    };
  }, [data]);

  if (loading) return <p className="text-center mt-10">Loading report...</p>;

  return (
    <div className="p-10">

      <h1 className="text-3xl font-extrabold text-black-900 mb-10">
        Room Occupancy Report
      </h1>

      {/* -------- RESTYLED CARDS (Like Revenue Report) -------- */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <StatCard
          title="Total Rooms"
          value={totals.totalRooms}
          subtitle="Across all branches"
          icon="🛏️"
        />

        <StatCard
          title="Total Bookings"
          value={totals.totalBookings}
          subtitle="Sum of bookings (all rooms)"
          icon="📅"
        />

        <StatCard
          title="Avg Occupancy"
          value={`${totals.avgOccupancy}%`}
          subtitle="Average occupancy across rooms"
          icon="📈"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Doughnut */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-neutral-700 font-semibold">
              Room Type Booking Share
            </h3>
          </div>
          <div className="h-64">
            <Doughnut data={doughnutData} />
          </div>
        </div>

        {/* Bar */}
        <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-blue-200">
          <h3 className="text-sm font-semibold text-neutral-700 mb-4">
            Branch — Average Occupancy (%)
          </h3>
          <div className="h-64">
            <Bar
              data={branchBarData}
              options={{
                indexAxis: "y",
                plugins: { legend: { display: false } },
                scales: {
                  x: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { callback: (v) => `${v}%` },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* TABLE (unchanged) */}
      <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-md">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">
          Rooms — Details
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-50 text-sm text-neutral-700">
                <th className="p-3 text-left border-b">Room</th>
                <th className="p-3 text-left border-b">Branch</th>
                <th className="p-3 text-left border-b">Type</th>
                <th className="p-3 text-left border-b">Last Check-In</th>
                <th className="p-3 text-left border-b">Last Check-Out</th>
                <th className="p-3 text-right border-b">Booked Nights</th>
                <th className="p-3 text-right border-b">Occupancy %</th>
                <th className="p-3 text-left border-b">Status</th>
                <th className="p-3 text-right border-b">Bookings</th>
                <th className="p-3 text-right border-b">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => {
                const status = (item.currentStatus || "").toUpperCase();
                const statusBadge =
                  status === "AVAILABLE"
                    ? "bg-green-100 text-green-800"
                    : status === "OCCUPIED"
                    ? "bg-yellow-100 text-yellow-800"
                    : status === "BLOCKED"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-blue-100 text-blue-800";

                return (
                  <tr
                    key={i}
                    className="hover:bg-gray-50 transition border-b"
                  >
                    <td className="p-3">{item.roomNumber}</td>
                    <td className="p-3">{item.branchName}</td>
                    <td className="p-3">{item.roomType}</td>
                    <td className="p-3 text-sm text-neutral-700">
                      {item.lastCheckIn?.replace("T", " ") || "—"}
                    </td>
                    <td className="p-3 text-sm text-neutral-700">
                      {item.lastCheckOut?.replace("T", " ") || "—"}
                    </td>
                    <td className="p-3 text-right">{item.bookedNights}</td>
                    <td className="p-3 text-right">
                      {Number(item.occupancyPercent).toFixed(2)}%
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="p-3 text-right">{item.totalBookings}</td>
                    <td className="p-3 text-right text-green-700 font-semibold">
                      ₹ {item.totalRevenue?.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}