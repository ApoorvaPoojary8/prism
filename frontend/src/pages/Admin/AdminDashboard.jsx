import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import DashboardCard from "../../components/DashboardCard";
import { ComplaintContext } from "../../context/ComplaintContext";
import "../../Dashboard.css";

const AdminDashboard = () => {
  const { complaints, fetchComplaints } = useContext(ComplaintContext);
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  // 🔐 Role-based protection
  useEffect(() => {
    if (!token || (role !== "admin" && role !== "chief_warden")) {
      alert("Unauthorized access! Please login as Admin.");
      navigate("/login");
      return;
    }
    fetchComplaints();
  }, [token, role]);

  // ✅ Use created_at instead of date
  const total = complaints.length;
  const pending = complaints.filter(
    (c) => c.status?.toLowerCase() === "pending"
  ).length;
  const resolved = complaints.filter(
    (c) => c.status?.toLowerCase() === "resolved"
  ).length;

  const now = new Date();
  const escalated = complaints.filter((c) => {
    if (c.status?.toLowerCase() === "resolved" || !c.created_at) return false;
    const diffDays = (now - new Date(c.created_at)) / (1000 * 60 * 60 * 24);
    return diffDays > 3;
  });

  return (
    <div className="dashboard-container">
      <Sidebar role="admin" />
      <div className="main-content">
        <div className="top-bar">
          <h2>Admin Dashboard</h2>
        </div>

        <div className="cards">
          <DashboardCard title="Total Complaints" count={total} color="#3b82f6" />
          <DashboardCard title="Pending" count={pending} color="#facc15" />
          <DashboardCard title="Resolved" count={resolved} color="#22c55e" />
          <DashboardCard
            title="Escalated (Unresolved)"
            count={escalated.length}
            color="#ef4444"
          />
        </div>

        <p style={{ marginTop: "20px" }}>
          <strong>Note:</strong> Complaints pending for more than 3 days are automatically
          escalated. View them under <b>“Unresolved Complaints”</b>.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
