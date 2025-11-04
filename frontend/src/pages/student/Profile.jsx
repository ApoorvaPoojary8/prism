import React from "react";
import Sidebar from "../../components/Sidebar";
import "../../Dashboard.css";

const Profile = ({ studentName, roomNumber }) => {
    return (
        <div className="dashboard-container">
            <Sidebar role="student" />
            <div className="main-content">
                <h1 className="page-title">My Profile</h1>
                <div className="profile-card">
                    <p><strong>Name:</strong> {studentName}</p>
                    <p><strong>Room Number:</strong> {roomNumber}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
