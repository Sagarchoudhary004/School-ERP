import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", authMiddleware, getCategories);
router.post("/create", authMiddleware, createCategory);
router.put("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);

export default router;
