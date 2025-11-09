import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ role }) => {
    const navigate = useNavigate();

    const handleLogout = () => {


        // ✅ Clear stored login/session info
        localStorage.removeItem("userRole");
        localStorage.removeItem("isLoggedIn");


        
        // ✅ Redirect to login page
        navigate("/login");
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
                    <Link to="/student/feedback">Feedback</Link> {/* ✅ Added feedback section */}
                </>
            )}

            {role === "warden" && (
                <>
                    <Link to="/warden/dashboard">Dashboard</Link>
                    <Link to="/warden/pending">Pending Complaints</Link>
                    <Link to="/warden/resolved">Resolved Complaints</Link>
                    <Link to="/warden/feedbacks">View Feedback</Link> {/* ✅ Warden can view feedback */}
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

            <button className="logout-btn" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default Sidebar;
