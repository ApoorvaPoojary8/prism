// Feedback.jsx
import React, { useContext, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { ComplaintContext } from "../../context/ComplaintContext";


import "../../Dashboard.css";

const Feedback = () => {
    const { complaints, addFeedback } = useContext(ComplaintContext);
    const [feedbacks, setFeedbacks] = useState({});

    const resolvedComplaints = complaints.filter(
        (c) => c.status === "Resolved"
    );

    const handleSubmit = (id) => {
        if (!feedbacks[id] || feedbacks[id].trim() === "") {
            alert("Please enter feedback before submitting!");
            return;
        }

        addFeedback(id, feedbacks[id]);
        alert("Feedback submitted successfully!");
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
                            <p><b>Status:</b> {c.status}</p>

                            <textarea
                                placeholder="Write your feedback here..."
                                value={feedbacks[c.id] || ""}
                                onChange={(e) =>
                                    setFeedbacks({ ...feedbacks, [c.id]: e.target.value })
                                }
                            />
                            <button onClick={() => handleSubmit(c.id)}>Submit Feedback</button>
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
