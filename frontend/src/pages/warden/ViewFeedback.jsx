import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import "../../Dashboard.css";

const ViewFeedback = () => {
    const [feedbackList, setFeedbackList] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem("feedbackList");
        if (saved) setFeedbackList(JSON.parse(saved));
    }, []);

    return (
        <div className="dashboard-container">
            <Sidebar role="warden" />
            <div className="main-content">
                <h2>Student Feedbacks</h2>
                {feedbackList.length === 0 ? (
                    <p>No feedback found.</p>
                ) : (
                    <div className="complaints-list">
                        {feedbackList.map((fb) => (
                            <div key={fb.id} className="complaint-card">
                                <p>{fb.text}</p>
                                <small>Submitted on: {fb.date}</small>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewFeedback;
