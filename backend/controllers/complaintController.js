import pool from "../config/db.js";
import { sendMail } from "../utils/mailer.js";

/* =====================================================
   📍 1. CREATE COMPLAINT (Student)
===================================================== */
export const createComplaint = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.warn("🚨 Missing user info in request (token issue)");
      return res.status(401).json({ message: "Unauthorized or invalid token" });
    }

    const { title, description } = req.body;
    const user_id = req.user.id;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required." });
    }

    const [result] = await pool.query(
      "INSERT INTO complaints (user_id, title, description) VALUES (?, ?, ?)",
      [user_id, title, description]
    );

    const [rows] = await pool.query("SELECT * FROM complaints WHERE id = ?", [result.insertId]);
    console.log(`✅ Complaint #${result.insertId} created by user_id=${user_id}`);

    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error("❌ Error creating complaint:", err);
    return res.status(500).json({ message: "Server error while creating complaint." });
  }
};

/* =====================================================
   📍 2. GET MY COMPLAINTS (Student)
===================================================== */
export const getMyComplaints = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const user_id = req.user.id;
    const [rows] = await pool.query(
      "SELECT * FROM complaints WHERE user_id = ? ORDER BY created_at DESC",
      [user_id]
    );

    console.log(`📋 Retrieved ${rows.length} complaints for user_id=${user_id}`);
    return res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching student complaints:", err);
    return res.status(500).json({ message: "Server error while fetching complaints." });
  }
};

/* =====================================================
   📍 3. GET ALL COMPLAINTS (Role Based + Show Only Unresolved ≥ 3 Days for Admin)
===================================================== */
export const getAllComplaints = async (req, res) => {
  try {
    const role = req.user?.role;
    const userId = req.user?.id;

    if (!role) {
      return res.status(401).json({ message: "Unauthorized or invalid token" });
    }

    let query = "";
    let values = [];

    if (role === "student") {
      // 🎓 Student — only their own complaints
      query = `
        SELECT 
          c.*, 
          u.name AS student_name, 
          u.email AS student_email,
          TIMESTAMPDIFF(DAY, c.created_at, NOW()) AS pending_days
        FROM complaints c
        JOIN users u ON c.user_id = u.id
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
      `;
      values = [userId];
    }

    else if (role === "warden") {
      // 🧑‍🏫 Warden — sees all complaints
      query = `
        SELECT 
          c.*, 
          u.name AS student_name, 
          u.email AS student_email,
          TIMESTAMPDIFF(DAY, c.created_at, NOW()) AS pending_days
        FROM complaints c
        JOIN users u ON c.user_id = u.id
        ORDER BY c.created_at DESC
      `;
    }

    else if (role === "chief_warden" || role === "admin") {
      // 🧑‍💼 Admin / Chief Warden — only unresolved complaints ≥ 3 days old
      query = `
        SELECT 
          c.*, 
          u.name AS student_name, 
          u.email AS student_email,
          TIMESTAMPDIFF(DAY, c.created_at, NOW()) AS pending_days
        FROM complaints c
        JOIN users u ON c.user_id = u.id
        WHERE c.status != 'resolved'
          AND TIMESTAMPDIFF(DAY, c.created_at, NOW()) >= 3
        ORDER BY c.created_at DESC
      `;
    }

    else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    const [rows] = await pool.query(query, values);

    // 🔹 Optional: auto-mark pending complaints as escalated (for admin visibility)
    for (const c of rows) {
      if (c.status === "pending" && c.pending_days >= 3) {
        await pool.query(
          "UPDATE complaints SET status = 'escalated' WHERE id = ?",
          [c.id]
        );
        c.status = "escalated"; // reflect in memory too
      }
    }

    console.log(`📦 Role=${role} retrieved ${rows.length} unresolved complaints (≥3 days old)`);
    return res.json(rows);

  } catch (err) {
    console.error("❌ Error fetching all complaints:", err);
    return res.status(500).json({ message: "Server error while fetching complaints." });
  }
};




/* =====================================================
   📍 4. UPDATE STATUS (Warden/Admin)
===================================================== */
export const updateComplaintStatus = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const { status, remark, feedback } = req.body;
    const userRole = req.user?.role;

    // ✅ Student adds feedback
    if (userRole === "student" && feedback) {
      await pool.query("UPDATE complaints SET feedback = ? WHERE id = ?", [feedback, complaintId]);
      const [[updated]] = await pool.query("SELECT * FROM complaints WHERE id = ?", [complaintId]);
      console.log(`💬 Feedback added for complaint #${complaintId}`);
      return res.json(updated);
    }

    // ✅ Warden or admin updates status/remark
    await pool.query("UPDATE complaints SET status = ?, remark = ? WHERE id = ?", [
      status || "pending",
      remark || null,
      complaintId,
    ]);

    const [[updated]] = await pool.query(
      `SELECT c.*, u.email AS student_email, u.name AS student_name
       FROM complaints c JOIN users u ON c.user_id = u.id WHERE c.id = ?`,
      [complaintId]
    );

    // ✅ Notify student if resolved
    if (status === "resolved") {
      const subject = `Your complaint #${updated.id} has been resolved`;
      const html = `
        <p>Hi ${updated.student_name},</p>
        <p>Your complaint "<b>${updated.title}</b>" has been marked <b>Resolved</b>.</p>
        <p><b>Remark:</b> ${remark || "—"}</p>
        <p>Please login and submit your feedback.</p>
        <p>Thank you,<br/>PRISM Team</p>
      `;
      try {
        await sendMail({ to: updated.student_email, subject, html });
      } catch (mailErr) {
        console.error("📧 Mail send error:", mailErr);
      }
    }

    console.log(`✅ Complaint #${complaintId} updated (status=${status || "—"})`);
    const [rows] = await pool.query("SELECT * FROM complaints WHERE id = ?", [complaintId]);
    return res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error updating complaint:", err);
    return res.status(500).json({ message: "Server error while updating complaint." });
  }
};

/* =====================================================
   📍 5. GET SINGLE COMPLAINT BY ID
===================================================== */
export const getComplaintById = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.query(
      `SELECT c.*, u.name AS student_name, u.email AS student_email
       FROM complaints c JOIN users u ON c.user_id = u.id WHERE c.id = ?`,
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Complaint not found" });

    return res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error fetching complaint by ID:", err);
    return res.status(500).json({ message: "Server error while fetching complaint." });
  }
};
