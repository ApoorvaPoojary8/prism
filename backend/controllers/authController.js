import pool from "../config/db.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/mailer.js";

dotenv.config();

// =========================================
// 🔹 Generate 6-digit OTP
// =========================================
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// =========================================
// 🔹 SEND OTP
// =========================================
export const sendOtp = async (req, res) => {
  try {
    const { email, name, role = "student" } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // ✅ Normalize role
    let normalizedRole = role.trim().toLowerCase();
    if (["chief", "chiefwarden", "chief_warden", "admin"].includes(normalizedRole)) {
      normalizedRole = "chief_warden";
    } else if (["warden", "hostelwarden"].includes(normalizedRole)) {
      normalizedRole = "warden";
    } else {
      normalizedRole = "student";
    }

    // ✅ Find or create user
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    let user;

    if (rows.length === 0) {
      const [insert] = await pool.query(
        "INSERT INTO users (name, email, role) VALUES (?, ?, ?)",
        [name || email.split("@")[0], email, normalizedRole]
      );
      const [newUser] = await pool.query("SELECT * FROM users WHERE id = ?", [insert.insertId]);
      user = newUser[0];
    } else {
      user = rows[0];
      if (user.role !== normalizedRole) {
        await pool.query("UPDATE users SET role = ? WHERE id = ?", [normalizedRole, user.id]);
        user.role = normalizedRole;
      }
    }

    // ✅ Generate OTP (5 mins validity)
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await pool.query("UPDATE users SET otp = ?, otp_expires_at = ? WHERE id = ?", [
      otp,
      expiresAt,
      user.id,
    ]);

    // ✅ Send mail
    const subject = "PRISM Login OTP";
    const html = `
      <p>Hello <b>${user.name || "User"}</b>,</p>
      <p>Your login OTP is <b>${otp}</b>. It expires in 5 minutes.</p>
      <p>Thank you,<br/>PRISM Team</p>
    `;
    try {
      await sendMail({ to: user.email, subject, html });
    } catch (mailError) {
      console.error("❌ Error sending OTP email:", mailError);
    }

    return res.json({
      message: "OTP sent to email",
      userId: user.id,
      role: user.role,
    });
  } catch (err) {
    console.error("❌ Error in sendOtp:", err);
    return res.status(500).json({ message: "Server error while sending OTP" });
  }
};

// =========================================
// 🔹 VERIFY OTP
// =========================================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ message: "User not found" });

    const user = rows[0];
    if (!user.otp || !user.otp_expires_at) return res.status(400).json({ message: "No OTP found" });
    if (new Date() > new Date(user.otp_expires_at)) return res.status(400).json({ message: "OTP expired" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    await pool.query("UPDATE users SET otp = NULL, otp_expires_at = NULL WHERE id = ?", [user.id]);

    return res.json({ token, user: payload });
  } catch (err) {
    console.error("❌ Error in verifyOtp:", err);
    return res.status(500).json({ message: "Server error while verifying OTP" });
  }
};
