import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import BackButton from "./BackButton";

// -----------------------------------------------------
// MANAGER REPORTS PAGE (Housekeeping + Revenue + Occupancy)
// -----------------------------------------------------

export default function ManagerReportsPage() {
  const { user } = useAuth(); // contains userId (managerId)
  const [searchParams] = useSearchParams();
  const branchId = Number(searchParams.get("branchId"));
  const managerId = user?.userId;

  // STORE REPORT DATA
  const [hkSummary, setHkSummary] = useState(null);
  const [hkRows, setHkRows] = useState([]);

  const [revenue, setRevenue] = useState([]);

  const [occupancyRows, setOccupancyRows] = useState([]);

  const [loading, setLoading] = useState(true);

  // -----------------------------------------------------
  // FETCH ALL THREE REPORTS
  // -----------------------------------------------------
  useEffect(() => {
    if (!managerId || !branchId) return;

    async function load() {
      try {
        // Load Housingkeeping (manager)
        const [hkRowsRes, hkSummaryRes] = await Promise.all([
          axios.get(`/api/reports/housekeeping/manager/${managerId}`),
          axios.get(`/api/reports/housekeeping/manager/${managerId}/summary`)
        ]);

        setHkRows(hkRowsRes.data);
        setHkSummary(hkSummaryRes.data);

        // Load Revenue (manager)
        const revRes = await axios.get(
          `/api/reports/room-revenue/manager/${managerId}`
        );
        setRevenue(revRes.data);

        // Load Occupancy (branch)
        const occRes = await axios.get(
          `/api/reports/room-occupancy/branch/${branchId}`
        );
        setOccupancyRows(occRes.data);
      } catch (err) {
        console.error("Failed to load reports:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [managerId, branchId]);

  if (loading) {
    return (
      <p className="mt-40 text-center text-neutral-600 animate-pulse">
        Loading manager reports…
      </p>
    );
  }

  return (
    <div className="mt-28 mb-20 px-6 md:px-16 animate-fade-in">
         <BackButton />
      {/* HEADER */}
      <section className="mb-14">
        <div className="bg-neutral-50 border border-neutral-200 p-10 rounded">
          <h1 className="text-3xl font-light text-neutral-800 tracking-wide">
            Manager Reports — Branch #{branchId}
          </h1>
          <p className="text-neutral-600 font-light">
            View housekeeping, revenue, and occupancy analytics.
          </p>
        </div>
      </section>

      {/* -------------------------------------------------------
          1️⃣ HOUSEKEEPING REPORT
      -------------------------------------------------------- */}
      <ReportSection title="Housekeeping Report">
        {!hkSummary ? (
          <p className="text-neutral-500">No housekeeping data available.</p>
        ) : (
          <div>
            {/* SUMMARY CARDS */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <StatCard icon="🧹" title="Total Tasks" value={hkSummary.totalTasks} />
              <StatCard icon="✅" title="Completed" value={hkSummary.completedTasks} />
              <StatCard
                icon="📊"
                title="Completion %"
                value={`${hkSummary.completionPercentage.toFixed(1)}%`}
              />
            </div>

            {/* TABLE */}
            <ReportTable
              columns={["Task ID", "Staff", "Room", "Task Type", "Status"]}
              rows={hkRows.map((t) => [
                t.taskId,
                t.staffName,
                t.roomNumber,
                t.taskType,
                t.status,
              ])}
            />
          </div>
        )}
      </ReportSection>

      {/* -------------------------------------------------------
          2️⃣ ROOM REVENUE REPORT
      -------------------------------------------------------- */}
      <ReportSection title="Room Revenue Report">
        <ReportTable
          columns={[
            "Room Type",
            "Revenue (₹)",
            "Total Bookings",
            "Avg Revenue / Booking",
          ]}
          rows={revenue.map((r) => [
            r.roomType,
            `₹ ${r.revenue}`,
            r.totalBookings,
            r.totalBookings > 0
              ? Math.round(r.revenue / r.totalBookings)
              : 0,
          ])}
        />
      </ReportSection>

      {/* -------------------------------------------------------
          3️⃣ ROOM OCCUPANCY REPORT
      -------------------------------------------------------- */}
      <ReportSection title="Room Occupancy Report">
        <ReportTable
          columns={[
            "Room",
            "Type",
            "Last Check-In",
            "Last Check-Out",
            "Booked Nights",
            "Occ %"
          ]}
          rows={occupancyRows.map((o) => [
            o.roomNumber,
            o.roomType,
            o.lastCheckIn?.replace("T", " ") || "—",
            o.lastCheckOut?.replace("T", " ") || "—",
            o.bookedNights,
            `${o.occupancyPercent.toFixed(1)}%`,
          ])}
        />
      </ReportSection>
    </div>
  );
}

/* -----------------------------------------------------
   SMALL REUSABLE COMPONENTS
------------------------------------------------------*/

function ReportSection({ title, children }) {
  return (
    <section className="mb-16 bg-white border border-neutral-200 p-8 rounded-lg">
      <h2 className="text-2xl font-light text-neutral-800 mb-6">{title}</h2>
      {children}
    </section>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="p-7 bg-white rounded-xl border border-neutral-200 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="text-4xl">{icon}</div>
        <div>
          <p className="text-sm text-neutral-500 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-semibold text-neutral-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ReportTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-neutral-100 text-neutral-600 border-b">
          <tr>
            {columns.map((c, i) => (
              <th key={i} className="p-3 text-left">{c}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className="border-b hover:bg-neutral-50 transition-all"
            >
              {r.map((cell, j) => (
                <td key={j} className="p-3">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}