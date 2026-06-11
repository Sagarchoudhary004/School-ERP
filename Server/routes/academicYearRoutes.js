import express from "express";

import{
    createAcademicYear,
    deleteAcademicYear,
    getAcademicYear,
    updateAcademicYear,
} from "../controllers/academicYearController.js"

const router=express.Router();

router.post(
    "/create",
    createAcademicYear
)
router.get(
    "/",
    getAcademicYear
)
router.put(
  "/:id",
  updateAcademicYear
);
router.delete(
    "/:id",
    deleteAcademicYear
)


export default router