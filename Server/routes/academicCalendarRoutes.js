import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createAcademicCalendarEvent,
  deleteAcademicCalendarEvent,
  getAcademicCalendarEvents,
  updateAcademicCalendarEvent,
} from "../controllers/academicCalendarController.js";

const router = express.Router();

router.get("/", authMiddleware, getAcademicCalendarEvents);
router.post("/create", authMiddleware, createAcademicCalendarEvent);
router.put("/:id", authMiddleware, updateAcademicCalendarEvent);
router.delete("/:id", authMiddleware, deleteAcademicCalendarEvent);

export default router;
