import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getDashboardStats } from "../controllers/dashboardController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/stats", getDashboardStats);

export default router;
