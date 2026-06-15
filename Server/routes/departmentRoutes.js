import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
} from "../controllers/departmentController.js";

const router = express.Router();

router.get("/", authMiddleware, getDepartments);
router.post("/create", authMiddleware, createDepartment);
router.put("/:id", authMiddleware, updateDepartment);
router.delete("/:id", authMiddleware, deleteDepartment);

export default router;
