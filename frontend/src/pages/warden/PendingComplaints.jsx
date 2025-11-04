import React, { useContext } from "react";
import Sidebar from "../../components/Sidebar";
import ComplaintTable from "../../components/ComplaintTable";
import { ComplaintContext } from "../../context/ComplaintContext";
import "../../Dashboard.css";

const PendingComplaints = () => {
    const { complaints, updateComplaint } = useContext(ComplaintContext);

    // Filter only pending complaints
    const pendingComplaints = complaints.filter((c) => c.status === "Pending");

    // Handle marking complaint as resolved
    const handleMarkResolved = (id) => {
        updateComplaint(id, { status: "Resolved" });
        alert("Complaint marked as resolved!");
    };

    return (
        <div className="dashboard-container">
            <Sidebar role="warden" />
            <div className="main-content">
                <h2 className="page-title">Pending Complaints</h2>

                {pendingComplaints.length > 0 ? (
                    <ComplaintTable
                        complaints={pendingComplaints}
                        role="warden"
                        showAction={true} // ✅ enables "Mark Resolved" button
                        onStatusChange={handleMarkResolved}
                    />
                ) : (
                    <p className="no-data">No pending complaints.</p>
                )}
            </div>
        </div>
    );
};

export default PendingComplaints;
