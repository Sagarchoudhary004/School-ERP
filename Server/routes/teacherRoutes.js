import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createTeacher);

router.get("/", getTeachers);

router.get("/:id", getTeacherById);

router.put("/:id", updateTeacher);

router.delete("/:id", deleteTeacher);

export default router;