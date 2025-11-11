import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { ComplaintContext } from "../../context/ComplaintContext";
import axios from "axios";
import "../../Dashboard.css";

const UnresolvedComplaints = () => {
  const { complaints, fetchComplaints } = useContext(ComplaintContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  useEffect(() => {
    if (!token || (role !== "admin" && role !== "chief_warden")) {
      alert("Unauthorized access! Please login as Admin.");
      navigate("/login");
      return;
    }
    fetchComplaints();
  }, [token, role]);

  // ✅ Admin / Chief Warden resolves directly
  const handleMarkResolved = async (id) => {
    if (!window.confirm("Are you sure you want to mark this complaint as resolved?")) return;

    try {
      await axios.put(
        `http://localhost:5000/api/complaints/${id}`,
        {
          status: "Resolved",
          remark: "Resolved by Chief Warden/Admin",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Complaint marked as resolved successfully!");
      fetchComplaints();
    } catch (err) {
      console.error("❌ Error resolving complaint:", err);
      alert("Failed to mark as resolved. Please try again.");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="admin" />
      <div className="main-content">
        <h1 className="page-title">Unresolved (Escalated) Complaints</h1>

        {complaints.length > 0 ? (
          <div className="cards">
            {complaints.map((c, index) => (
              <div key={index} className="dashboard-card pending">
                <h3>{c.title}</h3>
                <p>{c.description}</p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span style={{ color: "#ef4444", fontWeight: "600" }}>
                    Pending {c.pending_days ? `(for ${c.pending_days} days)` : ""}
                  </span>
                </p>

                <p>
                  <strong>Raised on:</strong>{" "}
                  {new Date(c.created_at).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>

                {/* ✅ Mark as Resolved button */}
                <button
                  className="btn-resolve"
                  style={{
                    backgroundColor: "#16a34a",
                    color: "white",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginTop: "8px",
                  }}
                  onClick={() => handleMarkResolved(c.id)}
                >
                  Mark as Resolved
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No escalated complaints 🎉</p>
        )}
      </div>
    </div>
  );
};

export default UnresolvedComplaints;
