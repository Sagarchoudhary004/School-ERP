import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject,
} from "../controllers/subjectController.js";

const router = express.Router();

router.get("/", authMiddleware, getSubjects);
router.post("/create", authMiddleware, createSubject);
router.put("/:id", authMiddleware, updateSubject);
router.delete("/:id", authMiddleware, deleteSubject);

export default router;
