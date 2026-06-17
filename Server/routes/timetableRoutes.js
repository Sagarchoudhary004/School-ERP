import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createTimetable,
  deleteTimetable,
  getTimetableById,
  getTimetables,
  updateTimetable,
} from "../controllers/timetableController.js";

const router = express.Router();

router.get("/", authMiddleware, getTimetables);
router.get("/:id", authMiddleware, getTimetableById);
router.post("/", authMiddleware, createTimetable);
router.put("/:id", authMiddleware, updateTimetable);
router.delete("/:id", authMiddleware, deleteTimetable);

export default router;
