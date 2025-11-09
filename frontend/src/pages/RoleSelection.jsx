import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Fetch user data from localStorage
    const storedUser = localStorage.getItem("loggedInUser");

    if (!storedUser) {
      // ❌ No user found → back to login
      navigate("/login");
      return;
    }

    // 🔹 Parse user object
    const user = JSON.parse(storedUser);
    const role = user.role;

    // 🔹 Smart redirection based on role
    if (role === "student") {
      navigate("/student/dashboard");
    } else if (role === "warden") {
      navigate("/warden/dashboard");
    } else if (role === "admin" || role === "chief_warden") {
      navigate("/admin/dashboard");
    } else {
      // ❌ Unknown role → clear data and redirect
      localStorage.clear();
      alert("Invalid role detected. Please log in again.");
      navigate("/login");
    }
  }, [navigate]);

  return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Redirecting...</h2>;
};

export default RoleSelection;
