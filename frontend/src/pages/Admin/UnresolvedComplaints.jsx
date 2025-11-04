import React, { useContext } from "react";
import Sidebar from "../../components/Sidebar";
import { ComplaintContext } from "../../context/ComplaintContext";
import "../../Dashboard.css";


const UnresolvedComplaints = () => {
    const { complaints } = useContext(ComplaintContext);
    const now = new Date();

    // ⏰ Filter complaints pending > 3 days
    const escalated = complaints.filter((c) => {
        if (c.status === "Resolved" || !c.date) return false;
        const diffDays = (now - new Date(c.date)) / (1000 * 60 * 60 * 24);
        return diffDays > 3;
    });

    return (
        <div className="dashboard-container">
            <Sidebar role="admin" />
            <div className="main-content">
                <h1 className="page-title">Unresolved (Escalated) Complaints</h1>
                <div className="cards">
                    {escalated.length > 0 ? (
                        escalated.map((c, index) => (
                            <div key={index} className="dashboard-card pending">
                                <h3>{c.title}</h3>
                                <p>{c.description}</p>
                                <p>
                                    <strong>Status:</strong> {c.status}
                                </p>
                                <p>
                                    <strong>Raised on:</strong>{" "}
                                    {new Date(c.date).toLocaleDateString()}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>No escalated complaints 🎉</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UnresolvedComplaints;
