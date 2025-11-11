// src/pages/student/Feedback.jsx
import React, { useContext, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { ComplaintContext } from "../../context/ComplaintContext";
import "../../Dashboard.css";

const Feedback = () => {
  const { complaints, addFeedback } = useContext(ComplaintContext);
  const [feedbacks, setFeedbacks] = useState({});

  // ✅ Show only resolved complaints (case-insensitive)
  const resolvedComplaints = complaints.filter(
    (c) => c.status?.toLowerCase() === "resolved"
  );

  // ✅ Handle feedback submission
  const handleSubmit = async (id) => {
    const feedbackText = feedbacks[id]?.trim();

    if (!feedbackText) {
      alert("Please enter feedback before submitting!");
      return;
    }

    try {
      await addFeedback(id, feedbackText); // Wait for backend update
      alert("✅ Feedback submitted successfully!");
      setFeedbacks((prev) => ({ ...prev, [id]: "" })); // Clear textbox
    } catch (err) {
      console.error("❌ Error submitting feedback:", err);
      alert("Server error while submitting feedback.");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="student" />
      <div className="main-content">
        <h2>Feedback on Resolved Complaints</h2>

        {resolvedComplaints.length > 0 ? (
          resolvedComplaints.map((c) => (
            <div key={c.id} className="feedback-card">
              <h3>{c.title}</h3>
              <p>{c.description}</p>
              <p>
                <b>Status:</b>{" "}
                <span
                  style={{
                    color: "#16a34a",
                    fontWeight: "bold",
                  }}
                >
                  {c.status}
                </span>
              </p>

              {/* ✅ If feedback already given, show it instead of textarea */}
              {c.feedback ? (
                <p className="feedback-text">
                  <b>Your Feedback:</b> {c.feedback}
                </p>
              ) : (
                <>
                  <textarea
                    placeholder="Write your feedback here..."
                    value={feedbacks[c.id] || ""}
                    onChange={(e) =>
                      setFeedbacks({
                        ...feedbacks,
                        [c.id]: e.target.value,
                      })
                    }
                  />
                  <button
                    onClick={() => handleSubmit(c.id)}
                    className="btn-resolve"
                  >
                    Submit Feedback
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No resolved complaints yet.</p>
        )}
      </div>
    </div>
  );
};

export default Feedback;
