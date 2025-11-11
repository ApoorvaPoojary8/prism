import pool from "../config/db.js";

// 🔹 Fetch user profile
export const getProfile = async (req, res) => {
  try {
    const { email } = req.query;
    const [rows] = await pool.query("SELECT name, email, usn, block, room FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    return res.json({ user: rows[0] });
  } catch (err) {
    console.error("❌ Error in getProfile:", err);
    return res.status(500).json({ message: "Server error while fetching profile" });
  }
};

// 🔹 Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { email, name, usn, block, room } = req.body;
    await pool.query(
      "UPDATE users SET name = ?, usn = ?, block = ?, room = ? WHERE email = ?",
      [name, usn, block, room, email]
    );
    console.log(`✅ Profile updated for ${email}`);
    return res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("❌ Error in updateProfile:", err);
    return res.status(500).json({ message: "Server error while updating profile" });
  }
};
