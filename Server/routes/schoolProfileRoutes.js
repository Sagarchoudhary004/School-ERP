import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  getSchoolProfile,
  saveSchoolProfile,
} from "../controllers/schoolProfileController.js";

const router = express.Router();

router.get("/", authMiddleware, getSchoolProfile);

router.post(
  "/",
  authMiddleware,
  saveSchoolProfile
);

export default router;