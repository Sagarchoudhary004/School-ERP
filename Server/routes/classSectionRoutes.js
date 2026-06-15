import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createClassSection,
  deleteClassSection,
  getClassSections,
  updateClassSection,
} from "../controllers/classSectionController.js";

const router = express.Router();

router.get("/", authMiddleware, getClassSections);
router.post("/create", authMiddleware, createClassSection);
router.put("/:id", authMiddleware, updateClassSection);
router.delete("/:id", authMiddleware, deleteClassSection);

export default router;
