import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import DashboardCard from "../../components/DashboardCard";
import { ComplaintContext } from "../../context/ComplaintContext";
import "../../Dashboard.css";

const AdminDashboard = () => {
    const { complaints } = useContext(ComplaintContext);
    const navigate = useNavigate();

    // 🔐 Role-based protection
    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role !== "admin") {
            alert("Unauthorized access! Please login as Admin.");
            navigate("/login");
        }
    }, [navigate]);

    // 🔍 Compute counts
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === "Pending").length;
    const resolved = complaints.filter((c) => c.status === "Resolved").length;

    // ⏰ Escalate complaints older than 3 days
    const now = new Date();
    const escalated = complaints.filter((c) => {
        if (c.status === "Resolved" || !c.date) return false;
        const diffDays = (now - new Date(c.date)) / (1000 * 60 * 60 * 24);
        return diffDays > 3; // complaints pending for more than 3 days
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
                    escalated. View them under <b>“Unresolved Complaints”</b> page.
                </p>
            </div>
        </div>
    );
};

export default AdminDashboard;
