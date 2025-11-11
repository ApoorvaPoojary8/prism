import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPageWithOTP.css";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [usn, setUsn] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !role) {
      alert("Please enter your email and select a role.");
      return;
    }
    if (role === "student" && !usn) {
      alert("Please enter your USN.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        email,
        usn,
        role,
      });

      // 🔹 If user exists, go to their dashboard immediately
      if (res.data.exists) {
        alert("Welcome back! Redirecting to your dashboard...");
        localStorage.setItem("userRole", role);
        localStorage.setItem("userEmail", email);
        if (role === "student") {
          localStorage.setItem("studentUSN", usn);
          navigate("/student/dashboard");
        } else if (role === "warden") {
          navigate("/warden/dashboard");
        } else if (role === "chief_warden") {
          navigate("/admin/dashboard");
        }
      } else {
        alert("Signup successful! Proceed to OTP login.");
        navigate("/login");
      }
    } catch (err) {
      console.error("❌ Signup error:", err);
      alert(err.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <h2>Smart Hostel Signup</h2>

        <div className="otp-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Select your role</option>
            <option value="student">Student</option>
            <option value="warden">Warden</option>
            <option value="chief_warden">Chief Warden</option>
          </select>

          {role === "student" && (
            <input
              type="text"
              placeholder="Enter your USN"
              value={usn}
              onChange={(e) => setUsn(e.target.value)}
            />
          )}

          <button onClick={handleSignup}>Sign Up / Continue</button>

          <p className="auth-switch">
            Already registered?{" "}
            <span className="auth-link" onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
