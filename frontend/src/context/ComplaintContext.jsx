import React, { createContext, useState, useEffect } from "react";

export const ComplaintContext = createContext();

export const ComplaintProvider = ({ children }) => {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem("complaints");
        if (stored) setComplaints(JSON.parse(stored));
    }, []);

    useEffect(() => {
        localStorage.setItem("complaints", JSON.stringify(complaints));
    }, [complaints]);

    const addComplaint = (complaint) => {
        const newComplaint = {
            ...complaint,
            id: Date.now(), // unique ID
            createdAt: new Date().toISOString(), // store creation date
            status: "Pending", // default
        };

        setComplaints((prev) => {
            const updated = [...prev, newComplaint];
            localStorage.setItem("complaints", JSON.stringify(updated));
            return updated;
        });
    };



    const updateComplaint = (id, updates) => {
        setComplaints((prev) =>
            prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
        );
    };

    return (
        <ComplaintContext.Provider value={{ complaints, addComplaint, updateComplaint }}>
            {children}
        </ComplaintContext.Provider>
    );
};
