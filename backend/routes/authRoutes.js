import express from 'express';
import { sendOtp, verifyOtp } from '../controllers/authController.js';
const router = express.Router();

router.post('/send-otp', sendOtp);     // body: { email, name?, role? }  -> sends OTP to email
router.post('/verify-otp', verifyOtp); // body: { email, otp } -> returns { token, user }

export default router;
