import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Hardcoded credentials
    const users = [
        { email: "student@gmail.com", password: "123456", role: "student", redirect: "/student/dashboard" },
        { email: "warden@gmail.com", password: "123456", role: "warden", redirect: "/warden/dashboard" },
        { email: "admin@gmail.com", password: "123456", role: "admin", redirect: "/admin/dashboard" },
    ];

    // ✅ Modified login (no alert inside)
    const login = (role, email) => {
        const found = users.find((u) => u.role === role && u.email === email);
        if (found) {
            setUser(found);
            localStorage.setItem("user", JSON.stringify(found));
            navigate(found.redirect);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/");
    };

    useEffect(() => {
        if (user) {
            navigate(user.redirect);
        }
    }, [user, navigate]);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
