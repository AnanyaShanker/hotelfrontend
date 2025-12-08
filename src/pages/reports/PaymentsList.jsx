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

// -------- Stat Card --------
function StatCard({ icon, title, value }) {
  return (
    <div className="p-7 bg-white rounded-xl border border-blue-200 shadow-md
                    hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
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

export default function PaymentsList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPayments() {
      try {
        const res = await axios.get("/api/payments/all");
        setPayments(res.data);
      } catch (err) {
        console.error("Error fetching payments:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPayments();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-12 text-blue-700 animate-pulse">
        Loading payments…
      </p>
    );
  }

  // 📊 Calculations
  const totalPayments = payments.length;
  const successfulPayments = payments.filter(p => p.status === "SUCCESS").length;
  const failedPayments = payments.filter(p => p.status === "FAILED").length;
  const totalRevenue = payments
    .filter(p => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amountPaid, 0);

  const statusCounts = ["SUCCESS", "FAILED", "PENDING"].map(
    s => payments.filter(p => p.status === s).length
  );

  const pieData = {
    labels: ["Success", "Failed", "Pending"],
    datasets: [
      {
        data: statusCounts,
        backgroundColor: [
          "rgba(16,185,129,0.85)",
          "rgba(220,38,38,0.85)",
          "rgba(234,179,8,0.85)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const methodMap = {};
  payments.forEach(p => {
    if (!methodMap[p.paymentMethod]) methodMap[p.paymentMethod] = 0;
    methodMap[p.paymentMethod]++;
  });

  const barData = {
    labels: Object.keys(methodMap),
    datasets: [
      {
        label: "Payments by Method",
        data: Object.values(methodMap),
        backgroundColor: "rgba(37,99,235,0.8)",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="p-10">

      {/* -------- HEADER -------- */}
      <h1 className="text-3xl font-extrabold text-gray-900 mb-10">
        💳 Payments Dashboard
      </h1>

      {/* -------- STAT CARDS -------- */}
      <div className="grid md:grid-cols-4 gap-8 mb-12">
        <StatCard icon="💰" title="Total Revenue" value={`₹${totalRevenue}`} />
        <StatCard icon="📊" title="Total Payments" value={totalPayments} />
        <StatCard icon="✅" title="Successful" value={successfulPayments} />
        <StatCard icon="❌" title="Failed" value={failedPayments} />
      </div>

      {/* -------- CHARTS -------- */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Pie Chart */}
        <div className="p-8 bg-white border border-blue-200 rounded-xl shadow-md">
          <h2 className="text-blue-900 text-lg mb-4 font-bold">
            📈 Payment Status Distribution
          </h2>
          <Pie data={pieData} />
        </div>

        {/* Bar Chart */}
        <div className="p-8 bg-white border border-blue-200 rounded-xl shadow-md">
          <h2 className="text-blue-900 text-lg mb-4 font-bold">
            💳 Payment Methods
          </h2>
          <Bar data={barData} />
        </div>
      </div>

      {/* -------- TABLE -------- */}
      <div className="bg-white border border-blue-200 rounded-xl shadow-md p-8">
        <h2 className="text-blue-900 text-xl mb-6 font-bold">📄 Recent Transactions</h2>

        <table className="w-full border-collapse">
          <thead className="bg-blue-100 text-blue-900 text-sm uppercase">
            <tr>
              <th className="p-3 border">Transaction ID</th>
              <th className="p-3 border">Customer</th>
              <th className="p-3 border">Booking ID</th>
              <th className="p-3 border">Facility Booking ID</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Method</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p) => (
              <tr key={p.paymentId} className="text-center hover:bg-blue-50 transition">
                <td className="p-3 border">{p.transactionId}</td>
                <td className="p-3 border">{p.customerId}</td>
                <td className="p-3 border">{p.bookingId || "-"}</td>
                <td className="p-3 border">{p.facilityBookingId || "-"}</td>
                <td className="p-3 border font-semibold text-green-700">
                  ₹{p.amountPaid}
                </td>
                <td className="p-3 border">{p.paymentMethod}</td>

                <td className="p-3 border">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        p.status === "SUCCESS"
                          ? "bg-green-100 text-green-700"
                          : p.status === "FAILED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {p.status}
                  </span>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}