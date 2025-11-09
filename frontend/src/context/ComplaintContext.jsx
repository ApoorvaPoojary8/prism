import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ComplaintContext = createContext();

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  // 🔹 Fetch complaints
  const fetchComplaints = async () => {
    try {
      if (!token) return;

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
    }
  };

  const addComplaint = async (complaint) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/complaints",
        complaint,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComplaints((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("❌ Error adding complaint:", err);
      alert("Server error while submitting complaint.");
    }
  };

  const updateComplaint = async (id, updates) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/complaints/${id}`,
        updates,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...res.data } : c))
      );
    } catch (err) {
      console.error("❌ Error updating complaint:", err);
    }
  };

  useEffect(() => {
    setComplaints([]); // ✅ Clear old data before fetching
    fetchComplaints();
  }, [token, role]);

  return (
    <ComplaintContext.Provider
      value={{ complaints, fetchComplaints, addComplaint, updateComplaint }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};
