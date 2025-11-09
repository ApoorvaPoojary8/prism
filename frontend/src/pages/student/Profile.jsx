import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import "../../Dashboard.css";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    block: "",
    room: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("loggedInUser"));
    if (userData) {
      setProfile({
        name: userData.name || "",
        block: userData.block || "",
        room: userData.room || "",
      });
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("loggedInUser", JSON.stringify(profile));
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="student" />
      <div className="main-content">
        <h1 className="page-title">My Profile</h1>

        <div className="profile-card">
          {isEditing ? (
            <>
              <label>Name:</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />

              <label>Hostel Block:</label>
              <input
                type="text"
                value={profile.block}
                onChange={(e) =>
                  setProfile({ ...profile, block: e.target.value })
                }
              />

              <label>Room Number:</label>
              <input
                type="text"
                value={profile.room}
                onChange={(e) =>
                  setProfile({ ...profile, room: e.target.value })
                }
              />

              <button className="primary-btn mt-3" onClick={handleSave}>
                Save Changes
              </button>
            </>
          ) : (
            <>
              <p>
                <strong>Name:</strong> {profile.name || "N/A"}
              </p>
              <p>
                <strong>Hostel Block:</strong> {profile.block || "N/A"}
              </p>
              <p>
                <strong>Room Number:</strong> {profile.room || "N/A"}
              </p>

              <button
                className="primary-btn mt-3"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
