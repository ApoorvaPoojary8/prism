import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPageWithOTP.css";

const LoginPageWithOTP = () => {
    const navigate = useNavigate();

    // 🔹 States
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [block, setBlock] = useState("");
    const [room, setRoom] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState("");

    // 🔹 Step 1: Send OTP
    const handleSendOtp = () => {
        if (!email || !role) {
            alert("Please enter your email and select a role.");
            return;
        }

        // Require block and room for students only
        if (role === "student" && (!block || !room)) {
            alert("Please enter your hostel block and room number.");
            return;
        }

        setShowOtp(true);
        alert(`OTP sent to ${email} (use 123456 to test)`);
    };

    // 🔹 Step 2: Verify OTP and redirect
    const handleVerifyOtp = () => {
        if (otp === "123456") {
            alert("Login successful!");

            // Save role for redirection
            localStorage.setItem("userRole", role);

            if (role === "student") {
                // Save student data
                localStorage.setItem("studentEmail", email);
                localStorage.setItem("studentBlock", block);
                localStorage.setItem("studentRoom", room);
                localStorage.setItem("studentName", email.split("@")[0]); // just a placeholder name
                navigate("/student/dashboard");
            } else if (role === "warden") {
                localStorage.setItem("wardenEmail", email);
                navigate("/warden/dashboard");
            } else if (role === "admin") {
                localStorage.setItem("adminEmail", email);
                navigate("/admin/dashboard");
            } else {
                alert("Invalid role selected.");
            }
        } else {
            alert("Invalid OTP. Please try 123456.");
        }
    };

    return (
        <div className="otp-container">
            <div className="otp-card">
                <h2>Smart Hostel Login</h2>

                {!showOtp ? (
                    <div className="otp-form">
                        {/* Email input */}
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {/* Role selection */}
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="">Select your role</option>
                            <option value="student">Student</option>
                            <option value="warden">Warden</option>
                            <option value="admin">Admin</option>
                        </select>

                        {/* 🔹 Extra inputs for Students only */}
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

                        <button onClick={handleSendOtp}>Send OTP</button>
                    </div>
                ) : (
                    // OTP verification
                    <div className="otp-form">
                        <input
                            type="text"
                            placeholder="Enter OTP (Try 123456)"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                        />
                        <button onClick={handleVerifyOtp}>Verify OTP</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPageWithOTP;
