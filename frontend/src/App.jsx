import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ComplaintProvider } from "./context/ComplaintContext";

// Common Pages
import Welcome from "./pages/Welcome";
import LoginPageWithOTP from "./pages/LoginPageWithOTP";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import RaiseComplaint from "./pages/student/RaiseComplaint";
import MyComplaints from "./pages/student/MyComplaints";
import Profile from "./pages/student/Profile";
import Feedback from "./pages/student/Feedback";

// Warden Pages
import WardenDashboard from "./pages/warden/WardenDashboard";
import PendingComplaints from "./pages/warden/PendingComplaints";
import ResolvedComplaints from "./pages/warden/ResolvedComplaints";
import ViewFeedback from "./pages/warden/ViewFeedback";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageWardens from "./pages/admin/ManageWardens";
import UnresolvedComplaints from "./pages/admin/UnresolvedComplaints";

function App() {
  const userEmail = localStorage.getItem("userEmail");

  return (
    <ComplaintProvider key={userEmail}>
      <Router>
        <Routes>
          {/* Common */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<LoginPageWithOTP />} />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/raisecomplaint" element={<RaiseComplaint />} />
          <Route path="/student/mycomplaints" element={<MyComplaints />} />
          <Route path="/student/profile" element={<Profile />} />
          <Route path="/student/feedback" element={<Feedback />} />

          {/* Warden Routes */}
          <Route path="/warden/dashboard" element={<WardenDashboard />} />
          <Route path="/warden/pending" element={<PendingComplaints />} />
          <Route path="/warden/resolved" element={<ResolvedComplaints />} />
          <Route path="/warden/feedback" element={<ViewFeedback />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/managestudents" element={<ManageStudents />} />
          <Route path="/admin/managewardens" element={<ManageWardens />} />
          <Route path="/admin/unresolved" element={<UnresolvedComplaints />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ComplaintProvider>
  );
}

export default App;
