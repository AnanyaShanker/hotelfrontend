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

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// ---------------------------------------------------------------------
// Reusable Stat Card (Styled like StaffDashboard cards)
// ---------------------------------------------------------------------
function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white border border-neutral-200 p-8 rounded-md shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-4">
        <div className="text-4xl">{icon}</div>
        <div>
          <h2 className="text-xs uppercase tracking-wider text-neutral-500 mb-1">{title}</h2>
          <p className="text-3xl font-light text-neutral-900">{value}</p>
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
        const res = await axios.get("/api/feedback/admin/list", { skipAuth: true });
        setData(res.data);
      } catch (e) {
        console.error("Error loading feedback report:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-40 text-neutral-600 text-lg">
        Loading feedback report...
      </div>
    );
  }

  // -------------------------------
  // Calculations
  // -------------------------------
  const avgRating =
    data.length > 0
      ? (data.reduce((a, b) => a + b.rating, 0) / data.length).toFixed(2)
      : 0;

  const uniqueCustomers = new Set(data.map((d) => d.customerName)).size;
  const totalFeedbacks = data.length;

  const ratingCounts = [1, 2, 3, 4, 5].map(
    (r) => data.filter((d) => d.rating === r).length
  );

  const pieData = {
    labels: ["1 ★", "2 ★", "3 ★", "4 ★", "5 ★"],
    datasets: [
      {
        data: ratingCounts,
        backgroundColor: [
          "rgba(220,38,38,0.8)",
          "rgba(251,146,60,0.8)",
          "rgba(234,179,8,0.8)",
          "rgba(59,130,246,0.8)",
          "rgba(16,185,129,0.8)",
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-16 max-w-7xl mx-auto">

      {/* PAGE HEADER */}
      <h1 className="text-3xl font-light text-neutral-900 mb-12 tracking-wide">
        Guest Feedback Report
      </h1>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-10 mb-14">
        <StatCard icon="⭐" title="Average Rating" value={avgRating} />
        <StatCard icon="🧍" title="Customers Reviewed" value={uniqueCustomers} />
        <StatCard icon="📝" title="Total Feedbacks" value={totalFeedbacks} />
      </div>

      {/* CHART */}
      <section className="bg-white border border-neutral-200 p-10 rounded-md shadow-sm mb-14">
        <h2 className="text-xl font-light text-neutral-800 mb-6 tracking-wide">
          Rating Distribution
        </h2>

        <div className="flex justify-center">
          <div className="w-72 h-72">
            <Pie data={pieData} />
          </div>
        </div>
      </section>

      {/* FEEDBACK TABLE */}
      <section className="bg-white border border-neutral-200 p-10 rounded-md shadow-sm">
        <h2 className="text-xl font-light text-neutral-800 mb-8 tracking-wide">
          All Feedback
        </h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-neutral-600 text-xs uppercase tracking-wider border-b border-neutral-300">
              <th className="py-3">Customer</th>
              <th className="py-3">Room / Facility</th>
              <th className="py-3">Rating</th>
              <th className="py-3">Comment</th>
            </tr>
          </thead>

          <tbody>
            {data.map((f) => (
              <tr key={f.feedbackId} className="border-b border-neutral-200 text-sm font-light">
                <td className="py-4">{f.customerName}</td>
                <td className="py-4">{f.itemName}</td>
                <td className="py-4">⭐ {f.rating}</td>
                <td className="py-4 text-neutral-600">{f.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

    </div>
  );
}