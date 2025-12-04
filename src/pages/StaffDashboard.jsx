import AdminLayout from "../layouts/AdminLayout";
import Card from "../ui/Card";
import Table from "../ui/Table";

export default function StaffDashboard() {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-10"> Staff Dashboard Overview</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card title="Total Rooms">120</Card>
        <Card title="Active Bookings">45</Card>
        <Card title="Revenue Today">₹2,90,000</Card>
      </div>

      <Card title="Recent Bookings">
        <Table
          headers={["Guest", "Room", "Status"]}
          data={[
            ["Rahul", "Deluxe", "Confirmed"],
            ["Rishi", "Suite", "Pending"],
            ["Kunal", "Standard", "Completed"],
          ]}
        />
      </Card>
    </AdminLayout>
  );
}
