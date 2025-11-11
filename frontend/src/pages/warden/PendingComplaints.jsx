import React, { useContext } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import ComplaintTable from "../../components/ComplaintTable";
import { ComplaintContext } from "../../context/ComplaintContext";
import "../../Dashboard.css";

const PendingComplaints = () => {
  const { complaints, fetchComplaints } = useContext(ComplaintContext);
  const token = localStorage.getItem("token");

  // ✅ Filter pending complaints (case-insensitive)
  const pendingComplaints = complaints.filter(
    (c) => c.status?.toLowerCase() === "pending"
  );

  // ✅ Handle marking complaint as resolved
  const handleMarkResolved = async (id) => {
    const remark = prompt("Enter a remark for this complaint:") || "";

    if (!remark.trim()) {
      alert("Please enter a remark before marking as resolved!");
      return;
    }

    try {
      // ✅ Send update to backend
      await axios.put(
        `http://localhost:5000/api/complaints/${id}`,
        { status: "Resolved", remark },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Complaint marked as resolved! Student notified via email.");

      // ✅ Refresh complaints immediately
      await fetchComplaints();
    } catch (err) {
      console.error("❌ Error updating complaint:", err);
      alert("Failed to update complaint. Please try again.");
    }
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
            showAction={true}
            onStatusChange={handleMarkResolved} // Pass function to button
          />
        ) : (
          <p className="no-data">No pending complaints.</p>
        )}
      </div>
    </div>
  );
};

export default PendingComplaints;
