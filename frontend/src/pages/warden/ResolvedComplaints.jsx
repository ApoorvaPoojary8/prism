import React, { useContext } from "react";
import Sidebar from "../../components/Sidebar";
import ComplaintTable from "../../components/ComplaintTable";
import { ComplaintContext } from "../../context/ComplaintContext";
import "../../Dashboard.css";

const ResolvedComplaints = () => {
  const { complaints } = useContext(ComplaintContext);

  // ✅ Case-insensitive filter for safety
  const resolved = complaints.filter(
    (c) => c.status?.toLowerCase() === "resolved"
  );

  return (
    <div className="dashboard-container">
      <Sidebar role="warden" />
      <div className="main-content">
        <h2 className="page-title">Resolved Complaints</h2>

        {resolved.length === 0 ? (
          <p>No resolved complaints.</p>
        ) : (
          <div className="complaint-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Remark (By Warden)</th>
                  <th>Feedback (By Student)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {resolved.map((c) => (
                  <tr key={c.id}>
                    <td>
                      {new Date(c.updated_at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td>{c.title}</td>
                    <td>{c.description}</td>
                    <td>{c.remark || "—"}</td>
                    <td>{c.feedback || "—"}</td>
                    <td style={{ color: "#16a34a", fontWeight: "600" }}>
                      {c.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResolvedComplaints;
