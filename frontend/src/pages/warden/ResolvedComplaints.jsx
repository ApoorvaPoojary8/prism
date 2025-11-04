import React, { useContext } from "react";
import Sidebar from "../../components/Sidebar";
import ComplaintTable from "../../components/ComplaintTable";
import { ComplaintContext } from "../../context/ComplaintContext";
import "../../Dashboard.css";

const ResolvedComplaints = () => {
    const { complaints } = useContext(ComplaintContext);
    const resolved = complaints.filter(c => c.status === "Resolved");

    return (
        <div className="dashboard-container">
            <Sidebar role="warden" />
            <div className="main-content">
                <h1 className="page-title">Resolved Complaints</h1>
                {resolved.length === 0 ? (
                    <p>No resolved complaints.</p>
                ) : (
                    <ComplaintTable complaints={resolved} role="warden" />
                )}
            </div>
        </div>
    );
};

export default ResolvedComplaints;
