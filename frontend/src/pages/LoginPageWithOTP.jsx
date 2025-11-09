import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPageWithOTP.css";

const LoginPageWithOTP = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [block, setBlock] = useState("");
  const [room, setRoom] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================================
  // STEP 1️⃣ : SEND OTP
  // =========================================
  const handleSendOtp = async () => {
    if (!email || !role) {
      alert("Please enter your email and select a role.");
      return;
    }

    if (role === "student" && (!block || !room)) {
      alert("Please enter your hostel block and room number.");
      return;
    }

    try {
      setLoading(true);

      let finalRole = role.toLowerCase().trim();
      if (finalRole === "chief" || finalRole === "chiefwarden") {
        finalRole = "chief_warden";
      }

      const res = await axios.post("http://localhost:5000/api/auth/send-otp", {
        email,
        role: finalRole,
      });

      if (res.data.message === "OTP sent to email") {
        alert(`OTP sent to ${email}`);
        setShowOtp(true);
      } else {
        alert("Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("❌ Error sending OTP:", err);
      alert("Server error while sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // STEP 2️⃣ : VERIFY OTP
  // =========================================
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter your OTP.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
      });

      if (res.data.token) {
        alert("✅ Login successful!");

// Only remove old login data safely
localStorage.removeItem("token");
localStorage.removeItem("userRole");
localStorage.removeItem("userEmail");
localStorage.removeItem("userName");


        const userRole = res.data.user.role.toLowerCase();

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("userEmail", res.data.user.email);
        localStorage.setItem("userName", res.data.user.name);
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({
            name: res.data.user.name,
            email: res.data.user.email,
            role: userRole,
            block,
            room,
          })
        );

        console.log("🔍 Logged-in role:", userRole);

        if (userRole === "student") {
          localStorage.setItem("studentBlock", block);
          localStorage.setItem("studentRoom", room);
          navigate("/student/dashboard", { replace: true });
       } else if (userRole === "warden") {
  navigate("/warden/dashboard", { replace: true });
} else if (userRole === "chief_warden" || userRole === "admin") {
  navigate("/admin/dashboard", { replace: true });
} else {
  alert("Unauthorized role or invalid credentials.");
  navigate("/login", { replace: true });
}

      } else {
        alert("Invalid OTP or user not found.");
      }
    } catch (err) {
      console.error("❌ OTP Verification Error:", err);
      alert("Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // UI
  // =========================================
  return (
    <div className="otp-container">
      <div className="otp-card">
        <h2>Smart Hostel Login</h2>

        {!showOtp ? (
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
              <>
                <input
                  type="text"
                  placeholder="Enter Hostel Block (e.g. A, B, C)"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter Room Number"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                />
              </>
            )}

            <button onClick={handleSendOtp} disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        ) : (
          <div className="otp-form">
            <input
              type="text"
              placeholder="Enter OTP from your Email"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />
            <button onClick={handleVerifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPageWithOTP;
