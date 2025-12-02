import React, { useEffect, useState } from "react";
import axios from "../../api/axiosConfig";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function RoomRevenueReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await axios.get("/api/reports/room-revenue", {
          headers:{},
          skipAuth: true,
        });
        console.log("got data",res.data);
        setData(res.data);
      } catch (err) {
        console.error("Error fetching revenue report:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-12 text-blue-700 animate-pulse">
        Loading revenue report…
      </p>
    );

  // -------------------------------------
  //  Chart Data
  // -------------------------------------
  const roomTypes = data.map((item) => item.roomType);
  const revenueValues = data.map((item) => Number(item.revenue));

  // Auto-generate beautiful Royal Blue colors for all room types
  const dynamicColors = roomTypes.map((_, i) => {
    const base = 180 + i * 25; // hue shift
    return `hsl(${base}, 75%, 55%)`;
  });

  const chartData = {
    labels: roomTypes,
    datasets: [
      {
        label: "Revenue (₹)",
        data: revenueValues,
        backgroundColor: dynamicColors,
        borderRadius: 10,
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#1e3a8a",
          font: { family: "Inter", size: 13 },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#1e40af" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#1e3a8a" },
        grid: { color: "rgba(180,180,255,0.25)" },
      },
    },
    animation: {
      duration: 1200,
      easing: "easeOutQuart",
    },
  };

  // -------------------------------------
  //  Card Totals
  // -------------------------------------
  const totalRevenue = revenueValues.reduce((a, b) => a + b, 0);
  const totalBookings = data.reduce((a, b) => a + b.totalBookings, 0);
  const avgRevenue =
    totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-extrabold text-black-900 mb-10">
        Revenue Report (Room Types)
      </h1>

      {/* Stats Cards */}
<div className="grid md:grid-cols-3 gap-8 mb-12">

  {/* Total Revenue */}
  <div className="p-7 bg-white rounded-xl border border-blue-200 shadow-md 
                  hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
    <div className="flex items-center gap-4">
      <div className="text-4xl">💰</div>
      <div>
        <h2 className="text-sm text-blue-600 uppercase tracking-widest">Total Revenue</h2>
        <p className="text-3xl font-semibold text-blue-900">₹ {totalRevenue}</p>
      </div>
    </div>
  </div>

  {/* Total Bookings */}
  <div className="p-7 bg-white rounded-xl border border-blue-200 shadow-md 
                  hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
    <div className="flex items-center gap-4">
      <div className="text-4xl">📅</div>
      <div>
        <h2 className="text-sm text-blue-600 uppercase tracking-widest">Total Bookings</h2>
        <p className="text-3xl font-semibold text-blue-900">{totalBookings}</p>
      </div>
    </div>
  </div>

  {/* Avg Revenue per Booking */}
  <div className="p-7 bg-white rounded-xl border border-blue-200 shadow-md 
                  hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
    <div className="flex items-center gap-4">
      <div className="text-4xl">📊</div>
      <div>
        <h2 className="text-sm text-blue-600 uppercase tracking-widest">Avg Revenue / Booking</h2>
        <p className="text-3xl font-semibold text-blue-900">
          ₹ {totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0}
        </p>
      </div>
    </div>
  </div>

</div>

      {/* ---------- Chart ---------- */}
      <div className="bg-white border border-blue-200 shadow-xl p-8 rounded-2xl animate-fade-in-up">
        <h2 className="text-xl font-bold text-blue-900 mb-6">
          Revenue by Room Type
        </h2>
        <Bar data={chartData} options={chartOptions} height={120} />
      </div>
    </div>
  );
}