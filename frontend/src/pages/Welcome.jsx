import React from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>Welcome to Hostel Helpdesk Portal 🏠</h1>
        <button onClick={() => navigate("/login")} className="get-started-btn">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Welcome;
