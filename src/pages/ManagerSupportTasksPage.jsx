import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import { useSearchParams } from "react-router-dom";
import BackButton from "./BackButton";

/**
 * ManagerSupportTasksPage
 *
 * Shows:
 *  - Assign Daily Staff Task (staff dropdown + room dropdown + task input)
 *  - Support Tickets table with assign dropdown/button
 *
 * Expects: ?branchId=1 (branchId provided by manager dashboard)
 */
export default function ManagerSupportTasksPage() {
  const [searchParams] = useSearchParams();
  const branchId = Number(searchParams.get("branchId")) || null; // manager passes branchId in URL

  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [staff, setStaff] = useState([]); // staff items with { staffId, userId, fullName }
  const [tickets, setTickets] = useState([]);

  // form state for daily task
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [taskType, setTaskType] = useState("");

  const [error, setError] = useState(null);
  const [refreshToggle, setRefreshToggle] = useState(false); // flip to reload data after actions

  useEffect(() => {
    if (!branchId) {
      setError("branchId is required in the URL query param ( ?branchId=1 ).");
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1) Rooms by branch
        const roomsResp = await axios.get(`/api/rooms/branch/${branchId}`);
        setRooms(roomsResp.data || []);

        // 2) Staff for hotel/branch
        // Using the endpoint you have: GET /api/stafftasks/hotel/{hotelId}/staff
        // (your backend returns list of StaffDTO { staffId, userId, ... })
        const staffResp = await axios.get(`/api/stafftasks/hotel/${branchId}/staff`);
        const staffList = Array.isArray(staffResp.data) ? staffResp.data : (staffResp.data?.data || []);

        // We need staff names (user full names). Make unique userId set, fetch names in parallel.
        const uniqueUserIds = [...new Set(staffList.map(s => s.userId).filter(Boolean))];
        const userFetches = uniqueUserIds.map(id =>
          axios.get(`/api/users/${id}`).then(r => ({ id, data: r.data })).catch(e => ({ id, data: null }))
        );

        const usersResolved = await Promise.all(userFetches);
        const userMap = {};
        usersResolved.forEach(u => {
          // some of your /api/users endpoints wrap in { data: ... } or return object directly; handle both
          const body = u.data;
          if (!body) return;
          const payload = body.data ? body.data : body; // handle API wrappers
          userMap[u.id] = payload?.name || payload?.fullName || "";
        });

        // Build staff array with fullName
        const staffWithNames = staffList.map(s => ({
          staffId: s.staffId,
          userId: s.userId,
          fullName: userMap[s.userId] || "",
          status: s.status || "UNKNOWN",
        }));

        setStaff(staffWithNames);

        // 3) Support tickets
        const ticketsResp = await axios.get("/api/support");
        const ticketsRaw = Array.isArray(ticketsResp.data) ? ticketsResp.data : (ticketsResp.data?.data || []);
        // For each ticket, augment with customer name and booking room number (if booking present)
        const ticketsWithExtras = await Promise.all(ticketsRaw.map(async t => {
          const ticket = { ...t };

          // customer name
          if (ticket.customerId) {
            try {
              const custResp = await axios.get(`/api/users/${ticket.customerId}`);
              const custBody = custResp.data;
              const cust = custBody?.data ? custBody.data : custBody;
              ticket.customerName = cust?.name || cust?.fullName || `User #${ticket.customerId}`;
            } catch (e) {
              ticket.customerName = `User #${ticket.customerId}`;
            }
          } else {
            ticket.customerName = "Guest";
          }

          // booking -> fetch booking details to get roomNumber
          ticket.roomNumber = "--";
          if (ticket.bookingId) {
            try {
              // your backend has GET /api/bookings/{bookingId}/details returning BookingsDTO with roomNumber
              const bookingResp = await axios.get(`/api/bookings/${ticket.bookingId}/details`);
              const booking = bookingResp.data;
              ticket.roomNumber = booking?.roomNumber || `Room #${booking?.roomId || ticket.bookingId}`;
              // keep bookingRoomId for later when creating staff task
              ticket.bookingRoomId = booking?.roomId || null;
            } catch (e) {
              ticket.roomNumber = `Booking #${ticket.bookingId}`;
            }
          } else if (ticket.facilityBookingId) {
            // you said facility booking API is not present — show placeholder
            ticket.roomNumber = `Facility #${ticket.facilityBookingId}`;
          }

          return ticket;
        }));

        setTickets(ticketsWithExtras);
      } catch (err) {
        console.error("Failed to load manager support/tasks page data:", err);
        setError("Failed to load data. See console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [branchId, refreshToggle]);

  // Helper to trigger refresh
  const refresh = () => setRefreshToggle(prev => !prev);

  // Create daily staff task
  const createDailyTask = async () => {
    if (!selectedStaffId) return alert("Please select a staff.");
    if (!taskType?.trim()) return alert("Please enter task name.");
    // roomId can be optional for some tasks; backend allows null
    const payload = {
      staffId: Number(selectedStaffId),
      roomId: selectedRoomId ? Number(selectedRoomId) : null,
      taskType: taskType.trim(),
      status: "PENDING",
    };

    try {
      await axios.post("/api/stafftasks", payload);
      alert("Task created and assigned to staff.");
      // clear form
      setSelectedStaffId("");
      setSelectedRoomId("");
      setTaskType("");
      refresh();
    } catch (err) {
      console.error("Failed to create staff task:", err);
      alert("Failed to create staff task. See console.");
    }
  };

  // Assign staff to support ticket + create staff task
  const assignStaffToTicket = async (ticketId, staffId, ticket) => {
    if (!staffId) return alert("Select a staff to assign.");
    try {
      // 1) assign on ticket
      await axios.patch(`/api/support/${ticketId}/assign`, null, {
        params: { staffId: Number(staffId) },
      });

      // 2) create a staff task for support (taskType = `Support: {subject}`)
      const taskPayload = {
        staffId: Number(staffId),
        roomId: ticket.bookingRoomId || (ticket.facilityBookingId ? null : null), // bookingRoomId may be null
        taskType: `Support: ${ticket.subject || "Support"}`,
        status: "PENDING",
      };

      await axios.post("/api/stafftasks", taskPayload);

      alert("Staff assigned to ticket and staff task created.");
      refresh();
    } catch (err) {
      console.error("Failed assigning staff to ticket or creating task:", err);
      alert("Failed to assign staff to ticket. See console.");
    }
  };

  if (loading) {
    return <div className="p-8 text-neutral-600">Loading manager support & tasks...</div>;
  }
  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="mt-10 mb-24 px-6 md:px-16">
      {/* Header */}
       <BackButton />
      <header className="mb-8">
        <h1 className="text-3xl font-light text-neutral-800">Manager Support & Staff Tasks</h1>
        <p className="text-neutral-600">Branch ID: {branchId} — assign tasks and manage support tickets</p>
      </header>

      {/* Assign Daily Staff Tasks */}
      <section className="bg-white border border-neutral-200 rounded mb-8 p-6">
        <h2 className="text-xl font-medium mb-3">Assign Daily Staff Task</h2>

        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-neutral-700 mb-1">Staff</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
            >
              <option value="">Select staff</option>
              {staff.map(s => (
                <option key={s.staffId} value={s.staffId}>
                  {s.fullName} 
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-neutral-700 mb-1">Room (optional)</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
            >
              <option value="">Select room (optional)</option>
              {rooms.map(r => (
                <option key={r.roomId} value={r.roomId}>
                  {r.roomNumber || `#${r.roomId}`} — {r.typeId ? `Type ${r.typeId}` : "" }
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm text-neutral-700 mb-1">Task Name</label>
            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="e.g. Clean corridor, Inventory refill"
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={createDailyTask}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Task
          </button>
        </div>
      </section>

      {/* Support Tickets Table */}
      <section className="bg-white border border-neutral-200 rounded p-6">
        <h2 className="text-xl font-medium mb-3">Support Tickets</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-sm text-neutral-600 bg-neutral-100">
              <tr>
                <th className="px-4 py-3">Ticket ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Room</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Created On</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Assign Staff</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {tickets.length === 0 ? (
                <tr><td colSpan={9} className="p-6 text-center text-neutral-500">No support tickets.</td></tr>
              ) : tickets.map(t => (
                <tr key={t.ticketId} className="border-t">
                  <td className="px-4 py-4 text-sm">{t.ticketId}</td>
                  <td className="px-4 py-4 text-sm">{t.customerName}</td>
                  <td className="px-4 py-4 text-sm">{t.roomNumber}</td>
                  <td className="px-4 py-4 text-sm">{t.subject}</td>
                  <td className="px-4 py-4 text-sm">{t.category}</td>
                  <td className="px-4 py-4 text-sm">
                    {t.createdAt ? new Date(t.createdAt).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                      ${t.status === "OPEN" ? "bg-blue-100 text-blue-800" : t.status === "IN_PROGRESS" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800" }`}
                    >
                      {t.status}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-sm">
                    <select
                      className="w-full border px-2 py-1 rounded"
                      defaultValue=""
                      id={`assign-select-${t.ticketId}`}
                    >
                      <option value="">Select staff</option>
                      {staff.map(s => (
                        <option key={s.staffId} value={s.staffId}>
                          {s.fullName} 
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-4 py-4 text-sm">
                    <button
                      onClick={() => {
                        const sel = document.getElementById(`assign-select-${t.ticketId}`);
                        const staffId = sel ? sel.value : "";
                        assignStaffToTicket(t.ticketId, staffId, t);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </section>
    </div>
  );
}