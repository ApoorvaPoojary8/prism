import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import "../../Dashboard.css";

const ManageStudents = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([
        { id: 1, name: "Student 1", email: "student1@college.com", hostel: "A Block" },
        { id: 2, name: "Student 2", email: "student2@college.com", hostel: "B Block" },
        { id: 3, name: "Student 3", email: "student3@college.com", hostel: "C Block" },
    ]);
    const [newStudent, setNewStudent] = useState({ name: "", email: "", hostel: "" });

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role !== "admin") {
            alert("Unauthorized access! Please login as Admin.");
            navigate("/login");
        }
    }, [navigate]);

    const handleAdd = () => {
        if (!newStudent.name || !newStudent.email || !newStudent.hostel) {
            alert("Please fill all fields!");
            return;
        }
        setStudents([...students, { id: Date.now(), ...newStudent }]);
        setNewStudent({ name: "", email: "", hostel: "" });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            setStudents(students.filter((s) => s.id !== id));
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar role="admin" />
            <div className="main-content">
                <div className="top-bar">
                    <h2>Manage Students</h2>
                </div>

                <div className="form-card">
                    <h3>Add New Student</h3>
                    <input
                        type="text"
                        placeholder="Name"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newStudent.email}
                        onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Hostel"
                        value={newStudent.hostel}
                        onChange={(e) => setNewStudent({ ...newStudent, hostel: e.target.value })}
                    />
                    <button onClick={handleAdd} className="add-btn">Add Student</button>
                </div>

                <div className="cards">
                    {students.length > 0 ? (
                        students.map((student) => (
                            <div key={student.id} className="dashboard-card">
                                <h4>{student.name}</h4>
                                <p>Email: {student.email}</p>
                                <p>Hostel: {student.hostel}</p>
                                <button className="delete-btn" onClick={() => handleDelete(student.id)}>
                                    Delete
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No students available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageStudents;
