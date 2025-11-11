import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ComplaintContext } from "../context/ComplaintContext"; // ✅ make sure path is correct

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const { clearComplaints } = useContext(ComplaintContext); // ✅ access context clear function

  const handleLogout = () => {
    // ✅ Immediately clear complaint context
    clearComplaints();

    // ✅ Clear ALL user-related data safely
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("studentUSN");
    localStorage.removeItem("studentBlock");
    localStorage.removeItem("studentRoom");
    localStorage.removeItem("isLoggedIn");

    // ✅ Redirect to login page
    navigate("/login", { replace: true });
  };

  return (
    <div className="sidebar">
      <h2>{role.toUpperCase()} PANEL</h2>

      {role === "student" && (
        <>
          <Link to="/student/dashboard">Dashboard</Link>
          <Link to="/student/raisecomplaint">Raise Complaint</Link>
          <Link to="/student/mycomplaints">My Complaints</Link>
          <Link to="/student/profile">Profile</Link>
          <Link to="/student/feedback">Feedback</Link>
        </>
      )}

      {role === "warden" && (
        <>
          <Link to="/warden/dashboard">Dashboard</Link>
          <Link to="/warden/pending">Pending Complaints</Link>
          <Link to="/warden/resolved">Resolved Complaints</Link>
          <Link to="/warden/feedbacks">View Feedback</Link>
        </>
      )}

      {role === "admin" && (
        <>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/managestudents">Manage Students</Link>
          <Link to="/admin/managewardens">Manage Wardens</Link>
          <Link to="/admin/unresolved">Unresolved Complaints</Link>
        </>
      )}

      {/* ✅ Secure Logout Button */}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
