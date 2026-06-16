import express from "express";

import {
  createGuardian,
} from "../controllers/guardianController.js";

const router = express.Router();

router.post(
  "/",
  createGuardian
);

export default router;