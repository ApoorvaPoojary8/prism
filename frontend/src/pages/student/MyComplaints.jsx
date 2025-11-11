// MyComplaints.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import "../../Dashboard.css";

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [feedbackText, setFeedbackText] = useState({});
  const token = localStorage.getItem("token");

  // ✅ Fetch complaints securely for the current logged-in student
  useEffect(() => {
    if (!token) {
      alert("Please log in again.");
      window.location.href = "/login";
      return;
    }

    axios
      .get("http://localhost:5000/api/complaints/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("✅ My complaints fetched:", res.data);
        setComplaints(res.data);
      })
      .catch((err) => {
        console.error("❌ Error fetching complaints:", err);
        alert("Error fetching complaints. Please try again.");
      });
  }, [token]);

  // ✅ Handle feedback submission
  const handleFeedbackSubmit = async (id) => {
    if (!feedbackText[id] || feedbackText[id].trim() === "") {
      alert("Please enter feedback before submitting.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/complaints/${id}`,
        { feedback: feedbackText[id] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Feedback submitted successfully!");

      // Refresh complaints after submitting feedback
      const res = await axios.get("http://localhost:5000/api/complaints/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);

      setFeedbackText((prev) => ({ ...prev, [id]: "" }));
    } catch (error) {
      console.error("❌ Error submitting feedback:", error);
      alert("Failed to submit feedback.");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="student" />
      <div className="main-content">
        <h2>My Complaints</h2>

        {complaints.length > 0 ? (
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
                {complaints.map((c) => (
                  <tr key={c.id}>
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
