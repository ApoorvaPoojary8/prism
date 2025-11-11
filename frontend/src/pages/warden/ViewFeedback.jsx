import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { ComplaintContext } from "../../context/ComplaintContext";
import "../../Dashboard.css";

const ViewFeedback = () => {
  const { complaints, fetchComplaints } = useContext(ComplaintContext);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || role !== "warden") {
      alert("Unauthorized or invalid session. Please log in again.");
      window.location.href = "/login";
      return;
    }

    const load = async () => {
      setLoading(true);
      await fetchComplaints();
      setLoading(false);
    };

    load();
  }, [token, role, fetchComplaints]);

  // ✅ Filter only resolved complaints that have feedback
  const feedbackList = complaints.filter(
    (c) =>
      c.feedback &&
      c.feedback.trim() !== "" &&
      c.status?.toLowerCase() === "resolved"
  );

  return (
    <div className="dashboard-container">
      <Sidebar role="warden" />
      <div className="main-content">
        <h2>📝 Student Feedbacks</h2>

        {loading ? (
          <p>Loading feedbacks...</p>
        ) : feedbackList.length === 0 ? (
          <p>No feedback submitted yet.</p>
        ) : (
          <div className="complaints-list">
            {feedbackList.map((fb) => (
              <div key={fb.id} className="complaint-card">
                <h3>{fb.title}</h3>
                <p>
                  <strong>Student:</strong> {fb.student_name || "Anonymous"}
                </p>
                <p>
                  <strong>Description:</strong> {fb.description}
                </p>
                <p>
                  <strong>Feedback:</strong> {fb.feedback}
                </p>
                <p>
                  <strong>Warden Remark:</strong> {fb.remark || "—"}
                </p>
                <small>
                  Submitted on:{" "}
                  {new Date(fb.updated_at).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewFeedback;
