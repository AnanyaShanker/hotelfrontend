import React, { useEffect, useState } from "react";
import axios from "../../api/axiosConfig";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// -------- Card Component (Matches Revenue Report Style) --------
function StatCard({ icon, title, value }) {
  return (
    <div
      className="p-7 bg-white rounded-xl border border-blue-200 shadow-md
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="text-4xl">{icon}</div>

        <div>
          <h2 className="text-sm text-blue-600 uppercase tracking-widest">{title}</h2>
          <p className="text-4xl font-semibold text-blue-900 mt-2">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function FeedbackReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get("/api/feedback/admin/summary", { skipAuth: true });
        setData(res.data);
      } catch (e) {
        console.error("Error loading feedback report:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return <p className="text-center mt-12 text-blue-700 animate-pulse">Loading feedback report…</p>;

  // ---------------------------------------------
  // 📊 Calculations
  // ---------------------------------------------
  const avgRating =
    data.length > 0
      ? (data.reduce((a, b) => a + b.rating, 0) / data.length).toFixed(2)
      : 0;

  const uniqueCustomers = new Set(data.map((d) => d.customerName)).size;
  const totalFeedbacks = data.length;

  // Rating distribution data
  const ratingCounts = [1, 2, 3, 4, 5].map(
    (r) => data.filter((d) => d.rating === r).length
  );

  const branchMap = {};
  data.forEach((d) => {
    if (!branchMap[d.branchName]) branchMap[d.branchName] = { count: 0, sum: 0 };
    branchMap[d.branchName].count++;
    branchMap[d.branchName].sum += d.rating;
  });

  const branchLabels = Object.keys(branchMap);
  const branchRatings = Object.values(branchMap).map((b) =>
    (b.sum / b.count).toFixed(2)
  );

  const pieData = {
    labels: ["1 ★", "2 ★", "3 ★", "4 ★", "5 ★"],
    datasets: [
      {
        data: ratingCounts,
        backgroundColor: [
          "rgba(220,38,38,0.85)",
          "rgba(251,146,60,0.85)",
          "rgba(234,179,8,0.85)",
          "rgba(59,130,246,0.85)",
          "rgba(16,185,129,0.85)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: branchLabels,
    datasets: [
      {
        label: "Avg Rating",
        data: branchRatings,
        backgroundColor: "rgba(37,99,235,0.8)",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="p-10">

      <h1 className="text-3xl font-extrabold text-black-900 mb-10">
        Guest Feedback Report
      </h1>

      {/* -------- RESTYLED CARDS -------- */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <StatCard
          icon="⭐"
          title="Average Rating"
          value={avgRating}
        />

        <StatCard
          icon="🧍"
          title="Customers Reviewed"
          value={uniqueCustomers}
        />

        <StatCard
          icon="📝"
          title="Total Feedbacks"
          value={totalFeedbacks}
        />
      </div>

      {/* -------- CHARTS -------- */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="p-8 bg-white border border-blue-200 rounded-xl shadow-md">
          <h2 className="text-blue-900 text-lg mb-4 font-bold">⭐ Rating Distribution</h2>
          <Pie data={pieData} />
        </div>

        <div className="p-8 bg-white border border-blue-200 rounded-xl shadow-md">
          <h2 className="text-blue-900 text-lg mb-4 font-bold">
            🏨 Branch-wise Average Rating
          </h2>
          <Bar data={barData} />
        </div>
      </div>

      {/* -------- TABLE -------- */}
      <div className="bg-white border border-blue-200 rounded-xl shadow-md p-8">
        <h2 className="text-blue-900 text-xl mb-6 font-bold">📄 All Feedbacks</h2>

        <table className="w-full border-collapse">
          <thead className="bg-blue-100 text-blue-900 text-sm uppercase">
            <tr>
              <th className="p-3 border">Customer</th>
              <th className="p-3 border">Branch</th>
              <th className="p-3 border">Item</th>
              <th className="p-3 border">Rating</th>
              <th className="p-3 border">Comments</th>
            </tr>
          </thead>

          <tbody>
            {data.map((f, i) => (
              <tr key={i} className="text-center hover:bg-blue-50 transition">
                <td className="p-3 border">{f.customerName}</td>
                <td className="p-3 border">{f.branchName}</td>
                <td className="p-3 border">{f.itemName}</td>
                <td className="p-3 border text-lg">⭐ {f.rating}</td>
                <td className="p-3 border text-sm text-neutral-700">{f.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}