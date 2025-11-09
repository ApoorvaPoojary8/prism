// MyComplaints.jsx
import React, { useContext, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { ComplaintContext } from "../../context/ComplaintContext";
import "../../Dashboard.css";

const MyComplaints = () => {
  const { complaints, updateComplaint } = useContext(ComplaintContext);
  const [feedbackText, setFeedbackText] = useState({});

  const handleFeedbackSubmit = (id) => {
    if (!feedbackText[id] || feedbackText[id].trim() === "") {
      alert("Please enter feedback before submitting.");
      return;
    }

    updateComplaint(id, { feedback: feedbackText[id] });
    alert("Feedback submitted successfully!");
    setFeedbackText((prev) => ({ ...prev, [id]: "" }));
  };

  const studentComplaints = complaints.filter((c) => c.role === "student" || c.id);

  return (
    <div className="dashboard-container">
      <Sidebar role="student" />
      <div className="main-content">
        <h2>My Complaints</h2>

        {studentComplaints.length > 0 ? (
          <div className="complaint-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Feedback</th>
                </tr>
              </thead>
              <tbody>
                {studentComplaints.map((c) => (
                  <tr key={c.id}>
                    {/* ✅ Fixed Date Display */}
                    <td>
                      {c.created_at
                        ? new Date(c.created_at).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "—"}
                    </td>

                    <td>{c.title}</td>
                    <td>{c.description}</td>
                    <td
                      style={{
                        color:
                          c.status === "Resolved"
                            ? "#16a34a"
                            : c.status === "Pending"
                            ? "#ca8a04"
                            : "#1e293b",
                        fontWeight: "600",
                      }}
                    >
                      {c.status}
                    </td>

                    <td>
                      {c.status === "Resolved" && !c.feedback ? (
                        <div className="feedback-box">
                          <textarea
                            placeholder="Write your feedback..."
                            value={feedbackText[c.id] || ""}
                            onChange={(e) =>
                              setFeedbackText({
                                ...feedbackText,
                                [c.id]: e.target.value,
                              })
                            }
                          />
                          <button
                            className="btn-resolve"
                            onClick={() => handleFeedbackSubmit(c.id)}
                          >
                            Submit
                          </button>
                        </div>
                      ) : c.feedback ? (
                        <span className="feedback-text">{c.feedback}</span>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No complaints yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyComplaints;
