import React, { useContext } from "react";
import { ComplaintContext } from "../../context/ComplaintContext";
import Sidebar from "../../components/Sidebar";
import DashboardCard from "../../components/DashboardCard";
import ComplaintTable from "../../components/ComplaintTable";
import "../../Dashboard.css";

const WardenDashboard = () => {
  const { complaints, updateComplaintStatus } = useContext(ComplaintContext);

  const handleStatusChange = (id, newStatus) => {
    console.log("WardenDashboard.handleStatusChange", id, newStatus);
    updateComplaintStatus(id, newStatus);
  };

  // ✅ Normalize status text (case-insensitive)
  const pendingCount = complaints.filter(
    (c) => c.status?.toLowerCase() === "pending"
  ).length;

  const resolvedCount = complaints.filter(
    (c) => c.status?.toLowerCase() === "resolved"
  ).length;

  return (
    <div className="dashboard-container">
      <Sidebar role="warden" />
      <div className="main-content">
        <div className="top-bar">
          <h2>Warden Dashboard</h2>
        </div>

        <div className="cards">
          <DashboardCard title="Total" count={complaints.length} />
          <DashboardCard title="Pending" count={pendingCount} />
          <DashboardCard title="Resolved" count={resolvedCount} />
        </div>

        <ComplaintTable
          complaints={complaints}
          role="warden"
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
};

export default WardenDashboard;
