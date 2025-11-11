import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPageWithOTP.css";

const LoginPageWithOTP = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [usn, setUsn] = useState("");
  const [role, setRole] = useState("");
  const [block, setBlock] = useState("");
  const [room, setRoom] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const hostelBlocks = ["4G", "2G", "3G", "NANDINI", "5B", "6G"];

  const generateRoomNumbers = () => {
    const rooms = [];
    for (let floor = 0; floor <= 3; floor++) {
      for (let i = 1; i <= 16; i++) {
        rooms.push(`${floor}${i.toString().padStart(2, "0")}`);
      }
    }
    return rooms;
  };
  const roomNumbers = generateRoomNumbers();

  /* ======================================================
     ✅ STEP 1: SEND OTP
  ====================================================== */
  const handleSendOtp = async () => {
    if (!email || !role) {
      alert("Please enter your email and select a role.");
      return;
    }

    if (role === "student" && (!usn || !block || !room)) {
      alert("Please fill all student details (USN, Block, Room).");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/auth/send-otp", {
        email,
        role,
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

  /* ======================================================
     ✅ STEP 2: VERIFY OTP
  ====================================================== */
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
        usn,
        block,
        room,
      });

      if (res.data.token) {
        alert("✅ Login successful!");

        // ✅ Step 1: Safely clear previous user data
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("studentUSN");
        localStorage.removeItem("studentBlock");
        localStorage.removeItem("studentRoom");

        // ✅ Step 2: Store new login info
        const userRole = res.data.user.role.toLowerCase();

        const loggedInUser = {
          name: res.data.user.name || email.split("@")[0],
          email: res.data.user.email,
          role: userRole,
          usn: usn || "N/A",
          block: block || "N/A",
          room: room || "N/A",
        };

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("userEmail", res.data.user.email);
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

        console.log("✅ Saved new user data:", loggedInUser);

        // ✅ Step 3: Redirect to correct dashboard and refresh
        if (userRole === "student") {
          localStorage.setItem("studentUSN", usn);
          localStorage.setItem("studentBlock", block);
          localStorage.setItem("studentRoom", room);
          navigate("/student/dashboard", { replace: true });
          window.location.reload(); // ✅ refresh so ComplaintContext picks up token
        } else if (userRole === "warden") {
          navigate("/warden/dashboard", { replace: true });
          window.location.reload();
        } else if (userRole === "chief_warden" || userRole === "admin") {
          navigate("/admin/dashboard", { replace: true });
          window.location.reload();
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

  /* ======================================================
     🖥️ RENDER
  ====================================================== */
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
                  placeholder="Enter your USN"
                  value={usn}
                  onChange={(e) => setUsn(e.target.value)}
                />

                <select value={block} onChange={(e) => setBlock(e.target.value)}>
                  <option value="">Select Hostel Block</option>
                  {hostelBlocks.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>

                <select value={room} onChange={(e) => setRoom(e.target.value)}>
                  <option value="">Select Room Number</option>
                  {roomNumbers.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </>
            )}

            <button onClick={handleSendOtp} disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            <p className="auth-switch">
              New user?{" "}
              <span
                className="auth-link"
                onClick={() => navigate("/signup")}
                style={{ cursor: "pointer" }}
              >
                Sign Up
              </span>
            </p>
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
