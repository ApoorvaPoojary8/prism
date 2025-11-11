import React, { useContext } from "react";
import axios from "axios";
import { ComplaintContext } from "../../context/ComplaintContext";
import Sidebar from "../../components/Sidebar";
import DashboardCard from "../../components/DashboardCard";
import ComplaintTable from "../../components/ComplaintTable";
import "../../Dashboard.css";

const WardenDashboard = () => {
  const { complaints, fetchComplaints } = useContext(ComplaintContext);
  const token = localStorage.getItem("token");

  // ✅ Normalize status text safely
  const pendingCount = complaints.filter(
    (c) => c.status?.toLowerCase() === "pending"
  ).length;
  const resolvedCount = complaints.filter(
    (c) => c.status?.toLowerCase() === "resolved"
  ).length;

  // ✅ Handle status update (Mark as Resolved)
  const handleStatusChange = async (id) => {
    const remark = prompt("Enter remark before resolving complaint:") || "";

    if (!remark.trim()) {
      alert("Please provide a remark before marking resolved!");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/complaints/${id}`,
        { status: "Resolved", remark },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Complaint marked as resolved and student notified!");
      await fetchComplaints(); // refresh updated data instantly
    } catch (error) {
      console.error("❌ Error updating complaint:", error);
      alert("Failed to update complaint. Try again.");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="warden" />
      <div className="main-content">
        <div className="top-bar">
          <h2>Warden Dashboard</h2>
        </div>

        <div className="cards">
          <DashboardCard title="Total Complaints" count={complaints.length} />
          <DashboardCard title="Pending" count={pendingCount} />
          <DashboardCard title="Resolved" count={resolvedCount} />
        </div>

        <h3 style={{ marginTop: "20px" }}>All Complaints</h3>
        {complaints.length === 0 ? (
          <p>No complaints found.</p>
        ) : (
          <ComplaintTable
            complaints={complaints}
            role="warden"
            showAction={true}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  );
};

export default WardenDashboard;
