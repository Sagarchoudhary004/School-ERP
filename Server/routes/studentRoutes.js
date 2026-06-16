import express from "express";
import upload from "../middlewares/upload.js";
import {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudents,
  updateStudent,
} from "../controllers/studentController.js";

const router = express.Router();

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
