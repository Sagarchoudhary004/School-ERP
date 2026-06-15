import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createExamType,
  deleteExamType,
  getExamTypes,
  updateExamType,
} from "../controllers/examTypeController.js";

const router = express.Router();

router.get("/", authMiddleware, getExamTypes);
router.post("/create", authMiddleware, createExamType);
router.put("/:id", authMiddleware, updateExamType);
router.delete("/:id", authMiddleware, deleteExamType);

export default router;
