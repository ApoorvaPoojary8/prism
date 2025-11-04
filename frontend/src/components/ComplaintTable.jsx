import React from "react";
import "../Dashboard.css";

const ComplaintTable = ({ complaints = [], role, onStatusChange }) => {
    const formatDate = (d) => {
        if (!d) return "—";
        const dt = new Date(d);
        return isNaN(dt.getTime()) ? "—" : dt.toLocaleDateString("en-IN");
    };

    return (
        <div className="complaint-table">
            <table>
                <thead>
                    <tr>
                        <th>ID</th><th>Title</th><th>Description</th><th>Date</th><th>Status</th>
                        {role === "warden" && <th>Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {complaints.length > 0 ? complaints.map(c => (
                        <tr key={c.id}>
                            <td>{c.id}</td>
                            <td>{c.title}</td>
                            <td>{c.description}</td>
                            <td>{formatDate(c.createdAt || c.date)}</td>
                            <td>{c.status}</td>
                            {role === "warden" && (
                                <td>
                                    <button
                                        type="button"
                                        className="btn-resolve"
                                        onClick={() => {
                                            console.log("onStatusChange called for", c.id, "-> Resolved");
                                            if (onStatusChange) onStatusChange(c.id, "Resolved");
                                        }}
                                    >
                                        Mark Resolved
                                    </button>
                                </td>
                            )}
                        </tr>
                    )) : (
                        <tr><td colSpan={role === "warden" ? 6 : 5} style={{ textAlign: 'center' }}>No complaints found</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ComplaintTable;
