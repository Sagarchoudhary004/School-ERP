import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { saveAttendance, getAttendance } from "../controllers/attendanceController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", saveAttendance);
router.get("/", getAttendance);

export default router;
