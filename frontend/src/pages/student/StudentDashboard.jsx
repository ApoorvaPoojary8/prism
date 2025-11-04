import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import DashboardCard from "../../components/DashboardCard";
import ComplaintTable from "../../components/ComplaintTable";
import { ComplaintContext } from "../../context/ComplaintContext";
import "../../Dashboard.css";



const StudentDashboard = () => {
    const { complaints } = useContext(ComplaintContext);


    return (
        <div className="dashboard-container">
            <Sidebar role="student" />
            <div className="main-content">
                <div className="top-bar">
                    <h2>Student Dashboard</h2>

                </div>
                <div className="cards">
                    <DashboardCard title="Total Complaints" count={complaints.length} color="#3b82f6" />
                    <DashboardCard title="Pending" count={complaints.filter(c => c.status === "Pending").length} color="#facc15" />
                    <DashboardCard title="Resolved" count={complaints.filter(c => c.status === "Resolved").length} color="#22c55e" />
                </div>
                <ComplaintTable complaints={complaints} role="student" />
            </div>
        </div>
    );
};

export default StudentDashboard;
