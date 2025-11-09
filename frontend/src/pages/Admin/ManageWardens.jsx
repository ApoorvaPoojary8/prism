import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import "../../Dashboard.css";

const ManageWardens = () => {
  const navigate = useNavigate();
  const [wardens, setWardens] = useState([
    { id: 1, name: "Warden 1", email: "warden1@college.com", hostel: "A Block" },
    { id: 2, name: "Warden 2", email: "warden2@college.com", hostel: "B Block" },
    { id: 3, name: "Warden 3", email: "warden3@college.com", hostel: "C Block" },
  ]);
  const [newWarden, setNewWarden] = useState({ name: "", email: "", hostel: "" });

  // ✅ Role protection (Admin + Chief Warden)
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "admin" && role !== "chief_warden") {
      alert("Unauthorized access! Please login as Admin.");
      navigate("/login");
    }
  }, [navigate]);

  // Add new warden
  const handleAdd = () => {
    if (!newWarden.name || !newWarden.email || !newWarden.hostel) {
      alert("Please fill all fields!");
      return;
    }
    setWardens([...wardens, { id: Date.now(), ...newWarden }]);
    setNewWarden({ name: "", email: "", hostel: "" });
  };

  // Delete warden
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this warden?")) {
      setWardens(wardens.filter((w) => w.id !== id));
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="admin" />
      <div className="main-content">
        <div className="top-bar">
          <h2>Manage Wardens</h2>
        </div>

        {/* Add Form */}
        <div className="form-card">
          <h3>Add New Warden</h3>
          <input
            type="text"
            placeholder="Name"
            value={newWarden.name}
            onChange={(e) => setNewWarden({ ...newWarden, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={newWarden.email}
            onChange={(e) => setNewWarden({ ...newWarden, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Hostel"
            value={newWarden.hostel}
            onChange={(e) => setNewWarden({ ...newWarden, hostel: e.target.value })}
          />
          <button onClick={handleAdd} className="add-btn">Add Warden</button>
        </div>

        {/* Warden Cards */}
        <div className="cards">
          {wardens.length > 0 ? (
            wardens.map((warden) => (
              <div key={warden.id} className="dashboard-card">
                <h4>{warden.name}</h4>
                <p>Email: {warden.email}</p>
                <p>Hostel: {warden.hostel}</p>
                <button className="delete-btn" onClick={() => handleDelete(warden.id)}>
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No wardens available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageWardens;
