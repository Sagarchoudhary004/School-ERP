import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createDesignation,
  deleteDesignation,
  getDesignations,
  updateDesignation,
} from "../controllers/designationController.js";

const router = express.Router();

router.get("/", authMiddleware, getDesignations);
router.post("/create", authMiddleware, createDesignation);
router.put("/:id", authMiddleware, updateDesignation);
router.delete("/:id", authMiddleware, deleteDesignation);

export default router;
