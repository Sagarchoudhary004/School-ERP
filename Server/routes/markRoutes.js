import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getMarks, saveMarks } from "../controllers/markController.js";

const router = express.Router();

router.get("/", authMiddleware, getMarks);
router.post("/", authMiddleware, saveMarks);

export default router;
