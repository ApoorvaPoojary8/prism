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
// 🔹 SIGNUP USER (Students / Wardens / Chief Wardens)
// =========================================
export const signupUser = async (req, res) => {
  const { email, usn, role } = req.body;

  try {
    if (!email || !role) {
      return res.status(400).json({ message: "Email and role are required." });
    }

    let normalizedRole = role.trim().toLowerCase();
    if (["chief", "chiefwarden", "chief_warden", "admin"].includes(normalizedRole)) {
      normalizedRole = "chief_warden";
    } else if (["warden", "hostelwarden"].includes(normalizedRole)) {
      normalizedRole = "warden";
    } else {
      normalizedRole = "student";
    }

    // ✅ Check if user already exists
    const [userRows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (userRows.length > 0) {
      // ✅ User already exists
      return res.status(200).json({
        exists: true,
        message: "User already registered. Redirecting to dashboard...",
      });
    }

    // ✅ Create new user
    const [insert] = await pool.query(
      "INSERT INTO users (email, usn, role, name) VALUES (?, ?, ?, ?)",
      [email, usn || null, normalizedRole, email.split("@")[0]]
    );

    console.log(`✅ New user signed up: ${email} (${normalizedRole})`);

    return res.status(201).json({
      exists: false,
      message: "Signup successful! Please verify via OTP login.",
    });
  } catch (err) {
    console.error("❌ Error in signupUser:", err);
    return res.status(500).json({ message: "Server error during signup." });
  }
};

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

    // ✅ Generate OTP (valid for 5 minutes)
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query("UPDATE users SET otp = ?, otp_expires_at = ? WHERE id = ?", [
      otp,
      expiresAt,
      user.id,
    ]);

    // ✅ Send OTP via Email
    const subject = "PRISM Login OTP";
    const html = `
      <p>Hello <b>${user.name || "User"}</b>,</p>
      <p>Your login OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>
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
// 🔹 VERIFY OTP (with USN update support)
// =========================================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, usn, block, room } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required." });

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ message: "User not found" });

    const user = rows[0];

    if (!user.otp || !user.otp_expires_at)
      return res.status(400).json({ message: "No OTP found. Please request again." });

    if (new Date() > new Date(user.otp_expires_at))
      return res.status(400).json({ message: "OTP expired. Please try again." });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP. Please try again." });

    // ✅ Update USN, Block, and Room if student
    if (user.role === "student" && usn) {
      await pool.query("UPDATE users SET usn = ? WHERE email = ?", [usn, email]);
      console.log(`✅ USN updated for ${email}: ${usn}`);
    }

    // ✅ Clear OTP fields after success
    await pool.query("UPDATE users SET otp = NULL, otp_expires_at = NULL WHERE id = ?", [user.id]);

    // ✅ Generate JWT
    const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    // ✅ Respond to frontend
    return res.json({
      token,
      user: payload,
    });
  } catch (err) {
    console.error("❌ Error in verifyOtp:", err);
    return res.status(500).json({ message: "Server error while verifying OTP." });
  }
};
