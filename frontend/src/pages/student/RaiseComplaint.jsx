import React, { useState, useContext } from "react";
import Sidebar from "../../components/Sidebar";
import { ComplaintContext } from "../../context/ComplaintContext";
import "../../Dashboard.css";

const RaiseComplaint = () => {
    const { addComplaint } = useContext(ComplaintContext);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title || !description) {
            alert("Please fill in all fields.");
            return;
        }

        const newComplaint = {
            id: Date.now(), // ✅ Unique ID for each complaint
            title,
            description,
            status: "Pending",
            role: "student",
            date: new Date().toLocaleDateString("en-IN"), // ✅ Store current date
        };

        addComplaint(newComplaint);
        alert("Complaint submitted successfully!");
        setTitle("");
        setDescription("");
    };


    return (
        <div className="dashboard-container">
            <Sidebar role="student" />
            <div className="main-content">
                <h1 className="page-title">Raise Complaint</h1>
                <div className="complaint-form-card">
                    <form onSubmit={handleSubmit}>
                        <label>Complaint Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter title"
                            required
                        />

                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={5}
                            placeholder="Describe problem"
                            required
                        />

                        <label>Attach File (optional)</label>
                        <div className="file-input-wrapper">
                            <button type="button" className="file-btn">
                                {file ? file.name : "Choose File"}
                            </button>
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </div>

                        <button type="submit" className="primary-btn">
                            Submit Complaint
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RaiseComplaint;
