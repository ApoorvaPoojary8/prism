import express from "express";
import { sendOtp, verifyOtp, signupUser } from "../controllers/authController.js";

const router = express.Router();

// =========================================
// 🔹 SIGNUP (For Students, Wardens, Chief Wardens)
// =========================================
router.post("/signup", signupUser); 
// body: { email, usn?, role } 
// → registers new users or redirects if already exists

// =========================================
// 🔹 SEND OTP
// =========================================
router.post("/send-otp", sendOtp);
// body: { email, name?, role? }
// → sends OTP to the given email

// =========================================
// 🔹 VERIFY OTP
// =========================================
router.post("/verify-otp", verifyOtp);
// body: { email, otp }
// → verifies OTP and returns { token, user }

export default router;
