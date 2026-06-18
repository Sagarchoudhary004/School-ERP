import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getFeeStructures,
  createFeeStructure,
  deleteFeeStructure,
  getFeePayments,
  recordFeePayment,
  getStudentFeeStatus,
  getFeeSummary,
} from "../controllers/feeController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/summary", getFeeSummary);
router.get("/structures", getFeeStructures);
router.post("/structures", createFeeStructure);
router.delete("/structures/:id", deleteFeeStructure);
router.get("/payments", getFeePayments);
router.post("/payments", recordFeePayment);
router.get("/student-status/:studentId", getStudentFeeStatus);

export default router;
