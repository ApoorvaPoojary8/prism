import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/get-profile", getProfile);
router.post("/update-profile", updateProfile);

export default router;
