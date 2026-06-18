import express from "express";
import upload from "../middlewares/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudentsByClassSection,
  getStudents,
  updateStudent,
} from "../controllers/studentController.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/").get(getStudents).post(
  upload.fields([
    { name: "studentPhoto", maxCount: 1 },
    { name: "aadhaarCard", maxCount: 1 },
    { name: "birthCertificate", maxCount: 1 },
    { name: "transferCertificate", maxCount: 1 },
    { name: "reportCard", maxCount: 1 },
    { name: "otherDocuments", maxCount: 10 },
  ]),
  createStudent
);

router.get("/class/:classSectionId", getStudentsByClassSection);

router
  .route("/:id")
  .get(getStudentById)
  .put(
    upload.fields([
      { name: "studentPhoto", maxCount: 1 },
      { name: "aadhaarCard", maxCount: 1 },
      { name: "birthCertificate", maxCount: 1 },
      { name: "transferCertificate", maxCount: 1 },
      { name: "reportCard", maxCount: 1 },
      { name: "otherDocuments", maxCount: 10 },
    ]),
    updateStudent
  )
  .delete(deleteStudent);

export default router;
