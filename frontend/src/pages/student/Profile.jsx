import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import "../../Dashboard.css";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    usn: "",
    block: "",
    room: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // 🔹 Load logged-in user from localStorage & fetch from backend
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
    const token = localStorage.getItem("token");

    if (storedUser.email) {
      // Load local data immediately
      setProfile({
        name: storedUser.name || "",
        email: storedUser.email || "",
        usn: storedUser.usn || "",
        block: storedUser.block || "",
        room: storedUser.room || "",
      });

      // Fetch updated data from backend
      axios
        .get(`http://localhost:5000/api/users/get-profile?email=${storedUser.email}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data && res.data.user) {
            setProfile(res.data.user);
            localStorage.setItem("loggedInUser", JSON.stringify(res.data.user));
          }
        })
        .catch((err) => {
          console.error("❌ Error fetching profile:", err);
        });
    }
  }, []);

  // 🔹 Save updates (backend + localStorage)
  const handleSave = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/update-profile", profile);
      localStorage.setItem("loggedInUser", JSON.stringify(profile));
      setIsEditing(false);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      alert("Server error while saving profile.");
    }
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

              <label>USN:</label>
              <input
                type="text"
                value={profile.usn}
                onChange={(e) => setProfile({ ...profile, usn: e.target.value })}
              />

              <label>Hostel Block:</label>
              <input
                type="text"
                value={profile.block}
                onChange={(e) => setProfile({ ...profile, block: e.target.value })}
              />

              <label>Room Number:</label>
              <input
                type="text"
                value={profile.room}
                onChange={(e) => setProfile({ ...profile, room: e.target.value })}
              />

              <button className="primary-btn mt-3" onClick={handleSave}>
                Save Changes
              </button>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {profile.name || "N/A"}</p>
              <p><strong>Email:</strong> {profile.email || "N/A"}</p>
              <p><strong>USN:</strong> {profile.usn || "N/A"}</p>
              <p><strong>Hostel Block:</strong> {profile.block || "N/A"}</p>
              <p><strong>Room Number:</strong> {profile.room || "N/A"}</p>

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
