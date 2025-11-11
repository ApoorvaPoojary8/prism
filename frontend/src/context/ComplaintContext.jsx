// src/context/ComplaintContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ComplaintContext = createContext();

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("userRole"));

  // 🔹 Listen to localStorage changes (login/logout in real-time)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("userRole"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 🔹 Fetch complaints from backend (based on role)
  const fetchComplaints = async () => {
    try {
      if (!token) {
        setComplaints([]);
        return;
      }

      const url =
        role === "student"
          ? "http://localhost:5000/api/complaints/my"
          : "http://localhost:5000/api/complaints";

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComplaints(res.data);
    } catch (err) {
      console.error("❌ Error fetching complaints:", err);
      if (err.response?.status === 401) {
        // Token invalid or expired — clear data
        localStorage.removeItem("token");
        setComplaints([]);
      }
    }
  };

  // 🔹 Add new complaint and refresh immediately
  const addComplaint = async (complaint) => {
    try {
      await axios.post("http://localhost:5000/api/complaints", complaint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchComplaints();
    } catch (err) {
      console.error("❌ Error adding complaint:", err);
      alert("Server error while submitting complaint.");
    }
  };

  // 🔹 Update complaint (feedback/status)
  const updateComplaint = async (id, updates) => {
    try {
      await axios.put(`http://localhost:5000/api/complaints/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchComplaints();
    } catch (err) {
      console.error("❌ Error updating complaint:", err);
    }
  };

  // 🔹 Fetch whenever token or role changes
  useEffect(() => {
    if (!token) {
      setComplaints([]); // ✅ Reset old complaints immediately
      return;
    }
    fetchComplaints();
  }, [token, role]);

  // 🔹 Logout cleanup (to clear context instantly)
  const clearComplaints = () => {
    setComplaints([]);
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        fetchComplaints,
        addComplaint,
        updateComplaint,
        clearComplaints,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};
